'use client';

import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useAppDispatch } from '@/hooks/redux';
import { addToCart, openCart } from '@/store/slices/cartSlice';
import toast from 'react-hot-toast';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (product.stock === 0) return;

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
        stock: product.stock,
      })
    );

    dispatch(openCart());
    toast.success('Added to cart');
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) /
          product.originalPrice) *
          100
      )
    : null;

  return (
    <Link
      href={`/products/${product._id}`}
      className="group flex flex-col overflow-hidden border border-gray-200/70 bg-white shadow-sm transition-all duration-500 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          priority={false}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {discount && discount > 0 && (
          <div className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
            {discount}% OFF
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900">
              Out of Stock
            </span>
          </div>
        )}

        {/* Floating Add To Cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          aria-label="Add to cart"
          title="Add to cart"
          className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-brand-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiShoppingCart size={18} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-brand-500">
          {product.brand}
        </span>

        <h3 className="mb-3 line-clamp-2 min-h-[52px] text-base font-semibold text-gray-900 transition-colors group-hover:text-brand-500 dark:text-white">
          {product.name}
        </h3>

        {product.numReviews > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  size={14}
                  className={
                    star <= Math.round(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }
                />
              ))}
            </div>

            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {product.rating.toFixed(1)}
            </span>

            <span className="text-sm text-gray-400">
              ({product.numReviews})
            </span>
          </div>
        )}

        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${product.price.toFixed(2)}
          </span>

          {product.originalPrice && (
            <span className="pb-1 text-sm text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="mt-4">
          {product.stock > 0 && product.stock <= 5 ? (
            <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
              Only {product.stock} left
            </span>
          ) : product.stock > 5 ? (
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}