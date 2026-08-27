import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import styles from '@/styles/Favorites.module.css';

export default function FavoritesPage() {
  const router = useRouter();
  const currentUser = useStore(state => state.currentUser);
  const favorites = useStore(state => state.favorites);
  const products = useStore(state => state.products);
  const categories = useStore(state => state.categories);
  const toggleFavorite = useStore(state => state.toggleFavorite);
  const addToCart = useStore(state => state.addToCart);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const userFavorites = favorites.filter(fav => fav.userId === currentUser.id);
  const favoriteProducts = userFavorites
    .map(fav => products.find(p => p.id === fav.productId))
    .filter(Boolean);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = (productId: string) => {
    addToCart(productId, 1);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Sản phẩm yêu thích</h1>

        {favoriteProducts.length === 0 ? (
          <div className={styles.empty}>
            <p>Bạn chưa có sản phẩm yêu thích nào</p>
            <button onClick={() => router.push('/')} className={styles.shopBtn}>
              Khám phá sản phẩm
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {favoriteProducts.map(product => {
              if (!product) return null;

              return (
                <div key={product.id} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <img src={product.image} alt={product.name} className={styles.image} />
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={styles.favoriteBtn}
                      aria-label="Remove from favorites"
                    >
                      ❤️
                    </button>
                  </div>

                  <div className={styles.content}>
                    <div className={styles.category}>
                      {getCategoryName(product.categoryId)}
                    </div>

                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.description}>{product.description}</p>

                    <div className={styles.footer}>
                      <div className={styles.priceWrapper}>
                        <div className={styles.price}>{formatPrice(product.price)}</div>
                        <div className={styles.stock}>Còn {product.stock} sản phẩm</div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className={styles.addToCartBtn}
                        disabled={product.stock === 0}
                      >
                        {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
