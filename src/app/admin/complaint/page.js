'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ManageComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComplaints, setTotalComplaints] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  useEffect(() => {
    // When filters change, reset to page 1
    setCurrentPage(1);
  }, [filterStatus, searchTerm, sortBy]);

  const checkAuthAndFetchData = async (page = 1) => {
    try {
      const authRes = await fetch('/api/token-check', {
        credentials: 'include',
      });
      const authData = await authRes.json();

      if (!authData.isAuthenticated || authData.user?.role !== 'admin') {
        router.push('/auth/login');
        return;
      }

      const complaintsRes = await fetch(`/api/complaint/getAll?page=${page}&limit=${itemsPerPage}`, {
        credentials: 'include',
      });

      if (complaintsRes.ok) {
        const complaintData = await complaintsRes.json();
        setComplaints(complaintData.complaints || []);
        setFilteredComplaints(complaintData.complaints || []);
        setTotalComplaints(complaintData.total || 0);
        setTotalPages(complaintData.totalPages || 1);
        setCurrentPage(page);
      }
    } catch (err) {
      setError('Error loading complaints');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterAndSort();
  }, [filterStatus, searchTerm, sortBy, complaints]);

  const filterAndSort = () => {
    let filtered = [...complaints];

    if (filterStatus !== 'all') {
      filtered = filtered.filter((c) => c.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

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

  const handlePageChange = (newPage) => {
    setLoading(true);
    checkAuthAndFetchData(newPage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    

      <main className="flex-grow py-8 sm:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <Link href="/admin" className="text-blue-600 hover:text-blue-700 font-semibold mb-3 sm:mb-4 inline-flex items-center gap-2 text-xs sm:text-sm">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">Manage Complaints</h1>
            <p className="text-xs sm:text-base text-gray-600">Review and manage all citizen complaints</p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8 text-xs sm:text-sm">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border-t-4 border-blue-600">
              <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase mb-2">Total</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">{totalComplaints}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border-t-4 border-yellow-500">
              <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase mb-2">Pending</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-600">{complaints.filter((c) => c.status === 'pending').length}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border-t-4 border-green-600">
              <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase mb-2">Approved</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">{complaints.filter((c) => c.status === 'approved').length}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border-t-4 border-red-600">
              <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase mb-2">Rejected</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600">{complaints.filter((c) => c.status === 'rejected').length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Filters & Search</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Search by Title, Category, or Address</label>
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-xs sm:text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Complaints List */}
          <div className="space-y-4 mb-8 mt-10 ">
            {filteredComplaints.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <p className="text-gray-600 text-xl mb-2">No complaints found</p>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <Link key={complaint._id} href={`/admin/complaint/${complaint._id}`}>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 cursor-pointer border-l-4 border-blue-600 hover:scale-[1.02] transform mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 items-center">
                      {/* Title & ID */}
                      <div className="md:col-span-2">
                        <p className="text-gray-500 text-xs font-semibold uppercase mb-2">Complaint Title</p>
                        <p className="text-gray-900 font-bold text-lg line-clamp-2 mb-2">{complaint.title}</p>
                        <p className="text-gray-400 text-xs">ID: {complaint._id.toString().slice(-8).toUpperCase()}</p>
                      </div>

                      {/* Category */}
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase mb-2">Category</p>
                        <p className="text-gray-900 font-semibold">{complaint.category}</p>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase mb-2">Status</p>
                        <span className={`inline-block px-4 py-2 rounded-full font-bold text-sm border ${getStatusColor(complaint.status)}`}>
                          {getStatusIcon(complaint.status)} {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                        </span>
                      </div>

                      {/* Date & Action */}
                      <div className="flex flex-col items-end gap-3">
                        <div>
                          <p className="text-gray-500 text-xs font-semibold uppercase mb-2">Created</p>
                          <p className="text-gray-900 font-semibold">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-all">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-600 font-semibold">
                  Page {currentPage} of {totalPages} ({totalComplaints} total complaints)
                </p>
                <div className="flex gap-2 flex-wrap justify-center sm:justify-end">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                  >
                    ← Previous
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg font-bold transition-all ${
                          currentPage === page
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div>
            <Link href="/admin" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
