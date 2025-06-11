
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, AlertTriangle, Globe, Smartphone } from 'lucide-react';

export const UserBillOfRights = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">User Bill of Rights</h1>
        <p className="text-slate-600">Full transparency about your privacy and data protection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your Rights & Protections */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <CardTitle className="text-green-800">Your Rights & Protections</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-green-700">
            <div>
              <strong>Local Storage Only:</strong> All your journal entries, motifs, and personal data stay in your browser's local storage. Nothing is sent to external servers.
            </div>
            <div>
              <strong>No Account Required:</strong> You don't need to create accounts, provide emails, or share personal identifiers.
            </div>
            <div>
              <strong>Private Sessions:</strong> Each browser session is completely isolated. Your data is never shared with other users.
            </div>
            <div>
              <strong>No Analytics Tracking:</strong> We don't track your usage patterns, clicks, or behavior within the app.
            </div>
            <div>
              <strong>Emergency Protocol:</strong> The "Display Personal ID" feature shows only information you've already entered, helping communicate your stability to others.
            </div>
          </CardContent>
        </Card>

        {/* Potential Exposures */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-orange-800">Potential Exposures & Limits</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-orange-700">
            <div>
              <strong>Browser Storage:</strong> Data persists in your browser's local storage. Clearing browser data will delete all entries.
            </div>
            <div>
              <strong>Device Access:</strong> Anyone with physical access to your unlocked device can view the app if it's open.
            </div>
            <div>
              <strong>Screenshot Sharing:</strong> If you share screenshots from the app, the content becomes visible to recipients.
            </div>
            <div>
              <strong>Browser Security:</strong> Your data security depends on your browser's security. Keep your browser updated.
            </div>
            <div>
              <strong>No Backup:</strong> Currently no cloud backup. If you lose your device or clear browser data, entries are gone permanently.
            </div>
          </CardContent>
        </Card>

        {/* Technical Transparency */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-blue-800">Technical Transparency</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-blue-700">
            <div>
              <strong>Web App Technology:</strong> Built with React, runs entirely in your browser. No server-side processing of your content.
            </div>
            <div>
              <strong>Link Sharing:</strong> The app URL can be shared with others, but each person gets their own private workspace.
            </div>
            <div>
              <strong>No AI Analysis:</strong> Your entries are not analyzed by AI or machine learning systems.
            </div>
            <div>
              <strong>Open Source Spirit:</strong> Code architecture prioritizes transparency and user control over data.
            </div>
            <div>
              <strong>Hosting:</strong> Served via Lovable's content delivery network, but your personal data never leaves your browser.
            </div>
          </CardContent>
        </Card>

        {/* Your Responsibilities */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-purple-800">Your Responsibilities</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-purple-700">
            <div>
              <strong>Device Security:</strong> Keep your device locked and secure. Use screen locks, PINs, or biometric security.
            </div>
            <div>
              <strong>Browser Security:</strong> Keep your browser updated and avoid using the app on shared/public computers.
            </div>
            <div>
              <strong>Backup Planning:</strong> Consider taking manual screenshots or notes of important entries for your own backup.
            </div>
            <div>
              <strong>Sharing Awareness:</strong> Be mindful when sharing your screen or screenshots that may contain personal content.
            </div>
            <div>
              <strong>Emergency Use:</strong> Use the Personal ID display feature responsibly and only when needed for safety.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Considerations */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-slate-600" />
            <CardTitle className="text-slate-800">Mobile App Considerations</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-700">
          <div>
            <strong>App Installation:</strong> When installed as a mobile app, data remains local to that specific app installation.
          </div>
          <div>
            <strong>OS Permissions:</strong> The app doesn't request unnecessary permissions. Media capture requires camera/microphone access only when used.
          </div>
          <div>
            <strong>Background Access:</strong> The app doesn't run in the background or access your data when closed.
          </div>
          <div>
            <strong>App Store Privacy:</strong> Installation through app stores follows their respective privacy policies, but your content remains local.
          </div>
        </CardContent>
      </Card>

      {/* Updates & Changes */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-slate-600" />
            <CardTitle className="text-slate-800">Updates & Changes</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-700">
          <div>
            <strong>Privacy by Design:</strong> Any future updates will maintain the core principle of local-only data storage.
          </div>
          <div>
            <strong>Feature Additions:</strong> New features will be designed with privacy as the primary consideration.
          </div>
          <div>
            <strong>No Surprise Changes:</strong> Any changes that could affect your privacy will be clearly communicated.
          </div>
          <div>
            <strong>User Control:</strong> You always maintain control over your data and can stop using the app at any time.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
