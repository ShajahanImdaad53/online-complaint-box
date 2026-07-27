'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Footer() {
  const router = useRouter();

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
    <footer className="bg-black text-gray-300 py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1 flex flex-col items-center justify-center text-center">
            <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Image
                src="/images/logo.jpeg"
                alt="Pradesha Shaba Logo"
                width={36}
                height={36}
                className="rounded-lg w-10 h-10 sm:w-12 sm:h-12"
              />
              <div>
                <h4 className="font-bold text-white text-base sm:text-lg md:text-xl">Pradesha Shaba</h4>
                <p className="text-sm sm:text-base text-gray-400">Addalachenai</p>
              </div>
            </div>
            <p className="text-sm sm:text-base md:text-base text-gray-300 leading-relaxed">
              Serving the community with transparency, efficiency, and dedication to progress.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center justify-center text-center">
            <h4 className="font-bold text-white mb-3 sm:mb-4 text-base sm:text-lg md:text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="text-sm sm:text-base text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-sm sm:text-base text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-sm sm:text-base text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('complaint')}
                  className="text-sm sm:text-base text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer"
                >
                  Complaints
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-sm sm:text-base text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="flex flex-col items-center justify-center text-center">
            <h4 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-lg">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/complaint/create" className="text-xs sm:text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  File Complaint
                </Link>
              </li>
              <li>
                <Link href="/complaint" className="text-xs sm:text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  Track Status
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-xs sm:text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-xs sm:text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="flex flex-col items-center justify-center text-center">
            <h4 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-lg">Support</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="text-xs sm:text-sm">
                <p className="text-gray-400 text-xs sm:text-sm">📞 Phone</p>
                <p className="text-white font-medium text-xs sm:text-sm">+94 XXX XXX XXXX</p>
              </li>
              <li className="text-xs sm:text-sm">
                <p className="text-gray-400 text-xs sm:text-sm">📧 Email</p>
                <p className="text-white font-medium break-all text-xs sm:text-sm">info@pradeshyasabha.lk</p>
              </li>
              <li className="text-xs sm:text-sm">
                <p className="text-gray-400 text-xs sm:text-sm">⏰ Available</p>
                <p className="text-white font-medium text-xs sm:text-sm">24/7 Support</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 py-8 md:py-10">
          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500 text-center md:text-left">
              <p>&copy; 2024 Pradesha Shaba Addalachenai. All rights reserved.</p>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 sm:gap-4 justify-center md:justify-center items-center">
              {/* Facebook */}
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-300 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md" title="Facebook">
                <svg className="w-5 h-5 text-gray-700 hover:text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              {/* Twitter X */}
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-300 hover:bg-black rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md" title="Twitter">
                <svg className="w-5 h-5 text-gray-700 hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
                  <path d="M453.2 112L523.8 112L369.6 288.2L551 528L409 528L297.7 382.6L170.5 528L99.8 528L264.7 339.5L90.8 112L236.4 112L336.9 244.9L453.2 112zM428.4 485.8L467.5 485.8L215.1 152L173.1 152L428.4 485.8z"/>
                </svg>
              </a>
              
              {/* WhatsApp */}
              <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-300 hover:bg-green-500 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md" title="WhatsApp">
                <svg className="w-5 h-5 text-gray-700 hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
                  <path d="M476.9 161.1C435 119.1 379.2 96 319.9 96C197.5 96 97.9 195.6 97.9 318C97.9 357.1 108.1 395.3 127.5 429L96 544L213.7 513.1C246.1 530.8 282.6 540.1 319.8 540.1L319.9 540.1C442.2 540.1 544 440.5 544 318.1C544 258.8 518.8 203.1 476.9 161.1zM319.9 502.7C286.7 502.7 254.2 493.8 225.9 477L219.2 473L149.4 491.3L168 423.2L163.6 416.2C145.1 386.8 135.4 352.9 135.4 318C135.4 216.3 218.2 133.5 320 133.5C369.3 133.5 415.6 152.7 450.4 187.6C485.2 222.5 506.6 268.8 506.5 318.1C506.5 419.9 421.6 502.7 319.9 502.7zM421.1 364.5C415.6 361.7 388.3 348.3 383.2 346.5C378.1 344.6 374.4 343.7 370.7 349.3C367 354.9 356.4 367.3 353.1 371.1C349.9 374.8 346.6 375.3 341.1 372.5C308.5 356.2 287.1 343.4 265.6 306.5C259.9 296.7 271.3 297.4 281.9 276.2C283.7 272.5 282.8 269.3 281.4 266.5C280 263.7 268.9 236.4 264.3 225.3C259.8 214.5 255.2 216 251.8 215.8C248.6 215.6 244.9 215.6 241.2 215.6C237.5 215.6 231.5 217 226.4 222.5C221.3 228.1 207 241.5 207 268.8C207 296.1 226.9 322.5 229.6 326.2C232.4 329.9 268.7 385.9 324.4 410C359.6 425.2 373.4 426.5 391 423.9C401.7 422.3 423.8 410.5 428.4 397.5C433 384.5 433 373.4 431.6 371.1C430.3 368.6 426.6 367.2 421.1 364.5z"/>
                </svg>
              </a>
            </div>

            {/* Footer Links */}
            <div className="flex gap-4 text-sm">
              <a href="/privacy-policy" className="text-gray-400 hover:text-white hover:translate-y-0.5 transition-all duration-200 cursor-pointer">
                Privacy Policy
              </a>
              <span className="text-gray-700">|</span>
              <a href="/terms-of-service" className="text-gray-400 hover:text-white hover:translate-y-0.5 transition-all duration-200 cursor-pointer">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
