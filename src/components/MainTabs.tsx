
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatInterface } from './ChatInterface';
import { ReflectionsManager } from './ReflectionsManager';
import { MotifDisplay } from './MotifDisplay';
import { Scroll, Archive, Map } from 'lucide-react';

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
      <TabsList className="grid w-full grid-cols-3 mb-8 portal-glass border-border/30 shadow-lg backdrop-blur-16">
        <TabsTrigger 
          value="chat" 
          className="flex items-center gap-3 whisper-hover data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-md codex-transition font-medium"
        >
          <Scroll className="w-4 h-4" />
          <span className="font-serif">Chronicle</span>
        </TabsTrigger>
        <TabsTrigger 
          value="reflections" 
          className="flex items-center gap-3 whisper-hover data-[state=active]:bg-accent/20 data-[state=active]:text-foreground data-[state=active]:shadow-md codex-transition font-medium"
        >
          <Archive className="w-4 h-4" />
          <span className="font-serif">Codex</span>
        </TabsTrigger>
        <TabsTrigger 
          value="patterns" 
          className="flex items-center gap-3 whisper-hover data-[state=active]:bg-accent/20 data-[state=active]:text-foreground data-[state=active]:shadow-md codex-transition font-medium"
        >
          <Map className="w-4 h-4" />
          <span className="font-serif">Threads</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chat" className="space-y-8 portal-fade">
        <div className="sacred-scroll observatory-glow">
          <ChatInterface 
            onReflectionCapture={onEntrySubmit}
            reflections={entries}
          />
        </div>
      </TabsContent>

      <TabsContent value="reflections" className="space-y-8 portal-fade">
        <div className="sacred-scroll rune-cipher">
          <ReflectionsManager 
            entries={entries}
            onDelete={onEntryDelete}
          />
        </div>
      </TabsContent>

      <TabsContent value="patterns" className="space-y-8 portal-fade">
        <div className="sacred-scroll memory-surface">
          <MotifDisplay entries={entries} />
        </div>
      </TabsContent>
    </Tabs>
  );
};
