
export interface OcclumencyResult {
  entry_id: string;
  original_text: string;
  repackaged_text: string;
  entry_type: 'repackaged';
  tags: string[];
  timestamp: Date;
}

export const containmentPhrases = [
  "All's good here",
  "Just getting settled",
  "Winding down",
  "No need to worry",
  "Just decompressing",
  "Taking space for now",
  "Settling in",
  "Staying grounded",
  "No action needed",
  "Just landing at home",
  "All good on my end"
];

export const repackageText = (text: string): string => {
  const lowercaseText = text.toLowerCase();
  
  // Detect high-intensity patterns
  const spiralPatterns = ['spiral', 'spiraling', 'overwhelm', 'chaos', 'breaking down'];
  const surveillancePatterns = ['watching', 'monitoring', 'checking on me', 'being evaluated'];
  const parentalPatterns = ['parent', 'mom', 'dad', 'family tension', 'they\'re gonna'];
  const emotionalIntensity = ['hate it', 'furious', 'rage', 'can\'t handle', 'losing it'];
  
  // Start with base containment
  let repackaged = '';
  
  // Handle spiral/overwhelm
  if (spiralPatterns.some(pattern => lowercaseText.includes(pattern))) {
    repackaged = "Settling in. Staying grounded. No action needed.";
  }
  // Handle surveillance concerns
  else if (surveillancePatterns.some(pattern => lowercaseText.includes(pattern))) {
    repackaged = "Just keeping things quiet tonight. All good on my end.";
  }
  // Handle parental tension
  else if (parentalPatterns.some(pattern => lowercaseText.includes(pattern))) {
    repackaged = "Just decompressing. Taking space for now.";
  }
  // Handle high emotional intensity
  else if (emotionalIntensity.some(pattern => lowercaseText.includes(pattern))) {
    repackaged = "Winding down for the evening. Everything's manageable.";
  }
  // Handle long/complex entries
  else if (text.length > 200) {
    repackaged = "Just processing some thoughts. All's good here.";
  }
  // Default containment
  else {
    repackaged = "Just landing at home. All's good on my end. Winding down soon.";
  }
  
  return repackaged;
};

export const detectOcclumencyTriggers = (text: string, motifs: string[]): boolean => {
  const triggerMotifs = ['Parental Tension', 'Spiral', 'Surveillance', 'Containment'];
  const hasTriggerMotif = motifs.some(motif => triggerMotifs.includes(motif));
  
  const triggerPhrases = ['occlumency check', 'being watched', 'they\'re gonna', 'spiral'];
  const hasTriggerPhrase = triggerPhrases.some(phrase => text.toLowerCase().includes(phrase));
  
  return hasTriggerMotif || hasTriggerPhrase;
};

export const createOcclumencyEntry = (originalText: string, repackagedText: string): OcclumencyResult => {
  return {
    entry_id: `occlumency_${Date.now()}`,
    original_text: originalText,
    repackaged_text: repackagedText,
    entry_type: 'repackaged',
    tags: ['Occlumency', 'Containment', 'Repackaged'],
    timestamp: new Date()
  };
};
