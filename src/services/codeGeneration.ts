import { supabase } from '@/integrations/supabase/client';
import { GeneratedCode } from '@/types';

// Generate code using Lovable AI
export async function generateCode(featurePrompt: string): Promise<GeneratedCode> {
  const { data, error } = await supabase.functions.invoke('generate-code', {
    body: { featurePrompt, action: 'generate' }
  });

  if (error) {
    console.error('Generate code error:', error);
    throw new Error('Failed to generate code');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  const content = data.content;
  
  // Parse the JSON from the response
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

// Evaluate user's explanation using Lovable AI
export async function evaluateExplanation(
  code: string,
  expectedExplanation: string,
  userExplanation: string
): Promise<{ score: number; feedback: string; passed: boolean }> {
  const { data, error } = await supabase.functions.invoke('generate-code', {
    body: { 
      action: 'evaluate',
      code,
      expectedExplanation,
      userExplanation
    }
  });

  if (error) {
    console.error('Evaluate explanation error:', error);
    throw new Error('Failed to evaluate explanation');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  const content = data.content;
  
  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse evaluation response');
  }
  
  return JSON.parse(jsonMatch[0]);
}
