export type QuizStatus = 'idle' | 'generating' | 'ready' | 'quizzing' | 'evaluating' | 'passed' | 'failed';

export interface CodeBlock {
  id: string;
  code: string;
  explanation: string;
  question: string;
}

export interface QuizResult {
  blockId: string;
  userExplanation: string;
  score: number;
  passed: boolean;
  feedback: string;
}

export interface TranscriptEntry {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export interface GeneratedCode {
  code: string;
  language: string;
  blocks: CodeBlock[];
}

export interface ApprovalResult {
  approved: boolean;
  prUrl?: string;
  feedback?: string;
}
