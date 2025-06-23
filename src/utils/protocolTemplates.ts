
import { ProtocolTemplate, ProtocolTemplateCategory } from '../types/ProtocolTemplate';

export const DEFAULT_TEMPLATES: ProtocolTemplate[] = [
  // Parental Templates
  {
    id: 'parental-basic',
    name: 'Basic Check-in',
    category: 'parental',
    description: 'For routine parental check-ins',
    template: "Just settling in for the night. All good on my end. Will check in tomorrow.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['parental', 'routine', 'basic']
  },
  {
    id: 'parental-busy',
    name: 'Busy Day Response',
    category: 'parental',
    description: 'When you need space after a long day',
    template: "Had a full day today. Taking some quiet time to decompress. Everything's manageable.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['parental', 'busy', 'space']
  },
  {
    id: 'parental-studying',
    name: 'Study/Work Mode',
    category: 'parental',
    description: 'When focusing on work or studies',
    template: "Deep in study mode tonight. Making good progress. Will surface when I'm done.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['parental', 'study', 'focus']
  },

  // Wellness Templates
  {
    id: 'wellness-basic',
    name: 'Routine Wellness',
    category: 'wellness',
    description: 'For wellness check-ins',
    template: "Taking care of myself today. Sticking to my routine. Feeling grounded.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['wellness', 'routine', 'grounded']
  },
  {
    id: 'wellness-recovery',
    name: 'Recovery Mode',
    category: 'wellness',
    description: 'When you need recovery time',
    template: "In recovery mode today. Being gentle with myself. Taking it step by step.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['wellness', 'recovery', 'gentle']
  },

  // Work Templates
  {
    id: 'work-boundaries',
    name: 'Work Boundaries',
    category: 'work',
    description: 'Setting professional boundaries',
    template: "Wrapping up for today. Will be offline until tomorrow morning. Thanks for understanding.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['work', 'boundaries', 'offline']
  },
  {
    id: 'work-overwhelmed',
    name: 'Managing Workload',
    category: 'work',
    description: 'When work feels overwhelming',
    template: "Working through my priority list today. Taking breaks as needed. Making steady progress.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['work', 'overwhelmed', 'progress']
  },

  // Social Templates
  {
    id: 'social-recharge',
    name: 'Social Recharge',
    category: 'social',
    description: 'When you need social space',
    template: "Taking some solo time to recharge. Nothing personal - just need to reset. Will reach out soon.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['social', 'recharge', 'solo']
  },
  {
    id: 'social-misunderstanding',
    name: 'Clear Communication',
    category: 'social',
    description: 'When there might be misunderstandings',
    template: "Want to make sure we're on the same page. Happy to clarify anything if needed.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['social', 'clarity', 'communication']
  },

  // Emergency Templates
  {
    id: 'emergency-basic',
    name: 'Basic Containment',
    category: 'emergency',
    description: 'Quick containment for any situation',
    template: "All good here. Just processing some thoughts. Will check in later if needed.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['emergency', 'containment', 'basic']
  }
];

export const TEMPLATE_CATEGORIES: ProtocolTemplateCategory[] = [
  {
    id: 'parental',
    name: 'Parental',
    description: 'Templates for family communications',
    icon: '👨‍👩‍👧‍👦',
    templates: DEFAULT_TEMPLATES.filter(t => t.category === 'parental')
  },
  {
    id: 'wellness',
    name: 'Wellness',
    description: 'Templates for wellness check-ins',
    icon: '🌱',
    templates: DEFAULT_TEMPLATES.filter(t => t.category === 'wellness')
  },
  {
    id: 'work',
    name: 'Work',
    description: 'Templates for professional situations',
    icon: '💼',
    templates: DEFAULT_TEMPLATES.filter(t => t.category === 'work')
  },
  {
    id: 'social',
    name: 'Social',
    description: 'Templates for social interactions',
    icon: '👥',
    templates: DEFAULT_TEMPLATES.filter(t => t.category === 'social')
  },
  {
    id: 'emergency',
    name: 'Emergency',
    description: 'Quick containment templates',
    icon: '🚨',
    templates: DEFAULT_TEMPLATES.filter(t => t.category === 'emergency')
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Your personal templates',
    icon: '⭐',
    templates: []
  }
];

export const getTemplatesByCategory = (category: string, customTemplates: ProtocolTemplate[] = []): ProtocolTemplate[] => {
  if (category === 'custom') {
    return customTemplates;
  }
  return DEFAULT_TEMPLATES.filter(template => template.category === category);
};

export const searchTemplates = (query: string, allTemplates: ProtocolTemplate[]): ProtocolTemplate[] => {
  const lowercaseQuery = query.toLowerCase();
  return allTemplates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const createCustomTemplate = (
  name: string,
  description: string,
  template: string,
  tags: string[] = []
): ProtocolTemplate => {
  return {
    id: `custom-${Date.now()}`,
    name,
    category: 'custom',
    description,
    template,
    isCustom: true,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['custom', ...tags]
  };
};
