import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilters } from '@/components/product/ProductFilters';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface SearchParams {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  featured?: string;
  page?: string;
}

async function getProducts(params: SearchParams) {
  await dbConnect();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: Record<string, any> = {};

  if (params.search) {
    query.$text = { $search: params.search };
  }
  if (params.category) {
    query.category = params.category.toLowerCase();
  }
  if (params.featured === 'true') {
    query.featured = true;
  }
  if (params.minPrice || params.maxPrice) {
    query.price = {};
    if (params.minPrice) query.price.$gte = Number(params.minPrice);
    if (params.maxPrice) query.price.$lte = Number(params.maxPrice);
  }

  const sortMap: Record<string, Record<string, number>> = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'rating': { rating: -1 },
    'newest': { createdAt: -1 },
  };
  const sort = sortMap[params.sort || 'newest'] || { createdAt: -1 };

  const page = Number(params.page) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    total,
    pages: Math.ceil(total / limit),
    page,
  };
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const { products, total, pages, page } = await getProducts(searchParams);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="md:w-64 flex-shrink-0">
          <Suspense fallback={<LoadingSpinner />}>
            <ProductFilters />
          </Suspense>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                {searchParams.category
                  ? searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1)
                  : searchParams.search
                  ? `Results for "${searchParams.search}"`
                  : 'All Products'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{total} products found</p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h2 className="text-xl font-bold mb-2">No products found</h2>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <a
                  key={p}
                  href={`?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}