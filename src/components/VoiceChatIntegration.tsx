'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Volume2, 
  VolumeX, 
  Settings,
  Users,
  MessageSquare,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { useVoiceConversation } from '@/core/hooks/useVoiceConversation';
import { ConversationConfig, VoiceConferenceConfig } from '@/core/services/ElevenLabsService';

interface VoiceChatIntegrationProps {
  agentId: string;
  agentName: string;
  voiceId?: string;
  isConferenceMode?: boolean;
  onVoiceMessage?: (message: any) => void;
  className?: string;
}

export function VoiceChatIntegration({
  agentId,
  agentName,
  voiceId = 'default',
  isConferenceMode = false,
  onVoiceMessage,
  className = ''
}: VoiceChatIntegrationProps) {
  const {
    isConnected,
    isConnecting,
    isSpeaking,
    isListening,
    session,
    error,
    startConversation,
    endConversation,
    toggleListening,
    voiceSettings,
    updateVoiceSettings,
  } = useVoiceConversation();

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [conferenceParticipants, setConferenceParticipants] = useState<string[]>([]);
  const [voiceMessages, setVoiceMessages] = useState<any[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleStartVoiceChat = async () => {
    try {
      const config: ConversationConfig = {
        agentId,
        voiceId,
        voiceSettings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true,
        },
        language: 'en',
        connectionType: 'websocket',
        model: 'eleven_flash_v2_5',
      };

      await startConversation(config);
    } catch (error) {
      console.error('Failed to start voice chat:', error);
    }
  };

  const handleStartConference = async () => {
    try {
      const config: VoiceConferenceConfig = {
        conferenceId: `conf_${agentId}_${Date.now()}`,
        participants: [agentId, 'user'],
        hostId: 'user',
        voiceId,
        voiceSettings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true,
        },
      };

      // For now, use the same startConversation method
      // In a real implementation, you would have a separate startConference method
      await startConversation({
        agentId: config.conferenceId,
        voiceId: config.voiceId,
        voiceSettings: config.voiceSettings,
        language: 'en',
        connectionType: 'websocket',
        model: 'eleven_flash_v2_5',
      });

      setConferenceParticipants(config.participants);
    } catch (error) {
      console.error('Failed to start conference:', error);
    }
  };

  const handleEndVoiceChat = async () => {
    try {
      await endConversation();
      setVoiceMessages([]);
      setConferenceParticipants([]);
    } catch (error) {
      console.error('Failed to end voice chat:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Create voice message
        const voiceMessage = {
          id: `voice_${Date.now()}`,
          type: 'user',
          content: '[Voice Message]',
          audioUrl: URL.createObjectURL(audioBlob),
          timestamp: new Date(),
          duration: audioBlob.size / 16000,
        };

        setVoiceMessages(prev => [...prev, voiceMessage]);
        onVoiceMessage?.(voiceMessage);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
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
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <VolumeX className="h-5 w-5 text-red-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Voice Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Voice Chat</h3>
            <p className="text-sm text-gray-500">Start a voice conversation with {agentName}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleStartVoiceChat}
            disabled={isConnecting}
            className="flex-1"
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
          
          {isConferenceMode && (
            <Button
              variant="outline"
              onClick={handleStartConference}
              disabled={isConnecting}
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-2" />
              Start Conference
            </Button>
          )}
        </div>

        {/* Voice Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Voice Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stability: {voiceSettings?.stability || 0.5}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={voiceSettings?.stability || 0.5}
                    onChange={(e) => updateVoiceSettings({
                      ...voiceSettings!,
                      stability: parseFloat(e.target.value)
                    })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Similarity Boost: {voiceSettings?.similarity_boost || 0.5}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={voiceSettings?.similarity_boost || 0.5}
                    onChange={(e) => updateVoiceSettings({
                      ...voiceSettings!,
                      similarity_boost: parseFloat(e.target.value)
                    })}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {isConferenceMode ? 'Voice Conference' : 'Voice Chat'} with {agentName}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {session && formatDuration(session.startTime)}
            </Badge>
            {isConferenceMode && conferenceParticipants.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {conferenceParticipants.length} participants
              </Badge>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center space-x-4 mb-4">
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

      {/* Voice Messages */}
      {voiceMessages.length > 0 && (
        <div className="mb-4 max-h-32 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Voice Messages</h4>
          <div className="space-y-2">
            {voiceMessages.map((message) => (
              <div key={message.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 flex-1">
                  {message.type === 'user' ? 'You' : agentName}
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(message.duration || 0)}s
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playAudio(message.audioUrl)}
                  className="p-1"
                >
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

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
          variant={isRecording ? "destructive" : "outline"}
          size="lg"
          onClick={isRecording ? stopRecording : startRecording}
          className="rounded-full w-16 h-16"
        >
          {isRecording ? (
            <Square className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
        
        <Button
          variant="destructive"
          size="lg"
          onClick={handleEndVoiceChat}
          className="rounded-full w-16 h-16"
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        {isRecording ? 'Recording... Click to stop' : 
         isListening ? 'Listening... Click to mute' : 
         'Click microphone to start recording'}
      </p>
    </div>
  );
}
