import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ScoreBarProps {
  score: number;
  threshold?: number;
}

export function ScoreBar({ score, threshold = 70 }: ScoreBarProps) {
  const passed = score >= threshold;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Understanding Score</span>
        <span className={cn(
          "font-mono font-bold",
          passed ? "text-success" : score > 0 ? "text-warning" : "text-muted-foreground"
        )}>
          {score}/100
        </span>
      </div>
      
      <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
        {/* Threshold marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-foreground/30 z-10"
          style={{ left: `${threshold}%` }}
        />
        
        {/* Score fill */}
        <motion.div
          className={cn(
            "h-full rounded-full",
            passed ? "bg-success" : "bg-warning"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span className={cn(
          "px-2 py-0.5 rounded-full",
          passed ? "bg-success/20 text-success" : "bg-secondary text-muted-foreground"
        )}>
          {threshold}% to pass
        </span>
        <span>100</span>
      </div>
    </div>
  );
}
