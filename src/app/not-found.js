import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 md:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="w-full max-w-7xl">
          <div className="grid md:grid-cols-2 items-center gap-8 md:gap-12">

            {/* Content Section */}
            <div className="space-y-8 text-center md:text-left order-2 md:order-1">
              
              <div className="inline-block md:inline-block md:mr-0 px-4 py-2 bg-red-100 rounded-full">
                <span className="text-red-600 font-semibold text-sm">Error 404</span>
              </div>

              <div>
                <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-2">
                  404
                </h1>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Oops! Page Not Found
                </h2>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto md:mx-0">
                Sorry, the page you're looking for doesn't exist or has been moved. Let's get you back on track.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                <Link href="/" className="w-full sm:w-auto">
                  <button className="w-full px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 transform hover:-translate-y-0.5">
                    Back to Home
                  </button>
                </Link>
                
                <Link href="/complaint" className="w-full sm:w-auto">
                  <button className="w-full px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-all duration-300">
                    File a Complaint
                  </button>
                </Link>
              </div>

            </div>

            {/* Illustration Section */}
            <div className="flex justify-center items-center order-1 md:order-2">
              <div className="relative w-full aspect-square max-w-sm">
                <Image
                  src="/images/404.png"
                  alt="404 page not found illustration"
                  width={500}
                  height={500}
                  priority
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
