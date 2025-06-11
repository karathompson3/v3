
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ArrowRight, Moon, Heart, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  type: 'ritual' | 'reflection' | 'action' | 'wellness';
  motifBased?: string;
  completed: boolean;
}

export const NextMoveList = ({ entries }: NextMoveListProps) => {
  const [moves, setMoves] = useState<NextMove[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

    // Wellness suggestions (formerly containment)
    if (motifCounts['Parental Tension'] || motifCounts['Occlumency']) {
      suggestions.push({
        id: 'wellness-prep',
        text: 'Check in with yourself before next family interaction',
        type: 'wellness',
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
          text: 'Explore what patterns feel important to you',
          type: 'reflection',
          completed: false
        }
      );
    }

    return suggestions.slice(0, 6); // Limit to 6 moves
  };

  // Initialize moves when entries change
  useEffect(() => {
    setMoves(generateNextMoves());
  }, [entries]);

  const toggleMove = (id: string) => {
    setMoves(prev => prev.map(move => 
      move.id === id ? { ...move, completed: !move.completed } : move
    ));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Add a small delay for better UX
    setTimeout(() => {
      setMoves(generateNextMoves());
      setIsRefreshing(false);
    }, 500);
  };

  const getTypeIcon = (type: NextMove['type']) => {
    switch (type) {
      case 'ritual': return <Moon className="w-4 h-4" />;
      case 'wellness': return <Heart className="w-4 h-4" />;
      case 'reflection': return <ArrowRight className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: NextMove['type']) => {
    switch (type) {
      case 'ritual': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'wellness': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'reflection': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const completedCount = moves.filter(m => m.completed).length;

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-slate-800">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Next Moves
          </span>
          {moves.length > 0 && (
            <Badge variant="outline" className="bg-slate-50">
              {completedCount}/{moves.length} complete
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-slate-600">
          Gentle suggestions based on your patterns
        </p>
      </CardHeader>
      <CardContent>
        {moves.length > 0 ? (
          <div className="space-y-3">
            {moves.map((move, index) => (
              <div
                key={move.id}
                className={`group p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] ${
                  move.completed 
                    ? 'bg-green-50/80 border-green-200 shadow-sm' 
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleMove(move.id)}
                    className={`mt-0.5 transition-all duration-200 hover:scale-110 ${
                      move.completed ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    aria-label={move.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {move.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <p className={`transition-all duration-200 ${
                      move.completed 
                        ? 'line-through text-slate-500' 
                        : 'text-slate-700 group-hover:text-slate-900'
                    }`}>
                      {move.text}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs border ${getTypeColor(move.type)}`}
                      >
                        <span className="mr-1">{getTypeIcon(move.type)}</span>
                        {move.type}
                      </Badge>
                      
                      {move.motifBased && (
                        <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
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
              className="w-full mt-6 group hover:bg-slate-50 transition-all duration-200"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 transition-transform duration-500 ${
                isRefreshing ? 'animate-spin' : 'group-hover:rotate-45'
              }`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Suggestions'}
            </Button>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <div className="relative mb-4">
              <Circle className="w-12 h-12 mx-auto opacity-30" />
              <div className="absolute inset-0 w-12 h-12 mx-auto border-2 border-blue-200 rounded-full animate-pulse"></div>
            </div>
            <p className="text-lg font-medium">Your next moves will appear here</p>
            <p className="text-sm mt-2 max-w-sm mx-auto">
              Start journaling to receive gentle, personalized suggestions based on your patterns
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
