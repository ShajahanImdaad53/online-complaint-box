'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks';
import { 
  DEFAULT_LOCATION, 
  MAP_CONFIG, 
  COMPLAINT_CATEGORIES, 
  TIMING, 
  API_ENDPOINTS, 
  ROUTES 
} from '@/lib/constants';

export default function CreateComplaintContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isChecking: authChecking } = useAuth(ROUTES.COMPLAINT_CREATE);
  const mapRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    address: '',
    lat: '',
    lng: '',
    images: [],
  });

  // Auto-select category from query params
  useEffect(() => {
    if (isAuthenticated) {
      const categoryParam = searchParams.get('category');
      if (categoryParam) {
        setFormData(prev => ({
          ...prev,
          category: decodeURIComponent(categoryParam)
        }));
      }
    }
  }, [isAuthenticated, searchParams]);

  // Initialize Google Map only after authentication is verified
  useEffect(() => {
    if (!isAuthenticated) return;

    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      loadMap();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.onload = loadMap;
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = loadMap;
    script.onerror = () => {
      setError('Failed to load Google Maps API');
    };
    document.head.appendChild(script);
  }, [isAuthenticated]);

  const loadMap = () => {
    initMap(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);
    setFormData((prev) => ({
      ...prev,
      lat: DEFAULT_LOCATION.lat.toString(),
      lng: DEFAULT_LOCATION.lng.toString(),
    }));
  };

  const initMap = (lat, lng) => {
    if (typeof google !== 'undefined' && mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        zoom: MAP_CONFIG.zoom,
        center: { lat, lng },
      });

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: MAP_CONFIG.title,
        draggable: true,
      });

      marker.addListener('dragend', () => {
        const position = marker.getPosition();
        setFormData((prev) => ({
          ...prev,
          lat: position.lat().toString(),
          lng: position.lng().toString(),
        }));
      });

      map.addListener('click', (event) => {
        marker.setPosition(event.latLng);
        setFormData((prev) => ({
          ...prev,
          lat: event.latLng.lat().toString(),
          lng: event.latLng.lng().toString(),
        }));
      });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    const updatedUrls = previewUrls.filter((_, i) => i !== index);

    setSelectedImages(updatedImages);
    setPreviewUrls(updatedUrls);
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.title || !formData.description || !formData.category || !formData.lat || !formData.lng) {
        setError('Please fill all required fields');
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('address', formData.address);
      data.append('lat', formData.lat);
      data.append('lng', formData.lng);

      selectedImages.forEach((image) => {
        data.append('images', image);
      });

      const response = await fetch(API_ENDPOINTS.COMPLAINT_CREATE, {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Failed to create complaint');
        return;
      }

      setSuccess('Complaint submitted successfully!');
      setTimeout(() => {
        router.push(ROUTES.HOME);
      }, TIMING.successMessageDuration);

    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Complaint submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-3 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Auth Checking Loading State */}
          {authChecking && (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="inline-block">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-600 font-semibold">Verifying your login...</p>
              </div>
            </div>
          )}

          {/* Not Authenticated Message */}
          {!authChecking && !isAuthenticated && (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <p className="text-gray-600 font-semibold">Redirecting to login...</p>
              </div>
            </div>
          )}

          {/* Form Content - Only show if authenticated */}
          {!authChecking && isAuthenticated && (
            <>
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                  File a Complaint
                </h1>
                <p className="text-lg text-gray-600">
                  Help us improve your community by reporting issues
                </p>
              </div>

              {/* Main Form Container */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 md:p-12">
                  {/* Error Message */}
                  {error && (
                    <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                      <p className="text-red-700 font-semibold">{error}</p>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                      <p className="text-green-700 font-semibold">{success}</p>
                    </div>
                  )}

                  {/* Title Field */}
                  <div className="mb-8">
                    <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
                      Complaint Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Deep pothole on Main Street"
                      className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-gray-900 text-base sm:text-lg placeholder-gray-500 font-medium focus:ring-2 focus:ring-blue-200"
                      required
                      style={{ fontSize: '16px' }}
                    />
                  </div>

                  {/* Category Field */}
                  <div className="mb-8">
                    <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-gray-900 text-base sm:text-lg font-medium focus:ring-2 focus:ring-blue-200"
                      required
                      style={{ fontSize: '16px' }}
                    >
                      <option value="">Select a category</option>
                      {COMPLAINT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description Field */}
                  <div className="mb-8">
                    <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Provide detailed information about the complaint..."
                      rows="5"
                      className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none text-gray-900 text-base sm:text-lg placeholder-gray-500 font-medium focus:ring-2 focus:ring-blue-200"
                      required
                      style={{ fontSize: '16px' }}
                    />
                  </div>

                  {/* Address Field */}
                  <div className="mb-8">
                    <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street, area, city"
                      className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-gray-900 text-base sm:text-lg placeholder-gray-500 font-medium focus:ring-2 focus:ring-blue-200"
                      style={{ fontSize: '16px' }}
                    />
                  </div>

                  {/* Location Section */}
                  <div className="mb-8">
                    <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-600 mb-4">Click on the map to select location or drag the marker</p>
                    <div
                      ref={mapRef}
                      className="w-full h-80 rounded-lg border-2 border-gray-200 overflow-hidden shadow-md"
                    />
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Latitude:</span> {formData.lat || 'Not set'}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Longitude:</span> {formData.lng || 'Not set'}
                      </p>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="mb-8">
                    <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
                      Upload Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-input"
                      />
                      <label htmlFor="image-input" className="cursor-pointer">
                        <svg
                          className="w-12 h-12 mx-auto text-gray-400 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-gray-600 font-semibold">Click to upload images</p>
                        <p className="text-sm text-gray-500">or drag and drop</p>
                      </label>
                    </div>

                    {/* Image Previews */}
                    {previewUrls.length > 0 && (
                      <div className="mt-6">
                        <p className="text-sm font-semibold text-gray-900 mb-4">
                          Selected Images ({previewUrls.length})
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {previewUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Preview ${index}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-8 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Info Box */}
              <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Tips for Better Complaints</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Be specific and clear about the location and problem</li>
                  <li>✓ Upload clear photos of the issue</li>
                  <li>✓ Provide accurate location information</li>
                  <li>✓ Include any relevant details that might help authorities</li>
                </ul>
              </div>

              {/* Back to Home Link */}
          <Link href="/">
          <button className="group inline-flex items-center mt-10 gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-xs sm:text-sm ">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
