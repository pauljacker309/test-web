import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import styles from '@/styles/Homepage.module.css';

export default function HomePage() {
  const router = useRouter();
  const currentUser = useStore(state => state.currentUser);
  const products = useStore(state => state.products);
  const categories = useStore(state => state.categories);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const featuredProducts = products.slice(0, 3);

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            ShopCRUD
          </Link>

          <div className={styles.navLinks}>
            {currentUser ? (
              <>
                <Link href="/products" className={styles.navLink}>Sản phẩm</Link>
                <Link href="/cart" className={styles.navLink}>Giỏ hàng</Link>
                {currentUser.role === 'admin' && (
                  <Link href="/admin" className={styles.navLink}>Quản trị</Link>
                )}
                <span className={styles.userName}>{currentUser.name}</span>
              </>
            ) : (
              <Link href="/login" className={styles.loginBtn}>
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Chào mừng đến với <span className={styles.highlight}>ShopCRUD</span>
            </h1>
            <p className={styles.heroDescription}>
              Nền tảng mua sắm trực tuyến với hàng nghìn sản phẩm công nghệ chất lượng cao.
              Trải nghiệm mua sắm dễ dàng, nhanh chóng và tiện lợi.
            </p>
            <div className={styles.heroActions}>
              <Link href={currentUser ? "/products" : "/login"} className={styles.primaryBtn}>
                {currentUser ? "Khám phá ngay" : "Bắt đầu mua sắm"}
              </Link>
              {!currentUser && (
                <Link href="/login" className={styles.secondaryBtn}>
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardIcon}>🛍️</div>
              <h3 className={styles.heroCardTitle}>Sản phẩm đa dạng</h3>
              <p className={styles.heroCardText}>Hàng nghìn sản phẩm chính hãng</p>
            </div>
            <div className={styles.heroCard}>
              <div className={styles.heroCardIcon}>🚚</div>
              <h3 className={styles.heroCardTitle}>Giao hàng nhanh</h3>
              <p className={styles.heroCardText}>Miễn phí vận chuyển toàn quốc</p>
            </div>
            <div className={styles.heroCard}>
              <div className={styles.heroCardIcon}>🔒</div>
              <h3 className={styles.heroCardTitle}>Thanh toán an toàn</h3>
              <p className={styles.heroCardText}>Bảo mật thông tin tuyệt đối</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.categories}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Danh mục sản phẩm</h2>
          <div className={styles.categoriesGrid}>
            {categories.map(category => (
              <Link
                key={category.id}
                href={currentUser ? `/products?category=${category.id}` : "/login"}
                className={styles.categoryCard}
              >
                <div className={styles.categoryIcon}>📦</div>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.categoryDesc}>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Sản phẩm nổi bật</h2>
          <div className={styles.productsGrid}>
            {featuredProducts.map(product => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.image} alt={product.name} />
                </div>
                <div className={styles.productContent}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productDesc}>{product.description}</p>
                  <div className={styles.productFooter}>
                    <span className={styles.productPrice}>{formatPrice(product.price)}</span>
                    <Link
                      href={currentUser ? "/products" : "/login"}
                      className={styles.productBtn}
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.featuredAction}>
            <Link href={currentUser ? "/products" : "/login"} className={styles.viewAllBtn}>
              Xem tất cả sản phẩm →
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Sẵn sàng bắt đầu?</h2>
          <p className={styles.ctaDescription}>
            Tham gia cùng hàng nghìn khách hàng đã tin tưởng ShopCRUD
          </p>
          <Link href={currentUser ? "/products" : "/login"} className={styles.ctaBtn}>
            {currentUser ? "Khám phá sản phẩm" : "Đăng ký ngay"}
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerSection}>
              <h4 className={styles.footerTitle}>ShopCRUD</h4>
              <p className={styles.footerText}>
                Nền tảng mua sắm trực tuyến uy tín hàng đầu Việt Nam
              </p>
            </div>
            <div className={styles.footerSection}>
              <h4 className={styles.footerTitle}>Về chúng tôi</h4>
              <ul className={styles.footerList}>
                <li><a href="#" className={styles.footerLink}>Giới thiệu</a></li>
                <li><a href="#" className={styles.footerLink}>Liên hệ</a></li>
                <li><a href="#" className={styles.footerLink}>Tuyển dụng</a></li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4 className={styles.footerTitle}>Chính sách</h4>
              <ul className={styles.footerList}>
                <li><a href="#" className={styles.footerLink}>Điều khoản sử dụng</a></li>
                <li><a href="#" className={styles.footerLink}>Chính sách bảo mật</a></li>
                <li><a href="#" className={styles.footerLink}>Chính sách vận chuyển</a></li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4 className={styles.footerTitle}>Hỗ trợ</h4>
              <ul className={styles.footerList}>
                <li><a href="#" className={styles.footerLink}>Câu hỏi thường gặp</a></li>
                <li><a href="#" className={styles.footerLink}>Hướng dẫn mua hàng</a></li>
                <li><a href="#" className={styles.footerLink}>Chăm sóc khách hàng</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© 2026 ShopCRUD. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
