import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { TranscriptEntry } from '@/types';
import { User, Bot } from 'lucide-react';

interface TranscriptDisplayProps {
  entries: TranscriptEntry[];
  isListening?: boolean;
}

export function TranscriptDisplay({ entries, isListening }: TranscriptDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <div className="space-y-2">
          <Bot className="w-12 h-12 mx-auto text-muted-foreground/50" />
          <p className="text-muted-foreground">
            Start the quiz to begin the conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"
    >
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={cn(
            "flex gap-3 animate-slide-in",
            entry.role === 'user' && "flex-row-reverse"
          )}
        >
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            entry.role === 'agent' ? "bg-primary/20" : "bg-secondary"
          )}>
            {entry.role === 'agent' ? (
              <Bot className="w-4 h-4 text-primary" />
            ) : (
              <User className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          
          <div className={cn(
            "max-w-[80%] rounded-xl px-4 py-2",
            entry.role === 'agent' 
              ? "bg-card border border-border" 
              : "bg-primary text-primary-foreground"
          )}>
            <p className="text-sm leading-relaxed">{entry.content}</p>
            <p className={cn(
              "text-[10px] mt-1",
              entry.role === 'agent' ? "text-muted-foreground" : "text-primary-foreground/70"
            )}>
              {entry.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
      
      {isListening && (
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
