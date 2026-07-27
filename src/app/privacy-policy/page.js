'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <button
              onClick={() => router.push('/')}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm transition-colors"
            >
              Back Home
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
          {/* Last Updated */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600">
              <strong>Last Updated:</strong> April 22, 2024
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-6 sm:space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                1. Introduction
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Pradesha Shaba ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our public complaint management system.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                2. Information We Collect
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    When you create an account or file a complaint, we may collect:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-sm sm:text-base text-gray-700 space-y-1">
                    <li>Full name and contact information (email, phone number)</li>
                    <li>Residential address and location details</li>
                    <li>Account credentials (username, password)</li>
                    <li>Complaint details and supporting documents</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Technical Information</h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    We automatically collect certain information about your device and browsing activity:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-sm sm:text-base text-gray-700 space-y-1">
                    <li>IP address and browser type</li>
                    <li>Pages visited and time spent on website</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Device information (operating system, screen resolution)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-3">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700">
                <li>Processing and managing your complaint submissions</li>
                <li>Communicating with you regarding your complaints and account</li>
                <li>Verifying user identity and authentication</li>
                <li>Improving our services and user experience</li>
                <li>Conducting research and analytics</li>
                <li>Complying with legal obligations</li>
                <li>Preventing fraud and ensuring security</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                4. Data Sharing and Disclosure
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-3">
                Your personal information is confidential. We do not sell or rent your personal data to third parties. We may share information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700">
                <li>With government authorities when required by law or legal process</li>
                <li>With service providers who help us operate our website and services</li>
                <li>To investigate or prevent illegal activities</li>
                <li>With your consent for specific purposes</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                5. Data Security
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-2 text-sm sm:text-base text-gray-700">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Secure password hashing and authentication</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information by authorized personnel</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                6. Your Rights and Choices
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-3">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700">
                <li>Right to access your personal data</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to delete your account and associated data</li>
                <li>Right to opt-out of marketing communications</li>
                <li>Right to data portability</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-700 mt-3">
                To exercise these rights, please contact us at <span className="font-semibold">info@pradeshyasabha.lk</span>
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                7. Cookies and Tracking
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                Our website uses cookies and similar tracking technologies to enhance your browsing experience. You can control cookie settings in your browser. Disabling cookies may affect website functionality.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                8. Data Retention
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy or as required by law. When information is no longer needed, we securely delete or anonymize it.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                9. Third-Party Links
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                Our website may contain links to third-party websites. We are not responsible for their privacy practices. Please review their privacy policies before sharing any information.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                10. Changes to This Policy
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. Your continued use of our services constitutes acceptance of the revised policy.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                11. Contact Us
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-3">
                If you have questions or concerns about our privacy practices, please contact us:
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-sm sm:text-base text-gray-700">
                <p><strong>Pradesha Shaba</strong></p>
                <p>Addalachenai</p>
                <p>Email: <a href="mailto:info@pradeshyasabha.lk" className="text-blue-600 hover:text-blue-700 font-semibold">info@pradeshyasabha.lk</a></p>
                <p>Phone: +94 XXX XXX XXXX</p>
              </div>
            </section>
          </div>

          {/* Footer Link */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <Link
              href="/terms-of-service"
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base transition-colors"
            >
              Read our Terms of Service →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
