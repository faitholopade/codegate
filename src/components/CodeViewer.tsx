import { useState } from 'react';
import { Copy, Check, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeViewerProps {
  code: string;
  language: string;
  highlightedBlock?: string;
}

export function CodeViewer({ code, language, highlightedBlock }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="code-block overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{language}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 px-2"
        >
          {copied ? (
            <Check className="w-4 h-4 text-success" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      <div className="overflow-auto max-h-[500px] scrollbar-thin">
        <pre className="p-4">
          <code className="text-sm leading-relaxed">
            {lines.map((line, index) => (
              <div
                key={index}
                className={cn(
                  "flex",
                  highlightedBlock && line.includes(highlightedBlock) && "bg-primary/10 -mx-4 px-4"
                )}
              >
                <span className="select-none text-muted-foreground w-8 text-right pr-4 border-r border-border mr-4">
                  {index + 1}
                </span>
                <span className="flex-1">{line || ' '}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
