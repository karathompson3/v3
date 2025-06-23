
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, Brain, Wind, Shield, RotateCcw, MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

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
  metadata?: {
    entryType?: string;
    [key: string]: any;
  };
}

interface WeeklyRecapData {
  weekStart: Date;
  weekEnd: Date;
  entryCount: number;
  topMotif: string;
  moodTrend: 'rising' | 'falling' | 'steady';
  windDownsLogged: number;
  occlumencyUses: number;
  replaysViewed: number;
  userContributions: {
    motifs: number;
    reflections: number;
  };
  suggestedAction?: {
    type: 'thread_followup' | 'stability_check' | 'reflection';
    targetMotif?: string;
  };
}

interface WeeklyRecapCardProps {
  entries: MotifEntry[];
  onViewThread?: (motif: string) => void;
  onStartNewEntry?: () => void;
  onClose: () => void;
}

export const WeeklyRecapCard = ({ 
  entries, 
  onViewThread, 
  onStartNewEntry, 
  onClose 
}: WeeklyRecapCardProps) => {
  const weeklyData = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    
    const weekEntries = entries.filter(entry => 
      isWithinInterval(entry.timestamp, { start: weekStart, end: weekEnd })
    );
    
    // Calculate motif frequencies
    const motifCounts = weekEntries.reduce((acc, entry) => {
      entry.motifs.forEach(motif => {
        acc[motif] = (acc[motif] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    const topMotif = Object.entries(motifCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';
    
    // Analyze mood trend (simplified)
    const emotionalTones = weekEntries.map(e => e.emotionalTone);
    const positiveWords = ['clarity', 'peace', 'hope', 'strength', 'grounded'];
    const negativeWords = ['conflict', 'anxiety', 'overwhelm', 'stuck', 'frustrated'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    emotionalTones.forEach(tone => {
      const lowerTone = tone.toLowerCase();
      if (positiveWords.some(word => lowerTone.includes(word))) positiveCount++;
      if (negativeWords.some(word => lowerTone.includes(word))) negativeCount++;
    });
    
    let moodTrend: 'rising' | 'falling' | 'steady' = 'steady';
    if (positiveCount > negativeCount + 2) moodTrend = 'rising';
    else if (negativeCount > positiveCount + 2) moodTrend = 'falling';
    
    // Count wind-downs and other activities
    const windDownsLogged = weekEntries.filter(e => 
      e.metadata?.entryType === 'wind_down'
    ).length;
    
    const occlumencyUses = weekEntries.filter(e => 
      e.stabilityFlags?.containmentUsed
    ).length;
    
    const replaysViewed = weekEntries.filter(e => 
      e.content.toLowerCase().includes('replay') || 
      e.content.toLowerCase().includes('review')
    ).length;
    
    // Count contributions (simplified)
    const userContributions = {
      motifs: weekEntries.filter(e => e.motifs.length > 2).length,
      reflections: weekEntries.filter(e => e.content.length > 100).length
    };
    
    // Suggest action based on patterns
    let suggestedAction: WeeklyRecapData['suggestedAction'];
    if (topMotif && motifCounts[topMotif] >= 3) {
      suggestedAction = {
        type: 'thread_followup',
        targetMotif: topMotif
      };
    } else if (windDownsLogged < 5) {
      suggestedAction = {
        type: 'stability_check'
      };
    } else {
      suggestedAction = {
        type: 'reflection'
      };
    }
    
    return {
      weekStart,
      weekEnd,
      entryCount: weekEntries.length,
      topMotif,
      moodTrend,
      windDownsLogged,
      occlumencyUses,
      replaysViewed,
      userContributions,
      suggestedAction
    };
  }, [entries]);

  const getMoodTrendIcon = () => {
    switch (weeklyData.moodTrend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'falling': return <TrendingDown className="w-4 h-4 text-orange-400" />;
      default: return <Minus className="w-4 h-4 text-blue-400" />;
    }
  };

  const getMoodTrendText = () => {
    switch (weeklyData.moodTrend) {
      case 'rising': return 'Rising clarity';
      case 'falling': return 'Working through challenges';
      default: return 'Finding balance';
    }
  };

  const getSuggestedActionText = () => {
    if (!weeklyData.suggestedAction) return null;
    
    switch (weeklyData.suggestedAction.type) {
      case 'thread_followup':
        return `Your "${weeklyData.suggestedAction.targetMotif}" thread is active — want to revisit or write a note to future you?`;
      case 'stability_check':
        return 'Consider adding more wind-down sessions to strengthen your stability practices.';
      case 'reflection':
        return 'You\'ve been consistent this week — what insight would you like to capture?';
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-md mx-auto bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 border-white/20 text-white">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-6 h-6 text-blue-300" />
          <CardTitle className="text-xl">
            Weekly Recap
          </CardTitle>
        </div>
        <p className="text-blue-200 text-sm">
          {format(weeklyData.weekStart, 'MMM d')} – {format(weeklyData.weekEnd, 'MMM d')}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Core Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-300" />
            <span>{weeklyData.entryCount} entries</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-300" />
            <span>Top: "{weeklyData.topMotif}"</span>
          </div>
        </div>

        {/* Mood Trend */}
        <div className="flex items-center gap-2 text-sm">
          {getMoodTrendIcon()}
          <span>{getMoodTrendText()}</span>
        </div>

        {/* Activity Summary */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-green-300" />
              <span>Wind-down complete:</span>
            </div>
            <Badge variant="outline" className="text-white border-white/30">
              {weeklyData.windDownsLogged} / 7
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-300" />
              <span>Occlumency used:</span>
            </div>
            <Badge variant="outline" className="text-white border-white/30">
              {weeklyData.occlumencyUses} times
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-cyan-300" />
              <span>Replays viewed:</span>
            </div>
            <Badge variant="outline" className="text-white border-white/30">
              {weeklyData.replaysViewed}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-pink-300" />
              <span>Contributions:</span>
            </div>
            <Badge variant="outline" className="text-white border-white/30">
              {weeklyData.userContributions.motifs + weeklyData.userContributions.reflections}
            </Badge>
          </div>
        </div>

        {/* Suggestion */}
        {weeklyData.suggestedAction && (
          <div className="bg-white/10 rounded-lg p-3 text-sm">
            <p className="text-blue-200 mb-3">
              📍 {getSuggestedActionText()}
            </p>
            
            <div className="flex gap-2">
              {weeklyData.suggestedAction.type === 'thread_followup' && weeklyData.suggestedAction.targetMotif && (
                <Button
                  size="sm"
                  onClick={() => onViewThread?.(weeklyData.suggestedAction.targetMotif!)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View Thread
                </Button>
              )}
              
              <Button
                size="sm"
                onClick={onStartNewEntry}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Start New Entry
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
