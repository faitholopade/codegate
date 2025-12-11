// API Configuration
// Replace these with your actual API keys

export const API_CONFIG = {
  // ElevenLabs API Key - Get from https://elevenlabs.io
  ELEVENLABS_API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
  
  // ElevenLabs Agent ID - Create an agent at https://elevenlabs.io/conversational-ai
  ELEVENLABS_AGENT_ID: import.meta.env.VITE_ELEVENLABS_AGENT_ID || '',
  
  // Anthropic Claude API Key - For code analysis and evaluation
  ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  
  // n8n Webhook URL - For approval workflow
  N8N_WEBHOOK_URL: import.meta.env.VITE_N8N_WEBHOOK_URL || '',
};

export const isConfigured = () => {
  return Boolean(
    API_CONFIG.ELEVENLABS_API_KEY && 
    API_CONFIG.ELEVENLABS_AGENT_ID &&
    API_CONFIG.ANTHROPIC_API_KEY
  );
};
