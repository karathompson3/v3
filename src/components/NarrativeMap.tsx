
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Network, Calendar, TrendingUp, Eye } from 'lucide-react';
import { useState } from 'react';

interface MotifEntry {
  id: string;
  content: string;
  motifs: string[];
  timestamp: Date;
  emotionalTone: string;
  intent: string;
}

interface NarrativeMapProps {
  entries: MotifEntry[];
}

interface MotifThread {
  motif: string;
  entries: MotifEntry[];
  trend: 'improving' | 'stable' | 'needs_attention';
  summary: string;
}

export const NarrativeMap = ({ entries }: NarrativeMapProps) => {
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

  // Group entries by motif to create threads
  const createMotifThreads = (): MotifThread[] => {
    const motifGroups = entries.reduce((acc, entry) => {
      entry.motifs.forEach(motif => {
        if (!acc[motif]) acc[motif] = [];
        acc[motif].push(entry);
      });
      return acc;
    }, {} as Record<string, MotifEntry[]>);

    return Object.entries(motifGroups)
      .map(([motif, entries]) => {
        // Simple trend analysis based on emotional tone keywords
        const recentEntries = entries.slice(0, 3);
        const positiveWords = ['calm', 'clear', 'steady', 'proud', 'grounded', 'confident'];
        const concernWords = ['spiral', 'chaos', 'overwhelm', 'stuck', 'heavy'];
        
        let trend: 'improving' | 'stable' | 'needs_attention' = 'stable';
        
        const recentTones = recentEntries.map(e => e.emotionalTone.toLowerCase());
        const hasPositive = recentTones.some(tone => positiveWords.some(word => tone.includes(word)));
        const hasConcern = recentTones.some(tone => concernWords.some(word => tone.includes(word)));
        
        if (hasPositive && !hasConcern) trend = 'improving';
        if (hasConcern && !hasPositive) trend = 'needs_attention';

        // Generate summary
        const entryCount = entries.length;
        const timeSpan = entries.length > 1 
          ? Math.ceil((entries[0].timestamp.getTime() - entries[entries.length - 1].timestamp.getTime()) / (1000 * 60 * 60 * 24))
          : 0;
        
        let summary = `${entryCount} entries`;
        if (timeSpan > 0) summary += ` over ${timeSpan} days`;
        
        if (trend === 'improving') summary += '. Growing clarity and regulation.';
        else if (trend === 'needs_attention') summary += '. May need gentle attention.';
        else summary += '. Stable pattern.';

        return { motif, entries, trend, summary };
      })
      .sort((a, b) => b.entries.length - a.entries.length); // Sort by frequency
  };

  const threads = createMotifThreads();

  const getTrendColor = (trend: MotifThread['trend']) => {
    switch (trend) {
      case 'improving': return 'border-green-300 bg-green-50';
      case 'needs_attention': return 'border-amber-300 bg-amber-50';
      default: return 'border-blue-300 bg-blue-50';
    }
  };

  const getTrendBadge = (trend: MotifThread['trend']) => {
    switch (trend) {
      case 'improving': return <Badge className="bg-green-100 text-green-800">↗ Growing</Badge>;
      case 'needs_attention': return <Badge className="bg-amber-100 text-amber-800">⚠ Notice</Badge>;
      default: return <Badge className="bg-blue-100 text-blue-800">→ Stable</Badge>;
    }
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Narrative Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-500">
            <Network className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">Your story threads will appear here</p>
            <p>Start journaling to build your narrative map</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Narrative Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{threads.length}</div>
              <div className="text-sm text-slate-600">Active Motifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {threads.filter(t => t.trend === 'improving').length}
              </div>
              <div className="text-sm text-slate-600">Growing Patterns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600">{entries.length}</div>
              <div className="text-sm text-slate-600">Total Reflections</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motif Threads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {threads.map((thread) => (
          <Card 
            key={thread.motif} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${getTrendColor(thread.trend)}`}
            onClick={() => setSelectedThread(selectedThread === thread.motif ? null : thread.motif)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{thread.motif}</CardTitle>
                {getTrendBadge(thread.trend)}
              </div>
              <p className="text-sm text-slate-600">{thread.summary}</p>
            </CardHeader>
            
            {selectedThread === thread.motif && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>Recent entries in this thread:</span>
                  </div>
                  
                  {thread.entries.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="bg-white/70 p-3 rounded border-l-4 border-slate-300">
                      <p className="text-sm text-slate-700 mb-1">
                        {entry.content.slice(0, 120)}...
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{entry.timestamp.toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{entry.emotionalTone}</span>
                      </div>
                    </div>
                  ))}
                  
                  {thread.entries.length > 3 && (
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View all {thread.entries.length} entries
                    </Button>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
