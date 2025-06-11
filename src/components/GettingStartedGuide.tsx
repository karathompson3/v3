
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  Heart, 
  Anchor, 
  Shield, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useState } from 'react';

interface UseCase {
  title: string;
  description: string;
  components: string[];
  vibe: string;
  icon: React.ReactNode;
  sampleInput: string;
  expectedReturn: string;
}

const useCases: UseCase[] = [
  {
    title: "Motif Tagging",
    description: "Drop a thought like 'I always get weird around August' — system softly tags it as a time-based motif. Later, you can ask: 'Show me all my August patterns.'",
    components: ["input", "imprint", "return"],
    vibe: "emotional breadcrumbing",
    icon: <Lightbulb className="w-5 h-5" />,
    sampleInput: "I always get weird around August... something about transitions and that back-to-school feeling even though I'm not in school anymore.",
    expectedReturn: "Tagged with 'Seasonal Patterns', 'August Transition', 'Emotional Timing'. System notes this as a recurring temporal motif for future pattern recognition."
  },
  {
    title: "Explain Myself (Gently)",
    description: "Type something like 'I think I messed up but I don't want to spiral' — system mirrors back a calm reframe or pulls a past entry where you've felt similarly but landed okay.",
    components: ["input", "return"],
    vibe: "compassionate pattern echo",
    icon: <Heart className="w-5 h-5" />,
    sampleInput: "I think I messed up that conversation with my friend but I don't want to spiral about it...",
    expectedReturn: "Gentle reframe: 'You're aware enough to catch this before it becomes a spiral. That's growth.' + Retrieved similar entry from 2 weeks ago where you worked through friend anxiety successfully."
  },
  {
    title: "Phrase Vault",
    description: "Save key phrases that feel like anchors (e.g., 'trust needs proof', 'I move with vision, not urgency'). System surfaces them when relevant or on command.",
    components: ["input", "imprint", "return"],
    vibe: "anchor logic",
    icon: <Anchor className="w-5 h-5" />,
    sampleInput: "Trust needs proof. I move with vision, not urgency. The spiral isn't the story.",
    expectedReturn: "Phrases saved to Anchor Vault. Tagged as 'Core Philosophy', 'Regulation Mantras'. Will surface during relevant emotional states or on request."
  },
  {
    title: "Quick Shift Protocols",
    description: "Say something like 'Occlumency check' — system returns a calming script, tone guide, or protocol you've designed for regulation moments.",
    components: ["input", "return"],
    vibe: "containment over crisis",
    icon: <Shield className="w-5 h-5" />,
    sampleInput: "Occlumency check - feeling activated before family dinner",
    expectedReturn: "Protocol activated: 1) Three deep breaths 2) 'I am separate from their chaos' 3) Set time limit: 2 hours max 4) Exit phrase ready: 'I need to check on something' 5) Debrief afterward"
  },
  {
    title: "Pre/Post State Logging",
    description: "Log 'before' and 'after' versions of yourself around events, convos, or spirals. System can compare tone, clarity, or mood deltas over time.",
    components: ["input", "imprint", "return"],
    vibe: "self-forensics",
    icon: <TrendingUp className="w-5 h-5" />,
    sampleInput: "PRE: Anxious about job interview, catastrophizing about every possible question. POST: Actually went fine, realized I prepared well, feeling proud.",
    expectedReturn: "Delta logged: Anxiety → Confidence. Pattern noted: Pre-event catastrophizing vs. post-event pride. Added to 'Interview Patterns' for future reference."
  },
  {
    title: "Explain to Future Me",
    description: "Write an entry to your future self with the tag 'Open Later'. System waits, then returns it based on your check-in rhythm or on request.",
    components: ["input", "imprint", "return"],
    vibe: "long-memory self-trust",
    icon: <Clock className="w-5 h-5" />,
    sampleInput: "Open Later: Hey future me - if you're reading this during a rough patch, remember that the therapy breakthrough from today was real. You figured out the parent thing. Don't let the spiral erase that.",
    expectedReturn: "Message stored with 'Open Later' tag. Will surface during next difficult period or in 30 days, whichever comes first. Tagged as 'Recovery Anchor', 'Therapy Breakthrough'."
  }
];

const getVibeColor = (vibe: string) => {
  const vibeColors = {
    'emotional breadcrumbing': 'bg-purple-100 text-purple-700',
    'compassionate pattern echo': 'bg-pink-100 text-pink-700',
    'anchor logic': 'bg-blue-100 text-blue-700',
    'containment over crisis': 'bg-green-100 text-green-700',
    'self-forensics': 'bg-orange-100 text-orange-700',
    'long-memory self-trust': 'bg-indigo-100 text-indigo-700'
  };
  return vibeColors[vibe as keyof typeof vibeColors] || 'bg-slate-100 text-slate-700';
};

export const GettingStartedGuide = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<number | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8" />
          How to Use V3
        </h1>
        <p className="text-slate-600 text-lg">Real patterns tested by the creator — refined and emotionally reliable</p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800 text-sm">
            <Sparkles className="w-4 h-4 inline mr-1" />
            These are actual use cases I've relied on. The system is early, but these work.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="overview">Use Cases Overview</TabsTrigger>
          <TabsTrigger value="interactive">Try Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((useCase, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedUseCase(selectedUseCase === index ? null : index)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    {useCase.icon}
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                  </div>
                  <Badge className={`text-xs ${getVibeColor(useCase.vibe)} w-fit`}>
                    {useCase.vibe}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-3">{useCase.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {useCase.components.map((component, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {component}
                      </Badge>
                    ))}
                  </div>
                  
                  {selectedUseCase === index && (
                    <div className="mt-4 p-3 bg-slate-50 rounded border">
                      <div className="text-xs font-medium text-slate-700 mb-2">Sample Input:</div>
                      <div className="text-xs text-slate-600 mb-3 italic">"{useCase.sampleInput}"</div>
                      
                      <div className="text-xs font-medium text-slate-700 mb-2">Expected Return:</div>
                      <div className="text-xs text-slate-600">{useCase.expectedReturn}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interactive">
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Interactive Examples
                </CardTitle>
                <p className="text-slate-600">Click any use case below to see it in action</p>
              </CardHeader>
            </Card>

            {useCases.map((useCase, index) => (
              <Card key={index} className="border-l-4 border-blue-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {useCase.icon}
                      <div>
                        <CardTitle className="text-xl">{useCase.title}</CardTitle>
                        <Badge className={`text-xs ${getVibeColor(useCase.vibe)} mt-1`}>
                          {useCase.vibe}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUseCase(selectedUseCase === index ? null : index)}
                    >
                      {selectedUseCase === index ? 'Hide' : 'Try'}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <p className="text-slate-600 mt-2">{useCase.description}</p>
                </CardHeader>
                
                {selectedUseCase === index && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="font-medium text-blue-800 mb-2">You might type:</div>
                        <div className="text-blue-700 italic">"{useCase.sampleInput}"</div>
                      </div>
                      
                      <div className="flex justify-center">
                        <ArrowRight className="w-6 h-6 text-slate-400" />
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="font-medium text-green-800 mb-2">System responds:</div>
                        <div className="text-green-700">{useCase.expectedReturn}</div>
                      </div>

                      <div className="flex justify-center">
                        <Button 
                          onClick={() => setSelectedUseCase(null)}
                          variant="outline"
                          size="sm"
                        >
                          Ready to try this yourself? Start journaling →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
