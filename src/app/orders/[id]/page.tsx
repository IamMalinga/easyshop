'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector } from '@/hooks/redux';
import { selectUser, selectToken } from '@/store/slices/authSlice';
import { Order } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FiCheckCircle, FiClock, FiTruck, FiPackage } from 'react-icons/fi';

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
const statusIcons = [FiClock, FiPackage, FiTruck, FiCheckCircle];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    fetch(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.success) setOrder(data.data); })
      .finally(() => setLoading(false));
  }, [id, user, token, router]);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!order) return <div className="text-center py-20"><p>Order not found</p><Link href="/orders" className="text-brand-500">← Back to orders</Link></div>;

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/orders" className="text-gray-500 hover:text-brand-500 text-sm">← Orders</Link>
        <h1 className="text-2xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h1>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ml-auto ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>

      {/* Status Tracker */}
      {order.status !== 'cancelled' && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-100 dark:bg-gray-800" />
            <div
              className="absolute top-5 left-8 h-0.5 bg-brand-500 transition-all"
              style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%`, right: 'auto' }}
            />
            {statusSteps.map((step, i) => {
              const Icon = statusIcons[i];
              const isActive = i <= currentStep;
              return (
                <div key={step} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? 'bg-brand-500 border-brand-500 text-white' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400'}`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-xs font-medium capitalize ${isActive ? 'text-brand-500' : 'text-gray-400'}`}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          <div className="card p-6">
            <h2 className="font-bold mb-4">Items Ordered</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold mb-4">Shipping Address</h2>
            <address className="text-sm text-gray-600 dark:text-gray-400 not-italic space-y-1">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </address>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${order.itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
                <span>Total</span><span className="text-brand-500">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Payment</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}