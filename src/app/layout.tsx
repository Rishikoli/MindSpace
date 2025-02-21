import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import Image from 'next/image';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindSpace - AI-Powered Learning Platform",
  description: "A next-gen AI-driven learning platform that personalizes study plans, gamifies learning, and incorporates smart distraction-blocking features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <Link href="/" className="flex items-center space-x-2">
                  <Image src="/logo.svg" alt="MindSpace Logo" width={140} height={32} priority />
                </Link>
                <div className="hidden md:flex space-x-1">
                  <Link href="/study-plans" 
                    className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition">
                    Study Plans
                  </Link>
                  <Link href="/focus" 
                    className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition">
                    Focus Mode
                  </Link>
                  <Link href="/ai-coach" 
                    className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition">
                    AI Coach
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
