
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
      <DialogContent className="max-w-5xl max-h-[85vh] glass-morph border-border/30 shadow-2xl">
        <DialogHeader className="border-b border-border/20 pb-6">
          <DialogTitle className="flex items-center gap-3 font-serif text-2xl text-primary">
            <Shield className="w-6 h-6 text-coastal" />
            V3 Governance Covenant & Transparency Pledge
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[65vh] pr-6">
          <div className="space-y-8 py-6">
            {/* Current Model */}
            <div className="moodboard-card bg-coastal/10 border-coastal/30">
              <h3 className="font-serif font-semibold text-primary mb-4 flex items-center gap-3">
                <Eye className="w-5 h-5 text-coastal" />
                Current Model: Open Access (Transitioning to Open Source)
              </h3>
              <div className="space-y-3 text-sm story-rhythm">
                <div className="flex items-center gap-3">
                  <div className="floating-marker bg-sage/30 text-primary">✅ Open Access</div>
                  <span className="text-muted-foreground">Anyone in the demo group can use the system freely</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="floating-marker bg-tangerine/30 text-primary">🔄 Protected Core</div>
                  <span className="text-muted-foreground">Model weights and internal tuning logic are not editable (temporarily)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="floating-marker bg-sage/30 text-primary">✅ Transparent Logs</div>
                  <span className="text-muted-foreground">Prompt-response logs and motif tagging are visible to you</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="floating-marker bg-sage/30 text-primary">✅ Full Auditability</div>
                  <span className="text-muted-foreground">Every interaction is auditable with optional trace mode</span>
                </div>
              </div>
            </div>

            {/* Open Source Timeline */}
            <div className="moodboard-card bg-sage/10 border-sage/30">
              <h3 className="font-serif font-semibold text-primary mb-4 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-sage" />
                Open Source Timeline: 1-10 Weeks
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground story-rhythm">
                <p className="text-primary font-medium">
                  <strong>Full Open Source Release Coming Soon:</strong> This system will be completely open source within the next 1-10 weeks.
                </p>
                <p>
                  We're currently in the final phase of ensuring safety, clarity, and user sovereignty before releasing the complete codebase, including model weights and all internal logic.
                </p>
                <div className="glass-morph p-4 rounded-lg border-l-4 border-sage">
                  <p className="font-medium text-primary mb-3">What "Full Open Source" means:</p>
                  <ul className="list-disc list-inside space-y-2">
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
            <div className="moodboard-card bg-accent/10 border-accent/30">
              <h3 className="font-serif font-semibold text-primary mb-4 flex items-center gap-3">
                <Shield className="w-5 h-5 text-accent" />
                Absolute User Data Rights
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground story-rhythm">
                <div className="flex items-center gap-3">
                  <div className="floating-marker bg-accent/30 text-primary">💯 Full Control</div>
                  <span>Complete ownership and control over all your data</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="floating-marker bg-accent/30 text-primary">✏️ Edit Rights</div>
                  <span>Full right to edit, modify, or delete any of your data at any time</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="floating-marker bg-accent/30 text-primary">📤 Export Rights</div>
                  <span>Download all your data in machine-readable formats</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="floating-marker bg-accent/30 text-primary">🚫 Revocation</div>
                  <span>Revoke consent for model training at any time</span>
                </div>
                <div className="glass-morph p-4 rounded-lg border-l-4 border-accent mt-4">
                  <p className="font-medium text-primary mb-2">Your Data, Your Terms:</p>
                  <p className="text-muted-foreground">When open source, you'll set licensing terms for your data through smart contracts. Duration, scope, and revocation terms are entirely under your control.</p>
                </div>
              </div>
            </div>

            {/* Resource Intelligence Principle */}
            <div className="moodboard-card bg-tangerine/10 border-tangerine/30">
              <h3 className="font-serif font-semibold text-primary mb-4 flex items-center gap-3">
                <Brain className="w-5 h-5 text-tangerine" />
                Core Principle: Resource Intelligence
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground story-rhythm">
                <p className="font-medium text-primary italic">
                  Resource intelligence is the ability to recognize when effort alone is not the answer — and instead identify the right unlock (person, document, question, or prompt) to move forward faster and smarter.
                </p>
                <div className="glass-morph p-4 rounded-lg border-l-4 border-tangerine">
                  <p className="font-medium text-primary mb-3">V3 Implementation:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Default to leverage over grind — always ask: what's the unlock?</li>
                    <li>Surface clarifying prompts when you're looping or stuck</li>
                    <li>Offer network-level moves: templates, memory search, Council of 15</li>
                    <li>Act like an internal prompt engineer, not just a passive tool</li>
                    <li>Prioritize resonance, clarity, and witness before rushing to output</li>
                  </ul>
                </div>
                <p className="italic text-primary">
                  Resource intelligence isn't laziness — it's elite navigation. V3's job isn't to push output — it's to help locate the highest leverage move.
                </p>
              </div>
            </div>

            {/* Role-Based Permissions */}
            <div className="moodboard-card">
              <h3 className="font-serif font-semibold text-primary mb-4 flex items-center gap-3">
                <Users className="w-5 h-5" />
                Role-Based Permission Layers
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left py-3 font-serif font-medium text-primary">Role</th>
                      <th className="text-left py-3 font-serif font-medium text-primary">Permissions</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b border-border/20">
                      <td className="py-3 font-medium text-coastal">Viewer</td>
                      <td className="py-3 text-muted-foreground">Read-only access to system behavior + own logs</td>
                    </tr>
                    <tr className="border-b border-border/20">
                      <td className="py-3 font-medium text-accent">Trusted Contributor</td>
                      <td className="py-3 text-muted-foreground">Can flag motif tags, propose edits, add structured reflections</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-tangerine">Core Steward</td>
                      <td className="py-3 text-muted-foreground">Final authority on motif weights, system values, model updates</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Governance Philosophy */}
            <div className="moodboard-card bg-muted/30">
              <h3 className="font-serif font-semibold text-primary mb-4">Governance Philosophy</h3>
              <div className="space-y-4 text-sm text-muted-foreground story-rhythm">
                <p className="font-medium text-primary">
                  V3 is built on a <strong>verify-then-trust</strong> model.
                </p>
                <p>
                  It will always prioritize <strong>traceability</strong>, <strong>user consent</strong>, 
                  and <strong>visible evolution</strong> over speed or secrecy.
                </p>
                <div className="glass-morph p-4 rounded-lg border-l-4 border-coastal italic text-primary">
                  "We believe AI should feel like Wikipedia, not Oracle — understandable, 
                  inspectable, and open to intelligent challenge."
                </div>
              </div>
            </div>

            {/* Blockchain Integration */}
            <div className="moodboard-card bg-coastal/10 border-coastal/30">
              <h3 className="font-serif font-semibold text-primary mb-4 flex items-center gap-3">
                <GitBranch className="w-5 h-5 text-coastal" />
                Future: Blockchain Integration (Architecture Ready)
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">📋 Consent-based ingestion contracts</div>
                <div className="flex items-center gap-2">🔗 Transparent edit ledger</div>
                <div className="flex items-center gap-2">⚖️ Weighted motif impact tracking</div>
                <div className="flex items-center gap-2">🍴 Forkable model governance</div>
                <div className="flex items-center gap-2">🔍 Immutable traceability for all model updates</div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic">
                Current architecture is designed with modularity for seamless blockchain integration upon open source release.
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-6 border-t border-border/20">
          <div className="text-xs text-muted-foreground font-light">
            Version 3.0.0-demo • Updated {new Date().toLocaleDateString()}
          </div>
          <Button 
            onClick={() => onOpenChange(false)}
            className="whisper-button soft-glow bg-primary hover:bg-primary/90"
          >
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
