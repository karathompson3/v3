
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JournalEntry } from './JournalEntry';
import { MotifDisplay } from './MotifDisplay';
import { NextMoveList } from './NextMoveList';
import { NarrativeMap } from './NarrativeMap';
import { PenTool, Map, ArrowRight } from 'lucide-react';

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
}

export const MainTabs = ({ entries, currentEntry, setCurrentEntry, onEntrySubmit }: MainTabsProps) => {
  return (
    <Tabs defaultValue="journal" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
        <TabsTrigger 
          value="journal" 
          className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 transition-all duration-200"
        >
          <PenTool className="w-4 h-4" />
          Journal
        </TabsTrigger>
        <TabsTrigger 
          value="narrative" 
          className="flex items-center gap-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 transition-all duration-200"
        >
          <Map className="w-4 h-4" />
          Narrative Map
        </TabsTrigger>
        <TabsTrigger 
          value="moves" 
          className="flex items-center gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 transition-all duration-200"
        >
          <ArrowRight className="w-4 h-4" />
          Next Moves
        </TabsTrigger>
      </TabsList>

      <TabsContent value="journal" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <JournalEntry 
              onEntrySubmit={onEntrySubmit}
              currentEntry={currentEntry}
              setCurrentEntry={setCurrentEntry}
              existingEntries={entries}
            />
          </div>
          <div>
            <MotifDisplay entries={entries} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="narrative" className="space-y-6">
        <NarrativeMap entries={entries} />
      </TabsContent>

      <TabsContent value="moves" className="space-y-6">
        <NextMoveList entries={entries} />
      </TabsContent>
    </Tabs>
  );
};
