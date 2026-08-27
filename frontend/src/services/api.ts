import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User, Category, Product, CartItem, Order, OrderItem, Favorite } from '@/types';
import { mockUsers, mockCategories, mockProducts } from '@/data/mockData';

// Helper mappers between DB snake_case and FE camelCase
export function mapUserFromDb(row: any): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    password: row.password,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapCategoryFromDb(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapProductFromDb(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    price: Number(row.price),
    categoryId: row.category_id || '',
    image: row.image || '',
    stock: Number(row.stock),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapCartItemFromDb(row: any): CartItem {
  return {
    id: row.id,
    userId: row.user_id,
    productId: row.product_id,
    quantity: Number(row.quantity),
    addedAt: row.added_at || new Date().toISOString(),
  };
}

export function mapFavoriteFromDb(row: any): Favorite {
  return {
    id: row.id,
    userId: row.user_id,
    productId: row.product_id,
    addedAt: row.added_at || new Date().toISOString(),
  };
}

export function mapOrderFromDb(orderRow: any, items: OrderItem[]): Order {
  return {
    id: orderRow.id,
    userId: orderRow.user_id,
    total: Number(orderRow.total),
    status: orderRow.status,
    createdAt: orderRow.created_at || new Date().toISOString(),
    items: items,
  };
}

// ==========================================
// 1. AUTH & USERS API
// ==========================================
export async function apiGetUsers(): Promise<User[]> {
  if (!isSupabaseConfigured) return [...mockUsers];
  try {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return [...mockUsers];
    return data.map(mapUserFromDb);
  } catch {
    return [...mockUsers];
  }
}

export async function apiCreateUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  if (!isSupabaseConfigured) {
    return { ...userData, id: Date.now().toString(), createdAt: new Date().toISOString() };
  }
  const { data, error } = await supabase.from('users').insert({
    email: userData.email,
    name: userData.name,
    role: userData.role,
    password: userData.password,
  }).select().single();

  if (error || !data) throw error || new Error('Failed to create user');
  return mapUserFromDb(data);
}

export async function apiUpdateUser(id: string, userData: Partial<User>): Promise<User | null> {
  if (!isSupabaseConfigured) return null;
  const updatePayload: any = {};
  if (userData.email !== undefined) updatePayload.email = userData.email;
  if (userData.name !== undefined) updatePayload.name = userData.name;
  if (userData.role !== undefined) updatePayload.role = userData.role;
  if (userData.password !== undefined) updatePayload.password = userData.password;

  const { data, error } = await supabase
    .from('users')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) throw error || new Error('Failed to update user');
  return mapUserFromDb(data);
}

export async function apiDeleteUser(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================
// 2. CATEGORIES API
// ==========================================
export async function apiGetCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return [...mockCategories];
  try {
    const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
    if (error || !data || data.length === 0) return [...mockCategories];
    return data.map(mapCategoryFromDb);
  } catch {
    return [...mockCategories];
  }
}

export async function apiCreateCategory(categoryData: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
  if (!isSupabaseConfigured) {
    return { ...categoryData, id: Date.now().toString(), createdAt: new Date().toISOString() };
  }
  const { data, error } = await supabase.from('categories').insert({
    name: categoryData.name,
    description: categoryData.description || '',
  }).select().single();

  if (error || !data) throw error || new Error('Failed to create category');
  return mapCategoryFromDb(data);
}

export async function apiUpdateCategory(id: string, categoryData: Partial<Category>): Promise<Category | null> {
  if (!isSupabaseConfigured) return null;
  const updatePayload: any = {};
  if (categoryData.name !== undefined) updatePayload.name = categoryData.name;
  if (categoryData.description !== undefined) updatePayload.description = categoryData.description;

  const { data, error } = await supabase
    .from('categories')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) throw error || new Error('Failed to update category');
  return mapCategoryFromDb(data);
}

export async function apiDeleteCategory(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================
// 3. PRODUCTS API
// ==========================================
export async function apiGetProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return [...mockProducts];
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return [...mockProducts];
    return data.map(mapProductFromDb);
  } catch {
    return [...mockProducts];
  }
}

