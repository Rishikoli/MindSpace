import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export interface StudyRecommendation {
  title: string;
  description: string;
  timeInMinutes: number;
  type: 'review' | 'quiz' | 'video';
}

const fallbackRecommendations: StudyRecommendation[] = [
  {
    title: "Review Core Concepts",
    description: "Go through the fundamental principles and key theories",
    timeInMinutes: 45,
    type: "review"
  },
  {
    title: "Practice Assessment",
    description: "Test your understanding with interactive questions",
    timeInMinutes: 30,
    type: "quiz"
  },
  {
    title: "Watch Tutorial",
    description: "Visual explanation of advanced topics",
    timeInMinutes: 25,
    type: "video"
  }
];

const fallbackInsights = [
  "Based on your activity patterns, you show better focus during morning sessions. Consider scheduling challenging topics between 9-11 AM.",
  "Your quiz performance indicates strong theoretical understanding. Recommended to increase practical exercises for better application.",
  "Recent progress shows consistent improvement in problem-solving speed. Keep maintaining regular practice sessions."
];

function sanitizeJsonString(str: string): string {
  // Remove any potential markdown formatting or extra characters
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  }
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

export async function getStudyRecommendations(topic: string): Promise<StudyRecommendation[]> {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    console.warn('Gemini API key not found. Using fallback data.');
    return fallbackRecommendations;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Generate a study plan for ${topic} with exactly 3 activities.
    Return ONLY a JSON array with this exact format, no additional text or formatting:
    [
      {
        "title": "activity title",
        "description": "brief description",
        "timeInMinutes": number,
        "type": "review" or "quiz" or "video"
      }
    ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = sanitizeJsonString(response.text());
    
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Validate each recommendation
        const validRecommendations = parsed.filter(rec => 
          rec.title && 
          rec.description && 
          typeof rec.timeInMinutes === 'number' &&
          ['review', 'quiz', 'video'].includes(rec.type)
        );
        
        if (validRecommendations.length > 0) {
          return validRecommendations;
        }
      }
      console.warn('Invalid API response format. Using fallback data.');
      return fallbackRecommendations;
    } catch (parseError) {
      console.error('Error parsing API response:', parseError);
      return fallbackRecommendations;
    }
  } catch (error) {
    console.error('Error generating study recommendations:', error);
    return fallbackRecommendations;
  }
}

export async function getPersonalizedInsights(learningData: any): Promise<string[]> {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    console.warn('Gemini API key not found. Using fallback data.');
    return fallbackInsights;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Based on the learning data, generate exactly 3 learning insights.
    Return ONLY a JSON array of 3 strings, no additional text or formatting:
    [
      "First insight about study patterns",
      "Second insight about learning progress",
      "Third insight about improvement areas"
    ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = sanitizeJsonString(response.text());
    
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length === 3 && parsed.every(item => typeof item === 'string')) {
        return parsed;
      }
      console.warn('Invalid API response format. Using fallback data.');
      return fallbackInsights;
    } catch (parseError) {
      console.error('Error parsing API response:', parseError, '\nText was:', text);
      return fallbackInsights;
    }
  } catch (error) {
    console.error('Error generating insights:', error);
    return fallbackInsights;
  }
}
