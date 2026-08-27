import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import styles from '@/styles/Cart.module.css';

export default function CartPage() {
  const router = useRouter();
  const currentUser = useStore(state => state.currentUser);
  const cart = useStore(state => state.cart);
  const products = useStore(state => state.products);
  const updateCartItem = useStore(state => state.updateCartItem);
  const removeFromCart = useStore(state => state.removeFromCart);
  const createOrder = useStore(state => state.createOrder);
  const clearCart = useStore(state => state.clearCart);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const userCart = cart.filter(item => item.userId === currentUser.id);

  const getProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateTotal = () => {
    return userCart.reduce((sum, item) => {
      const product = getProduct(item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    if (userCart.length === 0) return;
    createOrder();
    router.push('/orders');
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Giỏ hàng</h1>
          {userCart.length > 0 && (
            <button onClick={clearCart} className={styles.clearBtn}>
              Xóa tất cả
            </button>
          )}
        </div>

        {userCart.length === 0 ? (
          <div className={styles.empty}>
            <p>Giỏ hàng của bạn đang trống</p>
            <button onClick={() => router.push('/')} className={styles.shopBtn}>
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.items}>
              {userCart.map(item => {
                const product = getProduct(item.productId);
                if (!product) return null;

                return (
                  <div key={item.id} className={styles.item}>
                    <img src={product.image} alt={product.name} className={styles.image} />

                    <div className={styles.info}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productPrice}>{formatPrice(product.price)}</p>
                    </div>

                    <div className={styles.quantity}>
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity - 1)}
                        className={styles.quantityBtn}
                      >
                        −
                      </button>
                      <span className={styles.quantityValue}>{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        className={styles.quantityBtn}
                        disabled={item.quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>

                    <div className={styles.subtotal}>
                      {formatPrice(product.price * item.quantity)}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className={styles.removeBtn}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Tóm tắt đơn hàng</h2>

              <div className={styles.summaryRow}>
                <span>Tổng cộng ({userCart.length} sản phẩm)</span>
                <span className={styles.summaryTotal}>{formatPrice(calculateTotal())}</span>
              </div>

              <button onClick={handleCheckout} className={styles.checkoutBtn}>
                Đặt hàng
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
