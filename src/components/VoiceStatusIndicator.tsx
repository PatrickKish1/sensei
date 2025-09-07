'use client';

import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff } from 'lucide-react';

interface VoiceStatusIndicatorProps {
  isConnected: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  isConnecting?: boolean;
  className?: string;
}

export function VoiceStatusIndicator({
  isConnected,
  isSpeaking,
  isListening,
  isConnecting = false,
  className = '',
}: VoiceStatusIndicatorProps) {
  if (isConnecting) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
        <span className="text-sm text-gray-600">Connecting...</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <PhoneOff className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-600">Not Connected</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Connection Status */}
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm text-gray-600">Connected</span>
      </div>

      {/* Speaking Status */}
      <div className="flex items-center space-x-2">
        {isSpeaking ? (
          <Volume2 className="h-4 w-4 text-green-500" />
        ) : (
          <VolumeX className="h-4 w-4 text-gray-400" />
        )}
        <span className="text-sm text-gray-600">
          {isSpeaking ? 'Speaking' : 'Silent'}
        </span>
      </div>

      {/* Listening Status */}
      <div className="flex items-center space-x-2">
        {isListening ? (
          <Mic className="h-4 w-4 text-blue-500" />
        ) : (
          <MicOff className="h-4 w-4 text-gray-400" />
        )}
        <span className="text-sm text-gray-600">
          {isListening ? 'Listening' : 'Muted'}
        </span>
      </div>
    </div>
  );
}
