'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/types';
import { StarRating } from '@/components/ui/StarRating';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addToCart, openCart } from '@/store/slices/cartSlice';
import { selectUser } from '@/store/slices/authSlice';
import { FiShoppingCart, FiMinus, FiPlus, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) setProduct(data.data);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      stock: product.stock,
    }));
    dispatch(openCart());
    toast.success('Added to cart!');
  };

  const handleSubmitReview = async () => {
    if (!user) { toast.error('Please login to leave a review'); return; }
    if (!reviewText.trim()) { toast.error('Please write a review'); return; }
    setSubmittingReview(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: reviewRating, comment: reviewText }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Review submitted!');
        setReviewText('');
        setProduct(data.data);
      } else {
        toast.error(data.error || 'Failed to submit review');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!product) return <div className="text-center py-20"><p>Product not found</p><Link href="/products" className="text-brand-500">← Back to products</Link></div>;

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6 flex gap-2">
        <Link href="/" className="hover:text-brand-500">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-brand-500">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-brand-500 capitalize">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div>
          <div className="relative aspect-square bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden mb-4">
            <Image src={product.images[selectedImage]} alt={product.name} fill className="object-contain p-8" />
            {discount && <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">-{discount}%</span>}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-brand-500' : 'border-transparent'}`}
                  aria-label={`View image ${i + 1}`}
                  title={`View image ${i + 1}`}
                >
                  <Image src={img} alt={`${product.name} thumbnail ${i + 1}`} fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="text-sm text-brand-500 font-medium uppercase tracking-wide">{product.brand}</span>
          <h1 className="text-3xl font-bold mt-1 mb-4">{product.name}</h1>
          
          {product.numReviews > 0 && (
            <div className="mb-4">
              <StarRating rating={product.rating} numReviews={product.numReviews} />
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-black text-gray-900 dark:text-gray-100">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{product.description}</p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <FiPackage className={product.stock > 0 ? 'text-green-500' : 'text-red-500'} />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {product.stock === 0 ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left!` : `${product.stock} in stock`}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="space-y-4">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Decrease quantity"
                    title="Decrease quantity"
                    disabled={quantity <= 1}
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Increase quantity"
                    title="Increase quantity"
                    disabled={quantity >= product.stock}
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>

              <button type="button" onClick={handleAddToCart} className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2">
                <FiShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {product.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

        {/* Write Review */}
        <div className="card p-6 mb-8">
          <h3 className="font-semibold mb-4">Write a Review</h3>
          {user ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setReviewRating(s)}>
                      <span className={`text-2xl ${s <= reviewRating ? '★' : '☆'} ${s <= reviewRating ? 'text-amber-400' : 'text-gray-300'}`}>
                        {s <= reviewRating ? '★' : '☆'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className="input-field resize-none"
              />
              <button type="button" onClick={handleSubmitReview} disabled={submittingReview} className="btn-primary">
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              <Link href="/auth/login" className="text-brand-500 hover:underline">Login</Link> to write a review.
            </p>
          )}
        </div>

        {/* Review List */}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(product as any).reviews?.length > 0 ? (
          <div className="space-y-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(product as any).reviews.map((review: any, i: number) => (
              <div key={i} className="card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.name}</p>
                    <StarRating rating={review.rating} size={12} />
                  </div>
                  <span className="text-xs text-gray-400 ml-auto">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}