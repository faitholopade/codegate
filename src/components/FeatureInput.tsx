import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { VoiceInput } from '@/components/VoiceInput';
import { Sparkles, Loader2 } from 'lucide-react';

interface FeatureInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  disabled: boolean;
}

export function FeatureInput({ onGenerate, isGenerating, disabled }: FeatureInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (prompt.trim() && !isGenerating && !disabled) {
      onGenerate(prompt.trim());
    }
  };

  const examples = [
    'User authentication with JWT tokens',
    'REST API endpoint for file uploads',
    'Rate limiter middleware',
    'Database connection pool manager',
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Describe the feature you want to build
        </label>
        <div className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a user authentication system with login, signup, and password reset..."
            className="min-h-[120px] bg-card border-border focus:border-primary resize-none font-mono text-sm pr-12"
            disabled={isGenerating || disabled}
          />
          <div className="absolute right-2 top-2">
            <VoiceInput 
              onTranscript={(text) => setPrompt(prev => prev ? `${prev} ${text}` : text)}
              disabled={isGenerating || disabled}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground">Try:</span>
        {examples.map((example) => (
          <button
            key={example}
            onClick={() => setPrompt(example)}
            className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            disabled={isGenerating || disabled}
          >
            {example}
          </button>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!prompt.trim() || isGenerating || disabled}
        variant="glow"
        size="lg"
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin" />
            Generating Code...
          </>
        ) : (
          <>
            <Sparkles />
            Generate Code
          </>
        )}
      </Button>
    </div>
  );
}
