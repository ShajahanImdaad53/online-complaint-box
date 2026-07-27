'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function ViewProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch profile
      const profileRes = await fetch('/api/user/profile', {
        credentials: 'include',
      });

      if (!profileRes.ok) {
        throw new Error('Failed to fetch profile');
      }

      const profileData = await profileRes.json();
      setUser(profileData.user);

      // Fetch complaints
      const complaintsRes = await fetch('/api/complaint/my', {
        credentials: 'include',
      });

      if (complaintsRes.ok) {
        const complaintData = await complaintsRes.json();
        setComplaints(complaintData.complaints || []);
      }
    } catch (err) {
      setError('Error loading profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: complaints.length,
    approved: complaints.filter((c) => c.status === 'approved').length,
    approvalRate: complaints.length > 0 ? Math.round((complaints.filter((c) => c.status === 'approved').length / complaints.length) * 100) : 0,
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="flex-grow py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/account"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8"
          >
            ← Back to Dashboard
          </Link>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {user && (
            <>
              {/* Profile Header Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 mb-6 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                  {/* Profile Picture */}
                  <div className="flex-shrink-0">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.username}
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-500 shadow-lg">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="flex-grow">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{user.username}</h1>
                    <p className="text-gray-600 text-lg mb-6">{user.email}</p>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Account Type</p>
                        <p className="text-gray-900 font-bold text-lg">{user.role === 'admin' ? 'Admin' : 'Citizen'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Status</p>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">Active</span>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Complaints</p>
                        <p className="text-gray-900 font-bold text-lg">{stats.total}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Approved</p>
                        <p className="text-gray-900 font-bold text-lg">{stats.approved}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Statistics */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 sm:p-8 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Your Statistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">Total Complaints Filed</p>
                    <p className="text-4xl font-bold text-blue-600 mb-2">{stats.total}</p>
                    <p className="text-gray-500 text-sm">All time</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">Approval Rate</p>
                    <p className="text-4xl font-bold text-emerald-600 mb-2">{stats.approvalRate}%</p>
                    <p className="text-gray-500 text-sm">Success ratio</p>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 mb-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wide text-gray-600">Account Details</h3>
                <div className="space-y-4 text-sm sm:text-base">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Email</span>
                    <span className="font-semibold text-gray-900">{user.email}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Username</span>
                    <span className="font-semibold text-gray-900">{user.username}</span>
                  </div>
                  {user.nic && (
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">NIC</span>
                      <span className="font-semibold text-gray-900">{user.nic}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3">
                    <span className="text-gray-600 font-medium">Account Status</span>
                    <span className="font-semibold text-green-600">Active</span>
                  </div>
                </div>
              </div>

              {/* Edit Profile Button */}
              <div className="flex gap-4 justify-center">
                <Link
                  href="/account/edit-profile"
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  ✏️ Edit Profile
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
