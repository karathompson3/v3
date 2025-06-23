
import { MessageSquare, Lightbulb, Search } from 'lucide-react';

export const LanguageScreen = () => {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <MessageSquare className="w-16 h-16 mx-auto text-blue-400" />
        <h2 className="text-3xl font-bold text-white font-serif">
          We Learn Your Language
        </h2>
        <p className="text-lg text-blue-200">
          You define what matters. V3 adapts to your unique way of thinking.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <Lightbulb className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-200 mb-2">Your Terms, Your Meanings</h3>
              <p className="text-blue-100 text-sm">
                Whether you call it "spiraling," "going ghost mode," or "phoenix logic" - V3 learns your personal vocabulary and recognizes these patterns across all your entries.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <Search className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-200 mb-2">Context-Aware Connections</h3>
              <p className="text-blue-100 text-sm">
                V3 doesn't just store your thoughts - it understands relationships between them and surfaces relevant memories when you need them most.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-4 border border-blue-500/20">
          <p className="text-blue-200 text-center font-serif italic">
            "The best reflection tool adapts to you, not the other way around."
          </p>
        </div>
      </div>
    </div>
  );
};
