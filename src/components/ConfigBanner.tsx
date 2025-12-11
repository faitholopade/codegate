import { isConfigured, API_CONFIG } from '@/config/api';
import { AlertTriangle, Check, X, ExternalLink } from 'lucide-react';

export function ConfigBanner() {
  if (isConfigured()) return null;

  const configs = [
    { name: 'ElevenLabs API Key', configured: !!API_CONFIG.ELEVENLABS_API_KEY, url: 'https://elevenlabs.io' },
    { name: 'ElevenLabs Agent ID', configured: !!API_CONFIG.ELEVENLABS_AGENT_ID, url: 'https://elevenlabs.io/conversational-ai' },
    { name: 'Anthropic API Key', configured: !!API_CONFIG.ANTHROPIC_API_KEY, url: 'https://console.anthropic.com' },
  ];

  const optional = [
    { name: 'n8n Webhook URL', configured: !!API_CONFIG.N8N_WEBHOOK_URL },
  ];

  return (
    <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-warning">
        <AlertTriangle className="w-5 h-5" />
        <span className="font-semibold">Configuration Required</span>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Add the following environment variables to your <code className="px-1.5 py-0.5 rounded bg-secondary font-mono text-xs">.env</code> file:
      </p>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Required</p>
        {configs.map((config) => (
          <div key={config.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {config.configured ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <X className="w-4 h-4 text-destructive" />
              )}
              <span>{config.name}</span>
            </div>
            <a
              href={config.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              Get key
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Optional</p>
        {optional.map((config) => (
          <div key={config.name} className="flex items-center gap-2 text-sm text-muted-foreground">
            {config.configured ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <span className="w-4 h-4 text-center">-</span>
            )}
            <span>{config.name}</span>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-lg bg-card border border-border font-mono text-xs space-y-1">
        <p className="text-muted-foreground"># .env</p>
        <p>VITE_ELEVENLABS_API_KEY=your_key_here</p>
        <p>VITE_ELEVENLABS_AGENT_ID=your_agent_id</p>
        <p>VITE_ANTHROPIC_API_KEY=your_key_here</p>
        <p className="text-muted-foreground"># Optional</p>
        <p className="text-muted-foreground">VITE_N8N_WEBHOOK_URL=your_webhook_url</p>
      </div>
    </div>
  );
}
