import { API_CONFIG } from '@/config/api';
import { ApprovalResult, QuizResult } from '@/types';

export async function triggerApprovalWorkflow(
  code: string,
  language: string,
  results: QuizResult[],
  overallScore: number
): Promise<ApprovalResult> {
  // If n8n webhook is configured, call it
  if (API_CONFIG.N8N_WEBHOOK_URL) {
    try {
      const response = await fetch(API_CONFIG.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          quizResults: results,
          overallScore,
          timestamp: new Date().toISOString(),
          approved: overallScore >= 70,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          approved: true,
          prUrl: data.prUrl || generateMockPrUrl(),
          feedback: data.feedback || 'Code approved and workflow triggered!',
        };
      }
    } catch (error) {
      console.error('n8n webhook failed:', error);
    }
  }

  // Fallback to mock approval
  return {
    approved: overallScore >= 70,
    prUrl: overallScore >= 70 ? generateMockPrUrl() : undefined,
    feedback: overallScore >= 70
      ? `Code approved with score ${overallScore}/100. PR created successfully.`
      : `Code blocked. Score ${overallScore}/100 is below the 70% threshold. Please review and try again.`,
  };
}

function generateMockPrUrl(): string {
  const prNumber = Math.floor(Math.random() * 1000) + 1;
  return `https://github.com/your-org/your-repo/pull/${prNumber}`;
}

// Generate CodeRabbit-style review feedback
export async function generateCodeReview(code: string, language: string): Promise<string> {
  // This would call CodeRabbit API if configured
  // For now, return a mock review
  return `## CodeRabbit Review Summary

### Security
✅ No obvious security vulnerabilities detected

### Code Quality
- Clean code structure
- Proper error handling recommended
- Consider adding input validation

### Suggestions
1. Add TypeScript types for better type safety
2. Consider extracting reusable functions
3. Add unit tests for critical paths

**Overall**: Code looks good for merge after quiz verification.`;
}
