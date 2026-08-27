import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import styles from '@/styles/Orders.module.css';

export default function OrdersPage() {
  const router = useRouter();
  const currentUser = useStore(state => state.currentUser);
  const orders = useStore(state => state.orders);
  const products = useStore(state => state.products);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const userOrders = orders.filter(order => order.userId === currentUser.id);

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return styles.statusCompleted;
      case 'processing':
        return styles.statusProcessing;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusPending;
    }
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
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Đơn hàng của tôi</h1>

        {userOrders.length === 0 ? (
          <div className={styles.empty}>
            <p>Bạn chưa có đơn hàng nào</p>
            <button onClick={() => router.push('/')} className={styles.shopBtn}>
              Bắt đầu mua sắm
            </button>
          </div>
        ) : (
          <div className={styles.orders}>
            {userOrders.sort((a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ).map(order => (
              <div key={order.id} className={styles.order}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderId}>Đơn hàng #{order.id}</span>
                    <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                  </div>
                  <span className={`${styles.status} ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className={styles.orderItems}>
                  {order.items.map((item, index) => {
                    const product = getProduct(item.productId);
                    if (!product) return null;

                    return (
                      <div key={index} className={styles.orderItem}>
                        <img src={product.image} alt={product.name} className={styles.itemImage} />
                        <div className={styles.itemInfo}>
                          <span className={styles.itemName}>{product.name}</span>
                          <span className={styles.itemQuantity}>Số lượng: {item.quantity}</span>
                        </div>
                        <span className={styles.itemPrice}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.orderFooter}>
                  <span className={styles.totalLabel}>Tổng cộng:</span>
                  <span className={styles.totalAmount}>{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
