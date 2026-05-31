'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectCartCount, toggleCart } from '@/store/slices/cartSlice';
import { selectUser, logout } from '@/store/slices/authSlice';
import { useState, useEffect } from 'react';
import { FiShoppingCart, FiSun, FiMoon, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(selectCartCount);
  const user = useAppSelector(selectUser);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    toast.success('Logged out successfully');
    router.push('/');
  };

  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-brand-500 flex-shrink-0 text-transform uppercase">
            Aurelia Market
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="input-field pl-10 py-2 text-sm"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Cart"
            >
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 card shadow-lg py-1 animate-fade-in">
                      <p className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800">
                        {user.name ?? 'Account'}
                      </p>
                      <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setUserMenuOpen(false)}>Profile</Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setUserMenuOpen(false)}>Orders</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800">
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/auth/login" className="flex items-center gap-2 btn-primary text-sm py-2">
                  <FiUser size={16} />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}
            </div>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Category nav */}
        <nav className="hidden md:flex gap-6 pb-2 text-sm">
          <Link href="/products" className="text-gray-500 hover:text-brand-500 transition-colors font-medium">
            All Products
          </Link>
          {categories.map(cat => (
            <Link
              key={cat}
              href={`/products?category=${cat.toLowerCase()}`}
              className="text-gray-500 hover:text-brand-500 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 animate-slide-up">
          <form onSubmit={handleSearch} className="p-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="input-field pl-10 text-sm"
              />
            </div>
          </form>
          <div className="px-4 pb-4 grid grid-cols-2 gap-2">
            {['All Products', ...categories].map(cat => (
              <Link
                key={cat}
                href={cat === 'All Products' ? '/products' : `/products?category=${cat.toLowerCase()}`}
                className="text-sm py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-500 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}