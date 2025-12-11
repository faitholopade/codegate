import { useState, useCallback, useMemo } from 'react';
import { FeatureInput } from '@/components/FeatureInput';
import { CodeViewer } from '@/components/CodeViewer';
import { VoiceQuizPanel } from '@/components/VoiceQuizPanel';
import { VoiceTutorPanel } from '@/components/VoiceTutorPanel';
import { ApprovalPanel } from '@/components/ApprovalPanel';
import { ConfigBanner } from '@/components/ConfigBanner';
import { UserNav } from '@/components/AuthGuard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuizStatus, GeneratedCode } from '@/types';
import { generateCode } from '@/services/codeGeneration';
import { extractTopicsFromCode } from '@/services/voiceAgent';
import { Shield, Github, Zap, GraduationCap, ShieldQuestion } from 'lucide-react';
import { toast } from 'sonner';

export default function Index() {
  const [status, setStatus] = useState<QuizStatus>('idle');
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);
  const [activeTab, setActiveTab] = useState<'quiz' | 'tutor'>('quiz');

  // Extract topics from generated code for the tutor
  const codeTopics = useMemo(() => {
    if (!generatedCode?.code) return [];
    return extractTopicsFromCode(generatedCode.code);
  }, [generatedCode?.code]);

  const handleGenerate = useCallback(async (prompt: string) => {
    setStatus('generating');
    setGeneratedCode(null);
    
    try {
      const result = await generateCode(prompt);
      setGeneratedCode(result);
      setStatus('ready');
      toast.success('Code generated! Ready for the quiz.');
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('Failed to generate code. Check your OpenAI API key.');
      setStatus('idle');
    }
  }, []);

  const handleQuizComplete = useCallback((passed: boolean, score: number) => {
    setQuizPassed(passed);
    setFinalScore(score);
    
    if (passed) {
      toast.success('Quiz passed! You can now ship the code.');
    } else {
      toast.error('Quiz failed. Review the code and try again.');
    }
  }, []);

  const handleReset = useCallback(() => {
    setStatus('idle');
    setGeneratedCode(null);
    setFinalScore(0);
    setQuizPassed(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">Code Gatekeeper</h1>
                <p className="text-xs text-muted-foreground">If you can't explain it, you can't ship it</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                <span>Powered by ElevenLabs & Claude</span>
              </div>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <UserNav isAuthEnabled={!!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Code Generation & Viewer */}
          <div className="flex flex-col gap-4 overflow-hidden">
            <ConfigBanner />
            
            {!generatedCode ? (
              <div className="flex-1 flex flex-col justify-center">
                <div className="space-y-6 max-w-lg mx-auto w-full">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Generate Code</h2>
                    <p className="text-muted-foreground">
                      Describe a feature and let AI generate the implementation. 
                      Then prove you understand it before shipping.
                    </p>
                  </div>
                  <FeatureInput
                    onGenerate={handleGenerate}
                    isGenerating={status === 'generating'}
                    disabled={status !== 'idle' && status !== 'generating'}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <CodeViewer
                  code={generatedCode.code}
                  language={generatedCode.language}
                />
                
                {(status === 'passed' || status === 'failed') && (
                  <ApprovalPanel
                    code={generatedCode.code}
                    language={generatedCode.language}
                    score={finalScore}
                    passed={quizPassed}
                    onReset={handleReset}
                  />
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Voice Quiz / Tutor Tabs */}
          <div className="h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'quiz' | 'tutor')} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="quiz" className="flex items-center gap-2">
                  <ShieldQuestion className="w-4 h-4" />
                  Code Quiz
                </TabsTrigger>
                <TabsTrigger value="tutor" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Voice Tutor
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="quiz" className="flex-1 mt-0">
                <VoiceQuizPanel
                  code={generatedCode?.code || ''}
                  blocks={generatedCode?.blocks || []}
                  status={status}
                  onStatusChange={setStatus}
                  onQuizComplete={handleQuizComplete}
                />
              </TabsContent>
              
              <TabsContent value="tutor" className="flex-1 mt-0">
                <VoiceTutorPanel 
                  code={generatedCode?.code || ''}
                  topics={codeTopics}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
