
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

interface EmergencyProtocolProps {
  entriesCount: number;
  onClose: () => void;
}

export const EmergencyProtocol = ({ entriesCount, onClose }: EmergencyProtocolProps) => {
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
