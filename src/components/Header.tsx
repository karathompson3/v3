
interface HeaderProps {
  currentMantra: string;
  onWindDownMode: () => void;
  onEmergencyProtocol: () => void;
  onShowBillOfRights: () => void;
  onShowGettingStarted: () => void;
}

import { Button } from '@/components/ui/button';
import { Moon, Shield, ScrollText, BookOpen, Sparkles } from 'lucide-react';

export const Header = ({ 
  currentMantra, 
  onWindDownMode, 
  onEmergencyProtocol, 
  onShowBillOfRights,
  onShowGettingStarted
}: HeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="relative">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-slate-800 bg-clip-text text-transparent mb-3">
          V3
        </h1>
        <div className="absolute -top-1 -right-4">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
            <Sparkles className="w-3 h-3 mr-1" />
            demo
          </span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="inline-block p-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-700 italic font-medium max-w-lg">
            {currentMantra}
          </p>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="flex justify-center gap-3 mb-6 flex-wrap">
        <Button
          variant="outline"
          onClick={onShowGettingStarted}
          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
        >
          <BookOpen className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
          How to Use
        </Button>
        <Button
          variant="outline"
          onClick={onWindDownMode}
          className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 group"
        >
          <Moon className="w-4 h-4 group-hover:text-purple-600 transition-colors" />
          Wind-Down Mode
        </Button>
        <Button
          variant="outline"
          onClick={onEmergencyProtocol}
          className="flex items-center gap-2 hover:bg-amber-50 hover:border-amber-300 transition-all duration-200 group"
        >
          <Shield className="w-4 h-4 group-hover:text-amber-600 transition-colors" />
          Display Personal ID
        </Button>
        <Button
          variant="outline"
          onClick={onShowBillOfRights}
          className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-all duration-200 group"
        >
          <ScrollText className="w-4 h-4 group-hover:text-green-600 transition-colors" />
          Privacy Rights
        </Button>
      </div>
    </div>
  );
};
