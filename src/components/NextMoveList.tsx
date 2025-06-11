
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ArrowRight, Moon, Shield } from 'lucide-react';
import { useState } from 'react';

interface MotifEntry {
  id: string;
  content: string;
  motifs: string[];
  timestamp: Date;
  emotionalTone: string;
  intent: string;
}

interface NextMoveListProps {
  entries: MotifEntry[];
}

interface NextMove {
  id: string;
  text: string;
  type: 'ritual' | 'reflection' | 'action' | 'containment';
  motifBased?: string;
  completed: boolean;
}

export const NextMoveList = ({ entries }: NextMoveListProps) => {
  const [moves, setMoves] = useState<NextMove[]>([]);

  // Generate smart next moves based on entry patterns
  const generateNextMoves = (): NextMove[] => {
    const suggestions: NextMove[] = [];
    
    // Check recent motif patterns
    const recentMotifs = entries.slice(0, 5).flatMap(e => e.motifs);
    const motifCounts = recentMotifs.reduce((acc, motif) => {
      acc[motif] = (acc[motif] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Evening wind-down suggestion
    const hour = new Date().getHours();
    if (hour >= 20 || hour <= 6) {
      suggestions.push({
        id: 'wind-down',
        text: 'Complete tonight\'s wind-down ritual',
        type: 'ritual',
        completed: false
      });
    }

    // Recovery-based suggestions
    if (motifCounts['Recovery Arc'] || motifCounts['Narrator/Recovery']) {
      suggestions.push({
        id: 'recovery-check',
        text: 'Reflect on this week\'s recovery signals',
        type: 'reflection',
        motifBased: 'Recovery Arc',
        completed: false
      });
    }

    // Containment suggestions
    if (motifCounts['Parental Tension'] || motifCounts['Occlumency']) {
      suggestions.push({
        id: 'containment-prep',
        text: 'Practice Occlumency check before next family interaction',
        type: 'containment',
        motifBased: 'Occlumency',
        completed: false
      });
    }

    // Pattern recognition
    if (motifCounts['Signal Mining'] || motifCounts['Phoenix Logic']) {
      suggestions.push({
        id: 'pattern-review',
        text: 'Review Signal Mining entries from this week',
        type: 'reflection',
        motifBased: 'Signal Mining',
        completed: false
      });
    }

    // Stability maintenance
    if (entries.length >= 3) {
      suggestions.push({
        id: 'stability-anchor',
        text: 'Note three things that helped you stay regulated today',
        type: 'action',
        completed: false
      });
    }

    // Default helpful moves
    if (suggestions.length === 0) {
      suggestions.push(
        {
          id: 'first-reflection',
          text: 'Write your first reflection to build momentum',
          type: 'action',
          completed: false
        },
        {
          id: 'motif-explore',
          text: 'Explore what "containment" means for you',
          type: 'reflection',
          completed: false
        }
      );
    }

    return suggestions.slice(0, 6); // Limit to 6 moves
  };

  // Initialize moves when entries change
  useState(() => {
    setMoves(generateNextMoves());
  });

  const toggleMove = (id: string) => {
    setMoves(prev => prev.map(move => 
      move.id === id ? { ...move, completed: !move.completed } : move
    ));
  };

  const getTypeIcon = (type: NextMove['type']) => {
    switch (type) {
      case 'ritual': return <Moon className="w-4 h-4" />;
      case 'containment': return <Shield className="w-4 h-4" />;
      case 'reflection': return <ArrowRight className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: NextMove['type']) => {
    switch (type) {
      case 'ritual': return 'bg-purple-100 text-purple-700';
      case 'containment': return 'bg-blue-100 text-blue-700';
      case 'reflection': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const completedCount = moves.filter(m => m.completed).length;

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Next Moves</span>
          {moves.length > 0 && (
            <Badge variant="outline">
              {completedCount}/{moves.length} complete
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-slate-600">
          Emotionally intelligent suggestions based on your patterns
        </p>
      </CardHeader>
      <CardContent>
        {moves.length > 0 ? (
          <div className="space-y-3">
            {moves.map((move) => (
              <div
                key={move.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  move.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleMove(move.id)}
                    className={`mt-0.5 transition-colors ${
                      move.completed ? 'text-green-600' : 'text-slate-400'
                    }`}
                  >
                    {move.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <p className={`${move.completed ? 'line-through text-slate-500' : 'text-slate-700'}`}>
                      {move.text}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getTypeColor(move.type)}`}
                      >
                        <span className="mr-1">{getTypeIcon(move.type)}</span>
                        {move.type}
                      </Badge>
                      
                      {move.motifBased && (
                        <Badge variant="outline" className="text-xs">
                          {move.motifBased}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => setMoves(generateNextMoves())}
            >
              Refresh Suggestions
            </Button>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Circle className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p>Your next moves will appear here</p>
            <p className="text-sm mt-1">Start journaling to get personalized suggestions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
