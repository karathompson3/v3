
import { ArrowRight, Tag, Brain, RefreshCw } from 'lucide-react';

export const ProcessScreen = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white font-serif">
          How V3 Works
        </h2>
        <p className="text-lg text-blue-200">
          From raw thought to organized memory
        </p>
      </div>

      {/* Visual flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold">1</span>
          </div>
          <h3 className="font-medium text-blue-200 mb-2">Write</h3>
          <p className="text-sm text-blue-100">Express your thoughts naturally</p>
        </div>

        <div className="hidden md:flex justify-center">
          <ArrowRight className="w-6 h-6 text-blue-400" />
        </div>

        <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Tag className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-medium text-blue-200 mb-2">Tag</h3>
          <p className="text-sm text-blue-100">AI identifies key themes automatically</p>
        </div>

        <div className="hidden md:flex justify-center">
          <ArrowRight className="w-6 h-6 text-blue-400" />
        </div>

        <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-medium text-blue-200 mb-2">Remember</h3>
          <p className="text-sm text-blue-100">Becomes searchable, connected memory</p>
        </div>
      </div>

      {/* Example */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 backdrop-blur-sm">
        <h3 className="text-lg font-medium text-blue-200 mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Example in Action
        </h3>
        <div className="space-y-3">
          <div className="bg-white/10 rounded p-3">
            <p className="text-blue-100 italic text-sm">
              "Had a tough conversation with mom today about boundaries. Used the techniques from therapy to stay calm..."
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded text-sm">Parental Tension</span>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded text-sm">Recovery Arc</span>
            <span className="px-2 py-1 bg-green-500/20 text-green-200 rounded text-sm">Containment</span>
          </div>
        </div>
      </div>
    </div>
  );
};
