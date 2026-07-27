'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '../components/Footer';

export default function TermsOfService() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Terms of Service</h1>
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
                1. Acceptance of Terms
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                By accessing and using the Pradesha Shaba Public Complaint Management System ("the Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Service.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                2. Service Description
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                Pradesha Shaba provides a digital platform for citizens to file complaints, track their status, and communicate with local authorities. The Service includes complaint management, status tracking, and communication features to serve our community with transparency and efficiency.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                3. User Registration and Account
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-3">
                To use certain features of the Service, you must create an account by providing accurate and complete information. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700">
                <li>Provide truthful, accurate, and current information</li>
                <li>Maintain the confidentiality of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Be at least 18 years of age to create an account</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                4. Acceptable Use Policy
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-3">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700">
                <li>Submit false, misleading, or malicious complaints</li>
                <li>Harass, threaten, or abuse other users or officials</li>
                <li>Upload illegal, offensive, or obscene content</li>
                <li>Attempt to gain unauthorized access to the system</li>
                <li>Interfere with or disrupt the Service or its infrastructure</li>
                <li>Engage in any illegal or unethical activities</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                5. Complaint Submission
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-3">
                When submitting a complaint, you warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700">
                <li>All information provided is accurate and truthful</li>
                <li>You have the authority to submit the complaint</li>
                <li>The complaint does not violate anyone's rights</li>
                <li>You own or have permission to share any attachments</li>
                <li>The complaint falls within our jurisdiction</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-700 mt-3">
                Complaints containing false information may result in legal consequences and account termination.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                6. Intellectual Property Rights
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                The Service and all its contents, including text, graphics, logos, and software, are the property of Pradesha Shaba or its content suppliers and are protected by international copyright laws. You may not reproduce, distribute, or transmit any content without our written permission.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                7. User Content License
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                By submitting content (complaints, messages, documents) to the Service, you grant Pradesha Shaba a non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute your content for the purposes of complaint management and public interest.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                To the fullest extent permitted by law, Pradesha Shaba is not liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including loss of data, business interruption, or lost profits, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                9. Service Availability
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                We strive to maintain continuous service availability, but we do not warrant that the Service will be uninterrupted or error-free. We may suspend or discontinue the Service or any part thereof for maintenance, updates, or other reasons without notice.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                10. Termination of Account
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                We reserve the right to terminate or suspend your account if you violate these Terms of Service or engage in illegal or harmful activities. Upon termination, your right to use the Service ceases immediately.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                11. Indemnification
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                You agree to indemnify and hold harmless Pradesha Shaba and its officers, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms of Service.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                12. Governing Law
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                These Terms of Service are governed by and construed in accordance with the laws of Sri Lanka, and you irrevocably submit to the exclusive jurisdiction of the courts located in Sri Lanka.
              </p>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                13. Dispute Resolution
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                Any disputes arising from or relating to these Terms or your use of the Service shall be resolved through good-faith negotiation. If negotiation fails, disputes may be escalated to formal legal proceedings.
              </p>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                14. Amendments to Terms
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                We reserve the right to modify these Terms of Service at any time. Changes will become effective upon posting. Your continued use of the Service after modifications constitutes acceptance of the revised terms.
              </p>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                15. Entire Agreement
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                These Terms of Service, along with our Privacy Policy, constitute the entire agreement between you and Pradesha Shaba regarding your use of the Service. If any provision is found to be unenforceable, the remaining provisions shall continue in effect.
              </p>
            </section>

            {/* Section 16 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                16. Contact Us
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-3">
                If you have questions about these Terms of Service, please contact us:
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
              href="/privacy-policy"
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base transition-colors"
            >
              Read our Privacy Policy →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
