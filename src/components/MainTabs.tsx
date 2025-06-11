
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
      <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
        <TabsTrigger 
          value="chat" 
          className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 transition-all duration-200"
        >
          <MessageCircle className="w-4 h-4" />
          AI Chat
        </TabsTrigger>
        <TabsTrigger 
          value="reflections" 
          className="flex items-center gap-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 transition-all duration-200"
        >
          <Brain className="w-4 h-4" />
          Reflections
        </TabsTrigger>
        <TabsTrigger 
          value="patterns" 
          className="flex items-center gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 transition-all duration-200"
        >
          <Map className="w-4 h-4" />
          Patterns
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chat" className="space-y-6">
        <ChatInterface 
          onReflectionCapture={onEntrySubmit}
          reflections={entries}
        />
      </TabsContent>

      <TabsContent value="reflections" className="space-y-6">
        <ReflectionsManager 
          entries={entries}
          onDelete={onEntryDelete}
        />
      </TabsContent>

      <TabsContent value="patterns" className="space-y-6">
        <MotifDisplay entries={entries} />
      </TabsContent>
    </Tabs>
  );
};
