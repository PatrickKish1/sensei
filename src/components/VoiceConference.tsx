'use client';

import { useState, useCallback, useEffect } from 'react';
// Removed ElevenLabs SDK import to avoid bundling Node-only modules in the browser
// import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { Button } from './ui/button';
import { Mic, MicOff, PhoneOff, Volume2, VolumeX } from 'lucide-react';

type Participant = {
  id: string;
  name: string;
  isMuted: boolean;
  isSpeaking: boolean;
  stream?: MediaStream;
};

export function VoiceConference() {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  // const [elevenLabs, setElevenLabs] = useState<ElevenLabsClient | null>(null);

  // Initialize (placeholder)
  useEffect(() => {
    // In a real implementation, initialize signaling/voice here
  }, []);

  const toggleMute = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  }, [localStream, isMuted]);

  const toggleDeafen = useCallback(() => {
    setIsDeafened(!isDeafened);
    // In a real implementation, mute all incoming audio streams here
  }, [isDeafened]);

  const startConference = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);

      setParticipants([{
        id: 'local',
        name: 'You',
        isMuted: false,
        isSpeaking: false,
        stream: stream
      }]);

      // Connect to signaling/WebRTC in a real implementation
      setIsConnected(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, []);

  const endConference = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setParticipants([]);
    setIsConnected(false);
  }, [localStream]);

  const addAIParticipant = useCallback(async (voiceId: string, name: string) => {
    // Placeholder: In a real implementation, connect AI participant
    setParticipants(prev => [...prev, {
      id: `ai-${Date.now()}`,
      name,
      isMuted: false,
      isSpeaking: false
    }]);
  }, []);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Voice Conference</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 w-full">
        {participants.map(participant => (
          <div 
            key={participant.id}
            className={`p-4 rounded-lg border ${
              participant.isSpeaking 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{participant.name}</div>
              {participant.isSpeaking && (
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {participant.id === 'local' ? 'You' : 'AI'}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        {!isConnected ? (
          <Button onClick={startConference} className="gap-2">
            <Mic className="h-4 w-4" />
            Join Conference
          </Button>
        ) : (
          <>
            <Button 
              variant={isMuted ? 'outline' : 'default'} 
              onClick={toggleMute}
              className="gap-2"
            >
              {isMuted ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
            
            <Button 
              variant={isDeafened ? 'outline' : 'default'} 
              onClick={toggleDeafen}
              className="gap-2"
            >
              {isDeafened ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              {isDeafened ? 'Undeafen' : 'Deafen'}
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={endConference}
              className="gap-2"
            >
              <PhoneOff className="h-4 w-4" />
              Leave
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => addAIParticipant('default', 'AI Assistant')}
              className="gap-2"
            >
              Add AI
            </Button>
          </>
        )}
      </div>
      
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        {isConnected 
          ? 'Connected to conference' 
          : 'Click "Join Conference" to start'}
      </div>
    </div>
  );
}
