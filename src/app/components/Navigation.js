'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from './ThemeProvider';

export default function Navigation() {
  const router = useRouter();
  const { theme, toggleTheme, mounted } = useTheme();
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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#07090e]/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
        <div className="flex justify-between items-center">
          {/* Logo & Branding */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 md:gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/images/logo.jpeg"  
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl shadow-md border border-gray-200 dark:border-gray-800"
            />
            <div className="text-left">
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">Pradesha Shaba</h1>
              <p className="text-xs sm:text-xs md:text-sm text-blue-600 dark:text-blue-400 font-semibold">Addalachenai</p>
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
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {item.name}
                {activeNav === item.id && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                )}
              </button>
            ))}
          </nav>

          {/* Auth & Theme Toggle Section */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={toggleTheme}
                aria-label="Toggle Night Mode"
                className="p-2 sm:p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-700/60 shadow-sm hover:scale-105 active:scale-95 flex items-center justify-center group"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Night Mode'}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 sm:w-5 sm:h-5 animate-spin-slow group-hover:rotate-45 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.32a1 1 0 011.415 0l.708.707a1 1 0 01-1.414 1.414l-.708-.707a1 1 0 010-1.414zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-1.32 4.22a1 1 0 010 1.415l-.707.708a1 1 0 01-1.414-1.414l.707-.708a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-1.32a1 1 0 010 1.415l-.708.708a1 1 0 01-1.414-1.414l.708-.708a1 1 0 011.414 0zM4 10a1 1 0 01-1-1H2a1 1 0 110 2h1a1 1 0 011-1zm1.32-4.22a1 1 0 011.415 0l.708-.707a1 1 0 01-1.414 1.414L3.906 5.2a1 1 0 010-1.415zM10 6a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 sm:w-5 sm:h-5 text-gray-700 group-hover:-rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            )}

            {!isUser ? (
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <Link
                  href="/auth/login"
                  className="group relative inline-flex items-center gap-1.5 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 text-white font-black rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105 active:scale-95 text-xs sm:text-sm md:text-sm overflow-hidden border border-blue-400/30"
                >
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
                  <svg className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="tracking-wide">Sign In</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="hidden sm:inline-flex group relative items-center gap-1.5 px-5 sm:px-6 py-2 sm:py-2.5 md:py-2.5 bg-gray-900/10 dark:bg-white/10 hover:bg-gray-900/20 dark:hover:bg-white/20 backdrop-blur-md border border-gray-300 dark:border-white/20 hover:border-blue-500 dark:hover:border-cyan-400 text-gray-900 dark:text-white font-bold rounded-full transition-all duration-300 text-xs sm:text-sm md:text-sm shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="tracking-wide">Register</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                <Link
                  href={userRole === 'admin' ? '/admin' : '/account'}
                  className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-full transition-all duration-300 text-xs sm:text-sm md:text-sm flex items-center gap-1.5 shadow-md hover:shadow-green-500/30 hover:scale-105"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">{userRole === 'admin' ? 'Dashboard' : 'Profile'}</span>
                  <span className="sm:hidden">{userRole === 'admin' ? 'Dash' : 'Prof'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-full transition-all duration-300 text-xs sm:text-sm md:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-md hover:shadow-red-500/30 hover:scale-105"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="lg:hidden p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-600 dark:text-gray-300"
            >
              <svg className="w-6 h-6 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-3 sm:mt-3 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-center px-3 sm:px-4 py-3 text-base font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-all duration-300"
              >
                {item.name}
              </button>
            ))}
            {!isUser && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/auth/login"
                  className="w-full text-center py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="w-full text-center py-3 text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-xl shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
