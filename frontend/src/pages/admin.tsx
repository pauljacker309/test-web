import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import styles from '@/styles/Admin.module.css';

export default function AdminPage() {
  const router = useRouter();
  const currentUser = useStore(state => state.currentUser);
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'users'>('products');

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.role !== 'admin') {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'admin') return null;

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Quản trị hệ thống</h1>

        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab('products')}
            className={`${styles.tab} ${activeTab === 'products' ? styles.tabActive : ''}`}
          >
            Sản phẩm
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`${styles.tab} ${activeTab === 'categories' ? styles.tabActive : ''}`}
          >
            Danh mục
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
          >
            Đơn hàng
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`${styles.tab} ${activeTab === 'users' ? styles.tabActive : ''}`}
          >
            Người dùng
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'categories' && <CategoriesTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'users' && <UsersTab />}
        </div>
      </div>
    </>
  );
}

function ProductsTab() {
  const products = useStore(state => state.products);
  const categories = useStore(state => state.categories);
  const addProduct = useStore(state => state.addProduct);
  const updateProduct = useStore(state => state.updateProduct);
  const deleteProduct = useStore(state => state.deleteProduct);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    image: '',
    stock: 0,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      image: '',
      stock: 0,
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        image: product.image,
        stock: product.stock,
      });
      setEditingId(productId);
      setIsFormOpen(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, formData);
    } else {
      addProduct(formData);
    }
    resetForm();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h2 className={styles.tabTitle}>Quản lý sản phẩm</h2>
        <button onClick={() => setIsFormOpen(true)} className={styles.addBtn}>
          + Thêm sản phẩm
        </button>
      </div>

      {isFormOpen && (
        <div className={styles.modal} onClick={resetForm}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              <button onClick={resetForm} className={styles.closeBtn}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Tên sản phẩm</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className={styles.textarea}
                  rows={3}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Giá (VNĐ)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Số lượng</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Danh mục</label>
                <select
                  value={formData.categoryId}
                  onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                  className={styles.select}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>URL hình ảnh</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                  Hủy
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.tableCell}>Hình ảnh</div>
          <div className={styles.tableCell}>Tên sản phẩm</div>
          <div className={styles.tableCell}>Danh mục</div>
          <div className={styles.tableCell}>Giá</div>
          <div className={styles.tableCell}>Kho</div>
          <div className={styles.tableCell}>Thao tác</div>
        </div>

        {products.map(product => (
          <div key={product.id} className={styles.tableRow}>
            <div className={styles.tableCell}>
              <img src={product.image} alt={product.name} className={styles.tableImage} />
            </div>
            <div className={styles.tableCell}>
              <div className={styles.productInfo}>
                <span className={styles.productName}>{product.name}</span>
                <span className={styles.productDesc}>{product.description}</span>
              </div>
            </div>
            <div className={styles.tableCell}>{getCategoryName(product.categoryId)}</div>
            <div className={styles.tableCell}>{formatPrice(product.price)}</div>
            <div className={styles.tableCell}>{product.stock}</div>
            <div className={styles.tableCell}>
              <div className={styles.actions}>
                <button onClick={() => handleEdit(product.id)} className={styles.editBtn}>
                  Sửa
                </button>
                <button onClick={() => deleteProduct(product.id)} className={styles.deleteBtn}>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoriesTab() {
  const categories = useStore(state => state.categories);
  const addCategory = useStore(state => state.addCategory);
  const updateCategory = useStore(state => state.updateCategory);
  const deleteCategory = useStore(state => state.deleteCategory);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
      });
      setEditingId(categoryId);
      setIsFormOpen(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCategory(editingId, formData);
    } else {
      addCategory(formData);
    }
    resetForm();
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h2 className={styles.tabTitle}>Quản lý danh mục</h2>
        <button onClick={() => setIsFormOpen(true)} className={styles.addBtn}>
          + Thêm danh mục
        </button>
      </div>

      {isFormOpen && (
        <div className={styles.modal} onClick={resetForm}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingId ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
              </h3>
              <button onClick={resetForm} className={styles.closeBtn}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Tên danh mục</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className={styles.textarea}
                  rows={3}
                  required
                />
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                  Hủy
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.tableCell}>ID</div>
          <div className={styles.tableCell}>Tên danh mục</div>
          <div className={styles.tableCell}>Mô tả</div>
          <div className={styles.tableCell}>Thao tác</div>
        </div>

        {categories.map(category => (
          <div key={category.id} className={styles.tableRow}>
            <div className={styles.tableCell}>{category.id}</div>
            <div className={styles.tableCell}>{category.name}</div>
            <div className={styles.tableCell}>{category.description}</div>
            <div className={styles.tableCell}>
              <div className={styles.actions}>
                <button onClick={() => handleEdit(category.id)} className={styles.editBtn}>
                  Sửa
                </button>
                <button onClick={() => deleteCategory(category.id)} className={styles.deleteBtn}>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersTab() {
  const orders = useStore(state => state.orders);
  const users = useStore(state => state.users);
  const products = useStore(state => state.products);
  const updateOrderStatus = useStore(state => state.updateOrderStatus);

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Unknown';
  };

  const getProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h2 className={styles.tabTitle}>Quản lý đơn hàng</h2>
      </div>

      <div className={styles.ordersList}>
        {orders.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).map(order => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderCardHeader}>
              <div>
                <div className={styles.orderId}>Đơn hàng #{order.id}</div>
                <div className={styles.orderMeta}>
                  {getUserName(order.userId)} • {formatDate(order.createdAt)}
                </div>
              </div>
              <div className={styles.orderStatus}>
                <select
                  value={order.status}
                  onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                  className={styles.statusSelect}
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>

            <div className={styles.orderItems}>
              {order.items.map((item, index) => {
                const product = getProduct(item.productId);
                if (!product) return null;

                return (
                  <div key={index} className={styles.orderItem}>
                    <span>{product.name}</span>
                    <span>x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            <div className={styles.orderTotal}>
              <span>Tổng cộng:</span>
              <span className={styles.orderTotalAmount}>{formatPrice(order.total)}</span>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className={styles.emptyState}>Chưa có đơn hàng nào</div>
        )}
      </div>
    </div>
  );
}

function UsersTab() {
  const users = useStore(state => state.users);
  const addUser = useStore(state => state.addUser);
  const updateUser = useStore(state => state.updateUser);
  const deleteUser = useStore(state => state.deleteUser);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'user' as 'admin' | 'user',
    password: '',
  });

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      role: 'user',
      password: '',
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setFormData({
        email: user.email,
        name: user.name,
        role: user.role,
        password: user.password,
      });
      setEditingId(userId);
      setIsFormOpen(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateUser(editingId, formData);
    } else {
      addUser(formData);
    }
    resetForm();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h2 className={styles.tabTitle}>Quản lý người dùng</h2>
        <button onClick={() => setIsFormOpen(true)} className={styles.addBtn}>
          + Thêm người dùng
        </button>
      </div>

      {isFormOpen && (
        <div className={styles.modal} onClick={resetForm}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingId ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
              </h3>
              <button onClick={resetForm} className={styles.closeBtn}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Tên</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Mật khẩu</label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Vai trò</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                  className={styles.select}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                  Hủy
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.tableCell}>ID</div>
          <div className={styles.tableCell}>Email</div>
          <div className={styles.tableCell}>Tên</div>
          <div className={styles.tableCell}>Vai trò</div>
          <div className={styles.tableCell}>Ngày tạo</div>
          <div className={styles.tableCell}>Thao tác</div>
        </div>

        {users.map(user => (
          <div key={user.id} className={styles.tableRow}>
            <div className={styles.tableCell}>{user.id}</div>
            <div className={styles.tableCell}>{user.email}</div>
            <div className={styles.tableCell}>{user.name}</div>
            <div className={styles.tableCell}>
              <span className={user.role === 'admin' ? styles.roleAdmin : styles.roleUser}>
                {user.role}
              </span>
            </div>
            <div className={styles.tableCell}>{formatDate(user.createdAt)}</div>
            <div className={styles.tableCell}>
              <div className={styles.actions}>
                <button onClick={() => handleEdit(user.id)} className={styles.editBtn}>
                  Sửa
                </button>
                <button onClick={() => deleteUser(user.id)} className={styles.deleteBtn}>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
