
interface HeaderProps {
  currentMantra: string;
  onWindDownMode: () => void;
  onEmergencyProtocol: () => void;
  onShowBillOfRights: () => void;
  onShowGettingStarted: () => void;
  onShowOnboarding?: () => void;
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Shield, ScrollText, BookOpen, Sparkles, Clock, FileText } from 'lucide-react';
import { GovernanceCovenantModal } from './GovernanceCovenantModal';
import { InteractionLogsModal } from './InteractionLogsModal';
import { useGovernance } from '../hooks/useGovernance';
import { useAuth } from '../hooks/useAuth';

export const Header = ({ 
  currentMantra, 
  onWindDownMode, 
  onEmergencyProtocol, 
  onShowBillOfRights,
  onShowGettingStarted,
  onShowOnboarding
}: HeaderProps) => {
  const [showGovernanceModal, setShowGovernanceModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const { userRole, permissions } = useGovernance();
  const { user } = useAuth();

  const handleShowOnboarding = () => {
    if (user && onShowOnboarding) {
      // Clear the onboarding completion flag and show onboarding
      localStorage.removeItem(`onboarding_complete_${user.id}`);
      onShowOnboarding();
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="relative">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-3">
            V3
          </h1>
          <div className="absolute -top-1 -right-4">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100/20 text-blue-100 rounded-full border border-blue-200/30">
              <Sparkles className="w-3 h-3 mr-1" />
              demo
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
            <p className="text-blue-100 italic font-medium max-w-lg">
              {currentMantra}
            </p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          <Button
            variant="outline"
            onClick={onShowGettingStarted}
            className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200 group"
          >
            <BookOpen className="w-4 h-4 group-hover:text-blue-300 transition-colors" />
            How to Use
          </Button>
          {user && onShowOnboarding && (
            <Button
              variant="outline"
              onClick={handleShowOnboarding}
              className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200 group text-sm"
            >
              <Sparkles className="w-4 h-4 group-hover:text-blue-300 transition-colors" />
              About V3
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onWindDownMode}
            className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200 group"
          >
            <Moon className="w-4 h-4 group-hover:text-purple-300 transition-colors" />
            Wind-Down Mode
          </Button>
          <Button
            variant="outline"
            onClick={onEmergencyProtocol}
            className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200 group"
          >
            <Shield className="w-4 h-4 group-hover:text-amber-300 transition-colors" />
            Display Personal ID
          </Button>
          <Button
            variant="outline"
            onClick={onShowBillOfRights}
            className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200 group"
          >
            <ScrollText className="w-4 h-4 group-hover:text-green-300 transition-colors" />
            Privacy Rights
          </Button>
        </div>

        {/* Governance Actions */}
        <div className="flex justify-center gap-3 mb-4 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowGovernanceModal(true)}
            className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200 group text-xs"
          >
            <FileText className="w-3 h-3 group-hover:text-indigo-300 transition-colors" />
            Governance Covenant
          </Button>
          {permissions.canViewLogs && (
            <Button
              variant="outline"
              onClick={() => setShowLogsModal(true)}
              className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200 group text-xs"
            >
              <Clock className="w-3 h-3 group-hover:text-slate-300 transition-colors" />
              Interaction Logs
            </Button>
          )}
        </div>

        <div className="text-xs text-blue-200 mb-2">
          Role: {userRole} • Open Access Model • Full Transparency Mode
        </div>
      </div>

      <GovernanceCovenantModal 
        open={showGovernanceModal} 
        onOpenChange={setShowGovernanceModal} 
      />
      
      <InteractionLogsModal 
        open={showLogsModal} 
        onOpenChange={setShowLogsModal} 
      />
    </>
  );
};
