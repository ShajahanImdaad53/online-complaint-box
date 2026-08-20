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
        return 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/30';
      case 'approved':
        return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400 border-red-300 dark:border-red-500/30';
      default:
        return 'bg-gray-100 dark:bg-gray-500/20 text-gray-800 dark:text-gray-400 border-gray-300 dark:border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'approved':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const handlePageChange = (newPage) => {
    setLoading(true);
    checkAuthAndFetchData(newPage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#07090e] flex items-center justify-center transition-colors duration-300">
        <div className="text-center animate-fade-in">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-500 mb-6 shadow-lg"></div>
          <p className="text-gray-900 dark:text-white text-lg font-bold tracking-wide">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#07090e] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[500px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[800px] h-[500px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      <main className="flex-grow py-8 sm:py-12 px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12 animate-fade-in-down">
            <Link href="/admin" className="group inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-full shadow-sm mb-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm font-semibold text-gray-600 dark:text-gray-300">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Manage Complaints</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium">Review, filter, and update citizen complaints.</p>
          </div>

          {error && (
            <div className="bg-red-50/80 dark:bg-red-900/30 backdrop-blur-md border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 p-4 rounded-2xl mb-8 shadow-sm">
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 hover:border-blue-500/50 transition-all duration-500 hover:shadow-xl dark:shadow-none hover:-translate-y-1 group">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Total</p>
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
              </div>
              <p className="text-4xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{totalComplaints}</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 hover:border-amber-500/50 transition-all duration-500 hover:shadow-xl dark:shadow-none hover:-translate-y-1 group">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Pending</p>
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
              <p className="text-4xl font-black text-amber-600 dark:text-amber-400 group-hover:text-amber-500 transition-colors">{complaints.filter((c) => c.status === 'pending').length}</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-xl dark:shadow-none hover:-translate-y-1 group">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Approved</p>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors">{complaints.filter((c) => c.status === 'approved').length}</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 hover:border-red-500/50 transition-all duration-500 hover:shadow-xl dark:shadow-none hover:-translate-y-1 group">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Rejected</p>
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
              </div>
              <p className="text-4xl font-black text-red-600 dark:text-red-400 group-hover:text-red-500 transition-colors">{complaints.filter((c) => c.status === 'rejected').length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 sm:p-8 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filters & Search</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Title, Category, Address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all text-sm shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all text-sm appearance-none shadow-sm cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Sort</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all text-sm appearance-none shadow-sm cursor-pointer"
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Complaints List */}
          <div className="space-y-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {filteredComplaints.length === 0 ? (
              <div className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 p-16 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-gray-600 dark:text-gray-400 text-lg font-bold">No complaints found</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Adjust your filters or search term to see more results.</p>
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <Link key={complaint._id} href={`/admin/complaint/${complaint._id}`} className="block group">
                  <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-gray-800 p-6 sm:p-8 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl dark:shadow-none hover:-translate-y-1 relative overflow-hidden">
                    
                    {/* Subtle status glow indicator */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${
                      complaint.status === 'pending' ? 'bg-amber-400' :
                      complaint.status === 'approved' ? 'bg-emerald-400' : 'bg-red-400'
                    }`}></div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center pl-2">
                      {/* Title & ID */}
                      <div className="md:col-span-2">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                          ID: {complaint._id.toString().slice(-8).toUpperCase()}
                        </p>
                        <h4 className="text-gray-900 dark:text-white font-black text-lg line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{complaint.title}</h4>
                      </div>

                      {/* Category */}
                      <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Category</p>
                        <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm bg-gray-100 dark:bg-gray-800 inline-block px-3 py-1 rounded-md">{complaint.category}</p>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Status</p>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs border ${getStatusColor(complaint.status)}`}>
                          {getStatusIcon(complaint.status)}
                          <span>{complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}</span>
                        </span>
                      </div>

                      {/* Date & Action */}
                      <div className="flex flex-col md:items-end gap-3">
                        <div className="md:text-right">
                          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Submitted</p>
                          <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          View Details <span>→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-gray-800 p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                Showing page <span className="text-gray-900 dark:text-white font-bold">{currentPage}</span> of <span className="text-gray-900 dark:text-white font-bold">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-all text-sm shadow-sm"
                >
                  Prev
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold transition-all text-sm ${
                        currentPage === page
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-all text-sm shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
