import { API_CONFIG } from '@/config/api';
import { GeneratedCode, CodeBlock } from '@/types';

// Generate code using Claude
export async function generateCode(featurePrompt: string): Promise<GeneratedCode> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': API_CONFIG.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
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
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Claude API error:', error);
    throw new Error('Failed to generate code');
  }

  const data = await response.json();
  const content = data.content[0].text;
  
  // Parse the JSON from Claude's response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse code generation response');
  }
  
  const result = JSON.parse(jsonMatch[0]);
  
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
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': API_CONFIG.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: `Generate a single, specific technical question to test if a developer understands this code block. The question should be answerable in 1-2 sentences.

Code:
${code}

Expected understanding:
${explanation}`
        }
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze code');
  }

  const data = await response.json();
  return data.content[0].text;
}

// Evaluate user's explanation
export async function evaluateExplanation(
  code: string,
  expectedExplanation: string,
  userExplanation: string
): Promise<{ score: number; feedback: string; passed: boolean }> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': API_CONFIG.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      messages: [
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
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to evaluate explanation');
  }

  const data = await response.json();
  const content = data.content[0].text;
  
  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse evaluation response');
  }
  
  return JSON.parse(jsonMatch[0]);
}
