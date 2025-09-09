/**
 * Support Agent Configuration
 * This defines the platform-wide support agent that users can access via the floating widget
 */

export const SUPPORT_AGENT_CONFIG = {
  // ElevenLabs Agent Configuration
  agentId: 'agent_01jy1x9ke4e9g8c3vk9hmvv0jn', // Real ElevenLabs agent ID
  voiceId: 'support-voice-001',
  
  // Agent Personality & Behavior
  name: 'Digital Sensei Support',
  description: 'Your friendly platform support agent',
  greeting: 'Hello! I\'m your Digital Sensei support agent. How can I help you today?',
  
  // Voice Settings
  voiceSettings: {
    stability: 0.7,
    similarity_boost: 0.8,
    style: 0.3,
    use_speaker_boost: true,
  },
  
  // System Message for the AI
  systemMessage: `You are the Digital Sensei platform support agent. You help users with:

1. **Platform Features**: Explain how to create agents, use voice chat, manage subscriptions
2. **Technical Issues**: Help troubleshoot problems with the platform
3. **Account Management**: Assist with wallet connections, ENS names, subscriptions
4. **Agent Creation**: Guide users through creating and training their own AI agents
5. **Voice Features**: Explain ElevenLabs integration, voice settings, conversational AI
6. **General Questions**: Answer questions about the platform, pricing, features

Be helpful, friendly, and concise. If you don't know something specific, direct them to the appropriate documentation or support channels.

Key platform features to mention:
- Create and train AI agents with Sensay AI
- Voice conversations with ElevenLabs
- ENS name integration
- Subscription-based access to Senseis
- Wallet integration with Particle Network
- Real-time voice chat and conferences`,

  // Supported Topics
  supportedTopics: [
    'platform-features',
    'agent-creation',
    'voice-chat',
    'subscriptions',
    'wallet-connection',
    'ens-names',
    'technical-support',
    'billing',
    'account-management',
  ],

  // Quick Actions
  quickActions: [
    {
      label: 'Create Agent',
      action: 'navigate',
      target: '/dashboard?tab=create',
      description: 'Start creating your own AI agent'
    },
    {
      label: 'Voice Settings',
      action: 'navigate', 
      target: '/dashboard?tab=settings',
      description: 'Configure voice and audio settings'
    },
    {
      label: 'Browse Senseis',
      action: 'navigate',
      target: '/dashboard?tab=discover',
      description: 'Discover available AI Senseis'
    },
    {
      label: 'Documentation',
      action: 'navigate',
      target: '/docs',
      description: 'View platform documentation'
    }
  ],

  // Escalation Rules
  escalation: {
    // When to escalate to human support
    triggers: [
      'billing-issues',
      'account-suspension',
      'data-loss',
      'security-concerns',
      'complex-technical-issues'
    ],
    
    // Human support contact info
    humanSupport: {
      email: 'support@digitalsensei.ai',
      discord: 'https://discord.gg/digitalsensei',
      twitter: '@DigitalSenseiAI'
    }
  }
} as const;

// Helper function to get support agent info
export function getSupportAgentInfo() {
  return SUPPORT_AGENT_CONFIG;
}

// Helper function to check if a topic is supported
export type SupportedTopic = typeof SUPPORT_AGENT_CONFIG.supportedTopics[number];

export function isTopicSupported(topic: string): topic is SupportedTopic {
  return (SUPPORT_AGENT_CONFIG.supportedTopics as readonly string[]).includes(topic);
}

// Helper function to get quick actions
export function getQuickActions() {
  return SUPPORT_AGENT_CONFIG.quickActions;
}
