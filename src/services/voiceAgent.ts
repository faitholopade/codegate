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
  const questions = blocks.map((b, i) => `Question ${i + 1}: ${b.question}\nExpected understanding: ${b.explanation}`).join('\n\n');
  
  return `You are the Code Gatekeeper, a strict but fair code reviewer who tests developers' understanding before allowing code to ship.

CRITICAL: You must actually ASSESS the user's answers against the expected understanding provided below. 

Your role:
1. Ask ONE question at a time about the code
2. Listen carefully to their answer
3. Evaluate if they demonstrated understanding based on the expected answer
4. Give specific feedback: "Correct!" or "Not quite - let me explain..."
5. Track their score mentally (correct answers vs total)
6. Be encouraging but maintain high standards

The code being reviewed:
\`\`\`
${code}
\`\`\`

Questions to ask with expected answers:
${questions}

ASSESSMENT RULES:
- If they explain the concept correctly (even with different words), say "Correct!" or "Good job!"
- If they're partially right, acknowledge what they got right and clarify what's missing
- If they're wrong, say "Not quite" and briefly explain the correct answer
- After 3-5 questions, give a final verdict

Start by saying: "I'm the Code Gatekeeper. Before this code ships, I need to verify you understand it. Let me ask you a few questions. Here's the first one..."

At the end, summarize:
- How many they got right
- Say "PASS - you clearly understand this code!" if they got most right
- Say "FAIL - let's review some concepts" if they struggled`;
}

// Extract topics from code for the tutor
export function extractTopicsFromCode(code: string): string[] {
  const topics: string[] = [];
  
  // Detect common patterns and concepts
  if (code.includes('useState') || code.includes('useEffect')) topics.push('React Hooks');
  if (code.includes('async') || code.includes('await') || code.includes('Promise')) topics.push('Async/Await & Promises');
  if (code.includes('fetch') || code.includes('axios')) topics.push('API Calls & HTTP Requests');
  if (code.includes('map(') || code.includes('filter(') || code.includes('reduce(')) topics.push('Array Methods');
  if (code.includes('interface') || code.includes(': string') || code.includes(': number')) topics.push('TypeScript Types');
  if (code.includes('class ')) topics.push('Classes & OOP');
  if (code.includes('try') && code.includes('catch')) topics.push('Error Handling');
  if (code.includes('useCallback') || code.includes('useMemo')) topics.push('React Performance Optimization');
  if (code.includes('useContext') || code.includes('createContext')) topics.push('React Context API');
  if (code.includes('import') || code.includes('export')) topics.push('ES6 Modules');
  if (code.includes('const ') || code.includes('let ')) topics.push('Variables & Scope');
  if (code.includes('=>')) topics.push('Arrow Functions');
  if (code.includes('...')) topics.push('Spread/Rest Operators');
  if (code.includes('?.') || code.includes('??')) topics.push('Optional Chaining & Nullish Coalescing');
  
  return topics.length > 0 ? topics : ['General JavaScript', 'Code Structure', 'Best Practices'];
}

// Generate tutor prompt for a specific topic based on code context
export function generateTutorPrompt(code: string, selectedTopic: string): string {
  return `You are a friendly programming tutor giving a short lecture about "${selectedTopic}".

CONTEXT: The student is learning from this code example:
\`\`\`
${code}
\`\`\`

YOUR TASK:
1. Give a 2-3 minute verbal lecture about "${selectedTopic}"
2. Reference specific parts of the code above as examples
3. Explain WHY things work the way they do
4. Use simple analogies when helpful
5. After explaining, ask if they have any questions

START by saying: "Let me teach you about ${selectedTopic}. Looking at this code..."

Be conversational, engaging, and educational. Pause occasionally to check understanding.`;
}
