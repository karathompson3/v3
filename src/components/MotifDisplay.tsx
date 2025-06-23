import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, Calendar, Camera, Mic, TrendingUp, Activity } from 'lucide-react';

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
  onEntryDelete: (id: string) => void;
}

export const MotifDisplay = ({ entries, onEntryDelete }: MotifDisplayProps) => {
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

  const recentEntries = entries.slice(0, 3);
  const maxCount = Math.max(...Object.values(motifCounts), 1);

  return (
    <div className="space-y-6">
      {/* Motif Frequency */}
      <Card className="bg-white/95 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
            Active Motifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedMotifs.length > 0 ? (
            <div className="space-y-4">
              {sortedMotifs.map(([motif, count], index) => (
                <div 
                  key={motif} 
                  className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg hover:bg-slate-50 transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Badge 
                    variant="outline" 
                    className="text-sm bg-white border-slate-300 hover:border-blue-300 transition-colors"
                  >
                    {motif}
                  </Badge>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-600 font-medium min-w-[24px]">
                      {count}×
                    </div>
                    <div className="w-20 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                        style={{ 
                          width: `${(count / maxCount) * 100}%`,
                          animationDelay: `${index * 150}ms`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">
                    {sortedMotifs.length} pattern{sortedMotifs.length !== 1 ? 's' : ''} emerging
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="relative mb-4">
                <Activity className="w-12 h-12 mx-auto text-slate-300" />
                <div className="absolute inset-0 w-12 h-12 mx-auto border-2 border-slate-200 rounded-full animate-pulse"></div>
              </div>
              <p className="text-slate-500 font-medium">
                Your motif patterns will appear here
              </p>
              <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                Start journaling to discover recurring themes and insights
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Entries Preview */}
      {recentEntries.length > 0 && (
        <Card className="bg-white/95 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              Recent Reflections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEntries.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className="group border-l-4 border-blue-200 pl-4 py-3 bg-slate-50/30 rounded-r-lg hover:bg-slate-50/60 hover:border-blue-300 transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed group-hover:text-slate-900 transition-colors">
                        {entry.content.slice(0, 80)}...
                      </p>
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded-full border">
                          {entry.timestamp.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                        
                        {entry.media && (
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border">
                            {entry.media.type === 'photo' ? (
                              <Camera className="w-3 h-3 text-slate-400" />
                            ) : (
                              <Mic className="w-3 h-3 text-slate-400" />
                            )}
                            <span className="text-xs text-slate-500">
                              {entry.media.type}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex gap-1">
                          {entry.motifs.slice(0, 2).map(motif => (
                            <Badge 
                              key={motif} 
                              variant="secondary" 
                              className="text-xs bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 transition-colors"
                            >
                              {motif}
                            </Badge>
                          ))}
                          {entry.motifs.length > 2 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs text-slate-500"
                            >
                              +{entry.motifs.length - 2}
                            </Badge>
                          )}
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
