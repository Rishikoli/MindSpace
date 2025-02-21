'use client';

import { useState, useEffect } from 'react';
import { getStudyRecommendations } from '@/utils/gemini';
import Quiz from '@/components/Quiz';
import CustomStudyPlan from '@/components/CustomStudyPlan';
import StudyAIChat from '@/components/StudyAIChat';

interface Subject {
  name: string;
  icon: string;
  description: string;
}

interface StudyResource {
  title: string;
  description: string;
  type: 'review' | 'quiz' | 'video';
  link?: string;
}

interface Discussion {
  id: string;
  user: string;
  subject: string;
  title: string;
  message: string;
  timestamp: Date;
  replies: number;
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

// Sample study resources
const sampleResources: Record<string, StudyResource[]> = {
  'Mathematics': [
    {
      title: 'Calculus Fundamentals Review',
      description: 'Comprehensive review of limits, derivatives, and integrals',
      type: 'review'
    },
    {
      title: 'Khan Academy: Differential Equations',
      description: 'Video series on solving differential equations',
      type: 'video',
      link: 'https://www.khanacademy.org/math/differential-equations'
    },
    {
      title: 'Integration Techniques Quiz',
      description: 'Test your knowledge of various integration methods',
      type: 'quiz'
    }
  ],
  'Physics': [
    {
      title: 'Classical Mechanics Review',
      description: 'Review of Newton\'s laws and their applications',
      type: 'review'
    },
    {
      title: 'MIT OpenCourseWare: Electricity & Magnetism',
      description: 'Full lecture series on electromagnetic theory',
      type: 'video',
      link: 'https://ocw.mit.edu/courses/physics/8-02-physics-ii-electricity-and-magnetism-spring-2019/'
    },
    {
      title: 'Wave Mechanics Quiz',
      description: 'Practice problems on wave properties and interference',
      type: 'quiz'
    }
  ],
  'Chemistry': [
    {
      title: 'Organic Chemistry Mechanisms',
      description: 'Review of common organic chemistry reaction mechanisms',
      type: 'review'
    },
    {
      title: 'Chemistry LibreTexts: Chemical Bonding',
      description: 'Video tutorials on chemical bonding and molecular structure',
      type: 'video',
      link: 'https://chem.libretexts.org/Courses/University_of_Kentucky/UK%3A_CHE_103_-_Chemistry_for_Allied_Health_(Soult)/Chapters/Chapter_3%3A_Chemical_Bonding'
    },
    {
      title: 'Periodic Trends Quiz',
      description: 'Test your understanding of periodic table trends',
      type: 'quiz'
    }
  ],
  'Biology': [
    {
      title: 'Cell Biology Review',
      description: 'Comprehensive review of cell structure and function',
      type: 'review'
    },
    {
      title: 'Crash Course: Genetics',
      description: 'Video series covering genetics and inheritance',
      type: 'video',
      link: 'https://www.youtube.com/watch?v=CBezq1fFUEA'
    },
    {
      title: 'Evolution and Natural Selection Quiz',
      description: 'Practice questions on evolutionary biology',
      type: 'quiz'
    }
  ]
};

// Mock discussions data
const mockDiscussions: Discussion[] = [
  {
    id: '1',
    user: 'Sarah',
    subject: 'Mathematics',
    title: 'Need help with Calculus Integration',
    message: 'I\'m struggling with integration by parts. Can someone explain when to use it?',
    timestamp: new Date(),
    replies: 3
  },
  {
    id: '2',
    user: 'Alex',
    subject: 'Physics',
    title: 'Question about Wave Mechanics',
    message: 'How do we determine the phase difference between two waves?',
    timestamp: new Date(),
    replies: 5
  }
];

const XP_PER_RESOURCE = {
  review: 10,
  quiz: 20,
  video: 30
};

const progressManager = {
  getProgress: (userName: string, subject: string) => {
    // Simulate getting progress from database or API
    return {
      xp: 100,
      level: 2,
      badges: ['badge1', 'badge2']
    };
  },
  markResourceCompleted: (userName: string, subject: string, resourceId: string, type: string) => {
    // Simulate marking resource as completed in database or API
  },
  getCompletedResources: (userName: string, subject: string) => {
    // Simulate getting completed resources from database or API
    return ['resource1', 'resource2'];
  },
  getNextLevelXP: (userName: string, subject: string) => {
    // Simulate getting next level XP from database or API
    return 200;
  },
  getBadgeDetails: (badgeId: string) => {
    // Simulate getting badge details from database or API
    return {
      icon: '🏆',
      name: 'Badge Name',
      description: 'Badge description'
    };
  }
};

const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
];

