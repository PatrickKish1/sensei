import { useState, useEffect, useCallback } from 'react';
import { elevenLabsService, ConversationalAIConfig, ConversationSession, VoiceSettings, VoiceConferenceConfig } from '@/core/services/ElevenLabsService';

export interface UseVoiceConversationReturn {
  // State
  isConnected: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  session: ConversationSession | null;
  error: string | null;
  
  // Actions
  startConversation: (config: ConversationalAIConfig) => Promise<void>;
  startConference: (config: VoiceConferenceConfig) => Promise<void>;
  endConversation: () => Promise<void>;
  toggleMute: () => void;
  toggleListening: () => void;
  clearError: () => void;
  retryConversation: () => Promise<void>;
  
  // Voice settings
  voiceSettings: VoiceSettings | null;
  updateVoiceSettings: (settings: VoiceSettings) => Promise<void>;
}

export function useVoiceConversation(): UseVoiceConversationReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [session, setSession] = useState<ConversationSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings | null>(null);
  const [currentVoiceId, setCurrentVoiceId] = useState<string>('default');

  // Check if conversation is active on mount
  useEffect(() => {
    const currentSession = elevenLabsService.getCurrentSession();
    if (currentSession) {
      setSession(currentSession);
      setIsConnected(true);
    }
  }, []);

  const startConversation = useCallback(async (config: ConversationalAIConfig) => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const newSession = await elevenLabsService.startConversation(config);
      setSession(newSession);
      setIsConnected(true);
      setIsListening(true);
      setCurrentVoiceId(config.voice_id);
      
      // Load voice settings
      const settings = await elevenLabsService.getVoiceSettings(config.voice_id);
      setVoiceSettings(settings);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start conversation';
      setError(errorMessage);
      console.error('Voice conversation error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const startConference = useCallback(async (config: VoiceConferenceConfig) => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const newSession = await elevenLabsService.startConference(config);
      setSession(newSession);
      setIsConnected(true);
      setIsListening(true);
      setCurrentVoiceId(config.voiceId);
      
      // Load voice settings
      const settings = await elevenLabsService.getVoiceSettings(config.voiceId);
      setVoiceSettings(settings);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start conference';
      setError(errorMessage);
      console.error('Voice conference error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const endConversation = useCallback(async () => {
    try {
      await elevenLabsService.endConversation();
      setSession(null);
      setIsConnected(false);
      setIsSpeaking(false);
      setIsListening(false);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to end conversation';
      setError(errorMessage);
      console.error('Error ending conversation:', err);
    }
  }, []);

  const toggleMute = useCallback(() => {
    // Control the microphone through the current session
    if (session?.media_stream) {
      const audioTracks = session.media_stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsListening(prev => !prev);
  }, [session]);

  const toggleListening = useCallback(() => {
    setIsListening(prev => !prev);
  }, []);

  const updateVoiceSettings = useCallback(async (settings: VoiceSettings) => {
    if (!session) return;
    
    try {
      // Update voice settings through ElevenLabs service
      await elevenLabsService.updateVoiceSettings(currentVoiceId || 'default', settings);
      setVoiceSettings(settings);
      console.log('Voice settings updated:', settings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update voice settings';
      setError(errorMessage);
      console.error('Error updating voice settings:', err);
    }
  }, [session, currentVoiceId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retryConversation = useCallback(async () => {
    if (!session) return;
    
    try {
      setError(null);
      setIsConnecting(true);
      
      // Retry with the same configuration
      const config: ConversationalAIConfig = {
        agent_id: session.agent_id,
        voice_id: currentVoiceId || 'default',
        voice_settings: voiceSettings || {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true,
        },
        language: 'en',
        connection_type: 'webrtc',
      };
      
      const newSession = await elevenLabsService.startConversation(config);
      setSession(newSession);
      setIsConnected(true);
      setIsListening(true);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to retry conversation';
      setError(errorMessage);
      console.error('Retry conversation error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [session, voiceSettings, currentVoiceId]);

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    isListening,
    session,
    error,
    startConversation,
    startConference,
    endConversation,
    toggleMute,
    toggleListening,
    clearError,
    retryConversation,
    voiceSettings,
    updateVoiceSettings,
  };
}
