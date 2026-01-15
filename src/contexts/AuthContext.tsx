import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, User } from '@/lib/database';
import { toast } from 'sonner';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('ct_currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const foundUser = await db.findUserByEmail(email);
    
    if (!foundUser || foundUser.password !== password) {
      throw new Error('Invalid email or password');
    }

    const authUser: AuthUser = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      role: foundUser.role
    };

    setUser(authUser);
    localStorage.setItem('ct_currentUser', JSON.stringify(authUser));
    toast.success(`Welcome back, ${authUser.name}!`);
  };

  const signup = async (email: string, password: string, name: string) => {
    const existingUser = await db.findUserByEmail(email);
    
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    const newUser = await db.createUser({ email, password, name });

    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    };

    setUser(authUser);
    localStorage.setItem('ct_currentUser', JSON.stringify(authUser));
    toast.success('Account created successfully!');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ct_currentUser');
    toast.info('You have been logged out');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
