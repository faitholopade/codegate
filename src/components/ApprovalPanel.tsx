import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ApprovalResult } from '@/types';
import { triggerApprovalWorkflow, generateCodeReview } from '@/services/approval';
import { ExternalLink, GitPullRequest, Check, X, Loader2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApprovalPanelProps {
  code: string;
  language: string;
  score: number;
  passed: boolean;
  onReset: () => void;
}

export function ApprovalPanel({ code, language, score, passed, onReset }: ApprovalPanelProps) {
  const [result, setResult] = useState<ApprovalResult | null>(null);
  const [review, setReview] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const approvalResult = await triggerApprovalWorkflow(code, language, [], score);
      setResult(approvalResult);
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReview = async () => {
    setIsReviewing(true);
    try {
      const codeReview = await generateCodeReview(code, language);
      setReview(codeReview);
    } catch (error) {
      console.error('Review failed:', error);
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className={cn(
      "rounded-xl border p-6 space-y-4 animate-fade-in",
      passed ? "border-success/50 bg-success/5" : "border-destructive/50 bg-destructive/5"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-3 rounded-lg",
          passed ? "bg-success/20" : "bg-destructive/20"
        )}>
          {passed ? (
            <Check className="w-6 h-6 text-success" />
          ) : (
            <X className="w-6 h-6 text-destructive" />
          )}
        </div>
        <div>
          <h3 className={cn(
            "font-semibold text-lg",
            passed ? "text-success" : "text-destructive"
          )}>
            {passed ? 'Quiz Passed!' : 'Quiz Failed'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {passed 
              ? 'You demonstrated understanding of the code. Ready to ship!'
              : 'You need to better understand this code before shipping.'}
          </p>
        </div>
      </div>

      {passed && !result && (
        <div className="flex gap-2">
          <Button
            onClick={handleApprove}
            disabled={isApproving}
            variant="success"
            size="lg"
            className="flex-1"
          >
            {isApproving ? (
              <Loader2 className="animate-spin" />
            ) : (
              <GitPullRequest />
            )}
            {isApproving ? 'Creating PR...' : 'Ship Code'}
          </Button>
          <Button
            onClick={handleReview}
            disabled={isReviewing}
            variant="outline"
            size="lg"
          >
            {isReviewing ? (
              <Loader2 className="animate-spin" />
            ) : (
              <FileText />
            )}
            {isReviewing ? 'Reviewing...' : 'Get Review'}
          </Button>
        </div>
      )}

      {result && (
        <div className="space-y-3 p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-success" />
            <span className="font-medium">Workflow Triggered</span>
          </div>
          <p className="text-sm text-muted-foreground">{result.feedback}</p>
          {result.prUrl && (
            <a
              href={result.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              View Pull Request
            </a>
          )}
        </div>
      )}

      {review && (
        <div className="p-4 rounded-lg bg-card border border-border">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Code Review
          </h4>
          <div className="prose prose-sm prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono">
              {review}
            </pre>
          </div>
        </div>
      )}

      {!passed && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Take some time to review the code and understand each section. 
            When you're ready, try the quiz again.
          </p>
          <Button onClick={onReset} variant="outline" size="lg" className="w-full">
            Try Again
          </Button>
        </div>
      )}

      {passed && result && (
        <Button onClick={onReset} variant="ghost" size="lg" className="w-full">
          Start New Review
        </Button>
      )}
    </div>
  );
}
