interface Progress {
  completedResources: string[];
  xp: number;
  level: number;
  badges: string[];
}

interface ProgressStore {
  [userId: string]: {
    [subject: string]: Progress;
  };
}

const XP_PER_RESOURCE = {
  video: 50,
  review: 30,
  quiz: 100,
};

const LEVELS = [
  { level: 1, xpNeeded: 0 },
  { level: 2, xpNeeded: 200 },
  { level: 3, xpNeeded: 500 },
  { level: 4, xpNeeded: 1000 },
  { level: 5, xpNeeded: 2000 },
];

const SUBJECT_BADGES = {
  Mathematics: {
    NOVICE: {
      id: 'math_novice',
      name: 'Math Explorer',
      description: 'Started your journey in Mathematics',
      icon: '📐'
    },
    INTERMEDIATE: {
      id: 'math_intermediate',
      name: 'Formula Master',
      description: 'Mastering mathematical concepts',
      icon: '➗'
    },
    EXPERT: {
      id: 'math_expert',
      name: 'Math Wizard',
      description: 'Achieved excellence in Mathematics',
      icon: '🧮'
    }
  },
  Physics: {
    NOVICE: {
      id: 'physics_novice',
      name: 'Physics Pioneer',
      description: 'Started your journey in Physics',
      icon: '⚡'
    },
    INTERMEDIATE: {
      id: 'physics_intermediate',
      name: 'Force Master',
      description: 'Understanding physical phenomena',
      icon: '🔋'
    },
    EXPERT: {
      id: 'physics_expert',
      name: 'Quantum Explorer',
      description: 'Achieved excellence in Physics',
      icon: '⚛️'
    }
  },
  Chemistry: {
    NOVICE: {
      id: 'chemistry_novice',
      name: 'Chemistry Starter',
      description: 'Started your journey in Chemistry',
      icon: '🧪'
    },
    INTERMEDIATE: {
      id: 'chemistry_intermediate',
      name: 'Reaction Master',
      description: 'Understanding chemical reactions',
      icon: '⚗️'
    },
    EXPERT: {
      id: 'chemistry_expert',
      name: 'Molecular Genius',
      description: 'Achieved excellence in Chemistry',
      icon: '🔬'
    }
  },
  Biology: {
    NOVICE: {
      id: 'biology_novice',
      name: 'Biology Explorer',
      description: 'Started your journey in Biology',
      icon: '🧬'
    },
    INTERMEDIATE: {
      id: 'biology_intermediate',
      name: 'Life Master',
      description: 'Understanding living systems',
      icon: '🦠'
    },
    EXPERT: {
      id: 'biology_expert',
      name: 'Evolution Expert',
      description: 'Achieved excellence in Biology',
      icon: '🔬'
    }
  }
};

const GENERAL_BADGES = {
  FIRST_VIDEO: {
    id: 'first_video',
    name: 'Video Explorer',
    description: 'Completed your first video lesson',
    icon: '🎥'
  },
  FIRST_QUIZ: {
    id: 'first_quiz',
    name: 'Quiz Master',
    description: 'Completed your first quiz',
    icon: '✍️'
  },
  FIRST_REVIEW: {
    id: 'first_review',
    name: 'Review Champion',
    description: 'Completed your first review',
    icon: '📚'
  },
  SUBJECT_MASTER: {
    id: 'subject_master',
    name: 'Subject Master',
    description: 'Completed all resources in a subject',
    icon: '🏆'
  },
  QUICK_LEARNER: {
    id: 'quick_learner',
    name: 'Quick Learner',
    description: 'Completed 3 resources in one day',
    icon: '⚡'
  }
};

export class ProgressManager {
  private static instance: ProgressManager;
  private progress: ProgressStore = {};

  private constructor() {
    this.loadProgress();
  }

  static getInstance(): ProgressManager {
    if (!ProgressManager.instance) {
      ProgressManager.instance = new ProgressManager();
    }
    return ProgressManager.instance;
  }

