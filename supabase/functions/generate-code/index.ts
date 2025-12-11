import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { featurePrompt, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let messages;
    
    if (action === 'generate') {
      messages = [
        {
          role: 'user',
          content: `You are an expert code generator. Generate clean, production-ready code based on the user's feature request.
          
Return your response in the following JSON format (and nothing else, just the JSON):
{
  "code": "the complete code implementation",
  "language": "the programming language used",
  "blocks": [
    {
      "id": "block_1",
      "code": "a logical section of the code",
      "explanation": "what this section does in 1-2 sentences",
      "question": "a quiz question to test understanding of this block"
    }
  ]
}

Break the code into 2-4 logical blocks that can be tested for understanding.
Make questions specific and technical, like:
- "What happens if the user input is empty?"
- "How does this function handle errors?"
- "What security consideration is addressed here?"

Generate code for the following feature: ${featurePrompt}`
        }
      ];
    } else if (action === 'evaluate') {
      const { code, expectedExplanation, userExplanation } = await req.json();
      messages = [
        {
          role: 'user',
          content: `You are evaluating a developer's understanding of code. Score their explanation from 0-100.
          
Return ONLY a JSON object: { "score": number, "feedback": "brief feedback", "passed": boolean }

Pass threshold is 70. Be fair but rigorous - they should demonstrate actual understanding, not just repeat keywords.

Code:
${code}

Expected understanding:
${expectedExplanation}

Developer's explanation:
${userExplanation}`
        }
      ];
    } else {
      throw new Error("Invalid action");
    }

    console.log(`Processing ${action} request`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log(`${action} completed successfully`);

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-code function:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
