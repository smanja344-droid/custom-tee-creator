import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, CartItem, Product } from '@/lib/database';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addItem: (product: Product, size: string, color: string, notes?: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      // Load guest cart from localStorage
      const guestCart = localStorage.getItem('ct_guestCart');
      if (guestCart) {
        setItems(JSON.parse(guestCart));
      } else {
        setItems([]);
      }
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const cartItems = await db.getCart(user.id);
      setItems(cartItems);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCart = async (newItems: CartItem[]) => {
    if (user) {
      await db.updateCart(user.id, newItems);
    } else {
      localStorage.setItem('ct_guestCart', JSON.stringify(newItems));
    }
  };

  const addItem = async (product: Product, size: string, color: string, notes: string = '') => {
    const newItem: CartItem = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      price: product.price,
      size,
      color,
      notes,
      image: product.image,
      quantity: 1
    };

    const newItems = [...items, newItem];
    setItems(newItems);
    await saveCart(newItems);
    toast.success('Added to cart!');
  };

  const removeItem = async (itemId: string) => {
    const newItems = items.filter(item => item.id !== itemId);
    setItems(newItems);
    await saveCart(newItems);
    toast.info('Removed from cart');
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    const newItems = items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setItems(newItems);
    await saveCart(newItems);
  };

  const clearCart = async () => {
    setItems([]);
    if (user) {
      await db.clearCart(user.id);
    } else {
      localStorage.removeItem('ct_guestCart');
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      isLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
