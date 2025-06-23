
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WelcomeScreen } from './WelcomeScreen';
import { ProcessScreen } from './ProcessScreen';
import { LanguageScreen } from './LanguageScreen';
import { SafetyScreen } from './SafetyScreen';
import { FirstEntryScreen } from './FirstEntryScreen';

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

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 border-blue-200/30">
        <div className="relative h-full">
          {/* Progress indicator */}
          <div className="absolute top-6 left-6 right-6 z-10">
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

          {/* Screen content */}
          <div className="pt-16 pb-20 px-8 h-full overflow-y-auto">
            <CurrentScreenComponent 
              onComplete={currentScreen === 4 ? handleFirstEntry : undefined}
            />
          </div>

          {/* Navigation */}
          {currentScreen < 4 && (
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
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
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
