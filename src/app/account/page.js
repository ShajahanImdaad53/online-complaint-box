'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function UserDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('home');
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      // Check authentication
      const authRes = await fetch('/api/token-check', {
        credentials: 'include',
      });
      const authData = await authRes.json();

      if (!authData.isAuthenticated) {
        router.push('/auth/login');
        return;
      }

      setUser(authData.user);

      // Fetch user's complaints
      const complaintsRes = await fetch('/api/complaint/my', {
        credentials: 'include',
      });

      if (complaintsRes.ok) {
        const complaintData = await complaintsRes.json();
        setComplaints(complaintData.complaints || []);
        setFilteredComplaints(complaintData.complaints || []);
      }
    } catch (err) {
      setError('Error loading data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterComplaints();
  }, [filterStatus, complaints]);

  const filterComplaints = () => {
    let filtered = [...complaints];

    if (filterStatus !== 'all') {
      filtered = filtered.filter((c) => c.status === filterStatus);
    }

    setFilteredComplaints(filtered);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '📋';
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'pending').length,
    approved: complaints.filter((c) => c.status === 'approved').length,
    rejected: complaints.filter((c) => c.status === 'rejected').length,
  };

  // Home Section
  const HomeSection = () => (
    <div>
      <div className="mb-6 sm:mb-8">
        {/* <Link href="/">
          <button className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-xs sm:text-sm">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </Link> */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* View Profile Card */}
        <Link href="/account/view-profile">
          <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 p-5 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-md text-left h-full">
            <div className="flex flex-col h-full">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">My Profile</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 flex-grow">View and manage your account settings</p>
              <span className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-xs sm:text-sm inline-block w-full text-center">
                View Profile
              </span>
            </div>
          </div>
        </Link>

        {/* My Complaints Card */}
        <Link href="/complaint">
          <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 p-6 cursor-pointer transition-all duration-300 hover:shadow-md text-left h-full">
            <div className="flex flex-col h-full">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">My Complaints</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 flex-grow">
                Total: <span className="font-bold text-gray-900">{stats.total}</span>
              </p>
              <span className="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors text-xs sm:text-sm inline-block w-full text-center">
                View Complaints
              </span>
            </div>
          </div>
        </Link>

        {/* Create Complaint Card */}
        <Link href="/complaint/create">
          <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 p-5 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-md h-full">
            <div className="flex flex-col h-full">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Create Complaint</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 flex-grow">File a new complaint today</p>
              <button className="px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors text-xs sm:text-sm w-full">
                Create New
              </button>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );

  // Profile Section
  const ProfileSection = () => (
    <div className="space-y-6">
      <div className="mb-8">
        <button
          onClick={() => setActiveSection('home')}
          className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-start gap-8">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center border-2 border-blue-200">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-gray-900">{user?.username || 'User'}</h2>
            <p className="text-gray-600 text-sm mt-1">{user?.email || 'user@email.com'}</p>
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Account Type</p>
                <p className="text-gray-900 font-semibold">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Citizen'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Complaints</p>
                <p className="text-gray-900 font-semibold">{stats.total}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Approved</p>
                <p className="text-gray-900 font-semibold">{stats.approved}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Your Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-100">
            <p className="text-gray-500 text-xs uppercase font-semibold tracking-wide mb-2">Total Complaints Filed</p>
            <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-gray-500 text-xs mt-3">All time</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-100">
            <p className="text-gray-500 text-xs uppercase font-semibold tracking-wide mb-2">Approval Rate</p>
            <p className="text-4xl font-bold text-emerald-600">
              {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
            </p>
            <p className="text-gray-500 text-xs mt-3">Success ratio</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide text-gray-600">Account Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Email</span>
            <span className="font-medium text-gray-900">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Username</span>
            <span className="font-medium text-gray-900">{user?.username}</span>
          </div>
          {user?.nic && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">NIC</span>
              <span className="font-medium text-gray-900">{user.nic}</span>
            </div>
          )}
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Account Status</span>
            <span className="font-medium text-green-600">Active</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
         {/* <button
          onClick={() => setActiveSection('home')}
          className="flex-1 group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>  */}
      </div>
    </div>
  );

  // Complaints Section
  const ComplaintsSection = () => (
    <div className="space-y-6">
      <div className="mb-8">
        <button
          onClick={() => setActiveSection('home')}
          className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Total</p>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Pending</p>
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Approved</p>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Rejected</p>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide text-gray-600">Filter & Search</h3>
        <div className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 text-xs font-semibold mb-2 uppercase tracking-wide">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-gray-900"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 text-base font-medium">Loading complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-600 text-base mb-6 font-medium">No complaints found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComplaints.map((complaint) => (
            <Link key={complaint._id || complaint.id} href={`/complaint/${complaint._id || complaint.id}`}>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 p-5 cursor-pointer transition-all hover:shadow-md">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <h4 className="text-gray-900 font-semibold text-sm line-clamp-2">
                        {complaint.title}
                      </h4>
                      <p className="text-gray-500 text-xs mt-1">
                        {complaint.category} • {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs line-clamp-1">
                    {complaint.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* <Navigation /> */}

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium">
                {activeSection === 'home'
                  ? 'Welcome back, ' + (user?.username || 'User') + '!'
                  : activeSection === 'profile'
                  ? 'Your Profile'
                  : 'My Complaints'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all font-semibold text-xs sm:text-sm w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg font-semibold">
            {error}
          </div>
        )}

        {activeSection === 'home' && <HomeSection />}
        {activeSection === 'profile' && <ProfileSection />}
        {activeSection === 'complaints' && <ComplaintsSection />}

        {/* Back to Home Button */}
        <div className="mt-12 mb-8 flex justify-center">
          <Link href="/">
            <button className="group px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}