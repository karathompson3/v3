
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response - in production, this would call OpenAI/GPT
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Use reflection context to inform responses
    const recentReflections = reflections.slice(0, 3);
    const contextualPhrases = recentReflections.flatMap(r => r.motifs);
    
    // Simple contextual responses based on user patterns
    if (userMessage.toLowerCase().includes('how am i doing')) {
      if (recentReflections.length > 0) {
        return `Based on your recent reflections, I can see themes around ${contextualPhrases.slice(0, 2).join(' and ')}. You're actively engaging with self-awareness, which shows strength. What specific aspect would you like to explore?`;
      }
      return "I'd love to help you reflect on that. What's been on your mind lately?";
    }
    
    if (userMessage.toLowerCase().includes('stress') || userMessage.toLowerCase().includes('overwhelm')) {
      return "I hear you're feeling stressed. Remember, seeking support shows wisdom, not weakness. What's one small thing that usually helps you feel more grounded? We can build from there.";
    }
    
    if (userMessage.toLowerCase().includes('pattern') || userMessage.toLowerCase().includes('notice')) {
      return "Pattern recognition is powerful for growth. Your reflections are creating a foundation for understanding yourself better. What patterns are you curious about exploring?";
    }
    
    // Default helpful AI responses
    const responses = [
      "That's an interesting perspective. Can you tell me more about what's driving that thought?",
      "I appreciate you sharing that with me. What feels most important about this situation to you?",
      "Thank you for trusting me with this. How would you like to approach this challenge?",
      "I'm here to support you through this. What would feeling more settled look like to you right now?",
      "Your awareness of this shows real insight. What do you think your next step might be?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Capture reflection if appropriate
      captureReflection(userMessage.content, true);
      
      // Generate AI response
      const aiResponse = await generateAIResponse(userMessage.content);
      
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
        description: "I'm having trouble responding right now. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200 shadow-lg">
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
        <div className="flex gap-2">
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
            disabled={!input.trim() || isLoading}
            className="px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
