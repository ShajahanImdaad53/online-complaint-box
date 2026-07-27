'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ManageUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [promoteConfirm, setPromoteConfirm] = useState(null);
  const [promoting, setPromoting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleMakeAdmin = async (userId, userName) => {
    setPromoteConfirm(null);
    setPromoting(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/make-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to promote user to admin');
        return;
      }

      // Update the users list to remove the promoted user
      setUsers(users.filter(u => u._id !== userId));
      setFilteredUsers(filteredUsers.filter(u => u._id !== userId));
      setTotalUsers(totalUsers - 1);
      setSuccessMessage(`${userName} has been promoted to admin successfully!`);
    } catch (err) {
      console.error('Error promoting user:', err);
      setError('Error promoting user to admin. Please try again.');
    } finally {
      setPromoting(false);
    }
  };

  useEffect(() => {
    // When search term changes, reset to page 1
    setCurrentPage(1);
  }, [searchTerm]);

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

      // Fetch paginated citizen users
      const usersRes = await fetch(`/api/admin/users?page=${page}&limit=${itemsPerPage}`, {
        credentials: 'include',
      });

      if (usersRes.ok) {
        const userData = await usersRes.json();
        setUsers(userData.users || []);
        setFilteredUsers(userData.users || []);
        setTotalUsers(userData.total || 0);
        setTotalPages(userData.totalPages || 1);
        setCurrentPage(page);
      } else {
        // Fallback: show empty users list
        setUsers([]);
        setFilteredUsers([]);
        setTotalUsers(0);
        setTotalPages(1);
      }
    } catch (err) {
      setError('Error loading users');
      console.error(err);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const filterUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (u.address && u.address.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredUsers(filtered);
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
          <p className="text-gray-600 text-lg font-semibold">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin" className="text-blue-600 hover:text-blue-700 font-semibold mb-4 inline-flex items-center gap-2">
              ← Back to Dashboard
            </Link>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">Registered Users</h1>
            <p className="text-lg text-gray-600">Manage all registered citizens in the system</p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg mb-8">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-600">
              <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Total Users</p>
              <p className="text-4xl font-bold text-blue-600">{totalUsers}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-green-600">
              <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Showing on Page</p>
              <p className="text-4xl font-bold text-green-600">{filteredUsers.length}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-purple-600">
              <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Total Pages</p>
              <p className="text-4xl font-bold text-purple-600">{totalPages}</p>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Search Users</h3>
            <input
              type="text"
              placeholder="Search by username, email, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600 text-xl mb-2">No users found</p>
                <p className="text-gray-500">Try searching with different terms</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-6 text-left text-sm font-bold text-gray-900">Username</th>
                      <th className="px-6 py-6 text-left text-sm font-bold text-gray-900">Email</th>
                      <th className="px-6 py-6 text-left text-sm font-bold text-gray-900">Address</th>
                      <th className="px-6 py-6 text-left text-sm font-bold text-gray-900">Member Since</th>
                      <th className="px-6 py-6 text-left text-sm font-bold text-gray-900">Complaints Filed</th>
                      <th className="px-6 py-6 text-left text-sm font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user, index) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <p className="text-gray-900 font-semibold">{user.username}</p>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <p className="text-gray-600 font-medium">{user.email}</p>
                        </td>
                        <td className="px-6 py-6">
                          <p className="text-gray-600 font-medium">{user.address || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-6">
                          <p className="text-gray-600 font-medium">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </td>
                        <td className="px-6 py-6">
                          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                            {user.complaintCount || 0}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <button
                            onClick={() => setPromoteConfirm({ userId: user._id, userName: user.username })}
                            disabled={promoting}
                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                          >
                            Make Admin
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-600 font-semibold">
                  Page {currentPage} of {totalPages} ({totalUsers} total users)
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

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-lg mb-8 animate-pulse">
              <p className="font-semibold">{successMessage}</p>
            </div>
          )}

          {/* Confirmation Dialog */}
          {promoteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Promotion</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to make <span className="font-bold text-blue-600">{promoteConfirm.userName}</span> an admin? This action cannot be undone easily.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPromoteConfirm(null)}
                    disabled={promoting}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleMakeAdmin(promoteConfirm.userId, promoteConfirm.userName)}
                    disabled={promoting}
                    className="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {promoting && (
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-green-600"></div>
                    )}
                    {promoting ? 'Promoting...' : 'Yes, Make Admin'}
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
