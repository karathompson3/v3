
import { useState, useEffect } from 'react';
import { UserRole, UserPermissions, InteractionLog, GovernanceConfig } from '../types/Governance';
import { useAuth } from './useAuth';

const DEFAULT_GOVERNANCE_CONFIG: GovernanceConfig = {
  version: '3.0.0-demo',
  lastUpdated: new Date(),
  transparencyMode: 'full',
  auditingEnabled: true,
  userCanViewOwnLogs: true,
  publicMotifWeights: true,
};

// For now, using localStorage for role management - will be backend later
const getUserRole = (userId?: string): UserRole => {
  if (!userId) return 'viewer';
  
  // Placeholder logic - in production this would come from backend
  const storedRole = localStorage.getItem(`user_role_${userId}`);
  return (storedRole as UserRole) || 'viewer';
};

const getRolePermissions = (role: UserRole): UserPermissions => {
  switch (role) {
    case 'core_steward':
      return {
        canViewLogs: true,
        canFlagMotifs: true,
        canProposeEdits: true,
        canAddReflections: true,
        canModifyWeights: true,
        canUpdateSystemValues: true,
      };
    case 'trusted_contributor':
      return {
        canViewLogs: true,
        canFlagMotifs: true,
        canProposeEdits: true,
        canAddReflections: true,
        canModifyWeights: false,
        canUpdateSystemValues: false,
      };
    case 'viewer':
    default:
      return {
        canViewLogs: true,
        canFlagMotifs: false,
        canProposeEdits: false,
        canAddReflections: false,
        canModifyWeights: false,
        canUpdateSystemValues: false,
      };
  }
};

export const useGovernance = () => {
  const { user } = useAuth();
  const [interactionLogs, setInteractionLogs] = useState<InteractionLog[]>([]);
  const [governanceConfig] = useState<GovernanceConfig>(DEFAULT_GOVERNANCE_CONFIG);
  
  const userRole = getUserRole(user?.id);
  const permissions = getRolePermissions(userRole);

  const logInteraction = (log: Omit<InteractionLog, 'id' | 'timestamp' | 'userId'>) => {
    const newLog: InteractionLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      userId: user?.id,
    };
    
    setInteractionLogs(prev => [newLog, ...prev.slice(0, 999)]); // Keep last 1000 logs
    
    // Store in localStorage for persistence
    const existingLogs = JSON.parse(localStorage.getItem('interaction_logs') || '[]');
    existingLogs.unshift(newLog);
    localStorage.setItem('interaction_logs', JSON.stringify(existingLogs.slice(0, 1000)));
  };

  const getUserLogs = () => {
    if (!permissions.canViewLogs) return [];
    return interactionLogs.filter(log => 
      log.visible && (userRole === 'core_steward' || log.userId === user?.id)
    );
  };

  useEffect(() => {
    // Load existing logs
    const storedLogs = JSON.parse(localStorage.getItem('interaction_logs') || '[]');
    setInteractionLogs(storedLogs.map((log: any) => ({
      ...log,
      timestamp: new Date(log.timestamp)
    })));
  }, []);

  return {
    userRole,
    permissions,
    governanceConfig,
    interactionLogs: getUserLogs(),
    logInteraction,
  };
};
