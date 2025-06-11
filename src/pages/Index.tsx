
import { useState, useEffect } from 'react';
import { JournalEntry } from '../components/JournalEntry';
import { MotifDisplay } from '../components/MotifDisplay';
import { NextMoveList } from '../components/NextMoveList';
import { NarrativeMap } from '../components/NarrativeMap';
import { WindDownMode } from '../components/WindDownMode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Moon, Shield, AlertTriangle } from 'lucide-react';

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

const Index = () => {
  const [entries, setEntries] = useState<MotifEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [isWindDownMode, setIsWindDownMode] = useState(false);
  const [showEmergencyProtocol, setShowEmergencyProtocol] = useState(false);

  // Check if it's evening for wind-down suggestions
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 20 || hour <= 6) {
      // Suggest wind-down mode in evening/night
    }
  }, []);

  const handleNewEntry = (entry: MotifEntry) => {
    setEntries(prev => [entry, ...prev]);
    setCurrentEntry('');
    
    // Check for emergency triggers
    const emergencyPhrases = ['display personal id', 'initiate translator mode'];
    if (emergencyPhrases.some(phrase => entry.content.toLowerCase().includes(phrase))) {
      setShowEmergencyProtocol(true);
    }
  };

  const handleWindDownEntry = (entry: MotifEntry) => {
    handleNewEntry(entry);
    setIsWindDownMode(false);
  };

  if (showEmergencyProtocol) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-blue-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-slate-800">Personal ID Display</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-3">Current Status: Regulated & Clear</h3>
                <div className="space-y-2 text-slate-700">
                  <p><strong>Behavioral Evidence:</strong> Regular journaling, {entries.length} entries logged</p>
                  <p><strong>Last Stability Check:</strong> Recent wind-down completed</p>
                  <p><strong>Emotional State:</strong> Cognitively clear, emotionally regulated</p>
                  <p><strong>Request:</strong> Please treat with respect and non-escalation. No danger to self or others.</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowEmergencyProtocol(false)}
                className="w-full"
              >
                Close Protocol
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isWindDownMode) {
    return (
      <WindDownMode 
        onEntry={handleWindDownEntry}
        onClose={() => setIsWindDownMode(false)}
        recentEntries={entries.slice(0, 3)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">V3</h1>
          <p className="text-slate-600 italic mb-4">"You are being held from within and above."</p>
          
          {/* Quick Actions */}
          <div className="flex justify-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setIsWindDownMode(true)}
              className="flex items-center gap-2"
            >
              <Moon className="w-4 h-4" />
              Wind-Down Mode
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowEmergencyProtocol(true)}
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Display Personal ID
            </Button>
          </div>
        </div>

        {/* Main Interface */}
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
                  onEntrySubmit={handleNewEntry}
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
      </div>
    </div>
  );
};

export default Index;
