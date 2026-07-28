import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./animations.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Public Complaint System - Your Voice Matters",
  description: "Report issues affecting your community and track their resolution in real-time. Transparent service delivery for citizen satisfaction.",
  icons: {
    icon: "/favicon.svg",
  },
};

import ThemeProvider from "./components/ThemeProvider";
import LanguageProvider from "./components/LanguageProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#07090e] text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

