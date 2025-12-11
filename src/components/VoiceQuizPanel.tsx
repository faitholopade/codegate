import { useState, useCallback } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from './StatusIndicator';
import { ScoreBar } from './ScoreBar';
import { TranscriptDisplay } from './TranscriptDisplay';
import { QuizStatus, TranscriptEntry, CodeBlock } from '@/types';
import { API_CONFIG, isConfigured } from '@/config/api';
import { generateAgentPrompt } from '@/services/voiceAgent';
import { Mic, MicOff, Phone, PhoneOff, AlertCircle } from 'lucide-react';

interface VoiceQuizPanelProps {
  code: string;
  blocks: CodeBlock[];
  status: QuizStatus;
  onStatusChange: (status: QuizStatus) => void;
  onQuizComplete: (passed: boolean, score: number) => void;
}

export function VoiceQuizPanel({
  code,
  blocks,
  status,
  onStatusChange,
  onQuizComplete,
}: VoiceQuizPanelProps) {
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [score, setScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      onStatusChange('quizzing');
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      if (status === 'quizzing') {
        const passed = score >= 70;
        onQuizComplete(passed, score);
        onStatusChange(passed ? 'passed' : 'failed');
      }
    },
    onMessage: (message: { source?: string; message?: string }) => {
      console.log('Message:', message);
      
      // Handle transcript messages from ElevenLabs
      if (message.source && message.message) {
        const role = message.source === 'ai' ? 'agent' : 'user';
        addTranscriptEntry(role, message.message);
        
        // Check for pass/fail keywords in agent response
        if (role === 'agent') {
          const text = message.message.toLowerCase();
          if (text.includes('pass')) {
            setScore(prev => Math.min(100, prev + 15));
          } else if (text.includes('fail') || text.includes('incorrect')) {
            setScore(prev => Math.max(0, prev - 10));
          } else if (text.includes('good') || text.includes('correct') || text.includes('exactly')) {
            setScore(prev => Math.min(100, prev + 10));
          }
        }
      }
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
      addTranscriptEntry('agent', 'Connection error. Please try again.');
    },
  });

  const addTranscriptEntry = useCallback((role: 'user' | 'agent', content: string) => {
    setTranscript(prev => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        role,
        content,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const startQuiz = useCallback(async () => {
    if (!isConfigured()) {
      addTranscriptEntry('agent', 'API keys not configured. Please add your ElevenLabs and OpenAI API keys in the .env file.');
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const signedUrlResponse = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${API_CONFIG.ELEVENLABS_AGENT_ID}`,
        {
          headers: {
            'xi-api-key': API_CONFIG.ELEVENLABS_API_KEY,
          },
        }
      );

      if (!signedUrlResponse.ok) {
        throw new Error('Failed to get signed URL');
      }

      const { signed_url } = await signedUrlResponse.json();
      
      const contextPrompt = generateAgentPrompt(code, blocks);
      
      await conversation.startSession({
        signedUrl: signed_url,
        overrides: {
          agent: {
            prompt: {
              prompt: contextPrompt,
            },
            firstMessage: "Hello! I'm the Code Gatekeeper. Before this code can ship, I need to verify you understand what it does. Let's go through a few questions. Are you ready?",
          },
        },
      });
      
      setTranscript([]);
      setScore(50);
    } catch (error) {
      console.error('Failed to start quiz:', error);
      addTranscriptEntry('agent', `Failed to start: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [conversation, code, blocks, addTranscriptEntry]);

  const endQuiz = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const configured = isConfigured();

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-4">
        <StatusIndicator status={status} score={score} />
        {status !== 'idle' && status !== 'generating' && (
          <ScoreBar score={score} />
        )}
      </div>

      {/* Transcript */}
      <TranscriptDisplay 
        entries={transcript} 
        isListening={conversation.isSpeaking}
      />

      {/* Controls */}
      <div className="p-4 border-t border-border space-y-3">
        {!configured && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20 text-warning text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Configure API keys in .env to enable voice quiz</span>
          </div>
        )}
        
        <div className="flex gap-2">
          {conversation.status === 'disconnected' ? (
            <Button
              onClick={startQuiz}
              disabled={status === 'idle' || status === 'generating' || !configured}
              variant="glow"
              size="lg"
              className="flex-1"
            >
              <Phone className="w-5 h-5" />
              Start Quiz
            </Button>
          ) : (
            <>
              <Button
                onClick={toggleMute}
                variant={isMuted ? "destructive" : "secondary"}
                size="lg"
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              <Button
                onClick={endQuiz}
                variant="destructive"
                size="lg"
                className="flex-1"
              >
                <PhoneOff className="w-5 h-5" />
                End Quiz
              </Button>
            </>
          )}
        </div>
        
        {conversation.status === 'connected' && (
          <p className="text-center text-xs text-muted-foreground">
            {conversation.isSpeaking ? '🔊 Agent speaking...' : '🎤 Listening...'}
          </p>
        )}
      </div>
    </div>
  );
}
