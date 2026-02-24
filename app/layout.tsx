import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Business Bhaiya",
  description: "AI Growth Partner for Indian Business Owners",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-white`}
      >
        {/* HEADER */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-gray-800 z-50">
          <div className="h-full flex justify-between items-center px-8">
            <h1 className="text-lg font-semibold">
              Business Bhaiya
            </h1>

            <div className="space-x-4">
              <a
                href="/login"
                className="text-gray-300 hover:text-white transition"
              >
                Login
              </a>

              <a
                href="/login"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Sign Up
              </a>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}