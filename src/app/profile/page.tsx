'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectUser, selectToken, updateUser, logout } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiMapPin, FiSave, FiLogOut } from 'react-icons/fi';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    setForm({
      name: user.name || '',
      email: user.email || '',
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      zipCode: user.address?.zipCode || '',
      country: user.address?.country || '',
    });
  }, [user, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name,
          address: { street: form.street, city: form.city, state: form.state, zipCode: form.zipCode, country: form.country },
        }),
      });
      const data = await res.json();
      if (data.success) {
        dispatch(updateUser(data.data));
        toast.success('Profile updated!');
      } else {
        toast.error(data.error || 'Update failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Password changed!');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.error || 'Failed to change password');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><FiUser className="text-brand-500" /> My Profile</h1>

      <div className="space-y-6">
        {/* Profile Info */}
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name ?? 'Account'}</h2>
              <p className="text-gray-500 text-sm flex items-center gap-1"><FiMail size={12} /> {user.email}</p>
              <span className="text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full capitalize mt-1 inline-block">
                {user.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><FiUser size={16} /> Personal Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="profile-name" className="text-sm font-medium block mb-1">Full Name</label>
                <input
                  id="profile-name"
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="profile-email" className="text-sm font-medium block mb-1">Email (read-only)</label>
                <input
                  id="profile-email"
                  type="email"
                  value={form.email}
                  className="input-field opacity-60"
                  disabled
                />
              </div>
            </div>

            <h3 className="font-semibold flex items-center gap-2 pt-2"><FiMapPin size={16} /> Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="profile-street" className="text-sm font-medium block mb-1">Street</label>
                <input
                  id="profile-street"
                  type="text"
                  placeholder="123 Main St"
                  value={form.street}
                  onChange={e => setForm({ ...form, street: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="profile-city" className="text-sm font-medium block mb-1">City</label>
                <input
                  id="profile-city"
                  type="text"
                  placeholder="New York"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="profile-state" className="text-sm font-medium block mb-1">State</label>
                <input
                  id="profile-state"
                  type="text"
                  placeholder="NY"
                  value={form.state}
                  onChange={e => setForm({ ...form, state: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="profile-zip" className="text-sm font-medium block mb-1">ZIP Code</label>
                <input
                  id="profile-zip"
                  type="text"
                  placeholder="10001"
                  value={form.zipCode}
                  onChange={e => setForm({ ...form, zipCode: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="profile-country" className="text-sm font-medium block mb-1">Country</label>
                <input
                  id="profile-country"
                  type="text"
                  placeholder="US"
                  value={form.country}
                  onChange={e => setForm({ ...form, country: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <FiSave size={16} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card p-6">
          <h3 className="font-bold mb-4">🔒 Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {[
              { label: 'Current Password', key: 'currentPassword', placeholder: 'Current password' },
              { label: 'New Password', key: 'newPassword', placeholder: 'New password' },
              { label: 'Confirm New Password', key: 'confirmPassword', placeholder: 'Confirm new password' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label htmlFor={`password-${key}`} className="text-sm font-medium block mb-1">{label}</label>
                <input
                  id={`password-${key}`}
                  type="password"
                  value={passwords[key as keyof typeof passwords]}
                  onChange={e => setPasswords({ ...passwords, [key]: e.target.value })}
                  placeholder={placeholder}
                  title={label}
                  className="input-field"
                />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <FiSave size={16} /> {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="card p-6 border-red-100 dark:border-red-900/30">
          <h3 className="font-bold mb-4 text-red-500">Danger Zone</h3>
          <button
            onClick={() => { dispatch(logout()); router.push('/'); toast.success('Logged out'); }}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <FiLogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}