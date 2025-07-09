import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Sparkles, Paperclip, X, Image, Mic, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MediaCapture } from './MediaCapture';
import { ChatHistory } from './ChatHistory';
import { useDailyChatLog } from '../hooks/useDailyChatLog';
import { supabase } from '@/integrations/supabase/client';

interface MotifEntry {
  id: string;
  content: string;
  motifs: string[];
  timestamp: Date;
  emotionalTone: string;
  intent: string;
  dictionaryTerms?: string[];
  stabilityFlags?: {
    slept: boolean;
    ate: boolean;
    spikes: boolean;
    containmentUsed: boolean;
  };
  media?: {
    type: 'photo' | 'voice';
    url: string;
    duration?: number;
    caption?: string;
  };
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  reflectionCaptured?: boolean;
}

interface ChatInterfaceProps {
  onReflectionCapture: (entry: MotifEntry) => void;
  reflections: MotifEntry[];
  onTranslatorMode?: (text: string) => void;
}

export const ChatInterface = ({ onReflectionCapture, reflections, onTranslatorMode }: ChatInterfaceProps) => {
  const { currentLog, loading, availableDates, addMessage, loadChatLog, deleteChatLog } = useDailyChatLog();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMediaCapture, setShowMediaCapture] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [attachedMedia, setAttachedMedia] = useState<{
    type: 'photo' | 'voice';
    url: string;
    duration?: number;
    caption?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentLog?.messages]);

  const generateAIResponse = async (userMessage: string, mediaContext?: string): Promise<string> => {
    // Prepare context from recent reflections
    const recentReflections = reflections.slice(0, 5);
    const contextMessage = recentReflections.length > 0 
      ? recentReflections.map(r => 
          `"${r.content}" (themes: ${r.motifs.join(', ')})`
        ).join('; ')
      : '';

    // Include recent chat history for context
    const recentMessages = currentLog?.messages.slice(-6) || [];
    const chatHistoryContext = recentMessages.length > 0
      ? recentMessages.map(msg => 
          `${msg.role}: ${msg.content}`
        ).join('\n')
      : '';

    const fullMessage = mediaContext ? `${userMessage}\n\n${mediaContext}` : userMessage;

    try {
      console.log('Calling ai-chat edge function...');
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: fullMessage,
          context: contextMessage,
          chatHistory: chatHistoryContext
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to get response from AI');
      }

      return data.response || 'Sorry, I had trouble generating a response.';
    } catch (error) {
      console.error('AI chat error:', error);
      throw error;
    }
  };

  const handleMediaCapture = (media: { type: 'photo' | 'voice'; url: string; duration?: number; caption?: string }) => {
    setAttachedMedia(media);
    setShowMediaCapture(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setAttachedMedia({ type: 'photo', url });
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload an image file or use the voice recorder.",
          variant: "destructive"
        });
      }
    }
  };

  const removeAttachedMedia = () => {
    if (attachedMedia?.url) {
      URL.revokeObjectURL(attachedMedia.url);
    }
    setAttachedMedia(null);
  };

  const shouldCaptureReflection = (messageContent: string): boolean => {
    if (messageContent.length < 15) return false;
    
    const reflectionTriggers = [
      'feel', 'think', 'realize', 'notice', 'struggle', 'grateful', 
      'worry', 'hope', 'learn', 'understand', 'difficult', 'proud',
      'today', 'yesterday', 'remember', 'experience', 'situation',
      'relationship', 'work', 'family', 'anxious', 'calm', 'stressed',
      'happy', 'sad', 'angry', 'confused', 'clear', 'stuck'
    ];
    
    const lowerContent = messageContent.toLowerCase();
    const hasReflectionContent = reflectionTriggers.some(trigger => 
      lowerContent.includes(trigger)
    );
    
    const isThoughtfulLength = messageContent.length > 30;
    
    return hasReflectionContent || isThoughtfulLength;
  };

  const captureReflectionFromMessage = async (messageContent: string, media?: any) => {
    if (!shouldCaptureReflection(messageContent)) return;
    
    // Use o3 for enhanced pattern analysis
    const { enhancedMotifDetection } = await import('../utils/patternAnalysis');
    const analysis = await enhancedMotifDetection(messageContent, reflections);
    
    const reflection: MotifEntry = {
      id: Date.now().toString(),
      content: messageContent,
      motifs: analysis.motifs,
      timestamp: new Date(),
      emotionalTone: analysis.emotionalTone,
      intent: analysis.intent,
      dictionaryTerms: analysis.dictionaryTerms,
      stabilityFlags: analysis.stabilityFlags,
      media: media || undefined
    };
    
    onReflectionCapture(reflection);
    
    setTimeout(() => {
      toast({
        title: "Reflection captured",
        description: `Themes detected: ${analysis.motifs.join(', ')}`,
        duration: 3000
      });
    }, 1000);
    
    return true;
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedMedia) || isLoading) return;
    
    let messageContent = input.trim();
    let mediaContext = '';
    
    // Check for translator mode trigger
    if (messageContent.toLowerCase().includes('initiate translator mode')) {
      onTranslatorMode?.(messageContent);
      setInput('');
      return;
    }
    
    if (attachedMedia) {
      if (attachedMedia.type === 'photo') {
        mediaContext = `[Image uploaded${attachedMedia.caption ? `: ${attachedMedia.caption}` : ''}]`;
        if (!messageContent) messageContent = "I shared an image";
        else messageContent = `${messageContent}\n\n${mediaContext}`;
      } else if (attachedMedia.type === 'voice') {
        mediaContext = `[Voice memo recorded - ${Math.round((attachedMedia.duration || 0))}s]`;
        if (!messageContent) messageContent = "I shared a voice memo";
        else messageContent = `${messageContent}\n\n${mediaContext}`;
      }
    }
    
    if (!messageContent) return;
    
    setInput('');
    setIsLoading(true);
    
    // Add user message to database
    const userMessage = await addMessage('user', messageContent);
    
    if (!userMessage) {
      setIsLoading(false);
      return;
    }
    
    // Capture reflection BEFORE generating AI response
    const reflectionCaptured = captureReflectionFromMessage(messageContent, attachedMedia);
    
    try {
      const aiResponse = await generateAIResponse(messageContent, mediaContext);
      
      // Add AI response to database
      await addMessage('assistant', aiResponse);
      
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Connection issue",
        description: error instanceof Error ? error.message : "Please check the server connection.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      removeAttachedMedia();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[600px] bg-slate-900/95 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-blue-100">Loading chat history...</div>
        </div>
      </div>
    );
  }

  if (showHistory) {
    return (
      <div className="flex flex-col h-[600px] bg-slate-900/95 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg">
        <ChatHistory
          availableDates={availableDates}
          currentDate={currentLog?.date || ''}
          onDateSelect={(date) => {
            loadChatLog(date);
            setShowHistory(false);
          }}
          onDeleteDate={deleteChatLog}
          onClose={() => setShowHistory(false)}
        />
      </div>
    );
  }

  if (showMediaCapture) {
    return (
      <div className="flex flex-col h-[600px] bg-slate-900/95 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg">
        <div className="flex-1 flex items-center justify-center p-4">
          <MediaCapture 
            onMediaCapture={handleMediaCapture}
            onClose={() => setShowMediaCapture(false)}
          />
        </div>
      </div>
    );
  }

  const messages = currentLog?.messages || [];
  const currentDate = currentLog?.date || new Date().toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col h-[600px] bg-background rounded-lg border border-border shadow-lg">
      {/* Header with controls */}
      <div className="flex justify-between items-center p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">Your AI Companion</span>
          {currentDate !== today && (
            <Badge variant="outline" className="text-xs">
              {new Date(currentDate).toLocaleDateString()}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistory(true)}
            className="text-muted-foreground hover:text-foreground"
            title="Chat History"
          >
            <History className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages - Inline Text Message Style */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        {messages.length === 0 && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-muted text-foreground rounded-2xl rounded-bl-md p-3 shadow-sm">
              <p className="text-sm leading-relaxed">
                Hey! I'm your AI companion. Share anything on your mind - I'm here to listen and respond while quietly building your personal foundation.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-3 shadow-sm rounded-2xl ${
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-br-md' 
                : 'bg-muted text-foreground rounded-bl-md'
            }`}>
              <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                message.role === 'user' ? 'font-mono' : ''
              }`}>
                {message.content}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${
                  message.role === 'user' 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
                {message.reflectionCaptured && (
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Reflected
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-muted text-foreground rounded-2xl rounded-bl-md p-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area - iPhone style */}
      <div className="border-t border-border p-4 bg-card">
        {/* Media Preview */}
        {attachedMedia && (
          <div className="mb-3 p-3 bg-muted rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {attachedMedia.type === 'photo' ? (
                  <>
                    <Image className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Image attached</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Voice memo ({Math.round((attachedMedia.duration || 0))}s)
                    </span>
                  </>
                )}
                {attachedMedia.caption && (
                  <span className="text-xs text-muted-foreground">- {attachedMedia.caption}</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeAttachedMedia}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex gap-2 items-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMediaCapture(true)}
            className="px-2 shrink-0"
            title="Add media"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message..."
            className="user-input resize-none min-h-[40px] max-h-32 font-typewriter rounded-2xl border-border bg-background flex-1"
            disabled={isLoading}
          />
          
          <Button
            onClick={handleSend}
            disabled={(!input.trim() && !attachedMedia) || isLoading}
            className="px-4 shrink-0 rounded-full bg-blue-500 hover:bg-blue-600"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};