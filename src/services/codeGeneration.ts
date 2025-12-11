import { API_CONFIG } from '@/config/api';
import { GeneratedCode, CodeBlock } from '@/types';

// Generate code using OpenAI (or BLACKBOX if configured)
export async function generateCode(featurePrompt: string): Promise<GeneratedCode> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert code generator. Generate clean, production-ready code based on the user's feature request.
          
Return your response in the following JSON format:
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
- "What security consideration is addressed here?"`
        },
        {
          role: 'user',
          content: `Generate code for the following feature: ${featurePrompt}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate code');
  }

  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.content);
  
  return {
    code: result.code,
    language: result.language || 'typescript',
    blocks: result.blocks.map((block: any, index: number) => ({
      ...block,
      id: block.id || `block_${index + 1}`,
    })),
  };
}

// Analyze code blocks for quiz questions
export async function analyzeCodeBlock(code: string, explanation: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Generate a single, specific technical question to test if a developer understands this code block. The question should be answerable in 1-2 sentences.'
        },
        {
          role: 'user',
          content: `Code:\n${code}\n\nExpected understanding:\n${explanation}`
        }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze code');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Evaluate user's explanation
export async function evaluateExplanation(
  code: string,
  expectedExplanation: string,
  userExplanation: string
): Promise<{ score: number; feedback: string; passed: boolean }> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are evaluating a developer's understanding of code. Score their explanation from 0-100.
          
Return JSON: { "score": number, "feedback": "brief feedback", "passed": boolean }

Pass threshold is 70. Be fair but rigorous - they should demonstrate actual understanding, not just repeat keywords.`
        },
        {
          role: 'user',
          content: `Code:\n${code}\n\nExpected understanding:\n${expectedExplanation}\n\nDeveloper's explanation:\n${userExplanation}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to evaluate explanation');
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
