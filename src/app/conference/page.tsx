'use client';

import { VoiceConference } from '@/components/VoiceConference';

export default function ConferencePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Voice Conference</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Start a voice conference with AI agents. You can add multiple AI participants
          and have natural conversations with them in real-time.
        </p>
        
        <VoiceConference />
        
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How it works</h2>
          <ul className="space-y-3 list-disc pl-5">
            <li>Click "Join Conference" to start the voice conference</li>
            <li>Use the "Add AI" button to add AI participants</li>
            <li>Mute/Unmute your microphone as needed</li>
            <li>Deafen to mute all incoming audio</li>
            <li>Click "Leave" to end the conference</li>
          </ul>
          
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400">
            <p className="text-yellow-700 dark:text-yellow-300">
              <span className="font-semibold">Note:</span> This is a demo interface. 
              To enable full functionality, you'll need to:
            </p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Set up a signaling server for WebRTC</li>
              <li>Integrate with ElevenLabs API for AI voices</li>
              <li>Handle session management</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
