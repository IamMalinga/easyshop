import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import {
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiMessageCircle,
  FiMonitor,
  FiShoppingBag,
  FiBook,
  FiHome,
  FiActivity,
  FiHeart,
  FiGift,
  FiCoffee,
} from "react-icons/fi";

async function getFeaturedProducts() {
  await dbConnect();
  const products = await Product.find({ featured: true }).limit(8).lean();
  return JSON.parse(JSON.stringify(products));
}

async function getNewArrivals() {
  await dbConnect();
  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();
  return JSON.parse(JSON.stringify(products));
}

const features = [
  {
    icon: FiTruck,
    title: "Free Shipping",
    desc: "On orders over $50",
  },
  {
    icon: FiShield,
    title: "Secure Payment",
    desc: "SSL encrypted checkout",
  },
  {
    icon: FiRefreshCw,
    title: "Easy Returns",
    desc: "30-day return policy",
  },
  {
    icon: FiMessageCircle,
    title: "24/7 Support",
    desc: "Always here to help",
  },
];

const categories = [
  {
    name: "Electronics",
    icon: FiMonitor,
    color: "from-blue-500 to-cyan-500",
    href: "/products?category=electronics",
  },
  {
    name: "Clothing",
    icon: FiShoppingBag,
    color: "from-purple-500 to-pink-500",
    href: "/products?category=clothing",
  },
  {
    name: "Books",
    icon: FiBook,
    color: "from-green-500 to-emerald-500",
    href: "/products?category=books",
  },
  {
    name: "Home",
    icon: FiHome,
    color: "from-orange-500 to-amber-500",
    href: "/products?category=home",
  },
  {
    name: "Sports",
    icon: FiActivity,
    color: "from-red-500 to-rose-500",
    href: "/products?category=sports",
  },
  {
    name: "Beauty",
    icon: FiHeart,
    color: "from-pink-500 to-fuchsia-500",
    href: "/products?category=beauty",
  },
  {
    name: "Toys",
    icon: FiGift,
    color: "from-yellow-500 to-orange-500",
    href: "/products?category=toys",
  },
  {
    name: "Food",
    icon: FiCoffee,
    color: "from-lime-500 to-green-500",
    href: "/products?category=food",
  },
];

export default async function HomePage() {
  const [featuredProducts, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
  ]);

  return (
    <div>
      <section
        className="
    relative overflow-hidden
    bg-gradient-to-br
    from-slate-50 via-white to-orange-50
    dark:from-slate-950
    dark:via-slate-900
    dark:to-brand-950
  "
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-black leading-tight text-gray-900 dark:text-white">
                Shop Everything
                <span className="block bg-gradient-to-r from-brand-500 to-orange-500 bg-clip-text text-transparent">
                  In One Place
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-300">
                Discover premium electronics, fashion, home essentials, beauty
                products, books, and more with fast delivery and unbeatable
                prices.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="
              rounded-xl
              bg-brand-500
              px-8
              py-4
              font-semibold
              text-white
              shadow-lg
              transition-all
              hover:bg-brand-600
              hover:shadow-xl
            "
                >
                  Shop Now
                </Link>

                <Link
                  href="/auth/register"
                  className="
              rounded-xl
              border
              border-gray-300
              dark:border-gray-700
              bg-white
              dark:bg-slate-800
              px-8
              py-4
              font-semibold
              text-gray-900
              dark:text-white
              shadow-sm
              transition-all
              hover:shadow-lg
            "
                >
                  Create Account
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 flex flex-wrap gap-10">
                <div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">
                    10K+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Products
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">
                    50K+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Customers
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">
                    4.9★
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Rating
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div
                  className="
              w-100
              rounded-3xl
              bg-white
              dark:bg-slate-800
              p-6
              shadow-xl
              border
              border-gray-100
              dark:border-gray-700
            "
                >
                  <img
                    src="/hero/headphones.png"
                    alt="Featured Product"
                    className="h-72 w-full object-contain"
                  />

                  <div className="mt-4">
                    <span className="text-sm font-semibold text-green-500">
                      Best Seller
                    </span>

                    <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                      Premium Wireless Headphones
                    </h3>

                    <div className="mt-2 text-3xl font-black text-brand-500">
                      $199
                    </div>
                  </div>
                </div>

                <div
                  className="
              absolute
              -left-12
              top-10
              bg-white
              dark:bg-slate-800
              px-5
              py-3
              shadow-xl
              border
              border-gray-100
              dark:border-gray-700
            "
                >
                  <div className="text-green-500">
                    Free Shipping
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;

            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex flex-col items-center gap-3 p-4  bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${cat.color}  flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                </div>

                <span className="text-xs font-medium text-center">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/20">
                    <Icon className="h-6 w-6 text-brand-500" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm">{item.title}</h3>

                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link
              href="/products?featured=true"
              className="text-brand-500 hover:text-brand-600 text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map(
              (product: Parameters<typeof ProductCard>[0]["product"]) => (
                <ProductCard key={product._id} product={product} />
              ),
            )}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">New Arrivals</h2>
            <Link
              href="/products"
              className="text-brand-500 hover:text-brand-600 text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.map(
              (product: Parameters<typeof ProductCard>[0]["product"]) => (
                <ProductCard key={product._id} product={product} />
              ),
            )}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Get 20% off your first order
            </h2>
            <p className="text-gray-300">Sign up and start saving today</p>
          </div>
          <Link
            href="/auth/register"
            className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-3 rounded-lg transition-colors flex-shrink-0"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}
