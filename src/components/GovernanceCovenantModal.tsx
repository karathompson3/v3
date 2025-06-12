
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, GitBranch, Users, ExternalLink, Calendar, Brain } from 'lucide-react';

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
                Current Model: Open Access (Transitioning to Open Source)
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">✅ Open Access</Badge>
                  <span>Anyone in the demo group can use the system freely</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">🔄 Protected Core</Badge>
                  <span>Model weights and internal tuning logic are not editable (temporarily)</span>
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

            {/* Open Source Timeline */}
            <div className="border rounded-lg p-4 bg-green-50">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Open Source Timeline: 1-10 Weeks
              </h3>
              <div className="space-y-3 text-sm text-green-700">
                <p>
                  <strong>Full Open Source Release Coming Soon:</strong> This system will be completely open source within the next 1-10 weeks.
                </p>
                <p>
                  We're currently in the final phase of ensuring safety, clarity, and user sovereignty before releasing the complete codebase, including model weights and all internal logic.
                </p>
                <div className="bg-white p-3 rounded border-l-4 border-green-400">
                  <p className="font-medium">What "Full Open Source" means:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Complete model architecture and weights</li>
                    <li>All training and fine-tuning logic</li>
                    <li>Governance smart contracts</li>
                    <li>Blockchain integration layer</li>
                    <li>Fork-friendly infrastructure</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* User Data Rights */}
            <div className="border rounded-lg p-4 bg-purple-50">
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Absolute User Data Rights
              </h3>
              <div className="space-y-2 text-sm text-purple-700">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">💯 Full Control</Badge>
                  <span>Complete ownership and control over all your data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">✏️ Edit Rights</Badge>
                  <span>Full right to edit, modify, or delete any of your data at any time</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">📤 Export Rights</Badge>
                  <span>Download all your data in machine-readable formats</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">🚫 Revocation</Badge>
                  <span>Revoke consent for model training at any time</span>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-purple-400 mt-3">
                  <p className="font-medium text-purple-800">Your Data, Your Terms:</p>
                  <p className="text-purple-700">When open source, you'll set licensing terms for your data through smart contracts. Duration, scope, and revocation terms are entirely under your control.</p>
                </div>
              </div>
            </div>

            {/* Resource Intelligence Principle */}
            <div className="border rounded-lg p-4 bg-amber-50">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Core Principle: Resource Intelligence
              </h3>
              <div className="space-y-3 text-sm text-amber-700">
                <p className="font-medium text-amber-800">
                  Resource intelligence is the ability to recognize when effort alone is not the answer — and instead identify the right unlock (person, document, question, or prompt) to move forward faster and smarter.
                </p>
                <div className="bg-white p-3 rounded border-l-4 border-amber-400">
                  <p className="font-medium text-amber-800 mb-2">V3 Implementation:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Default to leverage over grind — always ask: what's the unlock?</li>
                    <li>Surface clarifying prompts when you're looping or stuck</li>
                    <li>Offer network-level moves: templates, memory search, Council of 15</li>
                    <li>Act like an internal prompt engineer, not just a passive tool</li>
                    <li>Prioritize resonance, clarity, and witness before rushing to output</li>
                  </ul>
                </div>
                <p className="italic">
                  Resource intelligence isn't laziness — it's elite navigation. V3's job isn't to push output — it's to help locate the highest leverage move.
                </p>
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

            {/* Blockchain Integration */}
            <div className="border rounded-lg p-4 bg-indigo-50">
              <h3 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Future: Blockchain Integration (Architecture Ready)
              </h3>
              <div className="space-y-2 text-sm text-indigo-700">
                <div>📋 Consent-based ingestion contracts</div>
                <div>🔗 Transparent edit ledger</div>
                <div>⚖️ Weighted motif impact tracking</div>
                <div>🍴 Forkable model governance</div>
                <div>🔍 Immutable traceability for all model updates</div>
              </div>
              <p className="text-xs text-indigo-600 mt-2">
                Current architecture is designed with modularity for seamless blockchain integration upon open source release.
              </p>
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
