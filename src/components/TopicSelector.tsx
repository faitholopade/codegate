import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopicSelectorProps {
  topics: string[];
  selectedTopic: string | null;
  onSelectTopic: (topic: string) => void;
  disabled?: boolean;
}

export function TopicSelector({ topics, selectedTopic, onSelectTopic, disabled }: TopicSelectorProps) {
  if (topics.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        Generate code first to see available topics
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <BookOpen className="w-4 h-4" />
        <span>Topics from your code:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <Button
            key={topic}
            variant={selectedTopic === topic ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectTopic(topic)}
            disabled={disabled}
            className={cn(
              "text-xs transition-all",
              selectedTopic === topic && "ring-2 ring-primary/50"
            )}
          >
            {topic}
          </Button>
        ))}
      </div>
    </div>
  );
}
