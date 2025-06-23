
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Save, X, MessageSquare, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { translateText } from '../utils/translationUtils';

interface TranslatorViewProps {
  initialText?: string;
  onSave?: (originalText: string, translatedText: string) => void;
  onClose?: () => void;
}

export const TranslatorView = ({ initialText = '', onSave, onClose }: TranslatorViewProps) => {
  const [originalText, setOriginalText] = useState(initialText);
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const { toast } = useToast();

  const handleTranslate = () => {
    if (!originalText.trim()) return;
    
    setIsTranslating(true);
    
    // Simulate processing time
    setTimeout(() => {
      const result = translateText(originalText);
      setTranslatedText(result);
      setIsTranslating(false);
    }, 1500);
  };

  const handleCopyTranslation = async () => {
    if (!translatedText) return;
    
    try {
      await navigator.clipboard.writeText(translatedText);
      toast({
        title: "Copied to clipboard",
        description: "Translation ready to share",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please select and copy manually",
        variant: "destructive",
      });
    }
  };

  const handleSaveEntry = () => {
    if (!originalText.trim() || !translatedText.trim()) return;
    
    onSave?.(originalText, translatedText);
    toast({
      title: "Translation saved",
      description: "Entry logged with Translator Mode tag",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Translator Mode
        </h2>
        <p className="text-blue-200">
          Say something messy, and we'll help you repackage it into calm, clear language.
        </p>
      </div>

      {/* Original Text Input */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📝 Your Words
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="I can't keep explaining myself to people who refuse to listen. It makes me feel invisible and insane."
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleTranslate}
              disabled={!originalText.trim() || isTranslating}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              {isTranslating ? 'Translating...' : 'Translate This'}
            </Button>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Translated Text Output */}
      {(translatedText || isTranslating) && (
        <Card className="bg-blue-50/90 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧠 Translated Version
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExplanation(!showExplanation)}
                className="ml-auto"
              >
                <Info className="w-4 h-4" />
                Why this works
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isTranslating ? (
              <div className="animate-pulse">
                <div className="h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                  <p className="text-blue-600">Processing your words...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400 mb-4">
                  <p className="text-slate-700 leading-relaxed">{translatedText}</p>
                </div>
                
                {showExplanation && (
                  <div className="bg-blue-100 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-blue-800 mb-2">Translation Approach:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Converted blame/fury into needs and boundaries</li>
                      <li>• Shifted to present-tense, observable facts</li>
                      <li>• Used emotional clarity, not emotional volume</li>
                      <li>• Removed spiraling logic and excess qualifiers</li>
                    </ul>
                  </div>
                )}
                
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={handleCopyTranslation}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Translation
                  </Button>
                  
                  <Button
                    onClick={handleSaveEntry}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save as New Entry
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
