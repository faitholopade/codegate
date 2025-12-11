import { useState, useCallback } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Button } from '@/components/ui/button';
import { TranscriptDisplay } from '@/components/TranscriptDisplay';
import { API_CONFIG, isConfigured } from '@/config/api';
import { GraduationCap, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { TranscriptEntry } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface VoiceTutorPanelProps {
  topic?: string;
  onClose?: () => void;
}

const TUTOR_PROMPT = `You are a friendly and knowledgeable programming tutor. Your role is to:

1. Help users learn programming concepts in an engaging, conversational way
2. Explain complex topics simply using analogies and examples
3. Answer questions about any programming language, framework, or concept
4. Provide code examples when helpful (describe them verbally)
5. Encourage curiosity and experimentation
6. Be patient and supportive, especially with beginners

Start by asking what programming topic they'd like to learn about today. Be conversational and friendly!`;

export function VoiceTutorPanel({ topic, onClose }: VoiceTutorPanelProps) {
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  const conversation = useConversation({
    onMessage: (message) => {
      console.log('Tutor message:', message);
    },
    onError: (error) => {
      console.error('Tutor error:', error);
      toast.error('Voice tutor error. Please try again.');
    },
  });

  const addTranscriptEntry = useCallback((text: string, role: 'user' | 'agent') => {
    setTranscript(prev => [...prev, {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content: text,
      timestamp: new Date(),
    }]);
  }, []);

  const startTutor = useCallback(async () => {
    if (!isConfigured()) {
      toast.error('Please configure your API keys first.');
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get signed URL from ElevenLabs
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${API_CONFIG.ELEVENLABS_AGENT_ID}`,
        {
          headers: {
            'xi-api-key': API_CONFIG.ELEVENLABS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }

      const { signed_url } = await response.json();

      const contextPrompt = topic 
        ? `${TUTOR_PROMPT}\n\nThe user wants to learn about: ${topic}. Start by introducing yourself and then dive into this topic.`
        : TUTOR_PROMPT;

      await conversation.startSession({
        signedUrl: signed_url,
        overrides: {
          agent: {
            prompt: {
              prompt: contextPrompt,
            },
          },
        },
      });

      addTranscriptEntry("Hello! I'm your programming tutor. What would you like to learn about today?", 'agent');
      toast.success('Voice tutor connected!');
    } catch (error) {
      console.error('Failed to start tutor:', error);
      toast.error(`Failed to start: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [conversation, addTranscriptEntry, topic]);

  const endTutor = useCallback(async () => {
    await conversation.endSession();
    addTranscriptEntry("Session ended. Happy coding!", 'agent');
  }, [conversation, addTranscriptEntry]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const isConnected = conversation.status === 'connected';
  const isSpeaking = conversation.isSpeaking;

  return (
    <div className="h-full flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-accent/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <GraduationCap className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold">Voice Tutor</h2>
              <p className="text-xs text-muted-foreground">Learn programming concepts</p>
            </div>
          </div>
          <div className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium",
            isConnected 
              ? isSpeaking 
                ? "bg-accent/20 text-accent" 
                : "bg-success/20 text-success"
              : "bg-muted text-muted-foreground"
          )}>
            {isConnected ? (isSpeaking ? 'Speaking' : 'Listening') : 'Ready'}
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div className="flex-1 overflow-hidden">
        <TranscriptDisplay 
          entries={transcript} 
          isListening={isConnected && !isSpeaking}
        />
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-border bg-card/50">
        {isConfigured() ? (
          <div className="flex items-center gap-3">
            {!isConnected ? (
              <Button
                onClick={startTutor}
                variant="glow"
                className="flex-1"
              >
                <Phone className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
            ) : (
              <>
                <Button
                  onClick={endTutor}
                  variant="destructive"
                  className="flex-1"
                >
                  <PhoneOff className="w-4 h-4 mr-2" />
                  End Session
                </Button>
                <Button
                  onClick={toggleMute}
                  variant={isMuted ? "secondary" : "outline"}
                  size="icon"
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            Configure API keys to use voice tutor
          </p>
        )}

        {isConnected && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-accent animate-pulse' : 'bg-success animate-recording'}`} />
            <span className="text-xs text-muted-foreground">
              {isSpeaking ? 'Tutor is speaking...' : 'Listening to you...'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
