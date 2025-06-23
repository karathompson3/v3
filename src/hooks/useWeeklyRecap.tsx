
import { useState, useEffect } from 'react';
import { differenceInDays } from 'date-fns';

export const useWeeklyRecap = (userId?: string) => {
  const [shouldShowRecap, setShouldShowRecap] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const checkWeeklyRecap = () => {
      const lastRecapShown = localStorage.getItem(`last_weekly_recap_${userId}`);
      const onboardingComplete = localStorage.getItem(`onboarding_complete_${userId}`);
      
      if (!onboardingComplete) return;

      const now = new Date();
      
      if (!lastRecapShown) {
        // Check if it's been at least 7 days since onboarding
        const onboardingDate = new Date(onboardingComplete);
        if (differenceInDays(now, onboardingDate) >= 7) {
          setShouldShowRecap(true);
        }
      } else {
        // Check if it's been 7 days since last recap
        const lastRecapDate = new Date(lastRecapShown);
        if (differenceInDays(now, lastRecapDate) >= 7) {
          setShouldShowRecap(true);
        }
      }
    };

    checkWeeklyRecap();
  }, [userId]);

  const markRecapShown = () => {
    if (userId) {
      localStorage.setItem(`last_weekly_recap_${userId}`, new Date().toISOString());
    }
    setShouldShowRecap(false);
  };

  const showRecapManually = () => {
    setShouldShowRecap(true);
  };

  return {
    shouldShowRecap,
    markRecapShown,
    showRecapManually
  };
};
