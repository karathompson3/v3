
import { ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-12 py-6 border-t border-slate-200 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-600">
            <strong>V3 Demo</strong> • Version 3.0.0-demo
          </div>
          
          <div className="text-sm text-slate-600 max-w-2xl text-center">
            <p className="mb-2">
              <strong>Open Access Model:</strong> This system is not currently open source, but it is open access.
            </p>
            <p className="text-xs">
              Our long-term commitment is to release the full system when safety, clarity, 
              and user sovereignty can be guaranteed.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Built with transparency</span>
            <span>•</span>
            <span>Verify-then-trust model</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 italic">
            "We believe AI should feel like Wikipedia, not Oracle — understandable, inspectable, and open to intelligent challenge."
          </p>
        </div>
      </div>
    </footer>
  );
};
