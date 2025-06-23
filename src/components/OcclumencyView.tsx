
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, Copy, Save, X, Info, Edit3, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { repackageText, createOcclumencyEntry, type OcclumencyResult } from '../utils/occlumencyUtils';
import { ProtocolTemplates } from './ProtocolTemplates';

interface OcclumencyViewProps {
  originalText: string;
  onSave?: (entry: OcclumencyResult) => void;
  onDismiss: () => void;
  showSaveOption?: boolean;
}

export const OcclumencyView = ({ 
  originalText, 
  onSave, 
  onDismiss, 
  showSaveOption = true 
}: OcclumencyViewProps) => {
  const [repackagedText, setRepackagedText] = useState(repackageText(originalText));
  const [isEditing, setIsEditing] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(repackagedText);
      toast({
        title: "Copied to clipboard",
        description: "Your contained version is ready to share",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please select and copy the text manually",
        variant: "destructive"
      });
    }
  };

  const handleSave = () => {
    if (onSave) {
      const occlumencyEntry = createOcclumencyEntry(originalText, repackagedText);
      onSave(occlumencyEntry);
      toast({
        title: "Occlumency entry saved",
        description: "Your containment protocol has been logged",
      });
    }
    onDismiss();
  };

  const handleRegenerate = () => {
    setRepackagedText(repackageText(originalText));
    setIsEditing(false);
    toast({
      title: "Repackaged",
      description: "Generated new containment version",
    });
  };

  const handleUseTemplate = (template: string) => {
    setRepackagedText(template);
    setShowTemplates(false);
    setIsEditing(false);
    toast({
      title: "Template applied",
      description: "Template has been loaded for your use",
    });
  };

  if (showTemplates) {
    return <ProtocolTemplates onUseTemplate={handleUseTemplate} onClose={() => setShowTemplates(false)} />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-blue-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-full">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              🛡️ Occlumency Protocol
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ✅ Sounds grounded
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              🧠 Protects your truth
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              🕊️ No extra attention drawn
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Original Text Preview */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-600">Your original entry:</h4>
            <div className="bg-slate-50 p-3 rounded border-l-4 border-slate-300 text-sm text-slate-700 max-h-24 overflow-y-auto">
              {originalText}
            </div>
          </div>

          {/* Repackaged Text */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-slate-800">🎭 Your Contained Version:</h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowTemplates(true)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  Templates
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  {isEditing ? 'Done' : 'Edit'}
                </Button>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-200">
              {isEditing ? (
                <Textarea
                  value={repackagedText}
                  onChange={(e) => setRepackagedText(e.target.value)}
                  className="min-h-[80px] bg-white/80 border-green-300 focus:border-green-400"
                  placeholder="Edit your contained message..."
                />
              ) : (
                <p className="text-slate-800 font-medium leading-relaxed">
                  "{repackagedText}"
                </p>
              )}
            </div>
          </div>

          {/* Info Section */}
          {showInfo && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-800 mb-1">Why this matters:</h5>
                  <p className="text-sm text-blue-700">
                    This helps you stay in control of your narrative when others might misread you. 
                    It's not censorship — it's selective translation that protects your authentic self 
                    while maintaining necessary boundaries.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={handleCopy} className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Copy
            </Button>
            
            {showSaveOption && (
              <Button onClick={handleSave} variant="outline" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save to Entry
              </Button>
            )}
            
            <Button onClick={handleRegenerate} variant="outline">
              Regenerate
            </Button>
            
            <Button 
              onClick={() => setShowInfo(!showInfo)} 
              variant="ghost" 
              size="sm"
              className="text-slate-500"
            >
              <Info className="w-4 h-4 mr-1" />
              {showInfo ? 'Hide' : 'Why this matters'}
            </Button>
            
            <Button onClick={onDismiss} variant="ghost">
              Dismiss
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