const SAMPLE_QUESTIONS = {
  'Mathematics': [
    {
      id: 'math1',
      question: 'What is the value of π (pi) to two decimal places?',
      options: ['3.14', '3.16', '3.12', '3.18'],
      correctAnswer: 0,
      explanation: 'π is approximately equal to 3.14159..., so rounded to two decimal places it is 3.14.'
    },
    {
      id: 'math2',
      question: 'What is the square root of 144?',
      options: ['10', '12', '14', '16'],
      correctAnswer: 1,
      explanation: '12 × 12 = 144, therefore the square root of 144 is 12.'
    }
  ],
  'Physics': [
    {
      id: 'phys1',
      question: 'What is the SI unit of force?',
      options: ['Watt', 'Newton', 'Joule', 'Pascal'],
      correctAnswer: 1,
      explanation: 'The Newton (N) is the SI unit of force, named after Sir Isaac Newton.'
    }
  ]
  // Add more subjects and questions as needed
};

export default function StudyPlans() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [discussions, setDiscussions] = useState<Discussion[]>(mockDiscussions);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', message: '' });
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [xp, setXp] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('mindspace_xp') || '0');
    }
    return 0;
  });

  useEffect(() => {
    const savedName = localStorage.getItem('mindspace_user_name');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  useEffect(() => {
    if (selectedSubject && userName) {
      const userProgress = progressManager.getProgress(userName, selectedSubject);
      setProgress(userProgress);
    }
  }, [selectedSubject, userName]);

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleResourceComplete = (resourceId: string, type: string) => {
    if (userName && selectedSubject) {
      progressManager.markResourceCompleted(userName, selectedSubject, resourceId, type);
      const updatedProgress = progressManager.getProgress(userName, selectedSubject);
      setProgress(updatedProgress);
    }
  };

  const calculateProgress = (subject: string): number => {
    if (!userName) return 0;
    const completed = progressManager.getCompletedResources(userName, subject);
    const total = sampleResources[subject].length;
    return Math.round((completed.length / total) * 100);
  };

  const isResourceCompleted = (resourceId: string): boolean => {
    if (!userName || !selectedSubject) return false;
    const completed = progressManager.getCompletedResources(userName, selectedSubject);
    return completed.includes(resourceId);
  };

  const renderProgressBar = () => {
    if (!progress) return null;

    const nextLevelXP = progressManager.getNextLevelXP(userName, selectedSubject!);
    const progressPercent = (progress.xp / nextLevelXP) * 100;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Your Progress</h3>
            <p className="text-gray-700">Level {progress.level}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600 font-medium">{progress.xp} XP</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{nextLevelXP} XP</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-500 rounded-full h-2 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        {progress.badges.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Earned Badges</h4>
            <div className="flex flex-wrap gap-2">
              {progress.badges.map((badgeId: string) => {
                const badge = progressManager.getBadgeDetails(badgeId);
                return badge ? (
                  <div
                    key={badgeId}
                    className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                    title={badge.description}
                  >
                    <span className="mr-1">{badge.icon}</span>
                    <span className="text-sm text-gray-800">{badge.name}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'review':
        return '📚';
      case 'quiz':
        return '✍️';
      case 'video':
        return '🎥';
      default:
        return '📄';
    }
  };

  const handleQuizComplete = (score: number) => {
    const earnedXP = score * 20; // 20 XP per correct answer
    const newXP = xp + earnedXP;
    setXp(newXP);
    localStorage.setItem('mindspace_xp', newXP.toString());
    setShowQuiz(false);
  };

  const handleResourceClick = (type: string) => {
    let earnedXP = 0;
    switch (type) {
      case 'video':
        earnedXP = 30;
        break;
      case 'review':
        earnedXP = 10;
        break;
    }
    const newXP = xp + earnedXP;
    setXp(newXP);
    localStorage.setItem('mindspace_xp', newXP.toString());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Study Plans
        </h1>
        <p className="text-gray-700 mb-8">Select a subject to access study materials and join discussions</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {subjects.map((subject) => (
            <button
              key={subject.name}
              onClick={() => handleSubjectSelect(subject.name)}
              className={`p-6 rounded-lg shadow-md text-left transition-all ${
                selectedSubject === subject.name
                  ? 'bg-blue-50 border-2 border-blue-600 shadow-lg'
                  : 'bg-white hover:bg-gray-50 hover:shadow-lg'
              }`}
            >
              <div className="text-4xl mb-4">{subject.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{subject.name}</h3>
              <p className="text-gray-700 mb-4">{subject.description}</p>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className="bg-green-500 rounded-full h-1 transition-all duration-500"
                  style={{ width: `${calculateProgress(subject.name)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {calculateProgress(subject.name)}% Complete
              </p>
            </button>
          ))}
        </div>

        {selectedSubject && !showQuiz && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Left Column: Study Resources */}
              <div className="lg:col-span-2 space-y-6">
                {renderProgressBar()}
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                    Study Resources for {selectedSubject}
                  </h2>
                  
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {sampleResources[selectedSubject].map((resource, index) => {
                        const resourceId = `${selectedSubject}-${resource.type}-${index}`;
                        const completed = isResourceCompleted(resourceId);
                        
                        return (
                          <div
                            key={index}
                            className={`border rounded-lg p-6 transition-colors ${
                              completed ? 'bg-green-50 border-green-200' : 'hover:bg-blue-50'
                            }`}
                          >
                            <div className="flex items-start space-x-4">
                              <span className="text-2xl">{getResourceIcon(resource.type)}</span>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-xl font-semibold text-gray-900">
                                    {resource.title}
                                  </h3>
                                  {completed && (
                                    <span className="text-green-600">✓</span>
                                  )}
                                </div>
                                <p className="text-gray-700 mb-4">{resource.description}</p>
                                {resource.link ? (
                                  <a
                                    href={resource.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                                    onClick={() => handleResourceComplete(resourceId, resource.type)}
                                  >
                                    {completed ? 'Review Again' : 'Start Learning'} →
                                  </a>
                                ) : (
                                  <button
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    onClick={() => handleResourceComplete(resourceId, resource.type)}
                                  >
                                    {completed ? 'Review Again' : `Start ${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}`} →
                                  </button>
                                )}
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                </span>
                                {!completed && (
                                  <span className="text-yellow-600 text-sm font-medium">
                                    +{XP_PER_RESOURCE[resource.type as keyof typeof XP_PER_RESOURCE]} XP
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Discussion Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Study Group Discussions
                    </h2>
                    <button
                      onClick={() => setShowDiscussionForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start Discussion
                    </button>
                  </div>

                  {showDiscussionForm && (
                    <div className="mb-8 bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4 text-gray-900">New Discussion</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={newDiscussion.title}
                            onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                            className="w-full p-2 border rounded-lg text-gray-900"
                            placeholder="What would you like to discuss?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message
                          </label>
                          <textarea
                            value={newDiscussion.message}
                            onChange={(e) => setNewDiscussion({ ...newDiscussion, message: e.target.value })}
                            className="w-full p-2 border rounded-lg text-gray-900 h-32"
                            placeholder="Describe your question or topic..."
                          />
                        </div>
                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() => setShowDiscussionForm(false)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              if (!selectedSubject || !newDiscussion.title || !newDiscussion.message) return;

                              const discussion: Discussion = {
                                id: Date.now().toString(),
                                user: userName || 'Anonymous',
                                subject: selectedSubject,
                                title: newDiscussion.title,
                                message: newDiscussion.message,
                                timestamp: new Date(),
                                replies: 0
                              };

                              setDiscussions([discussion, ...discussions]);
                              setNewDiscussion({ title: '', message: '' });
                              setShowDiscussionForm(false);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            disabled={!newDiscussion.title || !newDiscussion.message}
                          >
                            Post Discussion
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    {discussions
                      .filter(d => d.subject === selectedSubject)
                      .map((discussion) => (
                        <div
                          key={discussion.id}
                          className="border rounded-lg p-6 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                                {discussion.title}
                              </h3>
                              <p className="text-gray-700 mb-4">{discussion.message}</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {discussion.replies} replies
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{discussion.user}</span>
                              <span>•</span>
                              <span>{discussion.timestamp.toLocaleDateString()}</span>
                            </div>
                            <button className="text-blue-600 hover:text-blue-800 font-medium">
                              Join Discussion →
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Custom Study Plan and Quiz */}
              <div className="space-y-6">
                <CustomStudyPlan subject={selectedSubject} />
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Test Your Knowledge</h3>
                  <p className="text-gray-700 mb-4">
                    Take a quiz to test your understanding of {selectedSubject} concepts and earn XP!
                  </p>
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {showQuiz && (
          <div>
            <button
              onClick={() => setShowQuiz(false)}
              className="mb-6 text-blue-600 hover:text-blue-800"
            >
              ← Back to Resources
            </button>
            <Quiz
              subject={selectedSubject}
              questions={SAMPLE_QUESTIONS[selectedSubject as keyof typeof SAMPLE_QUESTIONS] || []}
              onComplete={handleQuizComplete}
            />
          </div>
        )}

        <StudyAIChat subject={selectedSubject} />
      </div>
    </div>
  );
}
