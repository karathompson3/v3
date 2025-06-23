
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Tag, Brain, DollarSign, X, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContributionData {
  user_id?: string;
  timestamp: string;
  contribution_type: 'phrase' | 'motif' | 'truth' | 'monetary';
  content: {
    name?: string;
    definition?: string;
    text?: string;
    amount?: number;
    note?: string;
  };
  tags: string[];
}

interface SignalContributionModalProps {
  open: boolean;
  onClose: () => void;
  triggerContext?: string;
  onContribution?: (contribution: ContributionData) => void;
}

export const SignalContributionModal = ({ 
  open, 
  onClose, 
  triggerContext,
  onContribution 
}: SignalContributionModalProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [phraseContent, setPhraseContent] = useState('');
  const [motifName, setMotifName] = useState('');
  const [motifDefinition, setMotifDefinition] = useState('');
  const [truthContent, setTruthContent] = useState('');
  const [monetaryAmount, setMonetaryAmount] = useState('');
  const [monetaryNote, setMonetaryNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleReset = () => {
    setSelectedType(null);
    setPhraseContent('');
    setMotifName('');
    setMotifDefinition('');
    setTruthContent('');
    setMonetaryAmount('');
    setMonetaryNote('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedType) return;

    setIsSubmitting(true);

    let contribution: ContributionData;
    const timestamp = new Date().toISOString();

    switch (selectedType) {
      case 'phrase':
        if (!phraseContent.trim()) {
          toast({
            title: "Please enter a phrase",
            description: "Share a phrase that helped you",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
        contribution = {
          timestamp,
          contribution_type: 'phrase',
          content: { text: phraseContent },
          tags: ['Wisdom', 'Support']
        };
        break;

      case 'motif':
        if (!motifName.trim() || !motifDefinition.trim()) {
          toast({
            title: "Please complete the motif",
            description: "Both name and definition are required",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
        contribution = {
          timestamp,
          contribution_type: 'motif',
          content: { name: motifName, definition: motifDefinition },
          tags: ['Motif', 'Pattern Recognition']
        };
        break;

      case 'truth':
        if (!truthContent.trim()) {
          toast({
            title: "Please enter a truth",
            description: "Share a truth you want others to remember",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
        contribution = {
          timestamp,
          contribution_type: 'truth',
          content: { text: truthContent },
          tags: ['Wisdom', 'Truth']
        };
        break;

      case 'monetary':
        const amount = parseFloat(monetaryAmount);
        if (isNaN(amount) || amount <= 0) {
          toast({
            title: "Please enter a valid amount",
            description: "Enter a positive number for monetary contribution",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
        contribution = {
          timestamp,
          contribution_type: 'monetary',
          content: { amount, note: monetaryNote },
          tags: ['Support', 'Monetary']
        };
        break;

      default:
        setIsSubmitting(false);
        return;
    }

    // Simulate API call
    setTimeout(() => {
      if (onContribution) {
        onContribution(contribution);
      }

      toast({
        title: "Contribution received",
        description: "Thank you for enriching the Archive of Meaning",
      });

      setIsSubmitting(false);
      handleClose();
    }, 1000);
  };

  const contributionOptions = [
    {
      type: 'phrase',
      icon: MessageSquare,
      title: 'Share a phrase that helped you',
      description: 'Words that grounded you when you needed them'
    },
    {
      type: 'motif',
      icon: Tag,
      title: 'Name a new motif or tag',
      description: 'Help identify patterns for others to recognize'
    },
    {
      type: 'truth',
      icon: Brain,
      title: 'Log a truth you want others to remember',
      description: 'Wisdom that deserves to persist'
    },
    {
      type: 'monetary',
      icon: DollarSign,
      title: 'Support with money (optional)',
      description: 'Traditional support if you prefer'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 border-white/20">
        <DialogHeader className="pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100/10 rounded-lg">
              <Heart className="w-6 h-6 text-blue-300" />
            </div>
            <DialogTitle className="text-2xl text-white">
              Contribute to the Archive of Meaning
            </DialogTitle>
          </div>
          
          <div className="text-blue-200 space-y-2">
            <p>V3 grows through reflection.</p>
            <p>Not everyone pays in dollars. Some pay in insight.</p>
            {triggerContext && (
              <p className="text-blue-300 italic text-sm">
                Triggered by: {triggerContext}
              </p>
            )}
          </div>
        </DialogHeader>

        {!selectedType ? (
          <div className="space-y-4">
            <p className="text-blue-200 mb-6">Choose how you'd like to give back:</p>
            
            <div className="space-y-3">
              {contributionOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card 
                    key={option.type}
                    className="bg-white/10 border-white/20 hover:bg-white/20 transition-all cursor-pointer group"
                    onClick={() => setSelectedType(option.type)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100/10 rounded-lg group-hover:bg-blue-100/20 transition-colors">
                          <Icon className="w-5 h-5 text-blue-300" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-1">
                            {option.title}
                          </h3>
                          <p className="text-blue-200 text-sm">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Skip for now
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedType(null)}
              className="text-blue-300 hover:text-white hover:bg-white/10 mb-4"
            >
              ← Back to options
            </Button>

            {selectedType === 'phrase' && (
              <div className="space-y-4">
                <h3 className="text-white text-lg">Share a phrase that helped you</h3>
                <Textarea
                  placeholder="I move with vision, not urgency..."
                  value={phraseContent}
                  onChange={(e) => setPhraseContent(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 focus:border-blue-300"
                  rows={3}
                />
              </div>
            )}

            {selectedType === 'motif' && (
              <div className="space-y-4">
                <h3 className="text-white text-lg">Name a new motif or tag</h3>
                <div className="space-y-3">
                  <Input
                    placeholder="Motif name (e.g., Threadkeeper)"
                    value={motifName}
                    onChange={(e) => setMotifName(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 focus:border-blue-300"
                  />
                  <Textarea
                    placeholder="Definition: A person or part of you that remembers what mattered when you were lost."
                    value={motifDefinition}
                    onChange={(e) => setMotifDefinition(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 focus:border-blue-300"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {selectedType === 'truth' && (
              <div className="space-y-4">
                <h3 className="text-white text-lg">Log a truth you want others to remember</h3>
                <Textarea
                  placeholder="Stability is a system, not a feeling..."
                  value={truthContent}
                  onChange={(e) => setTruthContent(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 focus:border-blue-300"
                  rows={3}
                />
              </div>
            )}

            {selectedType === 'monetary' && (
              <div className="space-y-4">
                <h3 className="text-white text-lg">Support with money</h3>
                <div className="space-y-3">
                  <Input
                    type="number"
                    placeholder="Amount (USD)"
                    value={monetaryAmount}
                    onChange={(e) => setMonetaryAmount(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 focus:border-blue-300"
                  />
                  <Textarea
                    placeholder="Optional note..."
                    value={monetaryNote}
                    onChange={(e) => setMonetaryNote(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 focus:border-blue-300"
                    rows={2}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? 'Contributing...' : 'Contribute'}
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
