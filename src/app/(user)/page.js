'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


import { useAuthCheck } from '@/lib/hooks';
import { SERVICES, ROUTES, API_ENDPOINTS, TIMING } from '@/lib/constants';
import { useLanguage } from '../components/LanguageProvider';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthCheck();
  const { t } = useLanguage();
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


      {/* Hero Section */}
      <section 
        id="home"
        className="bg-cover bg-center bg-no-repeat text-white py-14 sm:py-20 md:py-28 lg:py-36 px-4 sm:px-6 relative min-h-[85vh] flex items-center overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(7, 9, 14, 0.85) 0%, rgba(13, 17, 24, 0.92) 100%), url("/images/home.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Subtle animated light beams */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Left Column - Text Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20 shadow-lg animate-slide-in-left">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <p className="text-xs sm:text-sm font-bold tracking-wide uppercase text-blue-200">{t('heroBadge')} • {t('subtitle')}</p>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-5 sm:mb-6 leading-tight tracking-tight drop-shadow-md">
                {t('heroTitle1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">{t('heroTitle2')}</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-8 sm:mb-10 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0 drop-shadow">
                {t('heroDesc')}
              </p>
              
              {!isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center lg:justify-start w-full sm:w-auto">
                  <Link
                    href="/complaint/create"
                    className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 text-white font-black rounded-full transition-all duration-300 shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 text-sm sm:text-base border border-blue-400/30"
                  >
                    <span>{t('fileBtn')}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base shadow-lg"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{t('register')}</span>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center lg:justify-start w-full sm:w-auto">
                  <Link
                    href="/complaint/create"
                    className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 text-white font-black rounded-full transition-all duration-300 shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 text-sm sm:text-base border border-blue-400/30"
                  >
                    <span>{t('fileBtn')}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <Link
                    href="/complaint"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base shadow-lg"
                  >
                    <span>{t('trackBtn')}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Right Column - Premium Municipal Visual Showcase */}
            <div className="lg:col-span-5 flex justify-center mt-6 lg:mt-0">
              <div className="relative w-full max-w-md lg:max-w-none bg-white/10 dark:bg-black/40 backdrop-blur-2xl rounded-3xl p-4 sm:p-5 border border-white/20 shadow-2xl group hover:border-cyan-400/50 transition-all duration-500">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-inner mb-4 bg-gray-900">
                  <img
                    src="/images/municipality_hero.jpg"
                    alt="Addalachenai Municipal Administration"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <div className="text-left">
                      <span className="px-2.5 py-1 bg-blue-600/90 text-white text-[10px] font-bold rounded-full uppercase tracking-wider mb-1 inline-block shadow">Active Governance</span>
                      <h3 className="text-white font-bold text-sm sm:text-base leading-snug">Pradeshiya Sabha Administration</h3>
                    </div>
                  </div>
                </div>
                
                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/10">
                  <div className="p-2 rounded-xl bg-white/5">
                    <p className="text-cyan-400 font-black text-sm sm:text-base">100%</p>
                    <p className="text-[10px] text-gray-300 uppercase font-semibold">Digital</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <p className="text-emerald-400 font-black text-sm sm:text-base">24/7</p>
                    <p className="text-[10px] text-gray-300 uppercase font-semibold">Support</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <p className="text-purple-400 font-black text-sm sm:text-base">Fast</p>
                    <p className="text-[10px] text-gray-300 uppercase font-semibold">Resolution</p>
                  </div>
                </div>
              </div>
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
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm tracking-wider uppercase">{t('servicesBadge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              {t('servicesTitle')}
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
                    <span className="text-white text-xs font-bold px-3 py-1.5 bg-blue-600/90 backdrop-blur-md rounded-full shadow-lg">{t('clickExplore') || "Click to Explore →"}</span>
                  </div>
                </div>
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between items-center text-center">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{t('srv_' + service.id.split('-')[0] + '_title') || service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-3 font-normal">
                      {t('srv_' + service.id.split('-')[0] + '_desc') || service.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 w-full border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      {t('viewDetailsSubmit') || "View details & submit →"}
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
              <h2 className="text-2xl md:text-3xl font-black">{t('srv_' + selectedService.id.split('-')[0] + '_title') || selectedService.title}</h2>
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
                  <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg">{t('servicesBadge') || "Official Pradeshiya Sabha Service"}</span>
                </div>
              </div>

              {/* Service Description */}
              <div className="mb-8">
                <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-4">{t('aboutService') || "About This Service"}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed font-normal">
                  {t('srv_' + selectedService.id.split('-')[0] + '_desc') || selectedService.fullDescription}
                </p>
              </div>

              {/* Service Details */}
              <div className="mb-8">
                <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-6">{t('whatWeInclude') || "What We Include"}</h3>
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
                  <span>{t('fileComplaintFor') || "File Complaint for"} {t('srv_' + selectedService.id.split('-')[0] + '_title') || selectedService.category}</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-8 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold rounded-2xl transition-all duration-300 text-base md:text-lg"
                >
                  {t('closeBtn') || "Close"}
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
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm tracking-wider uppercase">{t('complaintBadge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              {t('complaintTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-normal leading-relaxed">
              Just 4 intuitive steps to report civic issues and track their resolution in real-time. Fast, secure, and fully transparent.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 relative mb-16 sm:mb-20">
            {/* Step 1 */}
            <div className="relative text-center group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex flex-col h-full bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 hover:border-blue-500/50 transition-all duration-500 hover:shadow-xl dark:shadow-none hover:-translate-y-1.5">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-5 shadow-inner bg-gray-900 group-hover:shadow-blue-500/20">
                  <img src="/images/step_account_new.png" alt="Create Account" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-2 right-2 px-2.5 py-1 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-extrabold rounded-full shadow">STEP 01</div>
                </div>
                
                <h3 className="font-black text-gray-900 dark:text-white mb-2 text-lg sm:text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t('step1_title') || "Create Account"}</h3>
                <p className="text-gray-600 dark:text-gray-400 flex-grow text-xs sm:text-sm leading-relaxed font-normal">
                  {t('step1_desc') || "Register in seconds using your email or phone number to access the citizen portal securely."}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative text-center group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col h-full bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-xl dark:shadow-none hover:-translate-y-1.5">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-5 shadow-inner bg-gray-900 group-hover:shadow-emerald-500/20">
                  <img src="/images/step_complaint_new.png" alt="File Complaint" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-2 right-2 px-2.5 py-1 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-extrabold rounded-full shadow">STEP 02</div>
                </div>

                <h3 className="font-black text-gray-900 dark:text-white mb-2 text-lg sm:text-xl group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{t('step2_title') || "File Complaint"}</h3>
                <p className="text-gray-600 dark:text-gray-400 flex-grow text-xs sm:text-sm leading-relaxed font-normal">
                  {t('step2_desc') || "Submit your detailed complaint with photos, description, and exact location markers."}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative text-center group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col h-full bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 hover:border-amber-500/50 transition-all duration-500 hover:shadow-xl dark:shadow-none hover:-translate-y-1.5">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-5 shadow-inner bg-gray-900 group-hover:shadow-amber-500/20">
                  <img src="/images/step_track_new.png" alt="Track Progress" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-2 right-2 px-2.5 py-1 bg-amber-600/90 backdrop-blur-md text-white text-[10px] font-extrabold rounded-full shadow">STEP 03</div>
                </div>

                <h3 className="font-black text-gray-900 dark:text-white mb-2 text-lg sm:text-xl group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{t('step3_title') || "Track Progress"}</h3>
                <p className="text-gray-600 dark:text-gray-400 flex-grow text-xs sm:text-sm leading-relaxed font-normal">
                  {t('step3_desc') || "Monitor live status updates, staff assignments, and receive instant progress notifications."}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative text-center group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col h-full bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 hover:border-purple-500/50 transition-all duration-500 hover:shadow-xl dark:shadow-none hover:-translate-y-1.5">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-5 shadow-inner bg-gray-900 group-hover:shadow-purple-500/20">
                  <img src="/images/step_resolution_new.png" alt="Get Resolution" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-2 right-2 px-2.5 py-1 bg-purple-600/90 backdrop-blur-md text-white text-[10px] font-extrabold rounded-full shadow">STEP 04</div>
                </div>

                <h3 className="font-black text-gray-900 dark:text-white mb-2 text-lg sm:text-xl group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{t('step4_title') || "Get Resolution"}</h3>
                <p className="text-gray-600 dark:text-gray-400 flex-grow text-xs sm:text-sm leading-relaxed font-normal">
                  {t('step4_desc') || "Receive resolution confirmation report, verify community improvements, and provide feedback."}
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-gray-900/80 dark:to-blue-950/30 rounded-3xl p-6 sm:p-8 border border-blue-200/80 dark:border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl dark:shadow-none animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="relative flex flex-row items-center gap-4 sm:flex-col sm:items-start sm:gap-0 text-left">
                <div className="w-16 h-16 sm:mb-4 shrink-0 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 ease-out">
                  <img src="/images/feat_fast_processing.png" alt="Fast Processing" className="w-full h-full object-contain drop-shadow-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-base sm:text-lg">{t('feat1_title') || "Fast Processing"}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-normal">{t('feat1_desc') || "Average response time: 24-48 hours"}</p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-gray-900/80 dark:to-emerald-950/30 rounded-3xl p-6 sm:p-8 border border-green-200/80 dark:border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl dark:shadow-none animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="relative flex flex-row items-center gap-4 sm:flex-col sm:items-start sm:gap-0 text-left">
                <div className="w-16 h-16 sm:mb-4 shrink-0 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 ease-out">
                  <img src="/images/feat_secure_confidential.png" alt="Secure & Confidential" className="w-full h-full object-contain drop-shadow-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-base sm:text-lg">{t('feat2_title') || "Secure & Confidential"}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-normal">{t('feat2_desc') || "Your information is protected and secure"}</p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-gray-900/80 dark:to-purple-950/30 rounded-3xl p-6 sm:p-8 border border-purple-200/80 dark:border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl dark:shadow-none animate-fade-in-up sm:col-span-2 md:col-span-1" style={{ animationDelay: '0.7s' }}>
              <div className="relative flex flex-row items-center gap-4 sm:flex-col sm:items-start sm:gap-0 text-left">
                <div className="w-16 h-16 sm:mb-4 shrink-0 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 ease-out">
                  <img src="/images/feat_247_access.png" alt="24/7 Access" className="w-full h-full object-contain drop-shadow-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-base sm:text-lg">{t('feat3_title') || "24/7 Access"}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-normal">{t('feat3_desc') || "File complaints anytime, anywhere"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us - Vision, Mission & Core Values Section */}
      <section id="about" className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 bg-gradient-to-b from-white via-slate-50 to-white dark:from-[#07090e] dark:via-[#0c1018] dark:to-[#07090e] relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-14 animate-fade-in-down">
            <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping"></span>
              <span className="text-blue-700 dark:text-blue-300 font-extrabold text-xs tracking-wider uppercase">{t('aboutBadge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
              {t('aboutTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              Dedicated to transparent governance, digital civic innovation, and community empowerment across Addalachenai.
            </p>
          </div>

          {/* New Digital Authority Showcase Bento Card with Image */}
          <div className="bg-gradient-to-br from-gray-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 border border-indigo-500/30 shadow-2xl mb-10 sm:mb-14 text-white relative overflow-hidden group">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/30 transition-all duration-700"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center relative z-10">
              {/* Left Column: Image Showcase */}
              <div className="lg:col-span-6 relative">
                <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                  <img src="/images/about_civic.jpg" alt="Civic Collaboration" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-md rounded-full text-[11px] font-bold tracking-wide">🏛️ Addalachenai Administration</span>
                    <span className="text-xs font-semibold text-gray-200">Digital Era</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Council Overview */}
              <div className="lg:col-span-6 space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <span>⚡ Citizen-Centric Leadership</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white">
                  Empowering Addalachenai Through Next-Gen Digital Governance
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
                  {t('aboutCouncilDesc') || "The Pradeshiya Sabha - Addalachenai is pioneering a new era of civic administration. By integrating transparent online complaint tracking, rapid dispatch teams, and active citizen participation, we ensure every voice is heard and every public issue is addressed with utmost integrity."}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                  <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/10">
                    <div className="text-xl font-black text-cyan-400 mb-0.5">100%</div>
                    <div className="text-xs text-gray-300 font-medium">{t('digitalAccountability') || "Digital Accountability"}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/10">
                    <div className="text-xl font-black text-emerald-400 mb-0.5">Rapid</div>
                    <div className="text-xs text-gray-300 font-medium">{t('rapidResolution') || "Grievance Resolution"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Vision & Mission Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-10 sm:mb-14">
            {/* Vision Card */}
            <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 sm:p-7 border border-gray-200/80 dark:border-blue-500/25 hover:border-blue-500/50 shadow-lg dark:shadow-blue-500/5 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-12 -top-12 w-36 h-36 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl pointer-events-none"></div>
              
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">{t('futureOutlook') || "FUTURE OUTLOOK"}</span>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">{t('ourVision') || "Our Vision"}</h3>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed mb-5">
                  {t('visionDesc') || "To build a clean, green, and technologically empowered community where every citizen enjoys superior public services, transparent governance, and an exceptional quality of life."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-semibold flex items-center gap-1">
                  <span className="text-blue-500 font-bold">✓</span> {t('sustainableGrowth') || "Sustainable Growth"}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-semibold flex items-center gap-1">
                  <span className="text-blue-500 font-bold">✓</span> {t('citizenFirst') || "Citizen First"}
                </span>
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 sm:p-7 border border-gray-200/80 dark:border-emerald-500/25 hover:border-emerald-500/50 shadow-lg dark:shadow-emerald-500/5 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-12 -top-12 w-36 h-36 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-xl pointer-events-none"></div>
              
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">{t('purposeAction') || "PURPOSE & ACTION"}</span>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">{t('ourMission') || "Our Mission"}</h3>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed mb-5">
                  {t('missionDesc') || "To deliver prompt, reliable municipal services while safeguarding our environment. We resolve grievances swiftly through real-time digital tracking and active public participation."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                  <span className="text-emerald-500 font-bold">✓</span> {t('swiftResolution') || "Swift Resolution"}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                  <span className="text-emerald-500 font-bold">✓</span> {t('ecoProtection') || "Eco-Protection"}
                </span>
              </div>
            </div>
          </div>

          {/* Compact Core Values Section */}
          <div>
            <div className="text-center mb-6 sm:mb-8">
              <span className="text-purple-600 dark:text-purple-400 font-bold text-[11px] uppercase tracking-widest block mb-1">{t('guidingPrinciples') || "GUIDING PRINCIPLES"}</span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">{t('coreValues') || "Our Core Values"}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {[
                { 
                  title: 'Transparency', 
                  desc: 'Complete openness in decision making and public service reporting.',
                  icon: (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  gradient: 'from-blue-500 to-indigo-600'
                },
                { 
                  title: 'Accountability', 
                  desc: 'Taking total responsibility for timely resolutions and community outcomes.',
                  icon: (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  gradient: 'from-emerald-500 to-green-600'
                },
                { 
                  title: 'Participation', 
                  desc: 'Empowering residents to voice concerns and co-create local solutions.',
                  icon: (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 10H9m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  gradient: 'from-purple-500 to-pink-600'
                },
                { 
                  title: 'Innovation', 
                  desc: 'Adopting state-of-the-art digital tools to streamline municipal services.',
                  icon: (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  gradient: 'from-amber-500 to-orange-600'
                }
              ].map((value, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/90 dark:bg-gray-900/70 backdrop-blur-md rounded-xl p-5 border border-gray-200/80 dark:border-gray-800 hover:border-purple-500/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 bg-gradient-to-br ${value.gradient} rounded-lg flex items-center justify-center shadow-sm shrink-0`}>
                        {value.icon}
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight">{t('val' + (idx + 1) + '_title') || value.title}</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{t('val' + (idx + 1) + '_desc') || value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Futuristic Command Portal */}
      <section id="contact" className="py-16 sm:py-20 md:py-28 lg:py-36 px-3 sm:px-4 md:px-6 bg-gradient-to-b from-slate-900 via-[#070b12] to-black text-white relative overflow-hidden transition-colors duration-300">
        {/* Ambient neon lighting */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[160px] pointer-events-none animate-pulse" style={{ animationDelay: '3s' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-14 animate-fade-in-down">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs sm:text-sm font-bold tracking-wider uppercase mb-4 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{t('contactBadge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
              {t('contactTitle')}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              {t('contactDesc') || "Have questions, feedback, or require assistance? Reach out to our dedicated municipal staff through any of our official digital channels below."}
            </p>
          </div>

          {/* Support Desk Image Banner */}
          <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 border border-cyan-500/30 shadow-2xl mb-12 sm:mb-16 relative overflow-hidden group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-6 space-y-4">
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full text-xs font-black uppercase tracking-wider inline-block">
                  {t('liveHelpdesk') || "💬 Live Citizen Helpdesk"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                  {t('supportTitle') || "We Are Here For Addalachenai 24/7"}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
                  {t('supportDesc') || "Our digital support team monitors inquiries around the clock. Whether you need help submitting a grievance, tracking a pending case, or locating public documents, we provide rapid, transparent assistance."}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-cyan-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> {t('instantSupport') || "Instant Online Support"}
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-emerald-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> {t('zeroWait') || "Zero Wait Times"}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                  <img src="/images/contact_support.jpg" alt="Contact Support Desk" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-emerald-600/90 text-white rounded-full text-xs font-bold shadow">
                    {t('systemsOperational') || "🟢 Systems Operational"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image-Based Contact Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 sm:mb-20">
            {/* Phone Card */}
            <div className="group relative rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-blue-500/50 shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-end overflow-hidden min-h-[280px]">
              <img src="/images/contact_phone_new.png" alt="Telephone" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
              
              <div className="relative z-10 text-white">
                <h3 className="text-xl font-black mb-1 drop-shadow-md">{t('telHotline') || "Telephone Hotline"}</h3>
                <p className="text-blue-400 font-bold text-lg mb-1 drop-shadow-md">+94 (0) XXX XXX XXXX</p>
                <p className="text-gray-300 text-xs mb-4 drop-shadow-md">{t('monSatHours') || "Mon-Sat, 8:00 AM - 5:00 PM"}</p>
                
                <a href="tel:+94" className="pt-3 border-t border-white/20 font-extrabold text-xs inline-flex items-center justify-between w-full group/link transition-colors hover:text-blue-400">
                  <span>{t('callHotline') || "CALL HOTLINE"}</span>
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover/link:translate-x-1 transition-transform backdrop-blur-md">→</span>
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="group relative rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-purple-500/50 shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-end overflow-hidden min-h-[280px]">
              <img src="/images/contact_email_new.png" alt="Email" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
              
              <div className="relative z-10 text-white">
                <h3 className="text-xl font-black mb-1 drop-shadow-md">{t('emailDispatch') || "Email Dispatch"}</h3>
                <p className="text-purple-400 font-bold text-lg mb-1 break-all drop-shadow-md">info@pradeshya.lk</p>
                <p className="text-gray-300 text-xs mb-4 drop-shadow-md">{t('guaranteed24') || "24-Hour Response Guaranteed"}</p>
                
                <a href="mailto:info@pradeshya.lk" className="pt-3 border-t border-white/20 font-extrabold text-xs inline-flex items-center justify-between w-full group/link transition-colors hover:text-purple-400">
                  <span>{t('sendMessage') || "SEND MESSAGE"}</span>
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover/link:translate-x-1 transition-transform backdrop-blur-md">→</span>
                </a>
              </div>
            </div>

            {/* Location Card */}
            <div className="group relative rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-rose-500/50 shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-end overflow-hidden min-h-[280px]">
              <img src="/images/contact_location_new.png" alt="Location" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
              
              <div className="relative z-10 text-white">
                <h3 className="text-xl font-black mb-1 drop-shadow-md">{t('headquarters') || "Headquarters"}</h3>
                <p className="text-rose-400 font-bold text-lg mb-1 drop-shadow-md">{t('secOffice') || "Pradeshiya Sabha Office"}</p>
                <p className="text-gray-300 text-xs mb-4 drop-shadow-md">{t('slAddressShort') || "Addalachenai, Sri Lanka"}</p>
                
                <a href="https://maps.app.goo.gl/sQSgHAfeEwF8XmrY7" target="_blank" rel="noopener noreferrer" className="pt-3 border-t border-white/20 font-extrabold text-xs inline-flex items-center justify-between w-full group/link transition-colors hover:text-rose-400">
                  <span>{t('viewMaps') || "VIEW ON MAPS"}</span>
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover/link:translate-x-1 transition-transform backdrop-blur-md">→</span>
                </a>
              </div>
            </div>

            {/* Hours Card */}
            <div className="group relative rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-emerald-500/50 shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-end overflow-hidden min-h-[280px]">
              <img src="/images/contact_hours_new.png" alt="Hours" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
              
              <div className="relative z-10 text-white">
                <h3 className="text-xl font-black mb-1 drop-shadow-md">{t('workingHours') || "Working Hours"}</h3>
                <p className="text-emerald-400 font-bold text-lg mb-1 drop-shadow-md">{t('monFriHours') || "Mon-Fri: 8AM - 5PM"}</p>
                <p className="text-gray-300 text-xs mb-4 drop-shadow-md">{t('emergencyDesk247') || "Emergency Desk: 24/7"}</p>
                
                <div className="pt-3 border-t border-white/20 font-extrabold text-xs inline-flex items-center justify-between w-full group/link transition-colors cursor-default">
                  <span>{t('openNow') || "● OPEN NOW"}</span>
                  <span className="w-auto px-2 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold backdrop-blur-md">GMT+5:30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ultra-Colorful Operational Schedule & Jurisdiction Bento Box */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 md:p-14 border border-indigo-500/40 shadow-[0_0_50px_rgba(79,70,229,0.15)] relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-20 -top-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center relative z-10">
              {/* Left Side: Secretariat Info */}
              <div className="md:col-span-5 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/40 rounded-full text-cyan-300 text-xs font-bold uppercase tracking-wider shadow">
                  <span>{t('jurisdictionBadge') || "📍 Official Jurisdiction"}</span>
                </div>
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                  {t('secretariatTitle') || "Main Municipal Secretariat"}
                </h4>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
                  {t('secretariatDesc') || "Our secretariat serves all citizens of the Addalachenai Pradeshiya Sabha area for public consultations, civic development inquiries, and administrative support."}
                </p>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/15 shadow-inner space-y-3">
                  <p className="text-white font-bold text-base sm:text-lg">
                    {t('secOffice') || "Pradeshiya Sabha Office"}<br/>
                    <span className="text-cyan-300 font-medium text-xs sm:text-sm">{t('secAddress') || "Addalachenai, Ampara District, Eastern Province, Sri Lanka"}</span>
                  </p>
                  <a
                    href="https://maps.app.goo.gl/sQSgHAfeEwF8XmrY7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white hover:text-cyan-200 font-extrabold transition-all text-xs sm:text-sm pt-2 group/btn"
                  >
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/50 rounded-xl transition-all shadow-md flex items-center gap-2">
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      {t('getDirections') || "GET INTERACTIVE DIRECTIONS"}
                    </span>
                  </a>
                </div>
              </div>

              {/* Right Side: Colorful Operational Schedule */}
              <div className="md:col-span-7 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <h4 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                    {t('opSchedule') || "Operational Schedule"}
                  </h4>
                  <span className="text-xs font-extrabold text-cyan-300 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/30">{t('activeTimetable') || "Active Timetable"}</span>
                </div>

                <div className="space-y-3">
                  {/* Monday - Friday */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 gap-2">
                    <span className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> {t('monFri') || "Monday - Friday"}
                    </span>
                    <span className="text-emerald-300 font-extrabold text-xs sm:text-sm px-3 py-1 bg-emerald-500/20 rounded-lg border border-emerald-400/40 w-fit">
                      {t('monFriSchedule') || "08:00 AM - 05:00 PM"}
                    </span>
                  </div>

                  {/* Saturday */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-transparent border border-blue-500/30 gap-2">
                    <span className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span> {t('saturday') || "Saturday"}
                    </span>
                    <span className="text-blue-300 font-extrabold text-xs sm:text-sm px-3 py-1 bg-blue-500/20 rounded-lg border border-blue-400/40 w-fit">
                      {t('satSchedule') || "09:00 AM - 01:00 PM"}
                    </span>
                  </div>

                  {/* Sunday & Holidays */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-rose-500/15 via-red-500/10 to-transparent border border-rose-500/30 gap-2">
                    <span className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-400"></span> {t('sundayHolidays') || "Sunday & Public Holidays"}
                    </span>
                    <span className="text-rose-300 font-extrabold text-xs sm:text-sm px-3 py-1 bg-rose-500/20 rounded-lg border border-rose-400/40 w-fit">
                      {t('closedPortalOpen') || "Closed • Online Portal Open"}
                    </span>
                  </div>
                </div>

                {/* Emergency Hotline Alert */}
                <div className="pt-2">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/40 flex items-center gap-3.5 shadow-lg">
                    <span className="text-3xl animate-bounce">🚨</span>
                    <div>
                      <p className="text-xs font-black text-amber-300 uppercase tracking-wider">{t('emergencyTitle') || "24/7 Emergency Dispatch Active"}</p>
                      <p className="text-xs sm:text-sm text-gray-200 font-medium">{t('emergencyDesc') || "For urgent civic crises (severe flooding, road hazards, water pipe ruptures), our emergency response hotline is staffed 365 days a year."}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}

    </div>
  );
}
