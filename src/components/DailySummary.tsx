
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Flame, Heart, TrendingUp } from 'lucide-react';
import { format, isToday, differenceInDays } from 'date-fns';

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

interface DailySummaryProps {
  entries: MotifEntry[];
}

export const DailySummary = ({ entries }: DailySummaryProps) => {
  // Filter today's entries
  const todaysEntries = entries.filter(entry => isToday(entry.timestamp));
  
  // Calculate streak (days with at least one entry)
  const sortedEntries = entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  let currentStreak = 0;
  let checkDate = new Date();
  
  for (let i = 0; i < 30; i++) { // Check last 30 days max
    const dayEntries = entries.filter(entry => 
      format(entry.timestamp, 'yyyy-MM-dd') === format(checkDate, 'yyyy-MM-dd')
    );
    
    if (dayEntries.length > 0) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (i === 0) {
      // If no entries today, streak is 0
      break;
    } else {
      // Gap in streak
      break;
    }
  }
  
  // Get today's motifs
  const todaysMotifs = todaysEntries.flatMap(entry => entry.motifs);
  const uniqueMotifs = [...new Set(todaysMotifs)];
  
  // Get emotional tone patterns
  const emotionalTones = todaysEntries.map(entry => entry.emotionalTone).filter(Boolean);
  const dominantTone = emotionalTones.length > 0 ? 
    emotionalTones.reduce((a, b, i, arr) => 
      arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
    ) : null;
  
  // Stability indicators
  const stabilityData = todaysEntries
    .map(entry => entry.stabilityFlags)
    .filter(Boolean);
  
  const stabilityScore = stabilityData.length > 0 ? 
    stabilityData.reduce((acc, flags) => {
      return acc + 
        (flags.slept ? 1 : 0) + 
        (flags.ate ? 1 : 0) + 
        (flags.spikes ? 0 : 1) + 
        (flags.containmentUsed ? 0.5 : 1);
    }, 0) / (stabilityData.length * 4) : null;

  return (
    <Card className="sacred-scroll observatory-glow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-candlewhite font-serif">
          <Calendar className="w-5 h-5 text-accent" />
          Today's Reflection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Entries & Streak */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-stone-beige font-medium">Entries Today</div>
            <div className="text-2xl font-serif text-candlewhite">
              {todaysEntries.length}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-stone-beige font-medium flex items-center gap-2">
              <Flame className="w-4 h-4 text-accent" />
              Reflection Streak
            </div>
            <div className="text-2xl font-serif text-candlewhite">
              {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>

        {/* Today's Motifs */}
        {uniqueMotifs.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm text-stone-beige font-medium">Today's Threads</div>
            <div className="flex flex-wrap gap-2">
              {uniqueMotifs.slice(0, 6).map((motif, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="thread-marker text-xs"
                >
                  {motif}
                </Badge>
              ))}
              {uniqueMotifs.length > 6 && (
                <Badge variant="outline" className="text-xs text-stone-beige">
                  +{uniqueMotifs.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Emotional Tone */}
        {dominantTone && (
          <div className="space-y-2">
            <div className="text-sm text-stone-beige font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-emotional-plum" />
              Emotional Thread
            </div>
            <div className="text-candlewhite font-serif capitalize">
              {dominantTone}
            </div>
          </div>
        )}

        {/* Stability Score */}
        {stabilityScore !== null && (
          <div className="space-y-2">
            <div className="text-sm text-stone-beige font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              Stability Thread
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-deeper-scroll rounded-full h-2">
                <div 
                  className="bg-accent rounded-full h-2 transition-all duration-500"
                  style={{ width: `${Math.round(stabilityScore * 100)}%` }}
                />
              </div>
              <div className="text-sm text-candlewhite font-medium">
                {Math.round(stabilityScore * 100)}%
              </div>
            </div>
          </div>
        )}

        {/* Gentle encouragement */}
        {todaysEntries.length === 0 && (
          <div className="text-center py-4 text-stone-beige font-serif italic opacity-75">
            The codex awaits your first reflection of the day...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
