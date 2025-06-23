
export interface TranslationResult {
  original_text: string;
  translated_text: string;
  tags: string[];
  timestamp: Date;
  entry_type: 'translated';
}

export const translateText = (text: string): string => {
  const lowercaseText = text.toLowerCase();
  
  // Check for high-intensity emotional language
  const intensityWords = ['insane', 'crazy', 'hate', 'furious', 'rage', 'spiral', 'overwhelming', 'everyone', 'never', 'always', 'can\'t', 'impossible'];
  const hasIntensity = intensityWords.some(word => lowercaseText.includes(word));
  
  // Apply translation heuristics
  let translated = text;
  
  // Convert blame/fury into needs or boundaries
  translated = translated.replace(/I hate when/gi, 'I need');
  translated = translated.replace(/everyone is/gi, 'I\'m experiencing');
  translated = translated.replace(/no one understands/gi, 'I need to be heard');
  translated = translated.replace(/I can't keep/gi, 'I\'m finding it difficult to');
  translated = translated.replace(/makes me feel insane/gi, 'leaves me feeling overwhelmed');
  translated = translated.replace(/makes me feel invisible/gi, 'leaves me feeling unseen');
  
  // Remove excess qualifiers
  translated = translated.replace(/I'm probably just/gi, 'I am');
  translated = translated.replace(/Maybe I'm crazy/gi, 'I\'m questioning');
  translated = translated.replace(/I guess/gi, 'I believe');
  
  // Convert absolute statements to present-tense observations
  translated = translated.replace(/always/gi, 'often');
  translated = translated.replace(/never/gi, 'rarely');
  translated = translated.replace(/can't trust anyone/gi, 'am experiencing a loss of trust');
  translated = translated.replace(/refuse to listen/gi, 'aren\'t hearing me');
  
  // Add grounding language if high intensity detected
  if (hasIntensity) {
    if (!translated.includes('I need')) {
      translated += ' I need space to recenter.';
    }
  }
  
  // Ensure it starts with a clear statement
  if (translated.startsWith('I feel like')) {
    translated = translated.replace('I feel like', 'I am experiencing');
  }
  
  return translated.trim();
};

export const createTranslationEntry = (originalText: string, translatedText: string): TranslationResult => {
  return {
    original_text: originalText,
    translated_text: translatedText,
    tags: ['Translator Mode', 'Containment'],
    timestamp: new Date(),
    entry_type: 'translated'
  };
};
