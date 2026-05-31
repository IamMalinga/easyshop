import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

async function getFeaturedProducts() {
  await dbConnect();
  const products = await Product.find({ featured: true }).limit(8).lean();
  return JSON.parse(JSON.stringify(products));
}

async function getNewArrivals() {
  await dbConnect();
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(8).lean();
  return JSON.parse(JSON.stringify(products));
}

const categories = [
  { name: 'Electronics', icon: '💻', color: 'from-blue-500 to-cyan-500', href: '/products?category=electronics' },
  { name: 'Clothing', icon: '👕', color: 'from-purple-500 to-pink-500', href: '/products?category=clothing' },
  { name: 'Books', icon: '📚', color: 'from-green-500 to-emerald-500', href: '/products?category=books' },
  { name: 'Home', icon: '🏠', color: 'from-orange-500 to-amber-500', href: '/products?category=home' },
  { name: 'Sports', icon: '⚽', color: 'from-red-500 to-rose-500', href: '/products?category=sports' },
  { name: 'Beauty', icon: '✨', color: 'from-pink-500 to-fuchsia-500', href: '/products?category=beauty' },
  { name: 'Toys', icon: '🎮', color: 'from-yellow-500 to-orange-500', href: '/products?category=toys' },
  { name: 'Food', icon: '🍕', color: 'from-lime-500 to-green-500', href: '/products?category=food' },
];

export default async function HomePage() {
  const [featuredProducts, newArrivals] = await Promise.all([getFeaturedProducts(), getNewArrivals()]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-500 via-brand-600 to-orange-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-2xl">
            <p className="text-brand-200 text-sm font-semibold uppercase tracking-widest mb-4">Welcome to Aurelia Market</p>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Shop Smarter,<br />
              <span className="text-white/90">Live Better</span>
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Discover thousands of products across all categories with fast delivery and unbeatable prices.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="bg-white text-brand-600 font-bold px-8 py-3 rounded-lg hover:bg-brand-50 transition-colors">
                Shop Now
              </Link>
              <Link href="/auth/register" className="border-2 border-white/50 text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
                Join Free
              </Link>
            </div>
            <div className="flex gap-8 mt-10">
              {[['10K+', 'Products'], ['50K+', 'Customers'], ['4.8★', 'Rating']].map(([num, label]) => (
                <div key={label}>
                  <div className="text-2xl font-black">{num}</div>
                  <div className="text-sm text-white/70">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map(cat => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col items-center gap-3 p-4 card hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="text-xs font-medium text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: '🔒', title: 'Secure Payment', desc: 'SSL encrypted checkout' },
              { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
              { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3 p-4">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/products?featured=true" className="text-brand-500 hover:text-brand-600 text-sm font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product: Parameters<typeof ProductCard>[0]['product']) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">New Arrivals</h2>
            <Link href="/products" className="text-brand-500 hover:text-brand-600 text-sm font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.map((product: Parameters<typeof ProductCard>[0]['product']) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Get 20% off your first order</h2>
            <p className="text-gray-300">Sign up and start saving today</p>
          </div>
          <Link href="/auth/register" className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-3 rounded-lg transition-colors flex-shrink-0">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}