'use client';

import { useState, useEffect } from 'react';
import { getStudyRecommendations, getPersonalizedInsights, type StudyRecommendation } from '@/utils/gemini';

interface InsightCardProps {
  icon: string;
  title: string;
  description: string;
}

interface RecommendationItemProps {
  title: string;
  description: string;
  time: string;
  type: 'review' | 'quiz' | 'video';
}

export default function AIStudyCoach() {
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Mock learning data - in a real app, this would come from user's learning history
        const mockLearningData = {
          preferredTimes: ['morning', 'evening'],
          completedTopics: ['basic algebra', 'calculus'],
          quizScores: [85, 90, 75],
          focusTimes: [45, 60, 30],
        };

        const [recData, insightData] = await Promise.all([
          getStudyRecommendations('mathematics'),
          getPersonalizedInsights(mockLearningData)
        ]);

        setRecommendations(recData);
        setInsights(insightData);
      } catch (err) {
        setError('Failed to load recommendations. Please try again later.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your AI Study Coach</h2>
          <p className="text-gray-600 mb-4">Personalized recommendations based on your learning style and goals</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Refresh Plan
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Today's Study Plan</h3>
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <RecommendationItem
                key={index}
                title={rec.title}
                description={rec.description}
                time={`${rec.timeInMinutes} min`}
                type={rec.type}
              />
            ))}
          </ul>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Personalized Insights</h3>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <InsightCard
                key={index}
                icon={['📈', '🎯', '💡'][index]}
                title={['Learning Pattern', 'Focus Areas', 'Progress'][index]}
                description={insight}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecommendationItem({ title, description, time, type }: RecommendationItemProps) {
  const typeIcons = {
    review: '📚',
    quiz: '✍️',
    video: '🎥'
  };

  return (
    <li className="flex items-start space-x-3 bg-white rounded-lg p-3 border border-blue-100">
      <span className="text-xl">{typeIcons[type]}</span>
      <div className="flex-1">
        <h4 className="text-gray-900 font-medium">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <span className="text-gray-500 text-sm whitespace-nowrap">{time}</span>
    </li>
  );
}

function InsightCard({ icon, title, description }: InsightCardProps) {
  return (
    <div className="flex items-start space-x-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <h4 className="text-gray-900 font-medium">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
