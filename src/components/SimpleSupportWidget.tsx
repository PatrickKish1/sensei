'use client';

import { useEffect } from 'react';
import { SUPPORT_AGENT_CONFIG } from '@/core/constants/supportAgent';

/**
 * Simple HTML-based ElevenLabs Widget
 * This uses the official ElevenLabs widget embed script
 * Much simpler but less customizable than the React component
 */
export function SimpleSupportWidget() {
  useEffect(() => {
    // Load the ElevenLabs widget script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    
    // Add error handling
    script.onerror = () => {
      console.error('Failed to load ElevenLabs widget script');
    };
    
    document.head.appendChild(script);

    // Create the widget element
    const widget = document.createElement('elevenlabs-convai');
    widget.setAttribute('agent-id', SUPPORT_AGENT_CONFIG.agentId);
    
    // Add some basic styling
    widget.style.position = 'fixed';
    widget.style.bottom = '24px';
    widget.style.right = '24px';
    widget.style.zIndex = '9999';
    
    document.body.appendChild(widget);

    return () => {
      // Cleanup
      try {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        if (document.body.contains(widget)) {
          document.body.removeChild(widget);
        }
      } catch (error) {
        console.warn('Error during widget cleanup:', error);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
}

/**
 * Alternative: Custom styled widget container
 * This gives you more control over the widget appearance
 */
export function CustomStyledWidget() {
  useEffect(() => {
    // Load the ElevenLabs widget script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.head.appendChild(script);

    // Create a container for the widget
    const container = document.createElement('div');
    container.id = 'elevenlabs-widget-container';
    container.style.position = 'fixed';
    container.style.bottom = '24px';
    container.style.right = '24px';
    container.style.zIndex = '9999';
    container.style.borderRadius = '12px';
    container.style.overflow = 'hidden';
    container.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
    
    // Create the widget element
    const widget = document.createElement('elevenlabs-convai');
    widget.setAttribute('agent-id', SUPPORT_AGENT_CONFIG.agentId);
    
    container.appendChild(widget);
    document.body.appendChild(container);

    return () => {
      // Cleanup
      try {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      } catch (error) {
        console.warn('Error during widget cleanup:', error);
      }
    };
  }, []);

  return null;
}
