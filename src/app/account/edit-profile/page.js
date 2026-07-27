'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [originalProfileImage, setOriginalProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await res.json();
      setUser(data.user);
      setFormData({
        username: data.user.username,
        email: data.user.email,
      });
      if (data.user.profileImage) {
        setPreviewImage(data.user.profileImage);
        setOriginalProfileImage(data.user.profileImage);
      }
    } catch (err) {
      setError('Error loading profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async () => {
    if (!profileImage) return;

    try {
      setUploading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('file', profileImage);

      const res = await fetch('/api/user/upload-profile-image', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await res.json();
      setUser(data.user);
      setProfileImage(null);
      setOriginalProfileImage(data.profileImage);
      setSuccess('Profile image uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error uploading image');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setRemoving(true);
      setError('');
      
      const res = await fetch('/api/user/remove-profile-image', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to remove image');
      }

      const data = await res.json();
      setUser(data.user);
      setPreviewImage(null);
      setOriginalProfileImage(null);
      setProfileImage(null);
      setSuccess('Profile image removed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error removing image');
      console.error(err);
    } finally {
      setRemoving(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await res.json();
      setUser(data.user);
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        router.push('/account/view-profile');
      }, 1500);
    } catch (err) {
      setError('Error updating profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
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
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/account/view-profile"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8"
          >
            ← Back to Profile
          </Link>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6">
              {success}
            </div>
          )}

          {user && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Profile</h1>

              {/* Profile Picture Section */}
              <div className="mb-12 pb-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Picture</h2>
                <div className="flex flex-col sm:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-5xl text-white font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-grow flex flex-col justify-center gap-4">
                    <input
                      type="file"
                      id="profile-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="profile-image"
                      className="px-6 py-3 bg-blue-100 text-blue-600 font-semibold rounded-lg hover:bg-blue-200 cursor-pointer transition-colors text-center"
                    >
                      📷 Choose Image
                    </label>

                    {profileImage && (
                      <button
                        onClick={uploadProfileImage}
                        disabled={uploading}
                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                      >
                        {uploading ? 'Uploading...' : '✓ Upload Image'}
                      </button>
                    )}

                    {originalProfileImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={removing}
                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
                      >
                        {removing ? 'Removing...' : '✕ Remove Image'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Information Form */}
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200 flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {saving ? 'Saving...' : '✓ Save Changes'}
                  </button>
                  <Link
                    href="/account/view-profile"
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors text-center"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
