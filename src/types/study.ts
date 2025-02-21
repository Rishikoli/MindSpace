export interface LearningInsight {
  type: 'strength' | 'weakness' | 'suggestion';
  title: string;
  description: string;
  score?: number;
  trend?: 'improving' | 'declining' | 'stable';
  actionItems?: string[];
}

export interface StudySession {
  date: Date;
  duration: number;
  subject: string;
  productivity: number;
  notes: string[];
  insights: string[];
}

export interface LearningPattern {
  timeOfDay: { [key: string]: number };
  subjectStrengths: { [key: string]: number };
  attentionSpan: number;
  preferredMethods: string[];
  challengeAreas: string[];
}
