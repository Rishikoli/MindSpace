'use client';

import Image from "next/image";
import Link from 'next/link'
import AIStudyCoach from '@/components/AIStudyCoach';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const [showNameDialog, setShowNameDialog] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('mindspace_user_name');
    if (!savedName) {
      setShowNameDialog(true);
    } else {
      setUserName(savedName);
    }
  }, []);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('mindspace_user_name', userName);
      setShowNameDialog(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {showNameDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome to MindSpace!</h2>
            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-2 border rounded mb-4"
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                disabled={!userName.trim()}
              >
                Get Started
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome{userName ? `, ${userName}` : ''}! 🎓
          </h1>
          <p className="text-gray-600">Here's your learning progress for today</p>
        </div>

        {/* AI Coach Section */}
        <AIStudyCoach />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Study Time"
            value="2.5 hrs"
            trend="+30min"
            trendUp={true}
          />
          <StatCard
            title="Focus Score"
            value="85%"
            trend="+5%"
            trendUp={true}
          />
          <StatCard
            title="Tasks Completed"
            value="12/15"
            trend="3 remaining"
            trendUp={false}
          />
        </div>

        {/* Current Focus and Next Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Current Focus</h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Mathematics</h3>
              <p className="text-gray-600 mb-3">Chapter 5: Differential Equations</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 rounded-full h-2 w-3/4"></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">75% Complete</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Next Up</h2>
            <ul className="space-y-3">
              <TaskItem
                title="Review Physics Notes"
                time="30 min"
                priority="high"
              />
              <TaskItem
                title="Complete Practice Problems"
                time="45 min"
                priority="medium"
              />
              <TaskItem
                title="Watch Video Lecture"
                time="1 hr"
                priority="low"
              />
            </ul>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Progress</h2>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-full bg-gray-50 rounded-lg h-24 mb-2 border border-gray-200">
                  <div 
                    className="bg-blue-600 rounded-lg h-full" 
                    style={{ height: `${Math.random() * 100}%` }}
                  ></div>
                </div>
                <span className="text-gray-600 text-sm">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

function StatCard({ title, value, trend, trendUp }: {
  title: string
  value: string
  trend: string
  trendUp: boolean
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-gray-600 text-sm mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className={`text-sm ${trendUp ? 'text-green-600' : 'text-yellow-600'}`}>
          {trend}
        </span>
      </div>
    </div>
  )
}

function TaskItem({ title, time, priority }: {
  title: string
  time: string
  priority: 'high' | 'medium' | 'low'
}) {
  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  }

  return (
    <li className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${priorityColors[priority]}`}></div>
        <span className="text-gray-900">{title}</span>
      </div>
      <span className="text-gray-600 text-sm">{time}</span>
    </li>
  )
}

function RecommendationItem({ title, description, time, type }: {
  title: string
  description: string
  time: string
  type: 'review' | 'quiz' | 'video'
}) {
  const typeIcons = {
    review: '📚',
    quiz: '✍️',
    video: '🎥'
  }

  return (
    <li className="flex items-start space-x-3 bg-white rounded-lg p-3 border border-blue-100">
      <span className="text-xl">{typeIcons[type]}</span>
      <div className="flex-1">
        <h4 className="text-gray-900 font-medium">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <span className="text-gray-500 text-sm whitespace-nowrap">{time}</span>
    </li>
  )
}

function InsightCard({ icon, title, description }: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="flex items-start space-x-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <h4 className="text-gray-900 font-medium">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  )
}
