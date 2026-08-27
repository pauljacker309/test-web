import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import styles from '@/styles/Login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login = useStore(state => state.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/');
      } else {
        setError('Email hoặc mật khẩu không đúng');
      }
    } catch {
      setError('Đã xảy ra lỗi trong quá trình đăng nhập');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Đăng nhập</h1>

          <div className={styles.demoAccounts}>
            <p className={styles.demoTitle}>Tài khoản demo:</p>
            <div className={styles.demoList}>
              <div className={styles.demoItem}>
                <strong>Admin:</strong> admin@example.com / admin123
              </div>
              <div className={styles.demoItem}>
                <strong>User:</strong> user@example.com / user123
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Mật khẩu</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
