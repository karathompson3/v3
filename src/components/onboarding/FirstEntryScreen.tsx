
import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface FirstEntryScreenProps {
  onComplete?: (entry: any) => void;
}

export const FirstEntryScreen = ({ onComplete }: FirstEntryScreenProps) => {
  const [entry, setEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!entry.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate processing
    setTimeout(() => {
      const firstEntry = {
        id: Date.now().toString(),
        content: entry,
        motifs: ['Recovery Arc', 'Signal Mining'], // Default suggested motifs for first entry
        timestamp: new Date(),
        emotionalTone: 'reflective, present',
        intent: 'first reflection',
        isFirstEntry: true
      };

      onComplete?.(firstEntry);
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <div className="relative">
          <Sparkles className="w-16 h-16 mx-auto text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-white font-serif">
          Your First Entry
        </h2>
        <p className="text-lg text-blue-200">
          Let's start your memory system with a simple reflection.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-lg font-medium text-blue-200 mb-4 text-center">
            Where are you landing today?
          </h3>
          
          <Textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Take a moment to check in with yourself. What's present? What feels true? There's no wrong way to begin..."
            className="min-h-[120px] resize-none bg-white/10 border-blue-200/30 text-white placeholder:text-blue-300/70 focus:border-blue-400 focus:ring-blue-400/50"
            disabled={isSubmitting}
          />
          
          <div className="mt-4 text-xs text-blue-300/70">
            V3 will automatically identify themes and create your first memory threads.
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={!entry.trim() || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" />
                Creating your first memory...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Begin Your Journey
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
