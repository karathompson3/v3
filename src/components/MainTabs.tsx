
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JournalEntry } from './JournalEntry';
import { MotifDisplay } from './MotifDisplay';
import { NextMoveList } from './NextMoveList';
import { NarrativeMap } from './NarrativeMap';

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
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="journal">Journal</TabsTrigger>
        <TabsTrigger value="narrative">Narrative Map</TabsTrigger>
        <TabsTrigger value="moves">Next Moves</TabsTrigger>
      </TabsList>

      <TabsContent value="journal">
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

      <TabsContent value="narrative">
        <NarrativeMap entries={entries} />
      </TabsContent>

      <TabsContent value="moves">
        <NextMoveList entries={entries} />
      </TabsContent>
    </Tabs>
  );
};
