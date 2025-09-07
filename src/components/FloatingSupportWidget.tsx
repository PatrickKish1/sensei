'use client';

import React, { useEffect } from 'react';
import { SUPPORT_AGENT_CONFIG } from '@/core/constants/supportAgent';

interface FloatingSupportWidgetProps {
  agentId?: string;
  className?: string;
  useDefaultWidget?: boolean; // If true, use ElevenLabs default widget instead of custom React component
}

export function FloatingSupportWidget({ 
  agentId = SUPPORT_AGENT_CONFIG.agentId,
  className = '',
  useDefaultWidget = true // Default to using the official widget
}: FloatingSupportWidgetProps) {
  // Use default ElevenLabs widget if requested
  if (useDefaultWidget) {
    return <DefaultElevenLabsWidget agentId={agentId} className={className} />;
  }

  // Fallback to custom widget (simplified version)
  return <CustomFloatingWidget agentId={agentId} className={className} />;
}

// Official ElevenLabs Conversational AI Widget
function DefaultElevenLabsWidget({ agentId, className }: { agentId: string; className?: string }) {
  useEffect(() => {
    // Load the ElevenLabs widget script if not already loaded
    const scriptId = 'elevenlabs-convai-widget';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className={`fixed bottom-6 left-4 z-50 ${className}`}>
      <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>
    </div>
  );
}

// Custom React-based widget (fallback)
function CustomFloatingWidget({ agentId, className }: { agentId: string; className?: string }) {
  return (
    <div className={`fixed bottom-6 left-4 z-50 ${className}`}>
      <div className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors cursor-pointer">
        <div className="w-6 h-6 flex items-center justify-center">
          <span className="text-sm font-medium">?</span>
        </div>
      </div>
    </div>
  );
}

// Declare the custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': {
        'agent-id': string;
        children?: React.ReactNode;
      };
    }
  }
}