
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Moon, Star, Heart, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MotifEntry {
  id: string;
  content: string;
  motifs: string[];
  timestamp: Date;
  emotionalTone: string;
  intent: string;
  stabilityFlags?: {
    slept: boolean;
    ate: boolean;
    spikes: boolean;
    containmentUsed: boolean;
  };
}

interface WindDownModeProps {
  onEntry: (entry: MotifEntry) => void;
  onClose: () => void;
  recentEntries: MotifEntry[];
}

const windDownPrompts = [
  "What helped you stay steady today?",
  "What are you proud of from today?",
  "What feels complete about today?",
  "What's one thing that went well?",
  "How did you take care of yourself today?",
  "What did you learn about yourself today?"
];

export const WindDownMode = ({ onEntry, onClose, recentEntries }: WindDownModeProps) => {
  const [reflection, setReflection] = useState('');
  const [stabilityFlags, setStabilityFlags] = useState({
    slept: false,
    ate: false,
    spikes: false,
    containmentUsed: false
  });
  const [exitPhrase, setExitPhrase] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const currentPrompt = windDownPrompts[Math.floor(Math.random() * windDownPrompts.length)];

  // Find a relevant past entry for replay
  const relevantEntry = recentEntries.find(entry => 
    entry.motifs.includes('Recovery Arc') || 
    entry.motifs.includes('Stability Signal') ||
    entry.emotionalTone.includes('proud') ||
    entry.emotionalTone.includes('grounded')
  );

  const handleSubmit = async () => {
    if (!reflection.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const entry: MotifEntry = {
        id: Date.now().toString(),
        content: reflection,
        motifs: ['Wind-Down', 'Stability Signal', 'Recovery Check-In'],
        timestamp: new Date(),
        emotionalTone: 'reflective, winding down',
        intent: 'evening_reflection',
        stabilityFlags
      };

      onEntry(entry);
      
      toast({
        title: "Wind-down logged",
        description: "Sleep well. You're building proof.",
      });

      setIsSubmitting(false);
    }, 1000);
  };

  const updateStabilityFlag = (flag: keyof typeof stabilityFlags, checked: boolean) => {
    setStabilityFlags(prev => ({ ...prev, [flag]: checked }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Moon className="w-8 h-8 text-blue-300" />
            <h1 className="text-3xl font-bold text-white">Wind-Down Mode</h1>
            <Star className="w-6 h-6 text-blue-300" />
          </div>
          <p className="text-blue-200 italic">End the day in safety. Store the signal. Reinforce the loop.</p>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="mt-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <X className="w-4 h-4 mr-2" />
            Exit Wind-Down
          </Button>
        </div>

        {/* Relevant Memory Replay */}
        {relevantEntry && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="w-5 h-5" />
                A Reminder for Tonight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white/20 p-4 rounded border-l-4 border-blue-300">
                <p className="text-blue-100 mb-2">{relevantEntry.content}</p>
                <p className="text-xs text-blue-200">
                  {relevantEntry.timestamp.toLocaleDateString()} • {relevantEntry.emotionalTone}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Reflection */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white">{currentPrompt}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Let yourself reflect gently..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="min-h-[120px] bg-white/20 border-white/30 text-white placeholder:text-blue-200 focus:border-blue-300"
              disabled={isSubmitting}
            />
          </CardContent>
        </Card>

        {/* Stability Check */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Stability Check</CardTitle>
            <p className="text-blue-200 text-sm">How did you care for yourself today?</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="slept"
                  checked={stabilityFlags.slept}
                  onCheckedChange={(checked) => updateStabilityFlag('slept', checked as boolean)}
                  className="border-white/30 data-[state=checked]:bg-blue-600"
                />
                <label htmlFor="slept" className="text-white text-sm">
                  Got enough sleep last night
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ate"
                  checked={stabilityFlags.ate}
                  onCheckedChange={(checked) => updateStabilityFlag('ate', checked as boolean)}
                  className="border-white/30 data-[state=checked]:bg-blue-600"
                />
                <label htmlFor="ate" className="text-white text-sm">
                  Ate adequately today
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="spikes"
                  checked={!stabilityFlags.spikes}
                  onCheckedChange={(checked) => updateStabilityFlag('spikes', !checked as boolean)}
                  className="border-white/30 data-[state=checked]:bg-blue-600"
                />
                <label htmlFor="spikes" className="text-white text-sm">
                  No major emotional spikes
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="containment"
                  checked={stabilityFlags.containmentUsed}
                  onCheckedChange={(checked) => updateStabilityFlag('containmentUsed', checked as boolean)}
                  className="border-white/30 data-[state=checked]:bg-blue-600"
                />
                <label htmlFor="containment" className="text-white text-sm">
                  Used healthy containment when needed
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exit Phrase */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Close the Day</CardTitle>
            <p className="text-blue-200 text-sm">How do you want to end today?</p>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Day 6. I'm proud of this. / Today had its challenges and I met them. / I'm learning to hold myself gently."
              value={exitPhrase}
              onChange={(e) => setExitPhrase(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 focus:border-blue-300"
              rows={2}
              disabled={isSubmitting}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={!reflection.trim() || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            {isSubmitting ? 'Logging...' : 'Complete Wind-Down'}
          </Button>
          
          <p className="text-blue-200 text-sm mt-4">
            "Logged. Sleep well. You're building proof."
          </p>
        </div>
      </div>
    </div>
  );
};