  private loadProgress() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mindspace_progress');
      if (saved) {
        this.progress = JSON.parse(saved);
      }
    }
  }

  private saveProgress() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mindspace_progress', JSON.stringify(this.progress));
    }
  }

  private initializeUserSubject(userId: string, subject: string) {
    if (!this.progress[userId]) {
      this.progress[userId] = {};
    }
    if (!this.progress[userId][subject]) {
      this.progress[userId][subject] = {
        completedResources: [],
        xp: 0,
        level: 1,
        badges: []
      };
      // Award subject-specific novice badge
      if (SUBJECT_BADGES[subject as keyof typeof SUBJECT_BADGES]) {
        this.progress[userId][subject].badges.push(
          SUBJECT_BADGES[subject as keyof typeof SUBJECT_BADGES].NOVICE.id
        );
      }
      this.saveProgress();
    }
  }

  private calculateLevel(xp: number): number {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].xpNeeded) {
        return LEVELS[i].level;
      }
    }
    return 1;
  }

  private checkAndAwardBadges(userId: string, subject: string, resourceType: string) {
    const userProgress = this.progress[userId][subject];
    const completedCount = userProgress.completedResources.length;

    // Check for first-time badges
    if (resourceType === 'video' && !userProgress.badges.includes(GENERAL_BADGES.FIRST_VIDEO.id)) {
      userProgress.badges.push(GENERAL_BADGES.FIRST_VIDEO.id);
    }
    if (resourceType === 'quiz' && !userProgress.badges.includes(GENERAL_BADGES.FIRST_QUIZ.id)) {
      userProgress.badges.push(GENERAL_BADGES.FIRST_QUIZ.id);
    }
    if (resourceType === 'review' && !userProgress.badges.includes(GENERAL_BADGES.FIRST_REVIEW.id)) {
      userProgress.badges.push(GENERAL_BADGES.FIRST_REVIEW.id);
    }

    // Check for subject-specific badges
    if (SUBJECT_BADGES[subject as keyof typeof SUBJECT_BADGES]) {
      const subjectBadges = SUBJECT_BADGES[subject as keyof typeof SUBJECT_BADGES];
      if (completedCount >= 5 && !userProgress.badges.includes(subjectBadges.INTERMEDIATE.id)) {
        userProgress.badges.push(subjectBadges.INTERMEDIATE.id);
      }
      if (completedCount >= 10 && !userProgress.badges.includes(subjectBadges.EXPERT.id)) {
        userProgress.badges.push(subjectBadges.EXPERT.id);
      }
    }

    // Quick learner badge
    const todayResources = userProgress.completedResources.filter(r => {
      const completion = new Date(r.split('|')[1]);
      const today = new Date();
      return completion.toDateString() === today.toDateString();
    });
    if (todayResources.length >= 3 && !userProgress.badges.includes(GENERAL_BADGES.QUICK_LEARNER.id)) {
      userProgress.badges.push(GENERAL_BADGES.QUICK_LEARNER.id);
    }

    this.saveProgress();
  }

  markResourceCompleted(userId: string, subject: string, resourceId: string, resourceType: string) {
    this.initializeUserSubject(userId, subject);
    
    const timestamp = new Date().toISOString();
    const resourceKey = `${resourceId}|${timestamp}`;
    
    if (!this.progress[userId][subject].completedResources.includes(resourceKey)) {
      this.progress[userId][subject].completedResources.push(resourceKey);
      this.progress[userId][subject].xp += XP_PER_RESOURCE[resourceType as keyof typeof XP_PER_RESOURCE] || 0;
      this.progress[userId][subject].level = this.calculateLevel(this.progress[userId][subject].xp);
      
      this.checkAndAwardBadges(userId, subject, resourceType);
      this.saveProgress();
    }
  }

  getProgress(userId: string, subject: string): Progress {
    this.initializeUserSubject(userId, subject);
    return this.progress[userId][subject];
  }

  getCompletedResources(userId: string, subject: string): string[] {
    this.initializeUserSubject(userId, subject);
    return this.progress[userId][subject].completedResources.map(r => r.split('|')[0]);
  }

  getNextLevelXP(userId: string, subject: string): number {
    const currentXP = this.progress[userId][subject].xp;
    for (const level of LEVELS) {
      if (level.xpNeeded > currentXP) {
        return level.xpNeeded;
      }
    }
    return LEVELS[LEVELS.length - 1].xpNeeded;
  }

  getBadgeDetails(badgeId: string) {
    // Check general badges
    for (const badge of Object.values(GENERAL_BADGES)) {
      if (badge.id === badgeId) {
        return badge;
      }
    }

    // Check subject-specific badges
    for (const subject of Object.values(SUBJECT_BADGES)) {
      for (const badge of Object.values(subject)) {
        if (badge.id === badgeId) {
          return badge;
        }
      }
    }

    return null;
  }
}

export const progressManager = ProgressManager.getInstance();
