'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ComplaintView() {
  const router = useRouter();
  const params = useParams();
  const complaintId = params.id;

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuthAndFetchComplaint();
  }, [complaintId]);

  const checkAuthAndFetchComplaint = async () => {
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

      // Fetch user's complaints to find this one
      const res = await fetch('/api/complaint/my', {
        credentials: 'include',
      });

      if (!res.ok) {
        setError('Failed to fetch complaint');
        return;
      }

      const data = await res.json();
      const foundComplaint = data.complaints.find((c) => c._id === complaintId);

      if (!foundComplaint) {
        setError('Complaint not found');
        return;
      }

      setComplaint(foundComplaint);
    } catch (err) {
      setError('Error loading complaint');
      console.error(err);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-gray-600 text-2xl">Loading complaint...</div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-8 text-center">
            <p className="text-red-700 text-lg font-semibold mb-6">{error || 'Complaint not found'}</p>
            <Link
              href="/complaint"
              className="inline-block px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              Back to My Complaints
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Complaint Details</h1>
          <Link
            href="/complaint"
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base text-center"
          >
            ← Back to Complaints
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">
        {/* Main Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8">
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{complaint.title}</h2>
                <p className="text-xs sm:text-sm text-gray-500">ID: {complaint._id.toString()}</p>
              </div>
              <span
                className={`inline-block px-3 sm:px-4 py-2 rounded-full font-bold text-sm sm:text-base border ${getStatusColor(
                  complaint.status
                )}`}
              >
                {getStatusIcon(complaint.status)} {complaint.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">CATEGORY</p>
                <p className="text-sm sm:text-base text-gray-900 font-semibold">{complaint.category}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">FILED ON</p>
                <p className="text-sm sm:text-base text-gray-900 font-semibold">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">LAST UPDATED</p>
                <p className="text-sm sm:text-base text-gray-900 font-semibold">
                  {new Date(complaint.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">TIME</p>
                <p className="text-sm sm:text-base text-gray-900 font-semibold">
                  {new Date(complaint.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Description</h3>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{complaint.description}</p>
        </div>

        {/* Location Card */}
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 mb-2">ADDRESS</p>
              <p className="text-sm sm:text-lg text-gray-900 font-semibold">
                {complaint.address || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500 mb-2">COORDINATES</p>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                <p className="text-xs sm:text-sm text-gray-700 font-mono">
                  Lat: <span className="text-blue-600">{complaint.location.lat}</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-700 font-mono">
                  Lng: <span className="text-blue-600">{complaint.location.lng}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow">
            <iframe
              width="100%"
              height="400"
              frameBorder="0"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${complaint.location.lat},${complaint.location.lng}`}
            />
          </div>
        </div>

        {/* Images Card */}
        {complaint.images && complaint.images.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Attached Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {complaint.images.map((image, index) => (
                <div key={index} className="group">
                  <img
                    src={image}
                    alt={`Complaint image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg shadow-md group-hover:shadow-lg group-hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => window.open(image, '_blank')}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">Click to enlarge</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Information */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Status Information</h3>
          <div className="space-y-2 text-sm text-blue-800">
            {complaint.status === 'pending' && (
              <>
                <p className="font-semibold">Your complaint is under review.</p>
                <p>We'll notify you once it's been approved or rejected. Thank you for your patience!</p>
              </>
            )}
            {complaint.status === 'approved' && (
              <>
                <p className="font-semibold">Your complaint has been approved!</p>
                <p>The relevant authority has been notified and will take appropriate action.</p>
              </>
            )}
            {complaint.status === 'rejected' && (
              <>
                <p className="font-semibold">Your complaint has been rejected.</p>
                <p>If you believe this is an error, please file a new complaint with more details.</p>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pb-8">
          <Link href="/complaint/create" className="w-full sm:w-auto">
            <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              File Another Complaint
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
