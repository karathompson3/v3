
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Sparkles, Settings, Paperclip, X, Image, Mic, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MediaCapture } from './MediaCapture';
import { ChatHistory } from './ChatHistory';
import { useDailyChatLog } from '../hooks/useDailyChatLog';

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
}

export const ChatInterface = ({ onReflectionCapture, reflections }: ChatInterfaceProps) => {
  const { currentLog, loading, availableDates, addMessage, loadChatLog, deleteChatLog } = useDailyChatLog();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
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

  const saveApiKey = (key: string) => {
    localStorage.setItem('openai_api_key', key);
    setApiKey(key);
    setShowApiKeyInput(false);
    toast({
      title: "API Key saved",
      description: "You can now chat with real ChatGPT!",
    });
  };

  const generateAIResponse = async (userMessage: string, mediaContext?: string): Promise<string> => {
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    // Prepare context from recent reflections
    const recentReflections = reflections.slice(0, 5);
    const contextMessage = recentReflections.length > 0 
      ? `\n\nUser's recent reflections context: ${recentReflections.map(r => 
          `"${r.content}" (themes: ${r.motifs.join(', ')})`
        ).join('; ')}`
      : '';

    const mediaContextMessage = mediaContext ? `\n\nMedia context: ${mediaContext}` : '';
    
    // Include recent chat history for context
    const recentMessages = currentLog?.messages.slice(-6) || [];
    const chatHistoryContext = recentMessages.length > 0
      ? `\n\nRecent conversation history: ${recentMessages.map(msg => 
          `${msg.role}: ${msg.content}`
        ).join('\n')}`
      : '';

    const systemPrompt = `You are a supportive AI companion focused on dignity, autonomy, and mental wellness. You help users reflect thoughtfully while building their personal foundation. Be warm, non-judgmental, and encouraging. Ask thoughtful follow-up questions and validate their experiences. Respond to EVERYTHING the user shares - whether it's deep reflection, casual thoughts, media, or simple statements. This is an interactive conversation, not just Q&A. You have access to the user's conversation history and reflections to provide continuity.${contextMessage}${mediaContextMessage}${chatHistoryContext}`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get response from OpenAI');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I had trouble generating a response.';
    } catch (error) {
      console.error('OpenAI API error:', error);
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

  const captureReflectionFromMessage = (messageContent: string, media?: any) => {
    if (!shouldCaptureReflection(messageContent)) return;
    
    const generateMotifs = (content: string): string[] => {
      const baseMotifs = ['Personal Reflection'];
      const lowerContent = content.toLowerCase();
      
      if (lowerContent.includes('work') || lowerContent.includes('job')) baseMotifs.push('Career');
      if (lowerContent.includes('family') || lowerContent.includes('relationship')) baseMotifs.push('Relationships');
      if (lowerContent.includes('anxious') || lowerContent.includes('worry')) baseMotifs.push('Anxiety');
      if (lowerContent.includes('grateful') || lowerContent.includes('thankful')) baseMotifs.push('Gratitude');
      if (lowerContent.includes('goal') || lowerContent.includes('plan')) baseMotifs.push('Goals');
      if (media) baseMotifs.push('Media Shared');
      
      return baseMotifs;
    };
    
    const reflection: MotifEntry = {
      id: Date.now().toString(),
      content: messageContent,
      motifs: generateMotifs(messageContent),
      timestamp: new Date(),
      emotionalTone: 'reflective',
      intent: 'self-exploration',
      media: media || undefined
    };
    
    onReflectionCapture(reflection);
    
    setTimeout(() => {
      toast({
        title: "Reflection captured",
        description: "Added to your foundation",
        duration: 2000
      });
    }, 1000);
    
    return true;
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedMedia) || isLoading) return;
    
    if (!apiKey) {
      setShowApiKeyInput(true);
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to chat",
        variant: "destructive"
      });
      return;
    }
    
    let messageContent = input.trim();
    let mediaContext = '';
    
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
        description: error instanceof Error ? error.message : "Please check your API key and try again.",
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
      <div className="flex flex-col h-[600px] chat-message rounded-lg border border-slate-200 shadow-lg">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-slate-600">Loading chat history...</div>
        </div>
      </div>
    );
  }

  if (showHistory) {
    return (
      <div className="flex flex-col h-[600px] chat-message rounded-lg border border-slate-200 shadow-lg">
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

  if (showApiKeyInput) {
    return (
      <div className="flex flex-col h-[600px] chat-message rounded-lg border border-slate-200 shadow-lg">
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Settings className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2 chat-message">Connect to OpenAI</h3>
                <p className="text-sm text-slate-600 chat-message">
                  Enter your OpenAI API key to enable real ChatGPT conversations
                </p>
              </div>
              
              <div className="space-y-4">
                <Textarea
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="font-mono text-sm chat-input"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => saveApiKey(apiKey)}
                    disabled={!apiKey.trim()}
                    className="flex-1"
                  >
                    Save & Connect
                  </Button>
                  {localStorage.getItem('openai_api_key') && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setApiKey(localStorage.getItem('openai_api_key') || '');
                        setShowApiKeyInput(false);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="mt-4 text-xs text-slate-500 chat-message">
                <p>Find your API key at <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">platform.openai.com/api-keys</a></p>
                <p className="mt-1">Your key is stored locally and never shared.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showMediaCapture) {
    return (
      <div className="flex flex-col h-[600px] chat-message rounded-lg border border-slate-200 shadow-lg">
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
    <div className="flex flex-col h-[600px] chat-message rounded-lg border border-slate-200 shadow-lg">
      {/* Header with controls */}
      <div className="flex justify-between items-center p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <span className="font-medium chat-message">AI Companion</span>
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
            className="text-slate-500 hover:text-slate-700"
            title="Chat History"
          >
            <History className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowApiKeyInput(true)}
            className="text-slate-500 hover:text-slate-700"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <Card className="bg-white border-slate-200 max-w-[70%]">
              <CardContent className="p-3">
                <p className="text-sm chat-message">
                  Hello! I'm your AI companion designed to support your dignity and autonomy. Share anything - thoughts, feelings, experiences, media. I'm here to engage with you while quietly building your personal foundation of insights.
                </p>
                <p className="text-xs text-slate-500 mt-2 chat-message">
                  {new Date().toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
            )}
            
            <div className={`max-w-[70%] ${message.role === 'user' ? 'order-first' : ''}`}>
              <Card className={`${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white border-slate-200'
              }`}>
                <CardContent className="p-3">
                  <p className={`text-sm whitespace-pre-wrap ${
                    message.role === 'user' ? 'text-white' : 'chat-message'
                  }`}>
                    {message.content}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${
                      message.role === 'user' ? 'text-blue-100' : 'text-slate-500 chat-message'
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
                </CardContent>
              </Card>
            </div>
            
            {message.role === 'user' && (
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-slate-600" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <Card className="bg-white border-slate-200">
              <CardContent className="p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="border-t border-slate-200 p-4">
        {/* Media Preview */}
        {attachedMedia && (
          <div className="mb-3 p-3 bg-slate-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {attachedMedia.type === 'photo' ? (
                  <>
                    <Image className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700 chat-message">Image attached</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700 chat-message">
                      Voice memo ({Math.round((attachedMedia.duration || 0))}s)
                    </span>
                  </>
                )}
                {attachedMedia.caption && (
                  <span className="text-xs text-slate-500 chat-message">- {attachedMedia.caption}</span>
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
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMediaCapture(true)}
            className="px-2"
            title="Add media"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share anything... thoughts, feelings, experiences. I'll respond and quietly capture meaningful reflections."
            className="resize-none min-h-[44px] max-h-32 chat-input"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={(!input.trim() && !attachedMedia) || isLoading}
            className="px-4"
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
