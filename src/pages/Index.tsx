import { useState } from 'react';
import { WindDownMode } from '../components/WindDownMode';
import { UserBillOfRights } from '../components/UserBillOfRights';
import { GettingStartedGuide } from '../components/GettingStartedGuide';
import { Header } from '../components/Header';
import { EmergencyProtocol } from '../components/EmergencyProtocol';
import { MainTabs } from '../components/MainTabs';
import { useMantra } from '../hooks/useMantra';
import { useAuth } from '../hooks/useAuth';
import { AuthPage } from '../components/AuthPage';
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
  const { user, loading } = useAuth();
  const [entries, setEntries] = useState<MotifEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [isWindDownMode, setIsWindDownMode] = useState(false);
  const [showEmergencyProtocol, setShowEmergencyProtocol] = useState(false);
  const [showBillOfRights, setShowBillOfRights] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  
  const currentMantra = useMantra(entries);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  // Show auth page if user is not logged in
  if (!user) {
    return <AuthPage />;
  }

  const handleNewEntry = (entry: MotifEntry) => {
    setEntries(prev => [entry, ...prev]);
    setCurrentEntry('');
    
    // Check for emergency triggers
    const emergencyPhrases = ['display personal id', 'initiate translator mode'];
    if (emergencyPhrases.some(phrase => entry.content.toLowerCase().includes(phrase))) {
      setShowEmergencyProtocol(true);
    }
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleWindDownEntry = (entry: MotifEntry) => {
    handleNewEntry(entry);
    setIsWindDownMode(false);
  };

  if (showGettingStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowGettingStarted(false)}
            className="mb-4 hover:bg-slate-50 transition-colors"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowBillOfRights(false)}
            className="mb-4 hover:bg-slate-50 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4">
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
          onEntryDelete={handleDeleteEntry}
        />
      </div>
    </div>
  );
};

export default Index;
