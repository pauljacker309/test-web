import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export default function App({ Component, pageProps }: AppProps) {
  const fetchInitialData = useStore(state => state.fetchInitialData);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return <Component {...pageProps} />;
}
