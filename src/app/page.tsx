'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AICoach from '@/components/AICoach';

export default function Home() {
  const [userName, setUserName] = useState('');
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('mindspace_user_name');
    if (savedName) {
      setUserName(savedName);
    } else {
      setShowNameDialog(true);
    }
  }, []);

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      localStorage.setItem('mindspace_user_name', tempName.trim());
      setUserName(tempName.trim());
      setShowNameDialog(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {showNameDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Welcome to MindSpace</h2>
            <p className="text-gray-700 mb-6">Please enter your name to get started:</p>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full p-2 border rounded mb-4 text-gray-900"
              placeholder="Your name"
              onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
            />
            <button
              onClick={handleNameSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              disabled={!tempName.trim()}
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            Welcome{userName ? `, ${userName}` : ' to MindSpace'}
          </h1>
          <p className="text-xl text-gray-700">
            Your personalized learning environment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link href="/study-plans">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Study Plans</h2>
              <p className="text-gray-700">
                Get personalized study recommendations and join subject discussions with peers.
              </p>
            </div>
          </Link>

          <Link href="/focus">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Focus Mode</h2>
              <p className="text-gray-700">
                Use the Pomodoro timer and ambient sounds to enhance your concentration.
              </p>
            </div>
          </Link>
        </div>

        <div className="bg-blue-50 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Quick Tips</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">📚</span>
              <span>Choose a subject in Study Plans to get personalized learning recommendations</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">💬</span>
              <span>Join discussions with peers to enhance your understanding</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">⏰</span>
              <span>Use Focus Mode with the Pomodoro timer to maintain productivity</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🎵</span>
              <span>Try different ambient sounds to create your ideal study environment</span>
            </li>
          </ul>
        </div>
      </div>

      <AICoach />
    </main>
  );
}
