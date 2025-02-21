'use client';

import { useState, useEffect } from 'react';
import { getStudyRecommendations } from '@/utils/gemini';

interface Subject {
  name: string;
  icon: string;
  description: string;
}

const subjects: Subject[] = [
  {
    name: 'Mathematics',
    icon: '📐',
    description: 'Algebra, Calculus, and Geometry'
  },
  {
    name: 'Physics',
    icon: '⚡',
    description: 'Mechanics, Electricity, and Waves'
  },
  {
    name: 'Chemistry',
    icon: '🧪',
    description: 'Organic, Inorganic, and Physical Chemistry'
  },
  {
    name: 'Biology',
    icon: '🧬',
    description: 'Genetics, Ecology, and Human Biology'
  }
];

export default function StudyPlans() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('mindspace_user_name');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleSubjectSelect = async (subject: string) => {
    setSelectedSubject(subject);
    setLoading(true);
    try {
      const recs = await getStudyRecommendations(subject);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          {userName ? `${userName}'s` : 'Your'} Study Plans
        </h1>
        <p className="text-gray-600 mb-8">Select a subject to get personalized study recommendations</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {subjects.map((subject) => (
            <button
              key={subject.name}
              onClick={() => handleSubjectSelect(subject.name)}
              className={`p-6 rounded-lg shadow-md text-left transition-all ${
                selectedSubject === subject.name
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="text-4xl mb-4">{subject.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
              <p className="text-gray-600">{subject.description}</p>
            </button>
          ))}
        </div>

        {selectedSubject && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Recommended Study Plan for {selectedSubject}
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{rec.title}</h3>
                        <p className="text-gray-600 mb-4">{rec.description}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {rec.timeInMinutes} min
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Type: {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Start Now →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
