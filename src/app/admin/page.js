'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '../components/ThemeProvider';

export default function AdminDashboard() {
  const router = useRouter();
  const { theme, toggleTheme, mounted } = useTheme();
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
      <div className="min-h-screen bg-white dark:bg-[#07090e] flex items-center justify-center transition-colors duration-300">
        <div className="text-center animate-fade-in">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-500 mb-6 shadow-lg"></div>
          <p className="text-gray-900 dark:text-white text-lg font-bold tracking-wide">Loading dashboard<span className="animate-pulse">...</span></p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Authenticating secure session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#07090e] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[500px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[800px] h-[500px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* <Navigation /> */}

      <main className="flex-grow pt-6 sm:pt-8 pb-8 sm:pb-12 px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12 animate-fade-in-down">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-6 sm:mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-full shadow-sm mb-4">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  <p className="text-xs sm:text-sm font-bold tracking-wide uppercase text-blue-600 dark:text-blue-400">Admin Portal</p>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium">Welcome back, {adminUser?.username || 'Admin'}!</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {mounted && (
                  <button
                    onClick={toggleTheme}
                    className="p-2.5 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    aria-label="Toggle Theme"
                  >
                    {theme === 'dark' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="group relative inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:via-rose-500 hover:to-red-400 text-white font-black rounded-full transition-all duration-300 shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95 text-xs sm:text-sm border border-red-400/30 flex-grow sm:flex-grow-0"
                >
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50/80 dark:bg-red-900/30 backdrop-blur-md border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 p-4 rounded-2xl mb-8 shadow-sm">
                <p className="font-medium text-sm">{error}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
              {/* Total Complaints */}
              <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-500 hover:shadow-xl dark:shadow-none transform hover:-translate-y-1.5 group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Total Complaints</p>
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{stats.total}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-3 font-medium">All submitted</p>
              </div>

              {/* Pending */}
              <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all duration-500 hover:shadow-xl dark:shadow-none transform hover:-translate-y-1.5 group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Pending</p>
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-black text-amber-600 dark:text-amber-400 group-hover:text-amber-500 transition-colors">{stats.pending}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-3 font-medium">Awaiting review</p>
              </div>

              {/* Approved */}
              <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-500 hover:shadow-xl dark:shadow-none transform hover:-translate-y-1.5 group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Approved</p>
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors">{stats.approved}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-3 font-medium">Accepted</p>
              </div>

              {/* Rejected */}
              <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 hover:border-red-500/50 dark:hover:border-red-500/50 transition-all duration-500 hover:shadow-xl dark:shadow-none transform hover:-translate-y-1.5 group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Rejected</p>
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-black text-red-600 dark:text-red-400 group-hover:text-red-500 transition-colors">{stats.rejected}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-3 font-medium">Declined</p>
              </div>
            </div>
          </div>

          {/* Admin Cards Section */}
          <div className="mt-8 sm:mt-16 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <span className="text-purple-600 dark:text-purple-400 font-bold text-[11px] uppercase tracking-widest block">Quick Actions</span>
              <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Admin Profile Card */}
              <Link href="/admin/view-profile" className="block h-full">
                <div className="group bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 p-6 sm:p-8 cursor-pointer transition-all duration-500 hover:shadow-xl dark:shadow-none transform hover:-translate-y-1.5 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 w-36 h-36 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl pointer-events-none group-hover:bg-blue-500/20 transition-all"></div>
                  
                  <div className="flex flex-col h-full relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform shrink-0 text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Admin Profile</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow leading-relaxed font-normal">Manage your account settings and administrative preferences.</p>
                    <button className="px-5 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 dark:group-hover:text-white font-bold rounded-xl transition-all duration-300 text-sm w-full flex items-center justify-center gap-2">
                      <span>View Profile</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </Link>

              {/* Manage Complaints Card */}
              <Link href="/admin/complaint" className="block h-full">
                <div className="group bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 p-6 sm:p-8 cursor-pointer transition-all duration-500 hover:shadow-xl dark:shadow-none transform hover:-translate-y-1.5 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 w-36 h-36 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>
                  
                  <div className="flex flex-col h-full relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform shrink-0 text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Manage Complaints</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow leading-relaxed font-normal">
                      Review, update status, and manage all <span className="font-black text-emerald-600 dark:text-emerald-400">{stats.total}</span> complaints in the system.
                    </p>
                    <button className="px-5 py-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 dark:group-hover:text-white font-bold rounded-xl transition-all duration-300 text-sm w-full flex items-center justify-center gap-2">
                      <span>Manage</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </Link>

              {/* Manage Users Card */}
              <Link href="/admin/users" className="block h-full">
                <div className="group bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 p-6 sm:p-8 cursor-pointer transition-all duration-500 hover:shadow-xl dark:shadow-none transform hover:-translate-y-1.5 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 w-36 h-36 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/20 transition-all"></div>
                  
                  <div className="flex flex-col h-full relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform shrink-0 text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m4 0a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Registered Users</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow leading-relaxed font-normal">View all registered citizens and manage user accounts securely.</p>
                    <button className="px-5 py-3 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 group-hover:bg-purple-600 group-hover:text-white dark:group-hover:bg-purple-500 dark:group-hover:text-white font-bold rounded-xl transition-all duration-300 text-sm w-full flex items-center justify-center gap-2">
                      <span>View Users</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </Link>

            </div>
          </div>

          {/* Recent Statistics Info */}
          <div className="mt-8 sm:mt-16 mb-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 sm:p-10 shadow-lg dark:shadow-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-8">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold text-[11px] uppercase tracking-widest block">Analytics overview</span>
                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                {/* Approval Rate */}
                <div className="group bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-gray-800/80 dark:to-blue-900/30 rounded-2xl p-6 sm:p-8 border border-blue-200/80 dark:border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-gray-600 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Approval Rate</p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <p className="text-4xl sm:text-5xl font-black text-blue-600 dark:text-blue-400">
                        {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                      </p>
                    </div>
                    <div className="w-full bg-blue-200/50 dark:bg-blue-950 rounded-full h-2.5 overflow-hidden border border-blue-100 dark:border-blue-900/50">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Pending Rate */}
                <div className="group bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-gray-800/80 dark:to-amber-900/30 rounded-2xl p-6 sm:p-8 border border-amber-200/80 dark:border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-gray-600 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Pending Rate</p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <p className="text-4xl sm:text-5xl font-black text-amber-600 dark:text-amber-400">
                        {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%
                      </p>
                    </div>
                    <div className="w-full bg-amber-200/50 dark:bg-amber-950 rounded-full h-2.5 overflow-hidden border border-amber-100 dark:border-amber-900/50">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Admin Info */}
                <div className="group bg-gradient-to-br from-gray-50/80 to-slate-50/80 dark:from-gray-800/80 dark:to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 flex flex-col justify-center relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Current Session</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-xl uppercase shadow-sm">
                        {adminUser?.username?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="text-lg font-black text-gray-900 dark:text-white">{adminUser?.username || 'Admin'}</p>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{adminUser?.email || 'admin@example.com'}</p>
                      </div>
                    </div>
                    <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 bg-green-100/50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Online & Authorized
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
