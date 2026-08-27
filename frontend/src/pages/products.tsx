import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import styles from '@/styles/Home.module.css';

export default function HomePage() {
  const router = useRouter();
  const currentUser = useStore(state => state.currentUser);
  const products = useStore(state => state.products);
  const categories = useStore(state => state.categories);
  const addToCart = useStore(state => state.addToCart);
  const toggleFavorite = useStore(state => state.toggleFavorite);
  const isFavorite = useStore(state => state.isFavorite);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        <div className={styles.header}>
          <h1 className={styles.title}>Sản phẩm</h1>

          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.categorySelect}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.grid}>
          {filteredProducts.map(product => (
            <div key={product.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={product.image} alt={product.name} className={styles.image} />
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`${styles.favoriteBtn} ${isFavorite(product.id) ? styles.favoriteBtnActive : ''}`}
                  aria-label="Toggle favorite"
                >
                  {isFavorite(product.id) ? '❤️' : '🤍'}
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
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className={styles.empty}>
            <p>Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>
    </>
  );
}
