
import { Scroll, Sparkles } from 'lucide-react';

export const WelcomeScreen = () => {
  return (
    <div className="text-center space-y-8 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="relative">
          <Scroll className="w-16 h-16 mx-auto text-blue-400 mb-4" />
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-blue-300 animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white font-serif">
          Welcome to V3
        </h1>
        
        <p className="text-xl text-blue-100 font-medium">
          This isn't a journal.
        </p>
        
        <p className="text-2xl text-blue-200 font-serif italic">
          It's a memory system.
        </p>
      </div>

      <div className="space-y-4 text-left bg-white/5 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-lg font-medium text-blue-200">What makes V3 different:</h3>
        <ul className="space-y-3 text-blue-100">
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>Your thoughts become searchable memories with intelligent tagging</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>Built-in safety features for sensitive content</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>Learns your language and recognizes your patterns</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>Surfaces relevant past entries when you need them</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
