
import { Shield, Eye, Languages, AlertTriangle } from 'lucide-react';

export const SafetyScreen = () => {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <Shield className="w-16 h-16 mx-auto text-green-400" />
        <h2 className="text-3xl font-bold text-white font-serif">
          Built-In Safety Features
        </h2>
        <p className="text-lg text-blue-200">
          Express yourself freely with protection when you need it.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm border border-green-500/20">
          <div className="flex items-start gap-4">
            <Eye className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-200 mb-2">Occlumency Mode</h3>
              <p className="text-blue-100 text-sm">
                Automatically generates safe, repackaged versions of sensitive content that you can share with others while keeping your raw thoughts private.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm border border-blue-500/20">
          <div className="flex items-start gap-4">
            <Languages className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-200 mb-2">Translator Mode</h3>
              <p className="text-blue-100 text-sm">
                Converts your internal language into external communication, helping bridge the gap between how you think and how others understand.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm border border-amber-500/20">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-200 mb-2">Emergency Protocol</h3>
              <p className="text-blue-100 text-sm">
                Quick access to identity information and safety resources when you need them most. Just type "display personal id" in any entry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
