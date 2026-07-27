'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function MyComplaints() {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkAuthAndFetchComplaints();
  }, []);

  const checkAuthAndFetchComplaints = async () => {
    try {
      // Check authentication
      const authRes = await fetch('/api/token-check', {
        credentials: 'include',
      });

      if (!authRes.ok) {
        router.push('/auth/login');
        return;
      }

      const authData = await authRes.json();

      if (!authData.isAuthenticated) {
        router.push('/auth/login');
        return;
      }

      // Fetch user's complaints
      const res = await fetch('/api/complaint/my', {
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/auth/login');
          return;
        }
        setError('Failed to fetch your complaints');
        return;
      }

      const data = await res.json();
      setComplaints(data.complaints);
      setFilteredComplaints(data.complaints);
    } catch (err) {
      setError('Error loading complaints');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterComplaints();
  }, [filterStatus, searchTerm, complaints]);

  const filterComplaints = () => {
    let filtered = [...complaints];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((c) => c.status === filterStatus);
    }

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by newest first
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredComplaints(filtered);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
              <p className="text-gray-600 text-sm mt-1">Track and manage your filed complaints</p>
            </div>
            <div className="flex gap-3">
              <Link href="/account">
                <button className="group px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base">
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold">Total Complaints</p>
                <p className="text-3xl font-bold mt-2">{stats.total}</p>
              </div>
              <div className="text-5xl opacity-20">📋</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-semibold">Pending</p>
                <p className="text-3xl font-bold mt-2">{stats.pending}</p>
              </div>
              <div className="text-5xl opacity-20">⏳</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-semibold">Approved</p>
                <p className="text-3xl font-bold mt-2">{stats.approved}</p>
              </div>
              <div className="text-5xl opacity-20">✅</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-semibold">Rejected</p>
                <p className="text-3xl font-bold mt-2">{stats.rejected}</p>
              </div>
              <div className="text-5xl opacity-20">❌</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        {loading ? (
          <div className="text-center py-12 ">
            <p className="text-gray-600 text-lg">Loading your complaints...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 text-red-700">
            {error}
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">
              {complaints.length === 0 ? "You haven't filed any complaints yet." : 'No complaints match your filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-4 mt-20">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint._id}
                className=" bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer  overflow-hidden sm:my-10 mt-20 "
                onClick={() => router.push(`/complaint/${complaint._id}`)}
              >
                <div className="p-4 sm:p-6 ">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">
                        Title
                      </p>
                      <p className="text-gray-900 font-bold text-lg line-clamp-2">
                        {complaint.title}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        ID: {complaint._id.toString().slice(-8)}
                      </p>
                    </div>

                    {/* Category */}
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">
                        Category
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {complaint.category}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">
                        Status
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-bold text-sm border ${getStatusColor(
                          complaint.status
                        )}`}
                      >
                        {getStatusIcon(complaint.status)} {complaint.status}
                      </span>
                    </div>

                    {/* Date & Action */}
                    <div className="text-right">
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">
                        Created
                      </p>
                      <p className="text-gray-900 font-semibold mb-4">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm">
                        View →
                      </button>
                    </div>
                  </div>

                  {/* Quick Preview */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {complaint.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

        {/* Back to Home Button */}
        <div className="mt-12 mb-8 flex justify-center px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <button className="group px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </Link>
        </div>

        <Footer />

    </div>
  );
}
