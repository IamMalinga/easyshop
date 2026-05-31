'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectCartItems, selectCartTotal, clearCart } from '@/store/slices/cartSlice';
import { selectUser, selectToken } from '@/store/slices/authSlice';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiLock, FiCreditCard } from 'react-icons/fi';

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'US',
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const shipping = total >= 50 ? 0 : 5.99;
  const tax = total * 0.08;
  const orderTotal = total + shipping + tax;

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🔒</p>
        <h2 className="text-2xl font-bold mb-3">Please sign in to checkout</h2>
        <Link href="/auth/login" className="btn-primary inline-block">Sign In</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
        <Link href="/products" className="btn-primary inline-block">Shop Now</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      toast.error('Please fill in all address fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: items.map(i => ({ product: i.productId, name: i.name, image: i.image, price: i.price, quantity: i.quantity })),
          shippingAddress: address,
          paymentMethod,
          itemsPrice: total,
          taxPrice: tax,
          shippingPrice: shipping,
          totalPrice: orderTotal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        router.push(`/orders/${data.data._id}`);
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><FiLock className="text-brand-500" /> Checkout</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Forms */}
          <div className="lg:col-span-3 space-y-6">
            {/* Shipping */}
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4">📦 Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium block mb-1">Street Address</label>
                  <input type="text" placeholder="123 Main St" value={address.street}
                    onChange={e => setAddress({ ...address, street: e.target.value })}
                    className="input-field" required />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">City</label>
                  <input type="text" placeholder="New York" value={address.city}
                    onChange={e => setAddress({ ...address, city: e.target.value })}
                    className="input-field" required />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">State</label>
                  <input type="text" placeholder="NY" value={address.state}
                    onChange={e => setAddress({ ...address, state: e.target.value })}
                    className="input-field" required />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">ZIP Code</label>
                  <input type="text" placeholder="10001" value={address.zipCode}
                    onChange={e => setAddress({ ...address, zipCode: e.target.value })}
                    className="input-field" required />
                </div>
                <div>
                  <label htmlFor="country" className="text-sm font-medium block mb-1">Country</label>
                  <select id="country" value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })}
                    className="input-field">
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="LK">Sri Lanka</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FiCreditCard className="text-brand-500" /> Payment Method</h2>
              <div className="space-y-3">
                {['Credit Card', 'PayPal', 'Cash on Delivery'].map(method => (
                  <label key={method} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === method ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20' : 'border-gray-100 dark:border-gray-700'}`}>
                    <input type="radio" name="payment" value={method} checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)} className="text-brand-500" />
                    <span className="font-medium text-sm">{method}</span>
                  </label>
                ))}
              </div>
              {paymentMethod === 'Credit Card' && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500">🔒 This is a demo. No real payment will be processed.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.productId} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>${total.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Shipping</span><span>{shipping === 0 ? <span className="text-green-500">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-100 dark:border-gray-800 pt-3">
                  <span>Total</span><span className="text-brand-500">${orderTotal.toFixed(2)}</span>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base mt-6 flex items-center justify-center gap-2">
                <FiLock size={16} />
                {loading ? 'Placing Order...' : `Place Order • $${orderTotal.toFixed(2)}`}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">🔒 Secured with SSL encryption</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}