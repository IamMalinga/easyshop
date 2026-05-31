// @ts-expect-error CSS imports are handled by Next.js
import './globals.css';

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Providers } from '@/components/layout/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Toaster } from 'react-hot-toast';


const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Aurelia Market - Modern E-Commerce',
  description: 'Shop the latest products with the best deals',
    icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen`}>
        <Providers>
          <Navbar />
          <CartDrawer />
          <main className="min-h-screen">{children}</main>
          <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-2xl font-bold text-brand-500 mb-3">Aurelia Market</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Your one-stop destination for quality products at unbeatable prices.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Shop</h4>
                  <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <li><a href="/products" className="hover:text-brand-500">All Products</a></li>
                    <li><a href="/products?category=electronics" className="hover:text-brand-500">Electronics</a></li>
                    <li><a href="/products?category=clothing" className="hover:text-brand-500">Clothing</a></li>
                    <li><a href="/products?category=books" className="hover:text-brand-500">Books</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Account</h4>
                  <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <li><a href="/profile" className="hover:text-brand-500">Profile</a></li>
                    <li><a href="/orders" className="hover:text-brand-500">Orders</a></li>
                    <li><a href="/auth/login" className="hover:text-brand-500">Login</a></li>
                    <li><a href="/auth/register" className="hover:text-brand-500">Register</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} Dragon Labs. All rights reserved.
              </div>
            </div>
          </footer>
          <Toaster position="bottom-right" toastOptions={{ className: 'dark:bg-gray-800 dark:text-white' }} />
        </Providers>
      </body>
    </html>
  );
}