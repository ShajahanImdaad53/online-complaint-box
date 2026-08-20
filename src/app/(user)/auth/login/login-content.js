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
      if (data.role === 'admin') {
        redirectUrl = '/admin';
        console.log('🎯 Redirecting to admin dashboard');
      } else if (redirectParam) {
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
    <main 
      className="flex-grow flex items-center justify-center px-4 sm:px-6 py-12 lg:py-20 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.8)), url("/images/home.jpeg")'
      }}
    >
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left Side - Form Section */}
          <div className="order-1 w-full max-w-md mx-auto md:mx-0 md:ml-auto">
            <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 sm:p-10 space-y-7 transition-all duration-300">
              
              {/* Header */}
              <div className="text-left space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Please enter your details to sign in</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-2xl text-red-700 dark:text-red-300 text-sm flex items-start gap-3 backdrop-blur-sm">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full pl-11 pr-4 py-3 sm:py-3.5 text-sm bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      style={{ fontSize: '16px' }}
                      className="w-full pl-11 pr-12 py-3 sm:py-3.5 text-sm bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 transform hover:-translate-y-0.5 mt-2 text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <span>Sign In Securely</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-[#0c1222] text-gray-400 font-medium rounded-full">New Citizen?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <Link 
                  href="/auth/register" 
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800/80 text-gray-700 dark:text-gray-200 font-bold rounded-2xl transition-colors text-sm sm:text-base border border-gray-200 dark:border-gray-700"
                >
                  Create an Account
                </Link>
              </div>

            </div>
          </div>

          {/* Right Side - Image Section */}
          <div className="hidden md:block order-2 w-full max-w-md mx-auto md:mx-0">
            <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 group">
              <Image
                src="/images/login.png"
                alt="Login illustration"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              
              {/* Decorative elements */}
              <div className="absolute top-6 right-6">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>

              <div className="absolute bottom-8 left-8 right-8 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wide text-white mb-4 border border-white/30 shadow-lg">
                  <span className="text-blue-300">🏛️</span> Official Portal
                </div>
                <h3 className="text-3xl font-black text-white leading-tight mb-3 drop-shadow-md">
                  Digital Civic<br />Administration
                </h3>
                <p className="text-gray-200 text-sm font-medium drop-shadow leading-relaxed opacity-90">
                  Secure access to your citizen dashboard. Report issues, track progress, and help build a better community.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
