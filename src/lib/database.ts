// Mock database using localStorage

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'men' | 'women' | 'unisex';
  sizes: string[];
  stock: number;
  image: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  size: string;
  color: string;
  notes: string;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

const SAMPLE_PRODUCTS: Omit<Product, 'id'>[] = [
  {
    name: 'Premium Cotton Tee',
    description: '100% organic cotton, incredibly soft and comfortable for everyday wear.',
    price: 29.99,
    category: 'unisex',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 100,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Vintage Wash Tee',
    description: 'Pre-washed for that perfect worn-in feel. Relaxed fit.',
    price: 34.99,
    category: 'unisex',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 75,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Classic Polo',
    description: 'Timeless polo shirt with premium stitching and logo detail.',
    price: 44.99,
    category: 'men',
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 60,
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Oversized Graphic Tee',
    description: 'Bold graphic print on relaxed oversized silhouette.',
    price: 39.99,
    category: 'unisex',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 45,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Slim Fit Essential',
    description: 'Modern slim fit with stretch for comfort. Perfect for layering.',
    price: 27.99,
    category: 'men',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 90,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Cropped Tee',
    description: 'Trendy cropped length with a relaxed fit. Perfect for high-waisted styles.',
    price: 32.99,
    category: 'women',
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 55,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

class Database {
  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    if (!localStorage.getItem('ct_users')) {
      localStorage.setItem('ct_users', JSON.stringify([
        {
          id: '1',
          email: 'admin@customtees.com',
          password: 'admin123',
          name: 'Admin User',
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          email: 'demo@customtees.com',
          password: 'demo123',
          name: 'Demo Customer',
          role: 'customer',
          createdAt: new Date().toISOString()
        }
      ]));
    }

    if (!localStorage.getItem('ct_products')) {
      const products = SAMPLE_PRODUCTS.map((p, i) => ({
        ...p,
        id: (i + 1).toString()
      }));
      localStorage.setItem('ct_products', JSON.stringify(products));
    }

    if (!localStorage.getItem('ct_orders')) {
      localStorage.setItem('ct_orders', JSON.stringify([]));
    }

    if (!localStorage.getItem('ct_carts')) {
      localStorage.setItem('ct_carts', JSON.stringify({}));
    }
  }

  // User methods
  async findUserByEmail(email: string): Promise<User | undefined> {
    const users = JSON.parse(localStorage.getItem('ct_users') || '[]');
    return users.find((user: User) => user.email === email);
  }

  async findUserById(id: string): Promise<User | undefined> {
    const users = JSON.parse(localStorage.getItem('ct_users') || '[]');
    return users.find((user: User) => user.id === id);
  }

  async createUser(userData: Omit<User, 'id' | 'role' | 'createdAt'>): Promise<User> {
    const users = JSON.parse(localStorage.getItem('ct_users') || '[]');
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('ct_users', JSON.stringify(users));
    return newUser;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return JSON.parse(localStorage.getItem('ct_products') || '[]');
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const products = JSON.parse(localStorage.getItem('ct_products') || '[]');
    const newProduct: Product = {
      id: Date.now().toString(),
      ...productData
    };
    products.push(newProduct);
    localStorage.setItem('ct_products', JSON.stringify(products));
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = JSON.parse(localStorage.getItem('ct_products') || '[]');
    const index = products.findIndex((p: Product) => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      localStorage.setItem('ct_products', JSON.stringify(products));
      return products[index];
    }
    return null;
  }

  // Order methods
  async createOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
    const orders = JSON.parse(localStorage.getItem('ct_orders') || '[]');
    const newOrder: Order = {
      id: 'ORD' + Date.now().toString().slice(-8),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    localStorage.setItem('ct_orders', JSON.stringify(orders));
    return newOrder;
  }

  async getOrders(userId?: string): Promise<Order[]> {
    const orders = JSON.parse(localStorage.getItem('ct_orders') || '[]');
    if (userId) {
      return orders.filter((order: Order) => order.userId === userId);
    }
    return orders;
  }

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
    const orders = JSON.parse(localStorage.getItem('ct_orders') || '[]');
    const index = orders.findIndex((order: Order) => order.id === orderId);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      localStorage.setItem('ct_orders', JSON.stringify(orders));
      return orders[index];
    }
    return null;
  }

  // Cart methods
  async getCart(userId: string): Promise<CartItem[]> {
    const carts = JSON.parse(localStorage.getItem('ct_carts') || '{}');
    return carts[userId] || [];
  }

  async updateCart(userId: string, items: CartItem[]): Promise<void> {
    const carts = JSON.parse(localStorage.getItem('ct_carts') || '{}');
    carts[userId] = items;
    localStorage.setItem('ct_carts', JSON.stringify(carts));
  }

  async clearCart(userId: string): Promise<void> {
    const carts = JSON.parse(localStorage.getItem('ct_carts') || '{}');
    carts[userId] = [];
    localStorage.setItem('ct_carts', JSON.stringify(carts));
  }
}

export const db = new Database();
