import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Sparkles, Settings, Paperclip, X, Image, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MediaCapture } from './MediaCapture';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI companion designed to support your dignity and autonomy. Ask me anything - I'm here to help while capturing meaningful reflections that build your personal foundation.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const [showMediaCapture, setShowMediaCapture] = useState(false);
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
  }, [messages]);

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

    const systemPrompt = `You are a supportive AI companion focused on dignity, autonomy, and mental wellness. You help users reflect thoughtfully while building their personal foundation. Be warm, non-judgmental, and encouraging. Ask thoughtful follow-up questions and validate their experiences.${contextMessage}${mediaContextMessage}`;

    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-6).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
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

  const captureReflection = (messageContent: string, isUserMessage: boolean) => {
    if (!isUserMessage || messageContent.length < 20) return;
    
    // Auto-detect if this warrants reflection capture
    const reflectionTriggers = [
      'feel', 'think', 'realize', 'notice', 'struggle', 'grateful', 
      'worry', 'hope', 'learn', 'understand', 'difficult', 'proud'
    ];
    
    const hasReflectionContent = reflectionTriggers.some(trigger => 
      messageContent.toLowerCase().includes(trigger)
    );
    
    if (hasReflectionContent) {
      const reflection: MotifEntry = {
        id: Date.now().toString(),
        content: messageContent,
        motifs: ['AI Conversation', 'Self-Reflection'],
        timestamp: new Date(),
        emotionalTone: 'thoughtful',
        intent: 'exploration'
      };
      
      onReflectionCapture(reflection);
      
      // Mark the last user message as having captured reflection
      setMessages(prev => prev.map(msg => 
        msg.id === prev[prev.length - 1]?.id && msg.role === 'user'
          ? { ...msg, reflectionCaptured: true }
          : msg
      ));
      
      toast({
        title: "Reflection captured",
        description: "Your insight has been added to your foundation",
      });
    }
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
    
    // Handle media attachments
    if (attachedMedia) {
      if (attachedMedia.type === 'photo') {
        mediaContext = `[Image uploaded${attachedMedia.caption ? `: ${attachedMedia.caption}` : ''}]`;
        messageContent = messageContent ? `${messageContent}\n\n${mediaContext}` : mediaContext;
      } else if (attachedMedia.type === 'voice') {
        mediaContext = `[Voice memo recorded - ${Math.round((attachedMedia.duration || 0))}s]`;
        messageContent = messageContent ? `${messageContent}\n\n${mediaContext}` : mediaContext;
      }
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Capture reflection with media if appropriate
      const reflection: MotifEntry = {
        id: Date.now().toString(),
        content: messageContent,
        motifs: ['AI Conversation', 'Self-Reflection'],
        timestamp: new Date(),
        emotionalTone: 'thoughtful',
        intent: 'exploration',
        media: attachedMedia || undefined
      };
      
      captureReflection(userMessage.content, true);
      if (attachedMedia) {
        onReflectionCapture(reflection);
      }
      
      // Generate AI response
      const aiResponse = await generateAIResponse(userMessage.content, mediaContext);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
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

  if (showApiKeyInput) {
    return (
      <div className="flex flex-col h-[600px] bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200 shadow-lg">
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Settings className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connect to OpenAI</h3>
                <p className="text-sm text-slate-600">
                  Enter your OpenAI API key to enable real ChatGPT conversations
                </p>
              </div>
              
              <div className="space-y-4">
                <Textarea
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="font-mono text-sm"
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
              
              <div className="mt-4 text-xs text-slate-500">
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
      <div className="flex flex-col h-[600px] bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200 shadow-lg">
        <div className="flex-1 flex items-center justify-center p-4">
          <MediaCapture 
            onMediaCapture={handleMediaCapture}
            onClose={() => setShowMediaCapture(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200 shadow-lg">
      {/* Header with API key management */}
      <div className="flex justify-between items-center p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <span className="font-medium">ChatGPT Conversation</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowApiKeyInput(true)}
          className="text-slate-500 hover:text-slate-700"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${
                      message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
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
                    <span className="text-sm text-slate-700">Image attached</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700">
                      Voice memo ({Math.round((attachedMedia.duration || 0))}s)
                    </span>
                  </>
                )}
                {attachedMedia.caption && (
                  <span className="text-xs text-slate-500">- {attachedMedia.caption}</span>
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
            placeholder="Ask me anything... Your meaningful thoughts will be automatically reflected."
            className="resize-none min-h-[44px] max-h-32"
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
