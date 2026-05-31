'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const categories = ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys', 'food'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    router.push('/products');
  };

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  const currentCategory = searchParams.get('category');
  const currentSort = searchParams.get('sort');
  const hasFilters = currentCategory || currentSort || searchParams.get('minPrice') || searchParams.get('maxPrice');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-brand-500 hover:text-brand-600">
            Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <div>
        <h4 className="text-sm font-medium mb-3">Sort by</h4>
        <div className="space-y-2">
          {sortOptions.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={currentSort === opt.value || (!currentSort && opt.value === 'newest')}
                onChange={() => updateFilter('sort', opt.value)}
                className="text-brand-500"
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h4 className="text-sm font-medium mb-3">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!currentCategory}
              onChange={() => updateFilter('category', '')}
              className="text-brand-500"
            />
            <span className="text-sm">All</span>
          </label>
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={currentCategory === cat}
                onChange={() => updateFilter('category', cat)}
                className="text-brand-500"
              />
              <span className="text-sm capitalize">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium mb-3">Price Range</h4>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="input-field text-sm py-1.5 px-2"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="input-field text-sm py-1.5 px-2"
          />
        </div>
        <button onClick={handlePriceFilter} className="btn-outline w-full mt-2 text-sm py-1.5">
          Apply
        </button>
      </div>
    </div>
  );
}