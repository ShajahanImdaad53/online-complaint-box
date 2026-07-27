'use client';

import { Suspense } from 'react';
import LoginContent from './login-content';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-semibold">Loading...</p>
          </div>
        </div>
      }>
        <LoginContent />
      </Suspense>

      {/* Back to Home Navigation */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-300 py-6 sm:py-8 px-3 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex justify-center md:justify-start">
          <Link href="/">
            <button className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 hover:from-blue-700 hover:via-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 transition-all duration-300 text-sm sm:text-base md:text-lg whitespace-nowrap active:scale-95 overflow-hidden">
              {/* Glow effect */}
              <span className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-30 rounded-xl transition-opacity duration-300 blur"></span>
              
              {/* Button content */}
              <span className="relative inline-flex items-center gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-2 group-hover:scale-125 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </span>
            </button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
