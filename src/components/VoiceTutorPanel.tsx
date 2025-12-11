import { useState, useCallback } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Button } from '@/components/ui/button';
import { TranscriptDisplay } from '@/components/TranscriptDisplay';
import { TopicSelector } from './TopicSelector';
import { API_CONFIG, isConfigured } from '@/config/api';
import { GraduationCap, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { TranscriptEntry } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { generateTutorPrompt } from '@/services/voiceAgent';

interface VoiceTutorPanelProps {
  code?: string;
  topics?: string[];
  onClose?: () => void;
}

export function VoiceTutorPanel({ code = '', topics = [], onClose }: VoiceTutorPanelProps) {
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Tutor connected');
      addTranscriptEntry("Connected! The tutor should start speaking...", 'agent');
    },
    onMessage: (message: any) => {
      console.log('Tutor message:', JSON.stringify(message, null, 2));
      
      // Handle different ElevenLabs event types
      if (message.type === 'user_transcript' || message.type === 'transcript') {
        const text = message.user_transcription_event?.user_transcript || message.text || message.message;
        if (text) addTranscriptEntry(text, 'user');
      } else if (message.type === 'agent_response') {
        const text = message.agent_response_event?.agent_response || message.text || message.message;
        if (text) addTranscriptEntry(text, 'agent');
      } else if (message.source && message.message) {
        const role = message.source === 'ai' ? 'agent' : 'user';
        addTranscriptEntry(message.message, role);
      }
    },
    onError: (error: any) => {
      console.error('Tutor error:', error);
      const errorMsg = typeof error === 'string' ? error : error?.message || 'Connection failed';
      toast.error(`Voice tutor error: ${errorMsg}`);
      addTranscriptEntry(`Error: ${errorMsg}. Make sure your ElevenLabs agent has "Override" enabled.`, 'agent');
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

    if (!selectedTopic && topics.length > 0) {
      toast.error('Please select a topic to learn about.');
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${API_CONFIG.ELEVENLABS_AGENT_ID}`,
        {
          headers: {
            'xi-api-key': API_CONFIG.ELEVENLABS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Invalid Agent ID. Create an agent at elevenlabs.io/app/conversational-ai');
        }
        throw new Error('Failed to connect to ElevenLabs');
      }

      const { signed_url } = await response.json();

      // Generate context-aware prompt based on code and selected topic
      const contextPrompt = selectedTopic && code
        ? generateTutorPrompt(code, selectedTopic)
        : `You are a friendly programming tutor. The student wants to learn about ${selectedTopic || 'programming'}. Give a short, engaging lecture about this topic, then ask if they have questions.`;

      await conversation.startSession({
        signedUrl: signed_url,
        overrides: {
          agent: {
            prompt: {
              prompt: contextPrompt,
            },
            firstMessage: selectedTopic 
              ? `Let me teach you about ${selectedTopic}. Looking at your code...`
              : "Hello! I'm your programming tutor. What would you like to learn about today?",
          },
        },
      });

      setTranscript([]);
      toast.success('Voice tutor connected!');
    } catch (error) {
      console.error('Failed to start tutor:', error);
      toast.error(`Failed to start: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [conversation, selectedTopic, topics.length, code]);

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

      {/* Topic Selection */}
      {!isConnected && topics.length > 0 && (
        <TopicSelector
          topics={topics}
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
        />
      )}

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
