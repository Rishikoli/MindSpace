'use client';

import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSubjectBadge } from '@/utils/subjectBadges';
import StudyMatrix from './StudyMatrix';

interface StudyAIChatProps {
  subject: string | null;
}

interface Message {
  text: string;
  isUser: boolean;
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export default function StudyAIChat({ subject }: StudyAIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: subject 
        ? `Hi! I'm your AI Coach for ${subject}. How can I help you learn today?` 
        : "Hi! I'm your AI Coach. How can I help you learn today?",
      isUser: false 
    }
  ]);

  const subjectBadge = getSubjectBadge(subject);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Create chat context
      const chat = model.startChat({
        history: messages.slice(0, -1).map(msg => ({
          role: msg.isUser ? "user" : "model",
          parts: [{ text: msg.text }],
        })),
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });

      // Get response
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return "I apologize, but I'm having trouble processing your request right now. Could you please try again?";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);
    
    // Add user message
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);

    try {
      // Get AI response
      const aiResponse = await getAIResponse(userMessage);
      setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [...prev, { 
        text: "I apologize, but I'm having trouble responding right now. Could you please try again?", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 flex items-center gap-2 ${subjectBadge.bgColor} text-gray-900 px-4 py-3 rounded-full shadow-lg hover:opacity-90 transition-all z-50`}
      >
        <span className="text-2xl">{subjectBadge.icon}</span>
        <span className={`font-medium ${subjectBadge.color}`}>
          {subject || 'Study Assistant'}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl z-50">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{subjectBadge.icon}</span>
            <h3 className={`font-medium ${subjectBadge.color}`}>
              {subject || 'Study Assistant'}
            </h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <StudyMatrix subject={subject} />
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-900">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
