'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🎓</span>
              <span className="font-bold text-xl">MindSpace</span>
            </Link>
          </div>

          <div className="flex space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/')}`}
            >
              Dashboard
            </Link>
            <Link
              href="/study-plans"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/study-plans')}`}
            >
              Study Plans
            </Link>
            <Link
              href="/focus"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/focus')}`}
            >
              Focus Mode
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
