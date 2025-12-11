import { cn } from '@/lib/utils';
import { QuizStatus } from '@/types';
import { Shield, ShieldCheck, ShieldX, ShieldQuestion, Loader2 } from 'lucide-react';

interface StatusIndicatorProps {
  status: QuizStatus;
  score?: number;
}

const statusConfig: Record<QuizStatus, { icon: any; label: string; color: string; glow: string }> = {
  idle: {
    icon: Shield,
    label: 'Awaiting Code',
    color: 'text-muted-foreground',
    glow: '',
  },
  generating: {
    icon: Loader2,
    label: 'Generating...',
    color: 'text-primary',
    glow: 'glow-primary',
  },
  ready: {
    icon: ShieldQuestion,
    label: 'Ready for Quiz',
    color: 'text-warning',
    glow: 'glow-warning',
  },
  quizzing: {
    icon: ShieldQuestion,
    label: 'Quiz in Progress',
    color: 'text-primary',
    glow: 'animate-pulse-glow',
  },
  evaluating: {
    icon: Loader2,
    label: 'Evaluating...',
    color: 'text-primary',
    glow: 'glow-primary',
  },
  passed: {
    icon: ShieldCheck,
    label: 'Approved',
    color: 'text-success',
    glow: 'glow-success',
  },
  failed: {
    icon: ShieldX,
    label: 'Blocked',
    color: 'text-destructive',
    glow: 'glow-destructive',
  },
};

export function StatusIndicator({ status, score }: StatusIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isAnimated = status === 'generating' || status === 'evaluating';

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-xl border border-border bg-card",
      config.glow
    )}>
      <div className={cn(
        "p-3 rounded-lg bg-secondary",
        config.color
      )}>
        <Icon className={cn("w-6 h-6", isAnimated && "animate-spin")} />
      </div>
      <div className="flex-1">
        <p className={cn("font-semibold", config.color)}>{config.label}</p>
        {score !== undefined && (
          <p className="text-sm text-muted-foreground">
            Score: {score}/100
          </p>
        )}
      </div>
    </div>
  );
}
