'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginContent() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Starting login...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Login failed:', data.message || data.massage);
        setError(data.message || data.massage || 'Login failed');
        setLoading(false);
        return;
      }

      console.log('✅ Login successful! Cookie is set by backend.');

      // Get redirect parameter
      const redirectParam = searchParams.get('redirect');
      console.log('📍 Redirect param:', redirectParam);

      // Wait for cookie to be fully registered
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('⏱️ Waited 500ms for cookie registration');

      // Determine the redirect URL
      let redirectUrl = '/';
      if (redirectParam) {
        redirectUrl = decodeURIComponent(redirectParam);
        console.log('🎯 Redirecting to:', redirectUrl);
      } else {
        console.log('🏠 Redirecting to home');
      }

      // Use hard page reload to ensure cookie is sent with the request
      // This forces the browser to include the cookie in the next HTTP request
      console.log('🔄 Performing hard page reload...');
      window.location.href = redirectUrl;
      
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="w-full max-w-6xl">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">

          {/* Left Side - Form Section */}
          <div className="order-1 w-full max-w-md mx-auto md:mx-0">
            <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 md:p-10 space-y-5 sm:space-y-6">
              
              {/* Header */}
              <div className="text-center space-y-1.5 sm:space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Login
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm">Sign in to your account</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm flex items-center gap-2 sm:gap-3">
                  <svg className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                
                {/* Email Field */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-400"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      style={{ fontSize: '16px' }}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-semibold py-2.5 sm:py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 transform hover:-translate-y-0.5 mt-5 sm:mt-6 text-sm sm:text-base"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 sm:h-5 w-4 sm:w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-1">
                <p className="text-gray-600 text-xs sm:text-sm">
                  Don't have an account?{' '}
                  <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Create one now
                  </Link>
                </p>
              </div>

            </div>
          </div>

          {/* Right Side - Image Section */}
          <div className="hidden md:flex justify-center items-center order-2">
            <div className="w-full max-w-2xl aspect-square flex items-center justify-center">
              <Image
                src="/images/login.png"
                alt="Login illustration"
                width={400}
                height={400}
                priority
                className="w-full h-full object-contain"
              />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
