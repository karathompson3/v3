
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Clock, Tag } from 'lucide-react';
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
      title: "Reflection deleted",
      description: "The reflection has been removed from your records",
    });
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Your Reflections
          </CardTitle>
          <p className="text-sm text-slate-600">
            {entries.length} reflections captured • Click delete to remove instantly
          </p>
        </CardHeader>
      </Card>

      {entries.length === 0 ? (
        <Card className="bg-slate-50/50">
          <CardContent className="text-center py-12">
            <p className="text-slate-500">No reflections yet. Start a conversation to begin building your foundation.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card
              key={entry.id}
              className="bg-white/90 backdrop-blur-sm hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 mb-3 line-clamp-3">
                      {entry.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {entry.motifs.map((motif) => (
                        <Badge key={motif} variant="outline" className="text-xs">
                          {motif}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {entry.timestamp.toLocaleDateString()} at {entry.timestamp.toLocaleTimeString()}
                      </span>
                      <span>Tone: {entry.emotionalTone}</span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
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
