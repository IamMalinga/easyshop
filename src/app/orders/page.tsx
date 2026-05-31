'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/hooks/redux';
import { selectUser, selectToken } from '@/store/slices/authSlice';
import { Order } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { FiPackage } from 'react-icons/fi';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function OrdersPage() {
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.success) setOrders(data.data); })
      .finally(() => setLoading(false));
  }, [user, token, router]);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><FiPackage className="text-brand-500" /> My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📦</p>
          <h2 className="text-xl font-bold mb-3">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <Link href="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order._id} href={`/orders/${order._id}`} className="card p-6 block hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order ID</p>
                  <p className="font-mono text-sm font-medium">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Items</p>
                  <p className="text-sm">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total</p>
                  <p className="font-bold text-brand-500">${order.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}