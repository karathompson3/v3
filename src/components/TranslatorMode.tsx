
import { TranslatorView } from './TranslatorView';

interface TranslatorModeProps {
  initialText?: string;
  onEntry?: (entry: any) => void;
  onClose?: () => void;
}

export const TranslatorMode = ({ initialText, onEntry, onClose }: TranslatorModeProps) => {
  const handleSaveTranslation = (originalText: string, translatedText: string) => {
    const entry = {
      id: Date.now().toString(),
      content: translatedText,
      motifs: ['Translator Mode', 'Containment'],
      timestamp: new Date(),
      emotionalTone: 'clear, grounded',
      intent: 'translation',
      metadata: {
        originalText,
        translatedText,
        entryType: 'translated',
      },
    };
    
    onEntry?.(entry);
    
    // Close translator mode after saving
    setTimeout(() => {
      onClose?.();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 z-50 overflow-y-auto">
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <TranslatorView
            initialText={initialText}
            onSave={handleSaveTranslation}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};
