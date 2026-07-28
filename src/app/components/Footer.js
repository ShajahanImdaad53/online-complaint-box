'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from './LanguageProvider';

export default function Footer() {
  const router = useRouter();
  const { t } = useLanguage();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If element doesn't exist on current page, navigate to home page with hash
      router.push(`/#${id}`);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-[#090d16] via-[#05070c] to-black text-gray-300 py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 border-t border-white/10 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
      {/* Subtle ambient light at the top of footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Footer Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10 mb-12 sm:mb-16">
          {/* Brand Section (Span 4) */}
          <div className="col-span-1 sm:col-span-2 md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
                <Image
                  src="/images/logo.jpeg"
                  alt="Pradesha Shaba Logo"
                  width={44}
                  height={44}
                  className="rounded-lg object-cover w-10 h-10 sm:w-11 sm:h-11"
                />
              </div>
              <div>
                <h4 className="font-black text-white text-lg sm:text-xl tracking-tight">{t('title')}</h4>
                <p className="text-xs sm:text-sm text-blue-400 font-bold tracking-wider uppercase">{t('subtitle')} Council</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm font-normal">
              Empowering our citizens through digital governance, rapid issue resolution, and transparent community development across the eastern province.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t('footerActive')}</span>
            </div>
          </div>

          {/* Quick Links (Span 2) */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-bold text-white mb-4 text-base tracking-wide border-b border-blue-500/30 pb-1.5 w-fit">{t('footerNav')}</h4>
            <ul className="space-y-2.5 w-full">
              {['home', 'services', 'complaint', 'about', 'contact'].map((section, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => scrollToSection(section)}
                    className="text-sm text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 capitalize flex items-center gap-1.5 mx-auto md:mx-0 group"
                  >
                    <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                    <span>{t(section)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services (Span 3) */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-bold text-white mb-4 text-base tracking-wide border-b border-indigo-500/30 pb-1.5 w-fit">{t('footerCivic')}</h4>
            <ul className="space-y-2.5 w-full">
              <li>
                <Link href="/complaint/create" className="text-sm text-gray-400 hover:text-indigo-400 hover:translate-x-1 transition-all duration-200 flex items-center gap-1.5 justify-center md:justify-start group">
                  <span className="text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                  <span>{t('submitNew')}</span>
                </Link>
              </li>
              <li>
                <Link href="/complaint" className="text-sm text-gray-400 hover:text-indigo-400 hover:translate-x-1 transition-all duration-200 flex items-center gap-1.5 justify-center md:justify-start group">
                  <span className="text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                  <span>{t('trackStatus')}</span>
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-sm text-gray-400 hover:text-indigo-400 hover:translate-x-1 transition-all duration-200 flex items-center gap-1.5 justify-center md:justify-start group">
                  <span className="text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                  <span>{t('citizenReg')}</span>
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-sm text-gray-400 hover:text-indigo-400 hover:translate-x-1 transition-all duration-200 flex items-center gap-1.5 justify-center md:justify-start group">
                  <span className="text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                  <span>{t('staffLogin')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support (Span 3) */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-bold text-white mb-4 text-base tracking-wide border-b border-emerald-500/30 pb-1.5 w-fit">{t('footerHelp')}</h4>
            <ul className="space-y-3 w-full">
              <li className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                <p className="text-gray-400 text-xs flex items-center justify-center md:justify-start gap-1">
                  <span>📞</span> {t('hotline')}
                </p>
                <p className="text-white font-bold text-sm">+94 (0) XXX XXX XXXX</p>
              </li>
              <li className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                <p className="text-gray-400 text-xs flex items-center justify-center md:justify-start gap-1">
                  <span>📧</span> {t('emailSupport')}
                </p>
                <p className="text-white font-semibold text-xs sm:text-sm break-all">info@pradeshyasabha.lk</p>
              </li>
              <li className="text-xs text-gray-500 pt-1">
                Emergency municipal response teams on standby 24/7/365.
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 mt-4">
          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xs sm:text-sm text-gray-400 text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} <span className="text-white font-bold">Pradesha Shaba Addalachenai</span>. All civic rights reserved.</p>
              <p className="text-xs text-gray-600 mt-1">Designed for high-performance municipal management and public accountability.</p>
            </div>

            {/* Social Links with Neon Glows */}
            <div className="flex gap-3 items-center">
              {/* Facebook */}
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-blue-600 border border-white/10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] group" title="Facebook">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              {/* Twitter X */}
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-black border border-white/10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] group" title="Twitter">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
                  <path d="M453.2 112L523.8 112L369.6 288.2L551 528L409 528L297.7 382.6L170.5 528L99.8 528L264.7 339.5L90.8 112L236.4 112L336.9 244.9L453.2 112zM428.4 485.8L467.5 485.8L215.1 152L173.1 152L428.4 485.8z"/>
                </svg>
              </a>
              
              {/* WhatsApp */}
              <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-emerald-600 border border-white/10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] group" title="WhatsApp">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
                  <path d="M476.9 161.1C435 119.1 379.2 96 319.9 96C197.5 96 97.9 195.6 97.9 318C97.9 357.1 108.1 395.3 127.5 429L96 544L213.7 513.1C246.1 530.8 282.6 540.1 319.8 540.1L319.9 540.1C442.2 540.1 544 440.5 544 318.1C544 258.8 518.8 203.1 476.9 161.1zM319.9 502.7C286.7 502.7 254.2 493.8 225.9 477L219.2 473L149.4 491.3L168 423.2L163.6 416.2C145.1 386.8 135.4 352.9 135.4 318C135.4 216.3 218.2 133.5 320 133.5C369.3 133.5 415.6 152.7 450.4 187.6C485.2 222.5 506.6 268.8 506.5 318.1C506.5 419.9 421.6 502.7 319.9 502.7zM421.1 364.5C415.6 361.7 388.3 348.3 383.2 346.5C378.1 344.6 374.4 343.7 370.7 349.3C367 354.9 356.4 367.3 353.1 371.1C349.9 374.8 346.6 375.3 341.1 372.5C308.5 356.2 287.1 343.4 265.6 306.5C259.9 296.7 271.3 297.4 281.9 276.2C283.7 272.5 282.8 269.3 281.4 266.5C280 263.7 268.9 236.4 264.3 225.3C259.8 214.5 255.2 216 251.8 215.8C248.6 215.6 244.9 215.6 241.2 215.6C237.5 215.6 231.5 217 226.4 222.5C221.3 228.1 207 241.5 207 268.8C207 296.1 226.9 322.5 229.6 326.2C232.4 329.9 268.7 385.9 324.4 410C359.6 425.2 373.4 426.5 391 423.9C401.7 422.3 423.8 410.5 428.4 397.5C433 384.5 433 373.4 431.6 371.1C430.3 368.6 426.6 367.2 421.1 364.5z"/>
                </svg>
              </a>
            </div>

            {/* Footer Links */}
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white hover:underline transition-all duration-200">
                Privacy Policy
              </Link>
              <span className="text-gray-700">•</span>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-white hover:underline transition-all duration-200">
                Terms of Service
              </Link>
              <span className="text-gray-700">•</span>
              <Link href="/faq" className="text-gray-400 hover:text-white hover:underline transition-all duration-200">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
