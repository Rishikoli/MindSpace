'use client';

import { useState } from 'react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizProps {
  subject: string;
  questions: Question[];
  onComplete: (score: number) => void;
}

export default function Quiz({ subject, questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);

    if (optionIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
      onComplete(score);
    }
  };

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Quiz Complete!</h3>
        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-blue-600 mb-2">{percentage}%</p>
          <p className="text-gray-700">
            You got {score} out of {questions.length} questions correct
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {subject} Quiz
        </h3>
        <span className="text-sm font-medium text-gray-700">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      <div className="mb-8">
        <p className="text-lg font-medium text-gray-900 mb-4">
          {questions[currentQuestion].question}
        </p>
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showExplanation && handleAnswer(index)}
              disabled={showExplanation}
              className={`w-full text-left p-4 rounded-lg transition-colors ${
                showExplanation
                  ? index === questions[currentQuestion].correctAnswer
                    ? 'bg-green-100 border-green-500 text-gray-900'
                    : selectedAnswer === index
                    ? 'bg-red-100 border-red-500 text-gray-900'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                  : 'border border-gray-200 hover:bg-blue-50 text-gray-900'
              } ${
                selectedAnswer === index ? 'border-2 font-medium' : 'border'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className="mb-6">
          <div className={`p-4 rounded-lg ${
            selectedAnswer === questions[currentQuestion].correctAnswer
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className="text-gray-900 mb-2">
              {selectedAnswer === questions[currentQuestion].correctAnswer
                ? '✅ Correct!'
                : '❌ Incorrect'}
            </p>
            <p className="text-gray-700">
              {questions[currentQuestion].explanation}
            </p>
          </div>
        </div>
      )}

      {showExplanation && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
}
