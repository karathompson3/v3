
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, GitBranch, Users, ExternalLink } from 'lucide-react';

interface GovernanceCovenantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GovernanceCovenantModal = ({ open, onOpenChange }: GovernanceCovenantModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            V3 Governance Covenant & Transparency Pledge
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Current Model */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Current Model: Open Access (Not Open Source)
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">✅ Open Access</Badge>
                  <span>Anyone in the demo group can use the system freely</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-red-100 text-red-800">🚫 Protected Core</Badge>
                  <span>Model weights and internal tuning logic are not editable</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">✅ Transparent Logs</Badge>
                  <span>Prompt-response logs and motif tagging are visible to you</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">✅ Full Auditability</Badge>
                  <span>Every interaction is auditable with optional trace mode</span>
                </div>
              </div>
            </div>

            {/* Role-Based Permissions */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Role-Based Permission Layers
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Role</th>
                      <th className="text-left py-2 font-medium">Permissions</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b">
                      <td className="py-2 font-medium text-blue-600">Viewer</td>
                      <td className="py-2">Read-only access to system behavior + own logs</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-purple-600">Trusted Contributor</td>
                      <td className="py-2">Can flag motif tags, propose edits, add structured reflections</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-amber-600">Core Steward</td>
                      <td className="py-2">Final authority on motif weights, system values, model updates</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Governance Philosophy */}
            <div className="border rounded-lg p-4 bg-slate-50">
              <h3 className="font-semibold text-slate-800 mb-3">Governance Philosophy</h3>
              <div className="space-y-3 text-sm text-slate-700">
                <p className="font-medium text-slate-800">
                  V3 is built on a <strong>verify-then-trust</strong> model.
                </p>
                <p>
                  It will always prioritize <strong>traceability</strong>, <strong>user consent</strong>, 
                  and <strong>visible evolution</strong> over speed or secrecy.
                </p>
                <p className="italic bg-white p-3 rounded border-l-4 border-blue-400">
                  "We believe AI should feel like Wikipedia, not Oracle — understandable, 
                  inspectable, and open to intelligent challenge."
                </p>
              </div>
            </div>

            {/* Blockchain Integration Placeholder */}
            <div className="border rounded-lg p-4 bg-amber-50">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Future: Blockchain Integration (In Development)
              </h3>
              <div className="space-y-2 text-sm text-amber-700">
                <div>📋 Consent-based ingestion contracts</div>
                <div>🔗 Transparent edit ledger</div>
                <div>⚖️ Weighted motif impact tracking</div>
                <div>🍴 Forkable model governance</div>
              </div>
              <p className="text-xs text-amber-600 mt-2">
                Current architecture is designed with modularity for future blockchain integration.
              </p>
            </div>

            {/* Open Source Commitment */}
            <div className="border rounded-lg p-4 bg-green-50">
              <h3 className="font-semibold text-green-800 mb-3">Open Source Roadmap Declaration</h3>
              <div className="space-y-3 text-sm text-green-700">
                <p>
                  <strong>This system is not currently open source, but it is open access.</strong>
                </p>
                <p>
                  Our long-term commitment is to release the full system when safety, clarity, 
                  and user sovereignty can be guaranteed.
                </p>
                <p className="text-xs text-green-600">
                  This signals our ethos without exposing scaffolding too early.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-xs text-slate-500">
            Version 3.0.0-demo • Updated {new Date().toLocaleDateString()}
          </div>
          <Button onClick={() => onOpenChange(false)}>
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
