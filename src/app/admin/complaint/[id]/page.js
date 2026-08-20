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
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'approved':
        return (
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#07090e] flex items-center justify-center transition-colors duration-300">
        <div className="text-center animate-fade-in">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-500 mb-6 shadow-lg"></div>
          <p className="text-gray-900 dark:text-white text-lg font-bold tracking-wide">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#07090e] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 p-8 rounded-3xl shadow-xl text-center backdrop-blur-xl">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <p className="font-black text-xl mb-2">Error</p>
          <p className="font-medium text-sm mb-6">{error || 'Complaint not found'}</p>
          <Link
            href="/admin/complaint"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            ← Back to Complaints
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#07090e] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 relative overflow-hidden pb-20">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[500px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        
        {/* Header Action */}
        <div className="mb-8 animate-fade-in-down">
          <Link href="/admin/complaint" className="group inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm font-semibold text-gray-600 dark:text-gray-300">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Complaints List
          </Link>
        </div>

        <div className="space-y-6 sm:space-y-8">
          
          {/* Hero Header Card */}
          <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 p-8 sm:p-10 shadow-lg dark:shadow-none relative overflow-hidden animate-fade-in-up">
            <div className={`absolute top-0 left-0 w-full h-2 ${
              complaint.status === 'pending' ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
              complaint.status === 'approved' ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-red-400 to-rose-400'
            }`}></div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md">
                    {complaint.category}
                  </span>
                  <span className="text-gray-400 text-xs font-bold font-mono">
                    ID: {complaint._id.toString().slice(-12).toUpperCase()}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight">{complaint.title}</h1>
              </div>
              <span className={`inline-flex items-center px-6 py-2.5 rounded-full font-black text-sm border-2 uppercase tracking-wide shadow-sm ${getStatusColor(complaint.status)}`}>
                {getStatusIcon(complaint.status)} {complaint.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">Filed By</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                    {complaint.user?.username?.charAt(0) || 'U'}
                  </div>
                  <p className="text-gray-900 dark:text-white font-semibold">{complaint.user?.username || 'User'}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">Created</p>
                <p className="text-gray-900 dark:text-white font-semibold">{new Date(complaint.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">Last Updated</p>
                <p className="text-gray-900 dark:text-white font-semibold">{new Date(complaint.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Left Column (Description & Location) */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              
              {/* Description Card */}
              <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                  </div>
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[15px] whitespace-pre-wrap">{complaint.description}</p>
              </div>

              {/* Location Card */}
              <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  Location Details
                </h3>
                
                <div className="mb-6">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Address Provided</p>
                  <p className="text-gray-900 dark:text-white font-semibold bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
                    {complaint.address || 'No specific address provided.'}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Coordinates</p>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 text-center">
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Latitude</p>
                      <p className="text-gray-900 dark:text-white font-mono font-bold text-sm">{complaint.location.lat}</p>
                    </div>
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 text-center">
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Longitude</p>
                      <p className="text-gray-900 dark:text-white font-mono font-bold text-sm">{complaint.location.lng}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 relative z-0">
                  <iframe
                    width="100%"
                    height="350"
                    frameBorder="0"
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${complaint.location.lat},${complaint.location.lng}`}
                    className="border-0 bg-gray-100 dark:bg-gray-800"
                  />
                </div>
              </div>
              
              {/* Images Card */}
              {complaint.images && complaint.images.length > 0 && (
                <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 p-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    Attached Evidence
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {complaint.images.map((image, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 cursor-zoom-in" onClick={() => window.open(image, '_blank')}>
                        <img
                          src={image}
                          alt={`Evidence ${index + 1}`}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
                            <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column (User & Status) */}
            <div className="space-y-6 sm:space-y-8">
              
              {/* User Info Card */}
              {complaint.user && (
                <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 p-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    Citizen Profile
                  </h3>
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                      <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                        {complaint.user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Username</p>
                        <p className="text-gray-900 dark:text-white font-bold truncate">{complaint.user.username}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                      <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Email Address</p>
                      <p className="text-gray-900 dark:text-white font-medium break-all text-sm">{complaint.user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Update Card */}
              <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-gray-800/90 dark:to-blue-900/40 backdrop-blur-xl rounded-3xl border border-blue-200/80 dark:border-blue-500/30 p-8 shadow-xl shadow-blue-500/5 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  Update Status
                </h3>
                
                <div className="flex flex-col gap-3 mb-6">
                  {['pending', 'approved', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`flex items-center justify-between px-5 py-4 rounded-xl font-bold transition-all border-2 ${
                        selectedStatus === status
                          ? `bg-white dark:bg-gray-800 border-blue-500 shadow-md transform scale-[1.02] ${
                              status === 'pending' ? 'text-amber-600 dark:text-amber-400' :
                              status === 'approved' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                            }`
                          : 'bg-white/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="flex items-center">
                        {getStatusIcon(status)}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      {selectedStatus === status && (
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {selectedStatus !== complaint.status && (
                  <div className="pt-4 border-t border-blue-200/50 dark:border-gray-700">
                    <button
                      onClick={handleStatusUpdate}
                      disabled={updating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
                    >
                      {updating ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Updating Database...
                        </>
                      ) : (
                        <>
                          Confirm Update
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
