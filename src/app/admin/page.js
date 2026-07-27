'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      // Check authentication
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
      
      // Calculate stats
      setStats({
        total: complaintData.total || 0,
        pending: complaintsArray.filter((c) => c.status === 'pending').length,
        approved: complaintsArray.filter((c) => c.status === 'approved').length,
        rejected: complaintsArray.filter((c) => c.status === 'rejected').length,
      });

      setUsers([]);
    } catch (err) {
      setError(`Error loading data: ${err.message}`);
      console.error('Admin dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navigation /> */}

      <main className="flex-grow pt-6 sm:pt-8 pb-8 sm:pb-12 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Admin Dashboard</h1>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Welcome back, {adminUser?.username || 'Admin'}!</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all text-xs sm:text-sm w-full sm:w-auto"
              >
                Logout
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">
                <p className="font-medium text-sm">{error}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Total Complaints */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Total Complaints</p>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-gray-500 text-xs mt-3">All submitted</p>
              </div>

              {/* Pending */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Pending</p>
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                <p className="text-gray-500 text-xs mt-3">Awaiting review</p>
              </div>

              {/* Approved */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Approved</p>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                <p className="text-gray-500 text-xs mt-3">Accepted</p>
              </div>

              {/* Rejected */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Rejected</p>
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-gray-500 text-xs mt-3">Declined</p>
              </div>
            </div>
          </div>

          {/* Admin Cards Section */}
          <div className="mt-8 sm:mt-12">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 uppercase tracking-wide text-gray-700">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Admin Profile Card */}
              <Link href="/admin/view-profile">
                <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 p-5 sm:p-6 cursor-pointer transition-all hover:shadow-md h-full">
                  <div className="flex flex-col h-full">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Admin Profile</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 flex-grow">Manage your account settings</p>
                    <button className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-xs sm:text-sm w-full">
                      View Profile
                    </button>
                  </div>
                </div>
              </Link>

              {/* Manage Complaints Card */}
              <Link href="/admin/complaint">
                <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 p-5 sm:p-6 cursor-pointer transition-all hover:shadow-md h-full">
                  <div className="flex flex-col h-full">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Manage Complaints</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 flex-grow">
                      Review all <span className="font-bold">{stats.total}</span> complaints
                    </p>
                    <button className="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors text-xs sm:text-sm w-full">
                      Manage
                    </button>
                  </div>
                </div>
              </Link>

              {/* Manage Users Card */}
              <Link href="/admin/users">
                <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 p-5 sm:p-6 cursor-pointer transition-all hover:shadow-md h-full">
                  <div className="flex flex-col h-full">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m4 0a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Registered Users</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 flex-grow">View all citizens</p>
                    <button className="px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors text-xs sm:text-sm w-full">
                      View Users
                    </button>
                  </div>
                </div>
              </Link>

            </div>
          </div>

          {/* Recent Statistics Info */}
          <div className="mt-8 sm:mt-12 bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 uppercase tracking-wide text-gray-700">Dashboard Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-6 border border-blue-100">
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2">Approval Rate</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg p-6 border border-amber-100">
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2">Pending Rate</p>
                <p className="text-3xl font-bold text-amber-600">
                  {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%
                </p>
                <div className="w-full bg-amber-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2">Admin Info</p>
                <p className="text-lg font-bold text-gray-900">{adminUser?.username}</p>
                <p className="text-xs text-gray-500 mt-2">{adminUser?.email}</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
