
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Clock, Feather } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface ReflectionsManagerProps {
  entries: MotifEntry[];
  onDelete: (id: string) => void;
}

export const ReflectionsManager = ({ entries, onDelete }: ReflectionsManagerProps) => {
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    onDelete(id);
    toast({
      title: "Memory released",
      description: "The reflection has been returned to the ether",
    });
  };

  return (
    <div className="space-y-6 journey-rhythm">
      <Card className="observatory-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <Feather className="w-5 h-5 text-primary" />
            Sacred Archive
          </CardTitle>
          <p className="text-sm text-muted-foreground font-serif italic">
            {entries.length} reflections preserved • Each memory a thread in the tapestry
          </p>
        </CardHeader>
      </Card>

      {entries.length === 0 ? (
        <Card className="portal-glass">
          <CardContent className="text-center py-16">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                <Feather className="w-8 h-8 text-accent" />
              </div>
              <p className="text-muted-foreground font-serif italic">
                The pages await your first inscription...
              </p>
              <p className="text-sm text-muted-foreground/80">
                Begin a chronicle to weave your foundation
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card
              key={entry.id}
              className="observatory-glow hover:memory-glow whisper-hover group"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="reflection-quote text-foreground/90 leading-relaxed">
                      {entry.content}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {entry.motifs.map((motif) => (
                        <span key={motif} className="thread-marker">
                          {motif}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-6 text-xs text-muted-foreground font-serif">
                      <span className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {entry.timestamp.toLocaleDateString()} • {entry.timestamp.toLocaleTimeString()}
                      </span>
                      <span className="text-accent font-medium">
                        Essence: {entry.emotionalTone}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="hover:bg-destructive/10 hover:text-destructive whisper-hover"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Release
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
