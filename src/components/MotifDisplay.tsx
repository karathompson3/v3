import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, TrendingUp, Calendar, Camera, Mic } from 'lucide-react';

interface MotifEntry {
  id: string;
  content: string;
  motifs: string[];
  timestamp: Date;
  emotionalTone: string;
  intent: string;
  dictionaryTerms?: string[];
  media?: { type: string };
}

interface MotifDisplayProps {
  entries: MotifEntry[];
}

export const MotifDisplay = ({ entries }: MotifDisplayProps) => {
  // Calculate motif frequency
  const motifCounts = entries.reduce((acc, entry) => {
    entry.motifs.forEach(motif => {
      acc[motif] = (acc[motif] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const sortedMotifs = Object.entries(motifCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8); // Top 8 motifs

  const totalEntries = entries.length;
  const recentEntries = entries.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Motif Frequency */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="w-5 h-5" />
            Active Motifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedMotifs.length > 0 ? (
            <div className="space-y-3">
              {sortedMotifs.map(([motif, count]) => (
                <div key={motif} className="flex items-center justify-between">
                  <Badge variant="outline" className="text-sm">
                    {motif}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-slate-600">{count}x</div>
                    <div className="w-16 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(count / Math.max(...Object.values(motifCounts))) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">
              Start journaling to see your motif patterns
            </p>
          )}
        </CardContent>
      </Card>

      {/* Progress Snapshot */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5" />
            Progress Signal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total Entries</span>
              <span className="font-semibold">{totalEntries}</span>
            </div>
            
            {totalEntries > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Days Active</span>
                  <span className="font-semibold">
                    {new Set(entries.map(e => e.timestamp.toDateString())).size}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Most Used Motif</span>
                  <Badge variant="default" className="text-xs">
                    {sortedMotifs[0]?.[0] || 'None yet'}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries Preview */}
      {recentEntries.length > 0 && (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              Recent Reflections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div key={entry.id} className="border-l-4 border-blue-200 pl-3 py-2">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-slate-700 line-clamp-2">
                        {entry.content.slice(0, 80)}...
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">
                          {entry.timestamp.toLocaleDateString()}
                        </span>
                        {entry.media && (
                          <div className="flex items-center gap-1">
                            {entry.media.type === 'photo' ? (
                              <Camera className="w-3 h-3 text-slate-400" />
                            ) : (
                              <Mic className="w-3 h-3 text-slate-400" />
                            )}
                            <span className="text-xs text-slate-400">
                              {entry.media.type}
                            </span>
                          </div>
                        )}
                        <div className="flex gap-1">
                          {entry.motifs.slice(0, 2).map(motif => (
                            <Badge key={motif} variant="secondary" className="text-xs">
                              {motif}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
