
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, Tag, Clock, Shield, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MotifEntry {
  id: string;
  content: string;
  motifs: string[];
  timestamp: Date;
  emotionalTone: string;
  intent: string;
  dictionaryTerms?: string[];
}

interface JournalEntryProps {
  onEntrySubmit: (entry: MotifEntry) => void;
  currentEntry: string;
  setCurrentEntry: (entry: string) => void;
  existingEntries: MotifEntry[];
}

const suggestedMotifs = [
  'Signal Mining', 'Cloudperson', 'Phoenix Logic', 'Butterfly Thread',
  'Occlumency', 'Recovery Arc', 'Stability Signal', 'Wind-Down',
  'Narrator/Recovery', 'Parental Tension', 'Containment', 'Ghost Mode'
];

const placeholderPrompts = [
  "What's holding you right now?",
  "What's echoing from earlier?", 
  "What feels true tonight?",
  "Where are you landing today?",
  "Let me show you how to talk to yourself, through me...",
  "What helped you stay steady today?",
  "What's asking for attention?"
];

export const JournalEntry = ({ onEntrySubmit, currentEntry, setCurrentEntry, existingEntries }: JournalEntryProps) => {
  const [selectedMotifs, setSelectedMotifs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOcclumency, setShowOcclumency] = useState(false);
  const [occlumencyOutput, setOcclumencyOutput] = useState('');
  const [suggestedReplay, setSuggestedReplay] = useState<MotifEntry | null>(null);
  const { toast } = useToast();

  const currentPlaceholder = placeholderPrompts[Math.floor(Math.random() * placeholderPrompts.length)];

  const analyzeEmotionalTone = (text: string): string => {
    if (text.toLowerCase().includes('spiral') || text.toLowerCase().includes('chaos')) return 'intense, seeking stability';
    if (text.toLowerCase().includes('calm') || text.toLowerCase().includes('steady')) return 'grounded, clear';
    if (text.toLowerCase().includes('tired') || text.toLowerCase().includes('heavy')) return 'weary but aware';
    if (text.toLowerCase().includes('proud') || text.toLowerCase().includes('growth')) return 'quiet confidence';
    return 'reflective, present';
  };

  const detectDictionaryTerms = (text: string): string[] => {
    const terms = ['occlumency', 'ghost mode', 'phoenix logic', 'signal mining', 'butterfly thread', 'containment'];
    return terms.filter(term => text.toLowerCase().includes(term));
  };

  const suggestMotifs = (text: string): string[] => {
    const suggestions: string[] = [];
    
    if (text.toLowerCase().includes('parent') || text.toLowerCase().includes('mom') || text.toLowerCase().includes('dad')) {
      suggestions.push('Parental Tension');
    }
    if (text.toLowerCase().includes('recover') || text.toLowerCase().includes('healing') || text.toLowerCase().includes('progress')) {
      suggestions.push('Recovery Arc', 'Narrator/Recovery');
    }
    if (text.toLowerCase().includes('contain') || text.toLowerCase().includes('regulate') || text.toLowerCase().includes('careful')) {
      suggestions.push('Containment', 'Occlumency');
    }
    if (text.toLowerCase().includes('distance') || text.toLowerCase().includes('float') || text.toLowerCase().includes('dissociat')) {
      suggestions.push('Cloudperson');
    }
    if (text.toLowerCase().includes('pattern') || text.toLowerCase().includes('signal') || text.toLowerCase().includes('meaning')) {
      suggestions.push('Signal Mining');
    }
    if (text.toLowerCase().includes('stable') || text.toLowerCase().includes('routine') || text.toLowerCase().includes('anchor')) {
      suggestions.push('Stability Signal');
    }

    // Add some default suggestions if none detected
    if (suggestions.length === 0) {
      suggestions.push('Recovery Arc', 'Signal Mining');
    }

    return suggestions.slice(0, 4); // Limit to 4 suggestions
  };

  const generateOcclumencyOutput = (text: string): string => {
    // Simplified repackaging logic - in real app, this would be more sophisticated
    if (text.length > 100) {
      return "All good on my end. Just processing some thoughts. I'll check in later if needed.";
    }
    if (text.toLowerCase().includes('spiral') || text.toLowerCase().includes('overwhelm')) {
      return "Taking some time to decompress tonight. Everything's manageable.";
    }
    if (text.toLowerCase().includes('parent') || text.toLowerCase().includes('family')) {
      return "Family stuff is fine. Just working through some normal communication things.";
    }
    return "Just reflecting on the day. All is well here.";
  };

  const findRelevantReplay = (motifs: string[]): MotifEntry | null => {
    // Find past entries with similar motifs
    for (const motif of motifs) {
      const matchingEntry = existingEntries.find(entry => 
        entry.motifs.includes(motif) && entry.id !== currentEntry
      );
      if (matchingEntry) return matchingEntry;
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!currentEntry.trim()) return;

    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const detectedTerms = detectDictionaryTerms(currentEntry);
      const suggestedMotifsForEntry = suggestMotifs(currentEntry);
      const tone = analyzeEmotionalTone(currentEntry);
      
      // Auto-select suggested motifs if none manually selected
      const finalMotifs = selectedMotifs.length > 0 ? selectedMotifs : suggestedMotifsForEntry;

      const entry: MotifEntry = {
        id: Date.now().toString(),
        content: currentEntry,
        motifs: finalMotifs,
        timestamp: new Date(),
        emotionalTone: tone,
        intent: 'reflection',
        dictionaryTerms: detectedTerms
      };

      // Find a relevant replay
      const replay = findRelevantReplay(finalMotifs);
      setSuggestedReplay(replay);

      onEntrySubmit(entry);
      setSelectedMotifs([]);
      setIsProcessing(false);

      toast({
        title: "Entry logged",
        description: `Tagged with: ${finalMotifs.join(', ')}`,
      });
    }, 1000);
  };

  const handleOcclumencyCheck = () => {
    const repackaged = generateOcclumencyOutput(currentEntry);
    setOcclumencyOutput(repackaged);
    setShowOcclumency(true);
  };

  const toggleMotif = (motif: string) => {
    setSelectedMotifs(prev => 
      prev.includes(motif) 
        ? prev.filter(m => m !== motif)
        : [...prev, motif]
    );
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Express Yourself
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={currentPlaceholder}
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            className="min-h-[120px] resize-none border-2 focus:border-blue-300"
            disabled={isProcessing}
          />

          {/* Motif Suggestions */}
          {currentEntry.length > 20 && (
            <div className="space-y-2">
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Suggested motifs (tap to select):
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestMotifs(currentEntry).map((motif) => (
                  <Badge
                    key={motif}
                    variant={selectedMotifs.includes(motif) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => toggleMotif(motif)}
                  >
                    {motif}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Selected Motifs */}
          {selectedMotifs.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-slate-600">Selected motifs:</p>
              <div className="flex flex-wrap gap-2">
                {selectedMotifs.map((motif) => (
                  <Badge
                    key={motif}
                    variant="default"
                    className="cursor-pointer"
                    onClick={() => toggleMotif(motif)}
                  >
                    {motif} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleSubmit}
              disabled={!currentEntry.trim() || isProcessing}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isProcessing ? 'Processing...' : 'Log Entry'}
            </Button>
            
            {currentEntry.trim() && (
              <Button
                variant="outline"
                onClick={handleOcclumencyCheck}
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Occlumency Check
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Occlumency Output */}
      {showOcclumency && (
        <Card className="bg-blue-50/50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Containment Protocol Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-4 rounded border-l-4 border-blue-400">
              <p className="text-slate-700">{occlumencyOutput}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={() => navigator.clipboard.writeText(occlumencyOutput)}>
                Copy to Clipboard
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowOcclumency(false)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggested Replay */}
      {suggestedReplay && (
        <Card className="bg-green-50/50 border-green-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Relevant Memory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-2">
              {suggestedReplay.timestamp.toLocaleDateString()} • {suggestedReplay.motifs.join(', ')}
            </p>
            <div className="bg-white p-4 rounded border-l-4 border-green-400">
              <p className="text-slate-700">{suggestedReplay.content}</p>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-3"
              onClick={() => setSuggestedReplay(null)}
            >
              Thanks for the reminder
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
