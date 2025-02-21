'use client';

import { useState, useEffect } from 'react';
import { getStudyRecommendations, getPersonalizedInsights } from '@/utils/gemini';

interface LearningInsight {
  type: 'strength' | 'weakness' | 'suggestion';
  title: string;
  description: string;
  score?: number;
  trend?: 'improving' | 'declining' | 'stable';
  actionItems?: string[];
}

interface StudySession {
  date: Date;
  duration: number;
  subject: string;
  productivity: number;
  notes: string[];
  insights: string[];
}

interface LearningPattern {
  timeOfDay: { [key: string]: number };
  subjectStrengths: { [key: string]: number };
  attentionSpan: number;
  preferredMethods: string[];
  challengeAreas: string[];
}

export default function AIStudyCoach() {
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('study_sessions');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [learningPattern, setLearningPattern] = useState<LearningPattern>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('learning_pattern');
      return saved ? JSON.parse(saved) : {
        timeOfDay: {},
        subjectStrengths: {},
        attentionSpan: 0,
        preferredMethods: [],
        challengeAreas: []
      };
    }
    return {
      timeOfDay: {},
      subjectStrengths: {},
      attentionSpan: 0,
      preferredMethods: [],
      challengeAreas: []
    };
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyzeStudyPatterns = async () => {
      try {
        // Simulate AI analysis of study patterns
        const newInsights: LearningInsight[] = [
          {
            type: 'strength',
            title: 'Peak Performance Time',
            description: 'You show highest productivity during morning hours (9-11 AM)',
            score: 85,
            trend: 'improving',
            actionItems: [
              'Schedule complex tasks during morning hours',
              'Use this time for challenging subjects'
            ]
          },
          {
            type: 'weakness',
            title: 'Mathematics Engagement',
            description: 'Lower engagement levels in mathematical problem-solving',
            score: 65,
            trend: 'stable',
            actionItems: [
              'Try interactive math visualization tools',
              'Break down complex problems into smaller steps'
            ]
          },
          {
            type: 'suggestion',
            title: 'Learning Method Enhancement',
            description: 'Based on your pattern, visual learning tools could boost retention',
            actionItems: [
              'Incorporate mind maps for complex topics',
              'Use video tutorials for new concepts'
            ]
          }
        ];
        setInsights(newInsights);
        setLoading(false);
      } catch (error) {
        console.error('Error analyzing study patterns:', error);
        setLoading(false);
      }
    };

    analyzeStudyPatterns();
  }, [sessions]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return '💪';
      case 'weakness': return '🎯';
      case 'suggestion': return '💡';
      default: return '📝';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      default: return '';
    }
  };

  const getProgressColor = (score?: number) => {
    if (!score) return 'bg-blue-600';
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">AI Learning Analysis</h2>
          <p className="text-gray-600">Deep insights into your learning patterns and suggestions for improvement</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Smart Progress Analysis */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Pattern Analysis</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {insights.map((insight, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getInsightIcon(insight.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                        {insight.trend && (
                          <span className="text-sm">{getTrendIcon(insight.trend)}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                      {insight.score !== undefined && (
                        <div className="mb-3">
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div 
                              className={`h-2 ${getProgressColor(insight.score)} rounded-full transition-all`}
                              style={{ width: `${insight.score}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-500 mt-1">
                            Proficiency: {insight.score}%
                          </span>
                        </div>
                      )}
                      {insight.actionItems && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-700">Suggested Actions:</p>
                          {insight.actionItems.map((item, i) => (
                            <p key={i} className="text-xs text-gray-600 flex items-center gap-1">
                              <span className="text-blue-600">•</span> {item}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Performance Matrix */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance Matrix</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(learningPattern.subjectStrengths).map(([subject, strength]) => (
                <div key={subject} className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-2">{subject}</h4>
                  <div className="h-2 bg-gray-200 rounded-full mb-2">
                    <div 
                      className={`h-2 ${getProgressColor(strength)} rounded-full transition-all`}
                      style={{ width: `${strength}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    Mastery: {strength}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Study Suggestions */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <span className="mr-2">🤖</span>
              AI-Powered Study Suggestions
            </h3>
            <div className="grid gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Optimal Study Schedule</h4>
                <div className="space-y-2">
                  {Object.entries(learningPattern.timeOfDay).map(([time, effectiveness]) => (
                    <div key={time} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-24">{time}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-600 rounded-full transition-all"
                          style={{ width: `${effectiveness}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-500 w-16">
                        {effectiveness}% effective
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Learning Method Preferences</h4>
                <div className="flex flex-wrap gap-2">
                  {learningPattern.preferredMethods.map((method, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
                <div className="space-y-2">
                  {learningPattern.challengeAreas.map((area, index) => (
                    <p key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-red-500">•</span> {area}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
