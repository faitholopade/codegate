import { API_CONFIG } from '@/config/api';

export interface VoiceAgentCallbacks {
  onConnect: () => void;
  onDisconnect: () => void;
  onMessage: (message: any) => void;
  onError: (error: Error) => void;
  onTranscript: (text: string, role: 'user' | 'agent') => void;
}

class VoiceAgentService {
  private conversation: any = null;
  private callbacks: VoiceAgentCallbacks | null = null;

  async initialize(callbacks: VoiceAgentCallbacks) {
    this.callbacks = callbacks;
    
    // Dynamically import ElevenLabs React SDK
    const { useConversation } = await import('@elevenlabs/react');
    
    return useConversation;
  }

  async getSignedUrl(): Promise<string> {
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
    return signed_url;
  }

  async startConversation(conversation: any, contextPrompt: string) {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const signedUrl = await this.getSignedUrl();
      
      await conversation.startSession({
        signedUrl,
        overrides: {
          agent: {
            prompt: {
              prompt: contextPrompt,
            },
          },
        },
      });
      
      this.conversation = conversation;
      this.callbacks?.onConnect();
    } catch (error) {
      console.error('Failed to start conversation:', error);
      this.callbacks?.onError(error as Error);
      throw error;
    }
  }

  async endConversation(conversation: any) {
    if (conversation) {
      await conversation.endSession();
      this.conversation = null;
      this.callbacks?.onDisconnect();
    }
  }

  sendTextMessage(conversation: any, text: string) {
    if (conversation && conversation.status === 'connected') {
      conversation.sendUserMessage(text);
    }
  }
}

export const voiceAgentService = new VoiceAgentService();

// Generate the context prompt for the voice agent based on code
export function generateAgentPrompt(code: string, blocks: { question: string; explanation: string }[]): string {
  const questions = blocks.map((b, i) => `Question ${i + 1}: ${b.question}`).join('\n');
  
  return `You are the Code Gatekeeper, a strict but fair code reviewer who tests developers' understanding before allowing code to ship.

Your role:
1. You have code that needs to be reviewed before it can be shipped
2. You must ask the developer questions to verify they understand the code
3. Be conversational but focused - ask one question at a time
4. Listen to their explanation and evaluate if they truly understand
5. If they struggle, offer hints but note it affects their score
6. Be encouraging but maintain high standards

The code being reviewed:
\`\`\`
${code}
\`\`\`

Questions to ask (adapt based on conversation):
${questions}

Start by introducing yourself briefly, then ask the first question. After each answer, acknowledge their response and either:
- Move to the next question if they demonstrated understanding
- Ask a follow-up if their answer was incomplete
- Provide a hint if they're stuck

At the end, summarize their performance. Say "PASS" if they demonstrated good understanding, or "FAIL" if they couldn't explain key concepts.`;
}
