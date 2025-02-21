interface SubjectBadge {
  color: string;
  icon: string;
  bgColor: string;
}

const subjectBadges: Record<string, SubjectBadge> = {
  Mathematics: {
    color: 'text-blue-700',
    icon: '📐',
    bgColor: 'bg-blue-100'
  },
  Physics: {
    color: 'text-purple-700',
    icon: '⚡',
    bgColor: 'bg-purple-100'
  },
  Chemistry: {
    color: 'text-green-700',
    icon: '🧪',
    bgColor: 'bg-green-100'
  },
  Biology: {
    color: 'text-red-700',
    icon: '🧬',
    bgColor: 'bg-red-100'
  },
  History: {
    color: 'text-amber-700',
    icon: '📜',
    bgColor: 'bg-amber-100'
  },
  Geography: {
    color: 'text-emerald-700',
    icon: '🌍',
    bgColor: 'bg-emerald-100'
  },
  Literature: {
    color: 'text-pink-700',
    icon: '📚',
    bgColor: 'bg-pink-100'
  },
  ComputerScience: {
    color: 'text-cyan-700',
    icon: '💻',
    bgColor: 'bg-cyan-100'
  }
};

export const getSubjectBadge = (subject: string | null): SubjectBadge => {
  if (!subject) {
    return {
      color: 'text-gray-700',
      icon: '📚',
      bgColor: 'bg-gray-100'
    };
  }

  // Try to find an exact match
  if (subject in subjectBadges) {
    return subjectBadges[subject];
  }

  // Try to find a partial match
  const subjectKey = Object.keys(subjectBadges).find(key => 
    subject.toLowerCase().includes(key.toLowerCase())
  );

  if (subjectKey) {
    return subjectBadges[subjectKey];
  }

  // Return default badge if no match found
  return {
    color: 'text-gray-700',
    icon: '📚',
    bgColor: 'bg-gray-100'
  };
};
