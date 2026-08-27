import { User, Category, Product, CartItem, Order, Favorite } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    password: 'user123',
    createdAt: '2024-01-02T00:00:00Z',
  },
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Điện thoại',
    description: 'Các loại điện thoại thông minh',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Laptop',
    description: 'Máy tính xách tay',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Phụ kiện',
    description: 'Phụ kiện công nghệ',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Điện thoại cao cấp từ Apple',
    price: 29990000,
    categoryId: '1',
    image: 'https://via.placeholder.com/300x300/1E2636/38BDF8?text=iPhone+15',
    stock: 50,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    description: 'Flagship Android mới nhất',
    price: 24990000,
    categoryId: '1',
    image: 'https://via.placeholder.com/300x300/1E2636/6EE7B7?text=Galaxy+S24',
    stock: 30,
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'MacBook Pro M3',
    description: 'Laptop chuyên nghiệp cho developer',
    price: 45990000,
    categoryId: '2',
    image: 'https://via.placeholder.com/300x300/1E2636/E9A568?text=MacBook+Pro',
    stock: 20,
    createdAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'Dell XPS 15',
    description: 'Laptop cao cấp cho đồ họa',
    price: 35990000,
    categoryId: '2',
    image: 'https://via.placeholder.com/300x300/1E2636/3B6DFF?text=Dell+XPS',
    stock: 15,
    createdAt: '2024-01-04T00:00:00Z',
  },
  {
    id: '5',
    name: 'AirPods Pro',
    description: 'Tai nghe không dây chống ồn',
    price: 6990000,
    categoryId: '3',
    image: 'https://via.placeholder.com/300x300/1E2636/38BDF8?text=AirPods',
    stock: 100,
    createdAt: '2024-01-05T00:00:00Z',
  },
];

export const mockCart: CartItem[] = [];
export const mockOrders: Order[] = [];
export const mockFavorites: Favorite[] = [];
