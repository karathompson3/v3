import { useState } from 'react';
import { WindDownMode } from '../components/WindDownMode';
import { UserBillOfRights } from '../components/UserBillOfRights';
import { GettingStartedGuide } from '../components/GettingStartedGuide';
import { Header } from '../components/Header';
import { EmergencyProtocol } from '../components/EmergencyProtocol';
import { MainTabs } from '../components/MainTabs';
import { useMantra } from '../hooks/useMantra';
import { Button } from '@/components/ui/button';

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
  const [showBillOfRights, setShowBillOfRights] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  
  const currentMantra = useMantra(entries);

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

  if (showGettingStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowGettingStarted(false)}
            className="mb-4"
          >
            ← Back to App
          </Button>
        </div>
        <GettingStartedGuide />
      </div>
    );
  }

  if (showBillOfRights) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowBillOfRights(false)}
            className="mb-4"
          >
            ← Back to App
          </Button>
        </div>
        <UserBillOfRights />
      </div>
    );
  }

  if (showEmergencyProtocol) {
    return (
      <EmergencyProtocol 
        entriesCount={entries.length}
        onClose={() => setShowEmergencyProtocol(false)}
      />
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
        <Header
          currentMantra={currentMantra}
          onWindDownMode={() => setIsWindDownMode(true)}
          onEmergencyProtocol={() => setShowEmergencyProtocol(true)}
          onShowBillOfRights={() => setShowBillOfRights(true)}
          onShowGettingStarted={() => setShowGettingStarted(true)}
        />

        <MainTabs
          entries={entries}
          currentEntry={currentEntry}
          setCurrentEntry={setCurrentEntry}
          onEntrySubmit={handleNewEntry}
        />
      </div>
    </div>
  );
};

export default Index;
