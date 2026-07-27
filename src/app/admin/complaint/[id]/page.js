'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ComplaintDetail() {
  const router = useRouter();
  const params = useParams();
  const complaintId = params.id;

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchComplaint();
  }, [complaintId]);

  const fetchComplaint = async () => {
    try {
      const res = await fetch(`/api/complaint/${complaintId}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        setError('Failed to fetch complaint');
        return;
      }

      const data = await res.json();
      setComplaint(data.complaint);
      setSelectedStatus(data.complaint.status);
    } catch (err) {
      setError('Error loading complaint');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (selectedStatus === complaint.status) {
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(`/api/complaint/${complaintId}/status-update`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (!res.ok) {
        setError('Failed to update status');
        return;
      }

      const data = await res.json();
      setComplaint(data.complaint);
      alert('Status updated successfully!');
    } catch (err) {
      setError('Error updating status');
      console.error(err);
    } finally {
      setUpdating(false);
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
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-8 rounded-lg shadow-lg">
            <p className="font-semibold text-lg">{error || 'Complaint not found'}</p>
            <Link
              href="/admin/complaint"
              className="mt-6 inline-block px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              ← Back to Complaints
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-lg border-b-2 border-blue-100">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Complaint Details</h1>
          <Link
            href="/admin/complaint"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            ← Back
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Main Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-600">
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">{complaint.title}</h2>
                <p className="text-gray-500 font-medium">ID: {complaint._id.toString().slice(-12).toUpperCase()}</p>
              </div>
              <span
                className={`inline-block px-6 py-2 rounded-full font-bold text-lg border-2 whitespace-nowrap ${getStatusColor(
                  complaint.status
                )}`}
              >
                {getStatusIcon(complaint.status)} {complaint.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t-2 border-gray-200">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                <p className="text-gray-600 text-xs font-bold uppercase mb-2">Category</p>
                <p className="text-gray-900 font-bold text-lg">{complaint.category}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                <p className="text-gray-600 text-xs font-bold uppercase mb-2">Created</p>
                <p className="text-gray-900 font-bold">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                <p className="text-gray-600 text-xs font-bold uppercase mb-2">Updated</p>
                <p className="text-gray-900 font-bold">
                  {new Date(complaint.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                <p className="text-gray-600 text-xs font-bold uppercase mb-2">Filed By</p>
                <p className="text-gray-900 font-bold">
                  {complaint.user?.username || 'User'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-blue-600">📝</span> Description
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg">{complaint.description}</p>
        </div>

        {/* Location Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-blue-600">📍</span> Location Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase mb-2">Address</p>
              <p className="text-gray-900 font-semibold text-lg bg-gray-50 rounded-lg p-4">
                {complaint.address || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase mb-2">Coordinates</p>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-gray-900 font-mono font-bold">
                  Lat: <span className="text-blue-600">{complaint.location.lat}</span>
                </p>
                <p className="text-gray-900 font-mono font-bold">
                  Lng: <span className="text-blue-600">{complaint.location.lng}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="rounded-xl overflow-hidden shadow-md">
            <iframe
              width="100%"
              height="400"
              frameBorder="0"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${complaint.location.lat},${complaint.location.lng}`}
              className="border-0"
            />
          </div>
        </div>

        {/* Images Card */}
        {complaint.images && complaint.images.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-blue-600">🖼️</span> Attached Images
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complaint.images.map((image, index) => (
                <div key={index} className="group">
                  <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all">
                    <img
                      src={image}
                      alt={`Complaint image ${index + 1}`}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => window.open(image, '_blank')}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Info Card */}
        {complaint.user && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-blue-600">👤</span> User Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-b-2 border-gray-200 pb-4">
                <p className="text-gray-500 text-sm font-bold uppercase mb-2">Username</p>
                <p className="text-gray-900 font-bold text-lg">{complaint.user.username}</p>
              </div>
              <div className="border-b-2 border-gray-200 pb-4">
                <p className="text-gray-500 text-sm font-bold uppercase mb-2">Email</p>
                <p className="text-gray-900 font-bold text-lg break-all">{complaint.user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Card */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-blue-600">⚙️</span> Update Status
          </h3>
          <div className="flex gap-4 flex-wrap mb-6">
            {['pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                {getStatusIcon(status)} {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {selectedStatus !== complaint.status && (
            <div>
              <button
                onClick={handleStatusUpdate}
                disabled={updating}
                className="w-full px-4 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 text-lg"
              >
                {updating ? '⏳ Updating...' : '✓ Confirm Status Update'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
