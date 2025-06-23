
import { ProtocolTemplate, ProtocolTemplateCategory } from '../types/ProtocolTemplate';

export const DEFAULT_TEMPLATES: ProtocolTemplate[] = [
  // Command Protocol Templates
  {
    id: 'cmd-occlumency-check',
    name: 'Occlumency Check Command',
    category: 'emergency',
    description: 'Triggers the containment protocol interface',
    template: "occlumency check",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['command', 'occlumency', 'containment']
  },
  {
    id: 'cmd-translator-mode',
    name: 'Translator Mode Command',
    category: 'emergency',
    description: 'Activates the translation protocol interface',
    template: "initiate translator mode",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['command', 'translator', 'communication']
  },
  {
    id: 'cmd-emergency-id',
    name: 'Emergency ID Command',
    category: 'emergency',
    description: 'Displays your personal emergency protocol',
    template: "display personal id",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['command', 'emergency', 'identity']
  },

  // Occlumency Protocol Definitions
  {
    id: 'protocol-basic-containment',
    name: 'Basic Containment Protocol',
    category: 'wellness',
    description: 'Standard response for overwhelming situations',
    template: "Taking some time to process things. Everything is manageable. Will check in when ready.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['occlumency', 'containment', 'basic']
  },
  {
    id: 'protocol-spiral-containment',
    name: 'Spiral Containment Protocol',
    category: 'wellness',
    description: 'For intense emotional spiraling episodes',
    template: "Working through some thoughts right now. Taking it step by step. All is stable on my end.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['occlumency', 'spiral', 'intense']
  },
  {
    id: 'protocol-parental-deflection',
    name: 'Parental Deflection Protocol',
    category: 'parental',
    description: 'When family dynamics become overwhelming',
    template: "Family stuff is all normal. Just working through some routine things. Nothing to worry about.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['occlumency', 'parental', 'deflection']
  },

  // Recovery Arc Definitions
  {
    id: 'protocol-recovery-check',
    name: 'Recovery Arc Check-in',
    category: 'wellness',
    description: 'Progress tracking for recovery journey',
    template: "Making steady progress today. Staying connected to my process. Growth feels sustainable.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['recovery', 'progress', 'growth']
  },
  {
    id: 'protocol-stability-signal',
    name: 'Stability Signal Protocol',
    category: 'wellness',
    description: 'When you need to signal stability to yourself or others',
    template: "Anchored and present. Routine is holding steady. Systems are working well.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['stability', 'routine', 'grounded']
  },

  // Signal Mining Definitions  
  {
    id: 'protocol-pattern-recognition',
    name: 'Pattern Recognition Protocol',
    category: 'work',
    description: 'For identifying meaningful patterns in experiences',
    template: "Noticing patterns in [situation]. Signal emerging around [theme]. Worth tracking this thread.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['signal-mining', 'patterns', 'awareness']
  },
  {
    id: 'protocol-butterfly-thread',
    name: 'Butterfly Thread Protocol',
    category: 'work',
    description: 'Following delicate but significant connections',
    template: "Light touch tracking on [theme]. Thread feels fragile but real. Following without forcing.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['butterfly-thread', 'delicate', 'following']
  },

  // Social Protocol Definitions
  {
    id: 'protocol-ghost-mode',
    name: 'Ghost Mode Protocol',
    category: 'social',
    description: 'When you need to be present but invisible',
    template: "Moving in observer mode today. Present but not engaging. Maintaining gentle distance.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['ghost-mode', 'observer', 'distance']
  },
  {
    id: 'protocol-cloudperson',
    name: 'Cloudperson Protocol',
    category: 'social',
    description: 'For dissociative or floating states',
    template: "Floating a bit above the situation today. Maintaining perspective from distance. Still connected to ground.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['cloudperson', 'dissociation', 'perspective']
  },

  // Phoenix Logic Definitions
  {
    id: 'protocol-phoenix-reset',
    name: 'Phoenix Logic Reset',
    category: 'wellness',
    description: 'For major life transitions and renewals',
    template: "In a renewal phase. Old patterns burning away clean. New structure emerging from foundation up.",
    isCustom: false,
    createdAt: new Date(),
    usageCount: 0,
    tags: ['phoenix-logic', 'renewal', 'transformation']
  }
];

export const TEMPLATE_CATEGORIES: ProtocolTemplateCategory[] = [
  {
    id: 'emergency',
    name: 'Commands',
    description: 'System commands and emergency protocols',
    icon: '⚡',
    templates: DEFAULT_TEMPLATES.filter(t => t.category === 'emergency')
  },
  {
    id: 'wellness',
    name: 'Wellness',
    description: 'Mental health and stability protocols',
    icon: '🌱',
    templates: DEFAULT_TEMPLATES.filter(t => t.category === 'wellness')
  },
  {
    id: 'parental',
    name: 'Parental',
    description: 'Family communication protocols',
    icon: '👨‍👩‍👧‍👦',
    templates: DEFAULT_TEMPLATES.filter(t => t.category === 'parental')
  },
  {
    id: 'work',
    name: 'Processing',
    description: 'Cognitive and analytical protocols',
    icon: '🧠',
    templates: DEFAULT_TEMPLATES.filter(t => t.category === 'work')
  },
  {
    id: 'social',
    name: 'Social',
    description: 'Interpersonal navigation protocols',
    icon: '👥',
    templates: DEFAULT_TEMPLATES.filter(t => t.category === 'social')
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Your personal protocol definitions',
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
