'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useVoiceConversation } from '@/core/hooks/useVoiceConversation';
import { ConversationConfig } from '@/core/services/ElevenLabsService';
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, Settings } from 'lucide-react';

interface VoiceConversationProps {
  senseiId: string;
  senseiName: string;
  voiceId?: string;
  elevenLabsAgentId?: string;
  onConversationStart?: () => void;
  onConversationEnd?: () => void;
}

export function VoiceConversation({
  senseiId,
  senseiName,
  voiceId = 'default',
  elevenLabsAgentId,
  onConversationStart,
  onConversationEnd,
}: VoiceConversationProps) {
  const {
    isConnected,
    isConnecting,
    isSpeaking,
    isListening,
    session,
    error,
    startConversation,
    endConversation,
    toggleMute,
    toggleListening,
    clearError,
    retryConversation,
    voiceSettings,
    updateVoiceSettings,
  } = useVoiceConversation();

  const [showSettings, setShowSettings] = useState(false);
  const [localVoiceSettings, setLocalVoiceSettings] = useState({
    stability: 0.5,
    similarity_boost: 0.5,
    style: 0.0,
    use_speaker_boost: true,
  });

  // Update local settings when voice settings change
  useEffect(() => {
    if (voiceSettings) {
      setLocalVoiceSettings(voiceSettings);
    }
  }, [voiceSettings]);

  const handleStartConversation = async () => {
    if (!elevenLabsAgentId) {
      console.error('ElevenLabs agent ID is required for voice conversation');
      return;
    }

    const config: ConversationConfig = {
      agentId: elevenLabsAgentId,
      voiceId,
      voiceSettings: localVoiceSettings,
      language: 'en',
      connectionType: 'webrtc',
    };

    await startConversation(config);
    onConversationStart?.();
  };

  const handleEndConversation = async () => {
    await endConversation();
    onConversationEnd?.();
  };

  const handleSettingsSave = async () => {
    await updateVoiceSettings(localVoiceSettings);
    setShowSettings(false);
  };

  const formatDuration = (startTime: Date) => {
    const now = new Date();
    const diff = now.getTime() - startTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <VolumeX className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">Voice Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={retryConversation}
              disabled={isConnecting}
              className="text-red-700 border-red-300 hover:bg-red-100"
            >
              {isConnecting ? 'Retrying...' : 'Retry'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearError}
              className="text-red-700 border-red-300 hover:bg-red-100"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <Phone className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Start Voice Conversation
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Have a live voice conversation with {senseiName}
          </p>
          <div className="space-y-3">
            <Button
              onClick={handleStartConversation}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4 mr-2" />
                  Start Voice Chat
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSettings(true)}
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              Voice Settings
            </Button>
          </div>
        </div>

        {/* Voice Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Voice Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stability: {localVoiceSettings.stability}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={localVoiceSettings.stability}
                    onChange={(e) => setLocalVoiceSettings(prev => ({
                      ...prev,
                      stability: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Similarity Boost: {localVoiceSettings.similarity_boost}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={localVoiceSettings.similarity_boost}
                    onChange={(e) => setLocalVoiceSettings(prev => ({
                      ...prev,
                      similarity_boost: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Style: {localVoiceSettings.style}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={localVoiceSettings.style}
                    onChange={(e) => setLocalVoiceSettings(prev => ({
                      ...prev,
                      style: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="speakerBoost"
                    checked={localVoiceSettings.use_speaker_boost}
                    onChange={(e) => setLocalVoiceSettings(prev => ({
                      ...prev,
                      use_speaker_boost: e.target.checked
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="speakerBoost" className="ml-2 block text-sm text-gray-700">
                    Use Speaker Boost
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSettingsSave}>
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Voice Chat with {senseiName}
          </h3>
          <p className="text-sm text-gray-500">
            {session && `Duration: ${formatDuration(session.startTime)}`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          <span className="text-sm text-gray-600">
            {isSpeaking ? 'Speaking' : 'Silent'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
          <span className="text-sm text-gray-600">
            {isListening ? 'Listening' : 'Muted'}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          variant={isListening ? "default" : "outline"}
          size="lg"
          onClick={toggleListening}
          className="rounded-full w-16 h-16"
        >
          {isListening ? (
            <Mic className="h-6 w-6" />
          ) : (
            <MicOff className="h-6 w-6" />
          )}
        </Button>
        
        <Button
          variant="destructive"
          size="lg"
          onClick={handleEndConversation}
          className="rounded-full w-16 h-16"
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        {isListening ? 'Click the microphone to mute' : 'Click the microphone to unmute'}
      </p>
    </div>
  );
}
