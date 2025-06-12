
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatInterface } from './ChatInterface';
import { ReflectionsManager } from './ReflectionsManager';
import { MotifDisplay } from './MotifDisplay';
import { MessageCircle, Brain, Map } from 'lucide-react';

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

interface MainTabsProps {
  entries: MotifEntry[];
  currentEntry: string;
  setCurrentEntry: (entry: string) => void;
  onEntrySubmit: (entry: MotifEntry) => void;
  onEntryDelete: (id: string) => void;
}

export const MainTabs = ({ entries, currentEntry, setCurrentEntry, onEntrySubmit, onEntryDelete }: MainTabsProps) => {
  return (
    <Tabs defaultValue="chat" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8 glass-morph border-border/30 shadow-lg">
        <TabsTrigger 
          value="chat" 
          className="flex items-center gap-3 whisper-button data-[state=active]:bg-coastal/20 data-[state=active]:text-primary data-[state=active]:shadow-md fade-transition font-medium"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="font-serif">Dialogue</span>
        </TabsTrigger>
        <TabsTrigger 
          value="reflections" 
          className="flex items-center gap-3 whisper-button data-[state=active]:bg-sage/20 data-[state=active]:text-primary data-[state=active]:shadow-md fade-transition font-medium"
        >
          <Brain className="w-4 h-4" />
          <span className="font-serif">Archive</span>
        </TabsTrigger>
        <TabsTrigger 
          value="patterns" 
          className="flex items-center gap-3 whisper-button data-[state=active]:bg-accent/20 data-[state=active]:text-primary data-[state=active]:shadow-md fade-transition font-medium"
        >
          <Map className="w-4 h-4" />
          <span className="font-serif">Patterns</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chat" className="space-y-8 fade-transition">
        <div className="moodboard-card">
          <ChatInterface 
            onReflectionCapture={onEntrySubmit}
            reflections={entries}
          />
        </div>
      </TabsContent>

      <TabsContent value="reflections" className="space-y-8 fade-transition">
        <div className="moodboard-card">
          <ReflectionsManager 
            entries={entries}
            onDelete={onEntryDelete}
          />
        </div>
      </TabsContent>

      <TabsContent value="patterns" className="space-y-8 fade-transition">
        <div className="moodboard-card">
          <MotifDisplay entries={entries} />
        </div>
      </TabsContent>
    </Tabs>
  );
};
