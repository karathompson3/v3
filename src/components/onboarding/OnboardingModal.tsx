
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { WelcomeScreen } from './WelcomeScreen';
import { ProcessScreen } from './ProcessScreen';
import { LanguageScreen } from './LanguageScreen';
import { SafetyScreen } from './SafetyScreen';
import { FirstEntryScreen } from './FirstEntryScreen';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface OnboardingModalProps {
  open: boolean;
  onComplete: (firstEntry?: any) => void;
}

export const OnboardingModal = ({ open, onComplete }: OnboardingModalProps) => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    { component: WelcomeScreen, showNext: true, showPrev: false },
    { component: ProcessScreen, showNext: true, showPrev: true },
    { component: LanguageScreen, showNext: true, showPrev: true },
    { component: SafetyScreen, showNext: true, showPrev: true },
    { component: FirstEntryScreen, showNext: false, showPrev: true }
  ];

  const CurrentScreenComponent = screens[currentScreen].component;

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handlePrev = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleFirstEntry = (entry: any) => {
    onComplete(entry);
  };

  const handleClose = () => {
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 border-blue-200/30 flex flex-col">
        <VisuallyHidden>
          <DialogTitle>Onboarding - Step {currentScreen + 1} of {screens.length}</DialogTitle>
        </VisuallyHidden>
        
        {/* Close button */}
        <div className="absolute top-4 right-4 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Progress indicator - Fixed at top */}
        <div className="flex-shrink-0 p-6 pb-4">
          <div className="flex gap-2">
            {screens.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  index <= currentScreen ? 'bg-blue-400' : 'bg-blue-900/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Screen content - Scrollable middle section */}
        <div className="flex-1 px-8 overflow-y-auto">
          <CurrentScreenComponent 
            onComplete={currentScreen === 4 ? handleFirstEntry : undefined}
          />
        </div>

        {/* Navigation - Fixed at bottom */}
        {currentScreen < 4 && (
          <div className="flex-shrink-0 p-6 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={!screens[currentScreen].showPrev}
                className="text-blue-200 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!screens[currentScreen].showNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