export async function apiCreateProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  if (!isSupabaseConfigured) {
    return { ...productData, id: Date.now().toString(), createdAt: new Date().toISOString() };
  }
  const { data, error } = await supabase.from('products').insert({
    name: productData.name,
    description: productData.description || '',
    price: productData.price,
    category_id: productData.categoryId,
    image: productData.image,
    stock: productData.stock,
  }).select().single();

  if (error || !data) throw error || new Error('Failed to create product');
  return mapProductFromDb(data);
}

export async function apiUpdateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
  if (!isSupabaseConfigured) return null;
  const updatePayload: any = {};
  if (productData.name !== undefined) updatePayload.name = productData.name;
  if (productData.description !== undefined) updatePayload.description = productData.description;
  if (productData.price !== undefined) updatePayload.price = productData.price;
  if (productData.categoryId !== undefined) updatePayload.category_id = productData.categoryId;
  if (productData.image !== undefined) updatePayload.image = productData.image;
  if (productData.stock !== undefined) updatePayload.stock = productData.stock;

  const { data, error } = await supabase
    .from('products')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) throw error || new Error('Failed to update product');
  return mapProductFromDb(data);
}

export async function apiDeleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================
// 4. CART API
// ==========================================
export async function apiGetCart(userId?: string): Promise<CartItem[]> {
  if (!isSupabaseConfigured || !userId) return [];
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error || !data) return [];
    return data.map(mapCartItemFromDb);
  } catch {
    return [];
  }
}

export async function apiAddToCart(userId: string, productId: string, quantity: number): Promise<CartItem | null> {
  if (!isSupabaseConfigured) return null;
  // Check if exists
  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (existing) {
    const newQty = existing.quantity + quantity;
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: newQty })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return mapCartItemFromDb(data);
  } else {
    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id: productId,
        quantity,
      })
      .select()
      .single();
    if (error) throw error;
    return mapCartItemFromDb(data);
  }
}

export async function apiUpdateCartItemQuantity(id: string, quantity: number): Promise<void> {
  if (!isSupabaseConfigured) return;
  if (quantity <= 0) {
    await apiRemoveFromCart(id);
  } else {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id);
    if (error) throw error;
  }
}

export async function apiRemoveFromCart(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('cart_items').delete().eq('id', id);
  if (error) throw error;
}

export async function apiClearCart(userId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('cart_items').delete().eq('user_id', userId);
  if (error) throw error;
}

// ==========================================
// 5. ORDERS API
// ==========================================
export async function apiGetOrders(userId?: string): Promise<Order[]> {
  if (!isSupabaseConfigured) return [];
  try {
    let query = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data, error } = await query;
    if (error || !data) return [];

    return data.map(o => {
      const items: OrderItem[] = (o.order_items || []).map((i: any) => ({
        productId: i.product_id,
        quantity: Number(i.quantity),
        price: Number(i.price),
      }));
      return mapOrderFromDb(o, items);
    });
  } catch {
    return [];
  }
}

export async function apiCreateOrder(
  userId: string,
  items: OrderItem[],
  total: number
): Promise<Order | null> {
  if (!isSupabaseConfigured) return null;

  // 1. Create order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total,
      status: 'pending',
    })
    .select()
    .single();

  if (orderError || !orderData) throw orderError || new Error('Failed to create order');

  // 2. Create order items
  const orderItemsPayload = items.map(item => ({
    order_id: orderData.id,
    product_id: item.productId,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsPayload);

  if (itemsError) throw itemsError;

  // 3. Clear cart
  await apiClearCart(userId);

  return mapOrderFromDb(orderData, items);
}

export async function apiUpdateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) throw error;
}

// ==========================================
// 6. FAVORITES API
// ==========================================
export async function apiGetFavorites(userId?: string): Promise<Favorite[]> {
  if (!isSupabaseConfigured || !userId) return [];
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId);

    if (error || !data) return [];
    return data.map(mapFavoriteFromDb);
  } catch {
    return [];
  }
}

export async function apiToggleFavorite(userId: string, productId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const { data: existing } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id);
    return false; // removed
  } else {
    await supabase.from('favorites').insert({
      user_id: userId,
      product_id: productId,
    });
    return true; // added
  }
}
