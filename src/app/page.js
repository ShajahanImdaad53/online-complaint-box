'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { useAuthCheck } from '@/lib/hooks';
import { SERVICES, ROUTES, API_ENDPOINTS, TIMING } from '@/lib/constants';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthCheck();
  const [selectedService, setSelectedService] = useState(null);

  const handleFileComplaint = async (categoryName) => {
    try {
      const response = await fetch(API_ENDPOINTS.TOKEN_CHECK, {
        method: 'GET',
        credentials: 'include',
      });

      const redirectPath = `${ROUTES.COMPLAINT_CREATE}?category=${encodeURIComponent(categoryName)}`;
      
      // Trust the fresh API response, don't rely on potentially stale isAuthenticated state
      if (response.ok) {
        router.push(redirectPath);
      } else {
        setSelectedService(null);
        // Properly encode the redirect parameter
        router.push(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectPath)}`);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setSelectedService(null);
      const redirectPath = `/complaint/create?category=${encodeURIComponent(categoryName)}`;
      router.push(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectPath)}`);
    }
  };

  // Handle hash navigation for smooth scrolling
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, TIMING.smoothScrollDelay);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#07090e] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Navigation />

      {/* Hero Section */}
      <section 
        id="home"
        className="bg-cover bg-center bg-no-repeat text-white py-20 sm:py-28 md:py-36 lg:py-44 px-3 sm:px-4 md:px-6 relative min-h-[90vh] flex items-center overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(7, 9, 14, 0.75) 0%, rgba(13, 17, 24, 0.85) 100%), url("/images/home.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Subtle animated light beams */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="flex items-center justify-center">
            {/* Center Content */}
            <div className="text-white text-center max-w-4xl">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full mb-6 sm:mb-8 border border-white/20 shadow-lg animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <p className="text-xs sm:text-sm font-bold tracking-wide uppercase text-blue-200">Welcome to Pradesha Shaba • Addalachenai</p>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 leading-tight tracking-tight animate-fade-in-down drop-shadow-md" style={{ animationDelay: '0.2s' }}>
                Your Voice <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">Matters</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 sm:mb-12 leading-relaxed font-normal max-w-3xl mx-auto animate-fade-in-down drop-shadow" style={{ animationDelay: '0.3s' }}>
                Report issues affecting your community and track their resolution in real-time. We are committed to transparent service delivery, digital governance, and citizen satisfaction.
              </p>
              
              {!isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-down w-full sm:w-auto" style={{ animationDelay: '0.4s' }}>
                  <Link
                    href="/complaint/create"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-black transition-all duration-300 shadow-xl hover:shadow-blue-500/30 text-center transform hover:-translate-y-1 active:scale-95 text-base sm:text-lg flex items-center justify-center gap-2 group"
                  >
                    <span>File a Complaint</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 text-center transform hover:-translate-y-1 active:scale-95 text-base sm:text-lg shadow-lg"
                  >
                    Register Account
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-down w-full sm:w-auto" style={{ animationDelay: '0.4s' }}>
                  <Link
                    href="/complaint/create"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-black transition-all duration-300 shadow-xl hover:shadow-blue-500/30 text-center transform hover:-translate-y-1 active:scale-95 text-base sm:text-lg flex items-center justify-center gap-2 group"
                  >
                    <span>File a Complaint</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <Link
                    href="/complaint"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 text-center transform hover:-translate-y-1 active:scale-95 text-base sm:text-lg shadow-lg"
                  >
                    View My Complaints
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Us - Vision & Mission Section */}
      <section id="about" className="py-16 sm:py-20 md:py-28 lg:py-36 px-3 sm:px-4 md:px-6 bg-gradient-to-b from-white via-slate-50 to-white dark:from-[#07090e] dark:via-[#0c1018] dark:to-[#07090e] relative overflow-hidden transition-colors duration-300">
        {/* Background Glowing Blobs for Night Mode */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '4s' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20 animate-fade-in-down">
            <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-4 py-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping"></span>
              <span className="text-blue-700 dark:text-blue-300 font-bold text-xs sm:text-sm tracking-wider uppercase">WHO WE ARE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">Vision & Mission</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
              Committed to transforming our community through transparent governance, digital innovation, and active citizen engagement for sustainable development.
            </p>
          </div>

          {/* Vision & Mission Bento Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-16 sm:mb-20 md:mb-24">
            {/* Vision Card (Col Span 6) */}
            <div className="col-span-1 lg:col-span-6 bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 sm:p-10 md:p-12 border border-gray-200/80 dark:border-blue-500/25 hover:border-blue-500/50 dark:hover:border-blue-400/60 shadow-xl dark:shadow-blue-500/5 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-20 -top-20 w-60 h-60 bg-gradient-to-br from-blue-500/15 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
              
              <div>
                <div className="flex items-center justify-between mb-8">
                  {/* Icon */}
                  <div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-blue-500/30 text-white">
                    <svg className="w-7 sm:w-8 h-7 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold text-xs tracking-wider uppercase border border-blue-200 dark:border-blue-800/60 shadow-sm">
                    FUTURE VISION
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Our Vision
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base sm:text-lg font-normal mb-8">
                  To build a clean, green, and technologically empowered community where every citizen enjoys superior public services, transparent governance, and an exceptional quality of life. We envision a future driven by participation and sustainability.
                </p>
              </div>

              {/* Highlight Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-gray-100 dark:border-gray-800/80">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                  <span className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 text-sm font-semibold">Sustainable Growth</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                  <span className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 text-sm font-semibold">Citizen Empowerment</span>
                </div>
              </div>
            </div>

            {/* Mission Card (Col Span 6) */}
            <div className="col-span-1 lg:col-span-6 bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 sm:p-10 md:p-12 border border-gray-200/80 dark:border-emerald-500/25 hover:border-emerald-500/50 dark:hover:border-emerald-400/60 shadow-xl dark:shadow-emerald-500/5 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-20 -top-20 w-60 h-60 bg-gradient-to-br from-emerald-500/15 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
              
              <div>
                <div className="flex items-center justify-between mb-8">
                  {/* Icon */}
                  <div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-lg shadow-emerald-500/30 text-white">
                    <svg className="w-7 sm:w-8 h-7 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-xs tracking-wider uppercase border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
                    OUR MISSION
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Our Mission
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base sm:text-lg font-normal mb-8">
                  To deliver prompt, reliable, and transparent municipal services while safeguarding our local environment. We dedicate ourselves to resolving citizen grievances swiftly through cutting-edge digital tracking and continuous public feedback.
                </p>
              </div>

              {/* Highlight Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-gray-100 dark:border-gray-800/80">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 text-sm font-semibold">Swift Resolution</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 text-sm font-semibold">Eco-Protection</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values Bento Section */}
          <div className="mt-8 sm:mt-12 md:mt-16">
            <div className="text-center mb-10 sm:mb-14 animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
              <span className="text-purple-600 dark:text-purple-400 font-bold text-xs sm:text-sm uppercase tracking-widest block mb-2">FOUNDATIONAL GUIDING PRINCIPLES</span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 dark:from-purple-400 dark:via-pink-400 dark:to-red-400">Core Values</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium">The non-negotiable pillars that govern every initiative, resolution, and public interaction in Pradesha Shaba.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {[
                { 
                  title: 'Transparency', 
                  desc: 'Complete openness in decision making, budget allocation, and public service reporting.',
                  icon: (
                    <svg className="w-6 sm:w-7 h-6 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  gradient: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-cyan-600',
                  badge: 'Open Governance',
                  badgeColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                },
                { 
                  title: 'Accountability', 
                  desc: 'Taking total responsibility for community outcomes and ensuring timely resolution of issues.',
                  icon: (
                    <svg className="w-6 sm:w-7 h-6 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  gradient: 'from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-green-600',
                  badge: 'Reliability',
                  badgeColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                },
                { 
                  title: 'Participation', 
                  desc: 'Empowering every resident to voice concerns, report grievances, and co-create solutions.',
                  icon: (
                    <svg className="w-6 sm:w-7 h-6 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 10H9m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  gradient: 'from-purple-500 to-purple-600 dark:from-purple-600 dark:to-pink-600',
                  badge: 'Community First',
                  badgeColor: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                },
                { 
                  title: 'Innovation', 
                  desc: 'Adopting state-of-the-art digital tools to streamline complaints and public administration.',
                  icon: (
                    <svg className="w-6 sm:w-7 h-6 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  gradient: 'from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-600',
                  badge: 'Digital Era',
                  badgeColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                }
              ].map((value, idx) => (
                <div 
                  key={idx} 
                  className="group relative bg-white/90 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 sm:p-7 md:p-8 border border-gray-200/80 dark:border-gray-800/80 hover:border-purple-500/50 dark:hover:border-purple-400/60 shadow-lg dark:shadow-gray-950/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col justify-between"
                  style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
                >
                  <div>
                    {/* Header with Icon and Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-md`}>
                        {value.icon}
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase border ${value.badgeColor}`}>
                        {value.badge}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <h4 className="font-black text-gray-900 dark:text-white mb-3 text-lg sm:text-xl tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{value.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed font-normal">{value.desc}</p>
                  </div>
                  
                  {/* Subtle Footer Arrow */}
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-end">
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center gap-1">
                      Learn more <span className="text-base leading-none">→</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-20 md:py-28 px-3 sm:px-4 md:px-6 bg-gray-50 dark:bg-[#0c1018] transition-colors duration-300 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20 animate-fade-in-down">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm tracking-wider uppercase">Civic Services Portal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              Services We <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">Provide</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-normal leading-relaxed">
              Dedicated to maintaining the highest standards of civic management, infrastructure development, and community welfare.
            </p>
          </div>

          {/* Services Grid */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {SERVICES.map((service, index) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className="group relative bg-white dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl dark:shadow-none transition-all duration-500 overflow-hidden border border-gray-200/80 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 text-center flex flex-col h-auto w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-2rem)] max-w-[360px] transform hover:-translate-y-2"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="relative w-full h-52 sm:h-44 md:h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="text-white text-xs font-bold px-3 py-1.5 bg-blue-600/90 backdrop-blur-md rounded-full shadow-lg">Click to Explore →</span>
                  </div>
                </div>
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between items-center text-center">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-3 font-normal">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 w-full border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      View details & submit <span className="text-base leading-none">→</span>
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#0e131f] border border-gray-200 dark:border-gray-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up transition-colors duration-300">
            {/* Close Button */}
            <div className="sticky top-0 flex justify-between items-center p-6 md:p-8 bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white border-b border-gray-700/80 z-10 backdrop-blur-md">
              <h2 className="text-2xl md:text-3xl font-black">{selectedService.title}</h2>
              <button
                onClick={() => setSelectedService(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-colors text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 md:p-8">
              {/* Service Image */}
              <div className="relative w-full h-60 sm:h-72 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-xl bg-gray-200 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
                <img 
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg">Official Pradeshiya Sabha Service</span>
                </div>
              </div>

              {/* Service Description */}
              <div className="mb-8">
                <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-4">About This Service</h3>
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed font-normal">
                  {selectedService.fullDescription}
                </p>
              </div>

              {/* Service Details */}
              <div className="mb-8">
                <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-6">What We Include</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedService.services.map((item, idx) => (
                    <div key={idx} className="flex items-start p-4 bg-blue-50/70 dark:bg-blue-950/20 rounded-2xl border border-blue-200/60 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/40 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0 shadow-sm">✓</div>
                      <span className="text-gray-800 dark:text-gray-200 font-medium text-sm sm:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    handleFileComplaint(selectedService.category);
                  }}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 active:scale-95 text-base md:text-lg flex items-center justify-center gap-2"
                >
                  <span>File Complaint for {selectedService.category}</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-8 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold rounded-2xl transition-all duration-300 text-base md:text-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How It Works Section */}
      <section id="complaint" className="py-16 sm:py-20 md:py-28 lg:py-36 px-3 sm:px-4 md:px-6 bg-white dark:bg-[#07090e] transition-colors duration-300 relative overflow-hidden">
        {/* Subtle background styling */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14 sm:mb-16 md:mb-20 animate-fade-in-down">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm tracking-wider uppercase">Simple Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              How to File a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">Complaint</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-normal leading-relaxed">
              Just 4 intuitive steps to report civic issues and track their resolution in real-time. Fast, secure, and fully transparent.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-6 relative mb-16 sm:mb-20">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-500/40 via-green-500/40 via-yellow-500/40 to-purple-500/40 dark:from-blue-400/20 dark:via-green-400/20 dark:via-yellow-400/20 dark:to-purple-400/20 rounded-full z-0"></div>

            {/* Step 1 */}
            <div className="relative text-center group animate-fade-in-up z-10" style={{ animationDelay: '0.1s' }}>
              <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-900/40 backdrop-blur-md p-6 rounded-3xl border border-gray-100 dark:border-gray-800/80 hover:border-blue-500/40 transition-all duration-300">
                <div className="relative inline-flex items-center justify-center mx-auto mb-6">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 text-white w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-blue-500/20 border border-white/20">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg sm:text-xl">Create Account</h3>
                <p className="text-gray-600 dark:text-gray-400 flex-grow text-xs sm:text-sm leading-relaxed font-normal">
                  Register in seconds using your email or phone number to access the portal securely.
                </p>
                <div className="mt-6">
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-500/20">Step 01</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative text-center group animate-fade-in-up z-10" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-900/40 backdrop-blur-md p-6 rounded-3xl border border-gray-100 dark:border-gray-800/80 hover:border-green-500/40 transition-all duration-300">
                <div className="relative inline-flex items-center justify-center mx-auto mb-6">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-700 text-white w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-green-500/20 border border-white/20">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg sm:text-xl">File Complaint</h3>
                <p className="text-gray-600 dark:text-gray-400 flex-grow text-xs sm:text-sm leading-relaxed font-normal">
                  Submit your detailed complaint with photos, description, and exact location markers.
                </p>
                <div className="mt-6">
                  <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-xs font-bold border border-green-200 dark:border-green-500/20">Step 02</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative text-center group animate-fade-in-up z-10" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-900/40 backdrop-blur-md p-6 rounded-3xl border border-gray-100 dark:border-gray-800/80 hover:border-yellow-500/40 transition-all duration-300">
                <div className="relative inline-flex items-center justify-center mx-auto mb-6">
                  <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-br from-amber-500 to-yellow-600 text-white w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-yellow-500/20 border border-white/20">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg sm:text-xl">Track Progress</h3>
                <p className="text-gray-600 dark:text-gray-400 flex-grow text-xs sm:text-sm leading-relaxed font-normal">
                  Monitor live status updates, staff assignments, and receive SMS/email alerts.
                </p>
                <div className="mt-6">
                  <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-bold border border-yellow-200 dark:border-yellow-500/20">Step 03</span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative text-center group animate-fade-in-up z-10" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-900/40 backdrop-blur-md p-6 rounded-3xl border border-gray-100 dark:border-gray-800/80 hover:border-purple-500/40 transition-all duration-300">
                <div className="relative inline-flex items-center justify-center mx-auto mb-6">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-br from-purple-500 to-indigo-700 text-white w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-purple-500/20 border border-white/20">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg sm:text-xl">Get Resolution</h3>
                <p className="text-gray-600 dark:text-gray-400 flex-grow text-xs sm:text-sm leading-relaxed font-normal">
                  Receive confirmation, resolution report, and provide feedback once completed.
                </p>
                <div className="mt-6">
                  <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold border border-purple-200 dark:border-purple-500/20">Step 04</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-gray-900/80 dark:to-blue-950/30 rounded-3xl p-6 sm:p-8 border border-blue-200/80 dark:border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl dark:shadow-none animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Fast Processing</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-normal">Average response time: <span className="text-blue-600 dark:text-blue-400 font-bold">24-48 hours</span></p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-gray-900/80 dark:to-emerald-950/30 rounded-3xl p-6 sm:p-8 border border-green-200/80 dark:border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl dark:shadow-none animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Secure & Confidential</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-normal">Your information is <span className="text-emerald-600 dark:text-emerald-400 font-bold">protected and secure</span></p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-gray-900/80 dark:to-purple-950/30 rounded-3xl p-6 sm:p-8 border border-purple-200/80 dark:border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl dark:shadow-none animate-fade-in-up sm:col-span-2 md:col-span-1" style={{ animationDelay: '0.7s' }}>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">24/7 Access</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-normal">File complaints <span className="text-purple-600 dark:text-purple-400 font-bold">anytime, anywhere</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Futuristic Command Portal */}
      <section id="contact" className="py-16 sm:py-20 md:py-28 lg:py-36 px-3 sm:px-4 md:px-6 bg-gradient-to-b from-slate-900 via-[#070b12] to-black text-white relative overflow-hidden transition-colors duration-300">
        {/* Ambient neon lighting */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse" style={{ animationDelay: '3s' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14 sm:mb-16 md:mb-20 animate-fade-in-down">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs sm:text-sm font-bold tracking-wider uppercase mb-6 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Online Support Center • Active</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
              Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">Touch</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-normal leading-relaxed">
              Have questions, feedback, or require urgent assistance? Reach out to our dedicated municipal staff through any of our official channels below.
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 sm:mb-20">
            {/* Phone Card */}
            <div className="group relative bg-white/[0.04] dark:bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-7 sm:p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl flex flex-col justify-between overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
              <div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30 border border-white/20">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Telephone</h3>
                <p className="text-gray-300 font-medium text-base mb-2">+94 (0) XXX XXX XXXX</p>
                <p className="text-gray-500 text-xs sm:text-sm">Mon-Sat, 8:00 AM - 5:00 PM</p>
              </div>
              <a href="tel:+94" className="mt-6 pt-4 border-t border-white/10 text-blue-400 hover:text-blue-300 font-bold text-sm inline-flex items-center gap-1 group/link transition-colors">
                <span>Call Hotline</span>
                <span className="group-hover/link:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Email Card */}
            <div className="group relative bg-white/[0.04] dark:bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-7 sm:p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl flex flex-col justify-between overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
              <div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30 border border-white/20">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Email Us</h3>
                <p className="text-gray-300 font-medium text-base mb-2 break-all">info@pradeshya.lk</p>
                <p className="text-gray-500 text-xs sm:text-sm">24-hour response guaranteed</p>
              </div>
              <a href="mailto:info@pradeshya.lk" className="mt-6 pt-4 border-t border-white/10 text-purple-400 hover:text-purple-300 font-bold text-sm inline-flex items-center gap-1 group/link transition-colors">
                <span>Send Dispatch</span>
                <span className="group-hover/link:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Location Card */}
            <div className="group relative bg-white/[0.04] dark:bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-7 sm:p-8 border border-white/10 hover:border-rose-500/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl flex flex-col justify-between overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all duration-500"></div>
              <div>
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-rose-500/30 border border-white/20">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Headquarters</h3>
                <p className="text-gray-300 font-medium text-base mb-2">Pradeshiya Sabha Office</p>
                <p className="text-gray-500 text-xs sm:text-sm">Addalachenai, Sri Lanka</p>
              </div>
              <a href="https://maps.app.goo.gl/sQSgHAfeEwF8XmrY7" target="_blank" rel="noopener noreferrer" className="mt-6 pt-4 border-t border-white/10 text-rose-400 hover:text-rose-300 font-bold text-sm inline-flex items-center gap-1 group/link transition-colors">
                <span>View Google Maps</span>
                <span className="group-hover/link:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Hours Card */}
            <div className="group relative bg-white/[0.04] dark:bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-7 sm:p-8 border border-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl flex flex-col justify-between overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
              <div>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/30 border border-white/20">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Working Hours</h3>
                <p className="text-gray-300 font-medium text-base mb-2">Mon-Fri: 8:00 AM - 5:00 PM</p>
                <p className="text-gray-500 text-xs sm:text-sm">Emergency Desk: 24/7</p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                  Open Now
                </span>
                <span className="text-xs text-gray-400">GMT+5:30</span>
              </div>
            </div>
          </div>

          {/* Office Location Details Bento Box */}
          <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-2xl rounded-3xl p-8 sm:p-10 md:p-14 border border-white/15 shadow-2xl relative overflow-hidden">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-xs font-bold uppercase tracking-wider">
                  <span>📍 Official Jurisdiction</span>
                </div>
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">Main Municipal Secretariat</h4>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-normal">
                  Our secretariat is open to all citizens of Addalachenai Pradeshiya Sabha area for public consultations, document submissions, and civic inquiries.
                </p>
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <p className="text-gray-200 font-semibold text-base sm:text-lg">
                    Pradeshiya Sabha Office<br/>
                    <span className="text-gray-400 font-normal text-sm sm:text-base">Addalachenai, Ampara District, Eastern Province, Sri Lanka</span>
                  </p>
                  <a
                    href="https://maps.app.goo.gl/sQSgHAfeEwF8XmrY7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold transition-colors group/btn text-sm sm:text-base pt-2"
                  >
                    <span className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 rounded-xl transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Get Interactive Directions
                    </span>
                  </a>
                </div>
              </div>

              <div className="space-y-6 bg-black/40 dark:bg-black/60 p-7 sm:p-8 rounded-3xl border border-white/10 shadow-inner">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                    Operational Schedule
                  </h4>
                  <span className="text-xs text-gray-400 px-2.5 py-1 bg-white/5 rounded-full border border-white/10">Standard Hours</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-300 font-medium text-sm sm:text-base">Monday - Friday</span>
                    <span className="text-emerald-400 font-bold text-sm sm:text-base px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-300 font-medium text-sm sm:text-base">Saturday</span>
                    <span className="text-blue-400 font-bold text-sm sm:text-base px-3 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20">9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-300 font-medium text-sm sm:text-base">Sunday & Public Holidays</span>
                    <span className="text-rose-400 font-bold text-sm sm:text-base px-3 py-1 bg-rose-500/10 rounded-lg border border-rose-500/20">Closed</span>
                  </div>

                  <div className="pt-4 mt-2 border-t border-white/10">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 flex items-center gap-3">
                      <span className="text-2xl">🚨</span>
                      <div>
                        <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">24/7 Emergency Dispatch</p>
                        <p className="text-xs sm:text-sm text-gray-300">For urgent civic issues (flooding, hazards, water breaks), hotline is staffed 365 days a year.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
