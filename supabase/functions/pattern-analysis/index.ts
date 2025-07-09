import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, analysisType, previousEntries } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (analysisType) {
      case 'motif_detection':
        systemPrompt = `You are V3's pattern detection intelligence. Analyze journal entries to identify recurring motifs, emotional patterns, and behavioral threads. Focus on dignity, autonomy, and personal growth patterns.

Return a JSON object with:
- motifs: Array of detected themes/patterns
- emotionalTone: Primary emotional tone
- intent: User's apparent intent or goal
- dictionaryTerms: New personal terms/concepts to track
- stabilityFlags: Object with {slept, ate, spikes, containmentUsed} booleans`;

        userPrompt = `Analyze this journal entry for patterns and motifs:

"${content}"

Previous entries context: ${previousEntries ? JSON.stringify(previousEntries.slice(0, 5)) : 'None'}`;
        break;

      case 'weekly_recap':
        systemPrompt = `You are V3's narrative synthesis intelligence. Create meaningful weekly recaps that show growth patterns, recurring themes, and emerging insights. Focus on progress, not just problems.`;

        userPrompt = `Create a weekly recap from these entries:
${JSON.stringify(previousEntries)}

Focus on:
- Key themes and patterns
- Growth and insights
- Emotional evolution
- Next steps or emerging goals`;
        break;

      case 'thread_analysis':
        systemPrompt = `You are V3's thread connection intelligence. Identify how motifs and themes connect across time, showing the user's evolving narrative and growth arcs.`;

        userPrompt = `Analyze connections between these entries for thread mapping:
${JSON.stringify(previousEntries)}

Identify:
- Connected themes across time
- Evolution of thinking/feeling
- Breakthrough moments
- Recurring challenge patterns`;
        break;

      default:
        throw new Error('Invalid analysis type');
    }

    // Use o3 for deep pattern analysis and reasoning
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'o3-2025-04-16',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.3, // Lower temperature for more consistent analysis
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get analysis from OpenAI');
    }

    const data = await response.json();
    const analysis = data.choices[0]?.message?.content || 'Analysis failed';

    // Try to parse as JSON if it's motif detection
    let result = analysis;
    if (analysisType === 'motif_detection') {
      try {
        result = JSON.parse(analysis);
      } catch {
        // If JSON parsing fails, create a structured response
        result = {
          motifs: ['Personal Reflection'],
          emotionalTone: 'reflective',
          intent: 'self-exploration',
          dictionaryTerms: [],
          stabilityFlags: { slept: false, ate: false, spikes: false, containmentUsed: false }
        };
      }
    }

    return new Response(JSON.stringify({ analysis: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in pattern-analysis function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});