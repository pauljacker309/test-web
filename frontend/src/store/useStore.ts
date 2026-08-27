import { create } from 'zustand';
import { User, Category, Product, CartItem, Order, Favorite } from '@/types';
import { mockUsers, mockCategories, mockProducts, mockCart, mockOrders, mockFavorites } from '@/data/mockData';
import * as api from '@/services/api';

interface StoreState {
  currentUser: User | null;
  users: User[];
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  favorites: Favorite[];
  isLoading: boolean;
  isInitialized: boolean;

  // Init
  fetchInitialData: () => Promise<void>;
  fetchUserData: (userId: string) => Promise<void>;

  // Auth
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Users CRUD
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // Categories CRUD
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Products CRUD
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Cart CRUD
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;

  // Orders CRUD
  createOrder: () => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;

  // Favorites CRUD
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

export const useStore = create<StoreState>((set, get) => ({
  currentUser: null,
  users: [...mockUsers],
  categories: [...mockCategories],
  products: [...mockProducts],
  cart: [...mockCart],
  orders: [...mockOrders],
  favorites: [...mockFavorites],
  isLoading: false,
  isInitialized: false,

  // ----------------------------------------------------
  // Initial Data Fetching from Supabase
  // ----------------------------------------------------
  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      // Check saved user session from localStorage if client-side
      let storedUser: User | null = null;
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('shop_user');
        if (saved) {
          try {
            storedUser = JSON.parse(saved);
          } catch {}
        }
      }

      const [users, categories, products] = await Promise.all([
        api.apiGetUsers(),
        api.apiGetCategories(),
        api.apiGetProducts(),
      ]);

      set({
        users,
        categories,
        products,
        currentUser: storedUser || get().currentUser,
        isInitialized: true,
      });

      const userToLoad = storedUser || get().currentUser;
      if (userToLoad) {
        await get().fetchUserData(userToLoad.id);
      }
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserData: async (userId: string) => {
    try {
      const isUserAdmin = get().currentUser?.role === 'admin';
      const [cart, orders, favorites] = await Promise.all([
        api.apiGetCart(userId),
        api.apiGetOrders(isUserAdmin ? undefined : userId),
        api.apiGetFavorites(userId),
      ]);
      set({ cart, orders, favorites });
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  },

  // ----------------------------------------------------
  // Auth
  // ----------------------------------------------------
  login: async (email, password) => {
    try {
      // Ensure users are fresh
      const users = await api.apiGetUsers();
      set({ users });
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        set({ currentUser: user });
        if (typeof window !== 'undefined') {
          localStorage.setItem('shop_user', JSON.stringify(user));
        }
        await get().fetchUserData(user.id);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shop_user');
    }
    set({ currentUser: null, cart: [], orders: [], favorites: [] });
  },

  // ----------------------------------------------------
  // Users CRUD
  // ----------------------------------------------------
  addUser: async (userData) => {
    try {
      const newUser = await api.apiCreateUser(userData);
      set(state => ({ users: [newUser, ...state.users] }));
    } catch (err) {
      console.error('Error adding user:', err);
      // Fallback local
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      set(state => ({ users: [newUser, ...state.users] }));
    }
  },

  updateUser: async (id, userData) => {
    try {
      await api.apiUpdateUser(id, userData);
      set(state => ({
        users: state.users.map(u => u.id === id ? { ...u, ...userData } : u),
        currentUser: state.currentUser?.id === id ? { ...state.currentUser, ...userData } : state.currentUser
      }));
    } catch (err) {
      console.error('Error updating user:', err);
      set(state => ({
        users: state.users.map(u => u.id === id ? { ...u, ...userData } : u)
      }));
    }
  },

  deleteUser: async (id) => {
    try {
      await api.apiDeleteUser(id);
      set(state => ({ users: state.users.filter(u => u.id !== id) }));
    } catch (err) {
      console.error('Error deleting user:', err);
      set(state => ({ users: state.users.filter(u => u.id !== id) }));
    }
  },

  // ----------------------------------------------------
  // Categories CRUD
  // ----------------------------------------------------
  addCategory: async (categoryData) => {
    try {
      const newCategory = await api.apiCreateCategory(categoryData);
      set(state => ({ categories: [...state.categories, newCategory] }));
    } catch (err) {
      console.error('Error adding category:', err);
      const newCat: Category = {
        ...categoryData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      set(state => ({ categories: [...state.categories, newCat] }));
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      await api.apiUpdateCategory(id, categoryData);
      set(state => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...categoryData } : c)
      }));
    } catch (err) {
      console.error('Error updating category:', err);
      set(state => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...categoryData } : c)
      }));
    }
  },

  deleteCategory: async (id) => {
    try {
      await api.apiDeleteCategory(id);
      set(state => ({ categories: state.categories.filter(c => c.id !== id) }));
    } catch (err) {
      console.error('Error deleting category:', err);
      set(state => ({ categories: state.categories.filter(c => c.id !== id) }));
    }
  },

  // ----------------------------------------------------
  // Products CRUD
  // ----------------------------------------------------
  addProduct: async (productData) => {
    try {
      const newProduct = await api.apiCreateProduct(productData);
      set(state => ({ products: [newProduct, ...state.products] }));
    } catch (err) {
      console.error('Error adding product:', err);
      const newProd: Product = {
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      set(state => ({ products: [newProd, ...state.products] }));
    }
  },

  updateProduct: async (id, productData) => {
    try {
      await api.apiUpdateProduct(id, productData);
      set(state => ({
        products: state.products.map(p => p.id === id ? { ...p, ...productData } : p)
      }));
    } catch (err) {
      console.error('Error updating product:', err);
      set(state => ({
        products: state.products.map(p => p.id === id ? { ...p, ...productData } : p)
      }));
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.apiDeleteProduct(id);
      set(state => ({ products: state.products.filter(p => p.id !== id) }));
    } catch (err) {
      console.error('Error deleting product:', err);
      set(state => ({ products: state.products.filter(p => p.id !== id) }));
    }
  },

  // ----------------------------------------------------
  // Cart CRUD
  // ----------------------------------------------------
  addToCart: async (productId, quantity) => {
    const { currentUser, cart } = get();
    if (!currentUser) return;

    try {
      const updatedItem = await api.apiAddToCart(currentUser.id, productId, quantity);
      if (updatedItem) {
        const exists = cart.some(item => item.id === updatedItem.id || (item.productId === productId && item.userId === currentUser.id));
        if (exists) {
          set(state => ({
            cart: state.cart.map(item => item.id === updatedItem.id || (item.productId === productId && item.userId === currentUser.id) ? updatedItem : item)
          }));
        } else {
          set(state => ({ cart: [updatedItem, ...state.cart] }));
        }
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      // Fallback
      const existingItem = cart.find(item => item.productId === productId && item.userId === currentUser.id);
      if (existingItem) {
        set(state => ({
          cart: state.cart.map(item =>
            item.id === existingItem.id ? { ...item, quantity: item.quantity + quantity } : item
          )
        }));
      } else {
        const newCartItem: CartItem = {
          id: Date.now().toString(),
          userId: currentUser.id,
          productId,
          quantity,
          addedAt: new Date().toISOString(),
        };
        set(state => ({ cart: [...state.cart, newCartItem] }));
      }
    }
  },

  updateCartItem: async (id, quantity) => {
    try {
      await api.apiUpdateCartItemQuantity(id, quantity);
      if (quantity <= 0) {
        set(state => ({ cart: state.cart.filter(item => item.id !== id) }));
      } else {
        set(state => ({
          cart: state.cart.map(item => item.id === id ? { ...item, quantity } : item)
        }));
      }
    } catch (err) {
      console.error('Error updating cart item:', err);
      if (quantity <= 0) {
        set(state => ({ cart: state.cart.filter(item => item.id !== id) }));
      } else {
        set(state => ({
          cart: state.cart.map(item => item.id === id ? { ...item, quantity } : item)
        }));
      }
    }
  },

  removeFromCart: async (id) => {
    try {
      await api.apiRemoveFromCart(id);
      set(state => ({ cart: state.cart.filter(item => item.id !== id) }));
    } catch (err) {
      console.error('Error removing from cart:', err);
      set(state => ({ cart: state.cart.filter(item => item.id !== id) }));
    }
  },

  clearCart: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await api.apiClearCart(currentUser.id);
      set(state => ({ cart: state.cart.filter(item => item.userId !== currentUser.id) }));
    } catch (err) {
      console.error('Error clearing cart:', err);
      set(state => ({ cart: state.cart.filter(item => item.userId !== currentUser.id) }));
    }
  },

  // ----------------------------------------------------
  // Orders CRUD
  // ----------------------------------------------------
  createOrder: async () => {
    const { currentUser, cart, products } = get();
    if (!currentUser) return;

    const userCart = cart.filter(item => item.userId === currentUser.id);
    if (userCart.length === 0) return;

    const orderItems: { productId: string; quantity: number; price: number }[] = userCart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product?.price || 0,
      };
    });

    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
      const newOrder = await api.apiCreateOrder(currentUser.id, orderItems, total);
      if (newOrder) {
        set(state => ({
          orders: [newOrder, ...state.orders],
          cart: state.cart.filter(item => item.userId !== currentUser.id)
        }));
      }
    } catch (err) {
      console.error('Error creating order:', err);
      // Fallback
      const newOrder: Order = {
        id: Date.now().toString(),
        userId: currentUser.id,
        items: orderItems,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      set(state => ({
        orders: [newOrder, ...state.orders],
        cart: state.cart.filter(item => item.userId !== currentUser.id)
      }));
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      await api.apiUpdateOrderStatus(id, status);
      set(state => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
      }));
    } catch (err) {
      console.error('Error updating order status:', err);
      set(state => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
      }));
    }
  },

  // ----------------------------------------------------
  // Favorites CRUD
  // ----------------------------------------------------
  toggleFavorite: async (productId) => {
    const { currentUser, favorites } = get();
    if (!currentUser) return;

    const isFav = favorites.some(f => f.userId === currentUser.id && f.productId === productId);

    // Optimistic update
    if (isFav) {
      set(state => ({
        favorites: state.favorites.filter(f => !(f.userId === currentUser.id && f.productId === productId))
      }));
    } else {
      const newFav: Favorite = {
        id: Date.now().toString(),
        userId: currentUser.id,
        productId,
        addedAt: new Date().toISOString(),
      };
      set(state => ({ favorites: [...state.favorites, newFav] }));
    }

    try {
      await api.apiToggleFavorite(currentUser.id, productId);
    } catch (err) {
      console.error('Error toggling favorite in Supabase:', err);
    }
  },

  isFavorite: (productId) => {
    const { currentUser, favorites } = get();
    if (!currentUser) return false;
    return favorites.some(f => f.userId === currentUser.id && f.productId === productId);
  },
}));
