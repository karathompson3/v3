
export interface ProtocolTemplate {
  id: string;
  name: string;
  category: 'parental' | 'wellness' | 'work' | 'social' | 'emergency' | 'custom';
  description: string;
  template: string;
  isCustom: boolean;
  createdAt: Date;
  usageCount: number;
  tags: string[];
}

export interface ProtocolTemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: ProtocolTemplate[];
}
