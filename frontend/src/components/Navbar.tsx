import { useStore } from '@/store/useStore';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const currentUser = useStore(state => state.currentUser);
  const logout = useStore(state => state.logout);
  const cart = useStore(state => state.cart);

  const userCartCount = currentUser
    ? cart.filter(item => item.userId === currentUser.id).length
    : 0;

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          ShopCRUD
        </Link>

        <div className={styles.links}>
          {currentUser ? (
            <>
              <Link href="/" className={styles.link}>Trang chủ</Link>
              <Link href="/products" className={styles.link}>Sản phẩm</Link>
              <Link href="/favorites" className={styles.link}>Yêu thích</Link>
              <Link href="/cart" className={styles.link}>
                Giỏ hàng {userCartCount > 0 && <span className={styles.badge}>{userCartCount}</span>}
              </Link>
              <Link href="/orders" className={styles.link}>Đơn hàng</Link>

              {currentUser.role === 'admin' && (
                <Link href="/admin" className={styles.link}>Quản trị</Link>
              )}

              <div className={styles.user}>
                <span className={styles.userName}>{currentUser.name}</span>
                <button onClick={logout} className={styles.logoutBtn}>
                  Đăng xuất
                </button>
              </div>
            </>
          ) : (
            <Link href="/login" className={styles.loginBtn}>
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
