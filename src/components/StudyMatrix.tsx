'use client';

import { useState } from 'react';

interface PerformanceData {
  subject: string;
  understanding: number;
  completion: number;
  accuracy: number;
  consistency: number;
}

interface StudyMatrixProps {
  subject: string | null;
}

export default function StudyMatrix({ subject }: StudyMatrixProps) {
  // Mock performance data - in a real app, this would come from a database
  const [performanceData] = useState<PerformanceData>({
    subject: subject || 'General',
    understanding: 75,
    completion: 80,
    accuracy: 85,
    consistency: 70,
  });

  const getColorClass = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-4">Performance Matrix</h3>
      <div className="space-y-3">
        <div className="flex items-center">
          <span className="w-32 text-sm text-gray-600">Understanding</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getColorClass(performanceData.understanding)}`}
              style={{ width: `${performanceData.understanding}%` }}
            />
          </div>
          <span className="ml-2 text-sm font-medium">{performanceData.understanding}%</span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-sm text-gray-600">Task Completion</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getColorClass(performanceData.completion)}`}
              style={{ width: `${performanceData.completion}%` }}
            />
          </div>
          <span className="ml-2 text-sm font-medium">{performanceData.completion}%</span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-sm text-gray-600">Accuracy</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getColorClass(performanceData.accuracy)}`}
              style={{ width: `${performanceData.accuracy}%` }}
            />
          </div>
          <span className="ml-2 text-sm font-medium">{performanceData.accuracy}%</span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-sm text-gray-600">Consistency</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getColorClass(performanceData.consistency)}`}
              style={{ width: `${performanceData.consistency}%` }}
            />
          </div>
          <span className="ml-2 text-sm font-medium">{performanceData.consistency}%</span>
        </div>
      </div>
    </div>
  );
}
