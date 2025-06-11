
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Clock, Tag, AlertTriangle } from 'lucide-react';
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
  const [deleteTimers, setDeleteTimers] = useState<Record<string, NodeJS.Timeout>>({});
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleDeleteStart = (id: string) => {
    if (deleteTimers[id]) return; // Already in progress

    setDeletingIds(prev => new Set([...prev, id]));
    
    toast({
      title: "Hold to delete",
      description: "Keep holding for 15 seconds to delete this reflection",
    });

    const timer = setTimeout(() => {
      onDelete(id);
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setDeleteTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[id];
        return newTimers;
      });
      
      toast({
        title: "Reflection deleted",
        description: "The reflection has been removed from your records",
      });
    }, 15000);

    setDeleteTimers(prev => ({ ...prev, [id]: timer }));
  };

  const handleDeleteCancel = (id: string) => {
    const timer = deleteTimers[id];
    if (timer) {
      clearTimeout(timer);
      setDeleteTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[id];
        return newTimers;
      });
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      
      toast({
        title: "Deletion cancelled",
        description: "Your reflection is safe",
      });
    }
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
            {entries.length} reflections captured • Hold delete button for 15 seconds to remove
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
          {entries.map((entry) => {
            const isDeleting = deletingIds.has(entry.id);
            
            return (
              <Card
                key={entry.id}
                className={`transition-all duration-200 ${
                  isDeleting 
                    ? 'bg-red-50 border-red-200 shadow-red-100' 
                    : 'bg-white/90 backdrop-blur-sm hover:shadow-md'
                }`}
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
                        variant={isDeleting ? "destructive" : "ghost"}
                        size="sm"
                        onMouseDown={() => handleDeleteStart(entry.id)}
                        onMouseUp={() => handleDeleteCancel(entry.id)}
                        onMouseLeave={() => handleDeleteCancel(entry.id)}
                        className={`transition-all duration-200 ${
                          isDeleting ? 'animate-pulse' : ''
                        }`}
                      >
                        {isDeleting ? (
                          <>
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Hold to Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
