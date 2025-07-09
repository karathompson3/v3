import { supabase } from '@/integrations/supabase/client';

interface MotifEntry {
  id: string;
  content: string;
  motifs: string[];
  timestamp: Date;
  emotionalTone: string;
  intent: string;
  dictionaryTerms?: string[];
  stabilityFlags?: {
    slept: boolean;
    ate: boolean;
    spikes: boolean;
    containmentUsed: boolean;
  };
  media?: {
    type: 'photo' | 'voice';
    url: string;
    duration?: number;
    caption?: string;
  };
}

export const analyzeWithO3 = async (
  content: string, 
  analysisType: 'motif_detection' | 'weekly_recap' | 'thread_analysis',
  previousEntries?: MotifEntry[]
) => {
  try {
    const { data, error } = await supabase.functions.invoke('pattern-analysis', {
      body: {
        content,
        analysisType,
        previousEntries: previousEntries?.slice(0, 10) // Limit context for performance
      }
    });

    if (error) {
      console.error('Pattern analysis error:', error);
      return null;
    }

    return data.analysis;
  } catch (error) {
    console.error('Error calling pattern analysis:', error);
    return null;
  }
};

export const enhancedMotifDetection = async (content: string, previousEntries: MotifEntry[]) => {
  const analysis = await analyzeWithO3(content, 'motif_detection', previousEntries);
  
  if (!analysis) {
    // Fallback to simple detection
    return {
      motifs: ['Personal Reflection'],
      emotionalTone: 'reflective',
      intent: 'self-exploration',
      dictionaryTerms: [],
      stabilityFlags: { slept: false, ate: false, spikes: false, containmentUsed: false }
    };
  }

  return analysis;
};

export const generateWeeklyRecap = async (entries: MotifEntry[]) => {
  return await analyzeWithO3('', 'weekly_recap', entries);
};

export const analyzeThreadConnections = async (entries: MotifEntry[]) => {
  return await analyzeWithO3('', 'thread_analysis', entries);
};