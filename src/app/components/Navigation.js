'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Navigation() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('home');
  const [isUser, setIsUser] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check authentication status on mount and when page becomes visible
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/token-check', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setIsUser(true);
          setUserRole(data.user.role);
        } else {
          setIsUser(false);
          setUserRole(null);
        }
      } catch (error) {
        setIsUser(false);
        setUserRole(null);
      }
    };

    // Initial auth check
    checkAuth();

    // Re-check auth when page becomes visible (after redirects from login)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const scrollToSection = (id) => {
    setActiveNav(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If element doesn't exist on current page, navigate to home page with hash
      router.push(`/#${id}`);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsUser(false);
        setUserRole(null);
        setMobileMenuOpen(false);
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About Us', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Complaint', id: 'complaint' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
        <div className="flex justify-between items-center">
          {/* Logo & Branding */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 md:gap-3 hover:opacity-80 transition-opacity">
          
                <Image
                  src="/images/logo.jpeg"  
                  alt="Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
                />
            
            
            <div className="text-left">
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 leading-tight">Pradesha Shaba</h1>
              <p className="text-xs sm:text-xs md:text-sm text-gray-500 font-medium">Addalachenai</p>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2.5 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 relative ${
                  activeNav === item.id
                    ? 'text-blue-600 font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.name}
                {activeNav === item.id && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full"></div>
                )}
              </button>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
            {!isUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 text-xs sm:text-sm md:text-base flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Sign in</span>
                  <span className="sm:hidden">In</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="hidden md:flex items-center gap-1.5 px-6 py-2.5 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold rounded-lg transition-all duration-300 text-sm"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                <Link
                  href={userRole === 'admin' ? '/admin' : '/account'}
                  className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-300 text-xs sm:text-sm md:text-base flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">{userRole === 'admin' ? 'Dashboard' : 'Profile'}</span>
                  <span className="sm:hidden">{userRole === 'admin' ? 'Dash' : 'Prof'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 text-xs sm:text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                  <span className="sm:hidden">{isLoggingOut ? 'Out...' : 'Out'}</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-3 sm:mt-3 py-3 sm:py-4 border-t border-gray-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-center px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                {item.name}
              </button>
            ))}
            {!isUser && (
              <Link
                href="/auth/register"
                className="block w-full text-center px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 transform hover:scale-105 mt-2"
              >
                Register
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
