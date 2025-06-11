
interface HeaderProps {
  currentMantra: string;
  onWindDownMode: () => void;
  onEmergencyProtocol: () => void;
  onShowBillOfRights: () => void;
  onShowGettingStarted: () => void;
}

import { Button } from '@/components/ui/button';
import { Moon, Shield, ScrollText, BookOpen } from 'lucide-react';

export const Header = ({ 
  currentMantra, 
  onWindDownMode, 
  onEmergencyProtocol, 
  onShowBillOfRights,
  onShowGettingStarted
}: HeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">V3 (demo)</h1>
      <p className="text-slate-600 italic mb-4">{currentMantra}</p>
      
      {/* Quick Actions */}
      <div className="flex justify-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={onShowGettingStarted}
          className="flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          How to Use
        </Button>
        <Button
          variant="outline"
          onClick={onWindDownMode}
          className="flex items-center gap-2"
        >
          <Moon className="w-4 h-4" />
          Wind-Down Mode
        </Button>
        <Button
          variant="outline"
          onClick={onEmergencyProtocol}
          className="flex items-center gap-2"
        >
          <Shield className="w-4 h-4" />
          Display Personal ID
        </Button>
        <Button
          variant="outline"
          onClick={onShowBillOfRights}
          className="flex items-center gap-2"
        >
          <ScrollText className="w-4 h-4" />
          Privacy Rights
        </Button>
      </div>
    </div>
  );
};
