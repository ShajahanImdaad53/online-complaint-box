'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminProfilePage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const authRes = await fetch('/api/token-check', {
        credentials: 'include',
      });
      
      if (!authRes.ok) {
        throw new Error(`Auth check failed: ${authRes.status}`);
      }
      
      const authData = await authRes.json();

      if (!authData.isAuthenticated || authData.user?.role !== 'admin') {
        router.push('/auth/login');
        return;
      }

      setAdminUser(authData.user);

      // Fetch complaints
      const complaintsRes = await fetch('/api/complaint/getAll?page=1&limit=100', {
        credentials: 'include',
      });

      if (!complaintsRes.ok) {
        throw new Error(`Failed to fetch complaints: ${complaintsRes.status}`);
      }

      const complaintData = await complaintsRes.json();
      const complaintsArray = complaintData.complaints || [];
      setComplaints(complaintsArray);
      
      setStats({
        total: complaintData.total || 0,
        pending: complaintsArray.filter((c) => c.status === 'pending').length,
        approved: complaintsArray.filter((c) => c.status === 'approved').length,
        rejected: complaintsArray.filter((c) => c.status === 'rejected').length,
      });
    } catch (err) {
      setError(`Error loading data: ${err.message}`);
      console.error('Admin profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin" className="text-blue-600 hover:text-blue-700 font-semibold mb-4 inline-flex items-center gap-2">
              ← Back to Dashboard
            </Link>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">Admin Profile</h1>
            <p className="text-lg text-gray-600">Manage your account and view activity</p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg mb-8">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* Main Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-10">
                <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center mb-10">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-6xl shadow-xl flex-shrink-0">
                    👤
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">{adminUser?.username || 'Admin'}</h2>
                    <p className="text-gray-600 text-lg mb-4">{adminUser?.email}</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                        🔐 Administrator
                      </div>
                      <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
                        ✓ Active
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-200 pt-8">
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm font-semibold uppercase">Account Type</p>
                    <p className="text-gray-900 font-bold text-lg">System Administrator</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm font-semibold uppercase">Status</p>
                    <p className="text-green-600 font-bold text-lg">Active (Online)</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm font-semibold uppercase">Member Since</p>
                    <p className="text-gray-900 font-bold text-lg">
                      {adminUser?.createdAt ? new Date(adminUser.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm font-semibold uppercase">Last Login</p>
                    <p className="text-gray-900 font-bold text-lg">Today</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-600">
                <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Total Managed</p>
                <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-gray-500 text-xs mt-2">Complaints</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-600">
                <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Approval Rate</p>
                <p className="text-4xl font-bold text-green-600">
                  {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                </p>
                <p className="text-gray-500 text-xs mt-2">of all complaints</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-yellow-600">
                <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Pending</p>
                <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-gray-500 text-xs mt-2">Under review</p>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="bg-white rounded-2xl shadow-lg p-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Activity Statistics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Total Processed</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-700 font-semibold">Approval Rate</p>
                  <p className="text-gray-600 text-sm">
                    {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-700 font-semibold">Pending Rate</p>
                  <p className="text-gray-600 text-sm">
                    {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-700 font-semibold">Rejection Rate</p>
                  <p className="text-gray-600 text-sm">
                    {stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <Link href="/admin" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
