
import { useState, useEffect } from 'react';
import { WindDownMode } from '../components/WindDownMode';
import { UserBillOfRights } from '../components/UserBillOfRights';
import { GettingStartedGuide } from '../components/GettingStartedGuide';
import { Header } from '../components/Header';
import { EmergencyProtocol } from '../components/EmergencyProtocol';
import { MainTabs } from '../components/MainTabs';
import { ProtocolTemplates } from '../components/ProtocolTemplates';
import { SignalContributionModal } from '../components/SignalContributionModal';
import { useMantra } from '../hooks/useMantra';
import { useAuth } from '../hooks/useAuth';
import { useGovernance } from '../hooks/useGovernance';
import { AuthPage } from '../components/AuthPage';
import { Button } from '@/components/ui/button';
import { Footer } from '../components/Footer';
import { OnboardingModal } from '../components/onboarding/OnboardingModal';
import { TranslatorMode } from '../components/TranslatorMode';
import { useToast } from '@/hooks/use-toast';
import { WeeklyRecapCard } from '../components/WeeklyRecapCard';
import { useWeeklyRecap } from '../hooks/useWeeklyRecap';

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
  metadata?: {
    originalText?: string;
    translatedText?: string;
    entryType?: string;
  };
}

const Index = () => {
  const { user, loading } = useAuth();
  const { logInteraction } = useGovernance();
  const { toast } = useToast();
  const { shouldShowRecap, markRecapShown, showRecapManually } = useWeeklyRecap(user?.id);
  
  const [entries, setEntries] = useState<MotifEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [isWindDownMode, setIsWindDownMode] = useState(false);
  const [showEmergencyProtocol, setShowEmergencyProtocol] = useState(false);
  const [showBillOfRights, setShowBillOfRights] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTranslatorMode, setShowTranslatorMode] = useState(false);
  const [showProtocolLibrary, setShowProtocolLibrary] = useState(false);
  const [showWeeklyRecap, setShowWeeklyRecap] = useState(false);
  const [translatorInitialText, setTranslatorInitialText] = useState('');
  
  const currentMantra = useMantra(entries);

  // Check onboarding status when user changes
  useEffect(() => {
    if (user) {
      const hasCompletedOnboarding = localStorage.getItem(`onboarding_complete_${user.id}`);
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [user]);

  // Show weekly recap when it's time
  useEffect(() => {
    if (shouldShowRecap && !showOnboarding && !isWindDownMode && !showEmergencyProtocol) {
      setShowWeeklyRecap(true);
    }
  }, [shouldShowRecap, showOnboarding, isWindDownMode, showEmergencyProtocol]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white/60 font-light tracking-wide font-serif italic candle-flicker">
          The codex awakens...
        </div>
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
    
    // Log the interaction for governance transparency
    logInteraction({
      type: 'entry_created',
      input: entry.content,
      motifTags: entry.motifs,
      metadata: {
        emotionalTone: entry.emotionalTone,
        intent: entry.intent,
        hasMedia: !!entry.media,
      },
      visible: true,
    });

    // Check for motifs and log them
    if (entry.motifs.length > 0) {
      logInteraction({
        type: 'motif_detected',
        input: entry.content,
        motifTags: entry.motifs,
        metadata: {
          detectedMotifs: entry.motifs,
          totalMotifs: entry.motifs.length,
        },
        visible: true,
      });
    }
    
    // Check for emergency triggers
    const emergencyPhrases = ['display personal id', 'initiate translator mode'];
    if (emergencyPhrases.some(phrase => entry.content.toLowerCase().includes(phrase))) {
      setShowEmergencyProtocol(true);
      logInteraction({
        type: 'system_update',
        input: 'Emergency protocol triggered',
        metadata: {
          trigger: 'emergency_phrase_detected',
          phrase: emergencyPhrases.find(phrase => entry.content.toLowerCase().includes(phrase)),
        },
        visible: true,
      });
    }
  };

  const handleDeleteEntry = (id: string) => {
    const deletedEntry = entries.find(entry => entry.id === id);
    setEntries(prev => prev.filter(entry => entry.id !== id));
    
    if (deletedEntry) {
      logInteraction({
        type: 'system_update',
        input: 'Entry deleted',
        metadata: {
          deletedEntryId: id,
          entryContent: deletedEntry.content.substring(0, 100),
        },
        visible: true,
      });
    }
  };

  const handleWindDownEntry = (entry: MotifEntry) => {
    handleNewEntry(entry);
    setIsWindDownMode(false);
    
    logInteraction({
      type: 'system_update',
      input: 'Wind-down mode session completed',
      metadata: {
        windDownEntry: true,
        entryLength: entry.content.length,
      },
      visible: true,
    });
  };

  const handleShowOnboardingAgain = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (firstEntry?: MotifEntry) => {
    if (user) {
      localStorage.setItem(`onboarding_complete_${user.id}`, 'true');
    }
    
    if (firstEntry) {
      handleNewEntry(firstEntry);
    }
    
    setShowOnboarding(false);
  };

  const handleTranslatorMode = (text: string) => {
    setTranslatorInitialText(text);
    setShowTranslatorMode(true);
    
    logInteraction({
      type: 'system_update',
      input: 'Translator mode initiated',
      metadata: {
        trigger: 'translator_mode_request',
        originalTextLength: text.length,
      },
      visible: true,
    });
  };

  const handleTranslatorEntry = (entry: MotifEntry) => {
    handleNewEntry(entry);
    
    logInteraction({
      type: 'entry_created',
      input: 'Translation completed',
      motifTags: entry.motifs,
      metadata: {
        translatorMode: true,
        originalText: entry.metadata?.originalText,
        translatedText: entry.metadata?.translatedText,
      },
      visible: true,
    });
  };

  const handleProtocolLibraryUse = (template: string) => {
    setCurrentEntry(template);
    setShowProtocolLibrary(false);
    
    toast({
      title: "Template applied",
      description: "Protocol template has been loaded into your entry field",
    });
    
    logInteraction({
      type: 'system_update',
      input: 'Protocol template used from library',
      metadata: {
        templateUsed: true,
        templateLength: template.length,
      },
      visible: true,
    });
  };

  const handleWeeklyRecapViewThread = (motif: string) => {
    // Navigate to the motif thread view
    setShowWeeklyRecap(false);
    // You could implement navigation to a specific motif thread here
    console.log('Viewing thread for motif:', motif);
  };

  const handleWeeklyRecapNewEntry = () => {
    setShowWeeklyRecap(false);
    // Focus on the main entry input
    setCurrentEntry('');
  };

  const handleWeeklyRecapClose = () => {
    setShowWeeklyRecap(false);
    markRecapShown();
  };

  if (showGettingStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => setShowGettingStarted(false)}
            className="whisper-hover bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            ← Return to Codex
          </Button>
        </div>
        <GettingStartedGuide />
      </div>
    );
  }

  if (showBillOfRights) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => setShowBillOfRights(false)}
            className="whisper-hover bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            ← Return to Codex
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
      <div className="ritual-vignette fixed inset-0 z-50">
        <WindDownMode 
          onEntry={handleWindDownEntry}
          onClose={() => setIsWindDownMode(false)}
          recentEntries={entries.slice(0, 3)}
        />
      </div>
    );
  }

  if (showTranslatorMode) {
    return (
      <TranslatorMode
        initialText={translatorInitialText}
        onEntry={handleTranslatorEntry}
        onClose={() => {
          setShowTranslatorMode(false);
          setTranslatorInitialText('');
        }}
      />
    );
  }

  if (showProtocolLibrary) {
    return (
      <ProtocolTemplates
        onUseTemplate={handleProtocolLibraryUse}
        onClose={() => setShowProtocolLibrary(false)}
      />
    );
  }

  if (showWeeklyRecap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-6">
        <WeeklyRecapCard
          entries={entries}
          onViewThread={handleWeeklyRecapViewThread}
          onStartNewEntry={handleWeeklyRecapNewEntry}
          onClose={handleWeeklyRecapClose}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 memory-mapping-mode">
      {/* Mystical background texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-br from-blue-300/5 via-transparent to-purple-300/5"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <Header
          currentMantra={currentMantra}
          onWindDownMode={() => setIsWindDownMode(true)}
          onEmergencyProtocol={() => setShowEmergencyProtocol(true)}
          onShowBillOfRights={() => setShowBillOfRights(true)}
          onShowGettingStarted={() => setShowGettingStarted(true)}
          onShowOnboarding={handleShowOnboardingAgain}
          onShowProtocolLibrary={() => setShowProtocolLibrary(true)}
          onShowWeeklyRecap={showRecapManually}
        />

        {/* Sacred codex interface */}
        <div className="mt-12">
          <MainTabs
            entries={entries}
            currentEntry={currentEntry}
            setCurrentEntry={setCurrentEntry}
            onEntrySubmit={handleNewEntry}
            onEntryDelete={handleDeleteEntry}
            onTranslatorMode={handleTranslatorMode}
          />
        </div>
        
        <Footer />
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal 
        open={showOnboarding}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
};

export default Index;
