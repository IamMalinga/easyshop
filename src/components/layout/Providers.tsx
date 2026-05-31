'use client';

import { store } from '@/store';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { initCart } from '@/store/slices/cartSlice';
import { initAuth } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/hooks/redux';

function StoreInitializer() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initCart());
    dispatch(initAuth());
  }, [dispatch]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <StoreInitializer />
        {children}
      </ThemeProvider>
    </Provider>
  );
}