
export type UserRole = 'viewer' | 'trusted_contributor' | 'core_steward';

export interface UserPermissions {
  canViewLogs: boolean;
  canFlagMotifs: boolean;
  canProposeEdits: boolean;
  canAddReflections: boolean;
  canModifyWeights: boolean;
  canUpdateSystemValues: boolean;
}

export interface InteractionLog {
  id: string;
  timestamp: Date;
  userId?: string;
  type: 'entry_created' | 'motif_detected' | 'reflection_captured' | 'system_update';
  input: string;
  output?: string;
  motifTags?: string[];
  metadata: Record<string, any>;
  visible: boolean;
}

export interface GovernanceConfig {
  version: string;
  lastUpdated: Date;
  transparencyMode: 'full' | 'partial' | 'minimal';
  auditingEnabled: boolean;
  userCanViewOwnLogs: boolean;
  publicMotifWeights: boolean;
}
