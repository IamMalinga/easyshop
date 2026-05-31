'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  selectCartItems, selectCartTotal, selectCartIsOpen,
  closeCart, removeFromCart, updateQuantity, clearCart
} from '@/store/slices/cartSlice';
import { FiX, FiTrash2, FiShoppingBag, FiPlus, FiMinus } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const isOpen = useAppSelector(selectCartIsOpen);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => dispatch(closeCart())}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiShoppingBag className="text-brand-500" />
            Cart ({items.length})
          </h2>
          <div className="flex gap-2">
            {items.length > 0 && (
              <button
                onClick={() => dispatch(clearCart())}
                className="text-sm text-red-400 hover:text-red-500 flex items-center gap-1"
              >
                <FiTrash2 size={14} /> Clear
              </button>
            )}
            <button
              onClick={() => dispatch(closeCart())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Close cart"
              aria-label="Close cart"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <FiShoppingBag size={48} className="text-gray-200 dark:text-gray-700 mb-4" />
              <p className="text-gray-500 mb-6">Your cart is empty</p>
              <Link
                href="/products"
                className="btn-primary"
                onClick={() => dispatch(closeCart())}
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item.productId} className="flex gap-4 p-3 card">
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image src={item.image} alt={item.name} fill className="object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-brand-500 font-semibold">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
                      className="w-6 h-6 rounded flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      disabled={item.quantity <= 1}
                      title="Decrease quantity"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <FiMinus size={12} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                      className="w-6 h-6 rounded flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      disabled={item.quantity >= item.stock}
                      title="Increase quantity"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <FiPlus size={12} />
                    </button>
                    <span className="text-xs text-gray-400 ml-1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item.productId))}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors self-start"
                  title={`Remove ${item.name} from cart`}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <FiX size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span>{total >= 50 ? <span className="text-green-500">Free</span> : '$5.99'}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-100 dark:border-gray-800 pt-4">
              <span>Total</span>
              <span>${(total >= 50 ? total : total + 5.99).toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              className="btn-primary w-full text-center block py-3 text-base"
              onClick={() => dispatch(closeCart())}
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={() => dispatch(closeCart())}
              className="btn-secondary w-full text-center py-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}