import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JournalEntry } from './JournalEntry';
import { MotifDisplay } from './MotifDisplay';
import { NarrativeMap } from './NarrativeMap';
import { ReflectionsManager } from './ReflectionsManager';
import { BookOpen, Map, Sparkles, MessageSquare } from 'lucide-react';

interface MotifEntry {
  id: string;
  content: string;
  motifs: string[];
  timestamp: Date;
  emotionalTone: string;
  intent: string;
  dictionaryTerms?: string[];
  media?: {
    type: 'photo' | 'voice';
    url: string;
    duration?: number;
    caption?: string;
  };
  metadata?: {
    originalText?: string;
    entryType?: string;
    [key: string]: any;
  };
}

interface MainTabsProps {
  entries: MotifEntry[];
  currentEntry: string;
  setCurrentEntry: (entry: string) => void;
  onEntrySubmit: (entry: MotifEntry) => void;
  onEntryDelete: (id: string) => void;
  onTranslatorMode?: (text: string) => void;
}

export const MainTabs = ({ 
  entries, 
  currentEntry, 
  setCurrentEntry, 
  onEntrySubmit, 
  onEntryDelete,
  onTranslatorMode 
}: MainTabsProps) => {
  return (
    <Tabs defaultValue="journal" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
        <TabsTrigger value="journal" className="flex items-center gap-2 text-white data-[state=active]:bg-white/20">
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Journal</span>
        </TabsTrigger>
        <TabsTrigger value="motifs" className="flex items-center gap-2 text-white data-[state=active]:bg-white/20">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Motifs</span>
        </TabsTrigger>
        <TabsTrigger value="narrative" className="flex items-center gap-2 text-white data-[state=active]:bg-white/20">
          <Map className="w-4 h-4" />
          <span className="hidden sm:inline">Map</span>
        </TabsTrigger>
        <TabsTrigger value="reflections" className="flex items-center gap-2 text-white data-[state=active]:bg-white/20">
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Reflect</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="journal" className="mt-6">
        <JournalEntry
          onEntrySubmit={onEntrySubmit}
          currentEntry={currentEntry}
          setCurrentEntry={setCurrentEntry}
          existingEntries={entries}
          onTranslatorMode={onTranslatorMode}
        />
      </TabsContent>

      <TabsContent value="motifs" className="mt-6">
        <MotifDisplay 
          entries={entries} 
          onEntryDelete={onEntryDelete}
        />
      </TabsContent>

      <TabsContent value="narrative" className="mt-6">
        <NarrativeMap entries={entries} />
      </TabsContent>

      <TabsContent value="reflections" className="mt-6">
        <ReflectionsManager 
          entries={entries} 
          onDelete={onEntryDelete}
        />
      </TabsContent>
    </Tabs>
  );
};
