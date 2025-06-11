
import { useState, useEffect } from 'react';

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

export const useMantra = (entries: MotifEntry[]) => {
  const [currentMantra, setCurrentMantra] = useState("Let's Get Started");

  useEffect(() => {
    if (entries.length === 0) {
      setCurrentMantra("Let's Get Started");
      return;
    }

    // Extract meaningful phrases from user's entries
    const userPhrases = entries.flatMap(entry => entry.dictionaryTerms || []);
    const motifCounts = entries.reduce((acc, entry) => {
      entry.motifs.forEach(motif => {
        acc[motif] = (acc[motif] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Find most significant user-created phrases or motifs
    const significantPhrase = userPhrases.find(phrase => 
      entries.filter(e => e.dictionaryTerms?.includes(phrase)).length >= 2
    );

    const topMotif = Object.entries(motifCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    // Recent meaningful quotes from entries
    const recentMeaningfulEntry = entries
      .slice(0, 5)
      .find(entry => entry.content.length > 20 && entry.content.length < 60);

    // Reflect back their language, not impose new language
    if (significantPhrase) {
      setCurrentMantra(`"${significantPhrase}"`);
    } else if (topMotif && motifCounts[topMotif] >= 3) {
      setCurrentMantra(`${topMotif} continues`);
    } else if (recentMeaningfulEntry) {
      // Extract a meaningful fragment
      const fragment = recentMeaningfulEntry.content.split('.')[0];
      if (fragment.length < 50) {
        setCurrentMantra(`"${fragment}"`);
      } else {
        setCurrentMantra("Building your language");
      }
    } else {
      setCurrentMantra("Your patterns are forming");
    }
  }, [entries]);

  return currentMantra;
};
