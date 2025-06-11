
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Share2, Copy } from 'lucide-react';
import { useState } from 'react';

interface EmergencyProtocolProps {
  entriesCount: number;
  onClose: () => void;
}

export const EmergencyProtocol = ({ entriesCount, onClose }: EmergencyProtocolProps) => {
  const [copied, setCopied] = useState(false);
  
  // Use the actual project URL instead of hardcoded v3.lovable.app
  const currentUrl = window.location.href;
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Personal ID Display - V3 Demo',
          text: 'This person is demonstrating emotional regulation and stability.',
          url: currentUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying to clipboard
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log('Error copying to clipboard:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/95 backdrop-blur-sm border-2 border-blue-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-slate-800">Personal ID Display</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="font-semibold text-slate-800 mb-3">Current Status: Regulated & Clear</h3>
              <div className="space-y-2 text-slate-700">
                <p><strong>Behavioral Evidence:</strong> Regular journaling, {entriesCount} entries logged</p>
                <p><strong>Last Stability Check:</strong> Recent wind-down completed</p>
                <p><strong>Emotional State:</strong> Cognitively clear, emotionally regulated</p>
                <p><strong>Request:</strong> Please treat with respect and non-escalation. No danger to self or others.</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleShare}
                variant="outline"
                className="flex-1 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share This Status
              </Button>
              <Button 
                onClick={handleCopyLink}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
            
            <Button 
              onClick={onClose}
              className="w-full"
            >
              Close Protocol
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
