/**
 * ElevenLabs Service - Proper implementation following official documentation
 * https://docs.elevenlabs.io/
 */

import { 
  ELEVENLABS_MODELS, 
  RECOMMENDED_MODELS,
  getModelInfo,
  isTTSModel,
  isSTTModel 
} from '@/core/constants/elevenlabsModels';

// Voice Settings Interface
export interface VoiceSettings {
  stability: number;           // 0.0 to 1.0
  similarity_boost: number;    // 0.0 to 1.0
  style?: number;             // 0.0 to 1.0 (Eleven v3 only)
  use_speaker_boost?: boolean; // true/false
}

// Voice Interface
export interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  labels?: Record<string, string>;
  preview_url?: string;
  available_for_tiers?: string[];
  settings?: VoiceSettings;
  sharing?: {
    status: string;
    history_item_sample_id?: string;
    original_voice_id?: string;
    public_owner_id?: string;
    liked_by_count?: number;
    name?: string;
    description?: string;
    labels?: Record<string, string>;
    created_at_unix?: number;
    sharing_status?: string;
    enabled_in_library?: boolean;
    finetuning_state?: string;
    verification_attempts?: any[];
    verification_failures?: string[];
    verification_attempts_count?: number;
    language?: string;
  };
  high_quality_base_model_ids?: string[];
  safety_control?: string;
  permission_on_resource?: string;
}

// Text-to-Speech Request
export interface TTSRequest {
  text: string;
  model_id?: string;
  voice_settings?: VoiceSettings;
  output_format?: 'mp3_44100_128' | 'mp3_44100_192' | 'mp3_44100_320' | 'pcm_16000' | 'pcm_22050' | 'pcm_24000' | 'pcm_44100' | 'ulaw_8000';
}

// Speech-to-Text Request
export interface STTRequest {
  file: Blob;
  model_id?: string;
  language_code?: string;
  diarize?: boolean;
  tag_audio_events?: boolean;
}

// Conversational AI Configuration
export interface ConversationalAIConfig {
  agent_id: string;
  voice_id: string;
  model_id?: string;
  voice_settings?: VoiceSettings;
  language?: string;
  connection_type?: 'webrtc' | 'websocket';
}

export interface VoiceConferenceConfig {
  conferenceId: string;
  participants: string[];
  hostId: string;
  voiceId: string;
  voiceSettings?: VoiceSettings;
  language?: string;
}

// Conversation Session
export interface ConversationSession {
  session_id: string;
  agent_id: string;
  is_active: boolean;
  start_time: Date;
  end_time?: Date;
  websocket?: WebSocket;
  audio_context?: AudioContext;
  media_stream?: MediaStream;
}

// Voice Message
export interface VoiceMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  audio_url?: string;
  timestamp: Date;
  duration?: number;
  is_voice_message?: boolean;
}

class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';
  private currentSession: ConversationSession | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '';
  }

  /**
   * Get all available voices
   * GET /api/elevenlabs/voices
   */
  async getVoices(): Promise<Voice[]> {
    try {
      const response = await fetch('/api/elevenlabs/voices');

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  }

  /**
   * Get a specific voice by ID
   * GET /v1/voices/:voice_id
   */
  async getVoice(voiceId: string): Promise<Voice> {
    try {
      const response = await fetch(`${this.baseUrl}/voices/${voiceId}`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voice: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching voice:', error);
      throw error;
    }
  }

  /**
   * Get voice settings for a specific voice
   * GET /v1/voices/:voice_id/settings
   */
  async getVoiceSettings(voiceId: string): Promise<VoiceSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/voices/${voiceId}/settings`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voice settings: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching voice settings:', error);
      throw error;
    }
  }

  /**
   * Update voice settings for a specific voice
   * POST /v1/voices/:voice_id/settings
   */
  async updateVoiceSettings(voiceId: string, settings: VoiceSettings): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/voices/${voiceId}/settings`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(`Failed to update voice settings: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating voice settings:', error);
      throw error;
    }
  }

  /**
   * Convert text to speech
   * POST /api/elevenlabs/text-to-speech
   */
  async textToSpeech(voiceId: string, request: TTSRequest): Promise<Blob> {
    try {
      const response = await fetch('/api/elevenlabs/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voiceId,
          text: request.text,
          modelId: request.model_id || RECOMMENDED_MODELS.HIGH_QUALITY,
          voiceSettings: request.voice_settings || {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true,
          },
          outputFormat: request.output_format || 'mp3_44100_128',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to convert text to speech: ${response.statusText}`);
      }

      const data = await response.json();
      // Convert base64 back to blob
      const binaryString = atob(data.audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new Blob([bytes], { type: 'audio/mpeg' });
    } catch (error) {
      console.error('Error converting text to speech:', error);
      throw error;
    }
  }

  /**
   * Convert speech to text
   * POST /api/elevenlabs/speech-to-text
   */
  async speechToText(request: STTRequest): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', request.file);
      formData.append('model_id', request.model_id || RECOMMENDED_MODELS.SPEECH_RECOGNITION);
      
      if (request.language_code) {
        formData.append('language_code', request.language_code);
      }
      if (request.diarize !== undefined) {
        formData.append('diarize', request.diarize.toString());
      }
      if (request.tag_audio_events !== undefined) {
        formData.append('tag_audio_events', request.tag_audio_events.toString());
      }

      const response = await fetch('/api/elevenlabs/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to convert speech to text: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error converting speech to text:', error);
      throw error;
    }
  }

  /**
   * Get signed URL for conversational AI
   * GET /api/elevenlabs/get-signed-url
   */
  async getConversationSignedUrl(agentId: string): Promise<string> {
    try {
      console.log('ElevenLabsService - getConversationSignedUrl called with agentId:', agentId);
      const response = await fetch(`/api/elevenlabs/get-signed-url?agent_id=${agentId}`);

      if (!response.ok) {
        throw new Error(`Failed to get signed URL: ${response.statusText}`);
      }

      const data = await response.json();
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting conversation signed URL:', error);
      throw error;
    }
  }

  /**
   * Get conversation token for conversational AI
   * GET /api/elevenlabs/conversation-token
   */
  async getConversationToken(agentId: string): Promise<string> {
    try {
      const response = await fetch(`/api/elevenlabs/conversation-token?agent_id=${agentId}`);

      if (!response.ok) {
        throw new Error(`Failed to get conversation token: ${response.statusText}`);
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Error getting conversation token:', error);
      throw error;
    }
  }

  /**
   * Start a conversational AI session
   */
  async startConversation(config: ConversationalAIConfig): Promise<ConversationSession> {
    try {
      console.log('ElevenLabsService - startConversation called with config:', config);
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Initialize audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Get user media
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // Get signed URL for WebSocket connection
      console.log('ElevenLabsService - calling getConversationSignedUrl with agent_id:', config.agent_id);
      const signedUrl = await this.getConversationSignedUrl(config.agent_id);
      const websocket = new WebSocket(signedUrl);

      // Set up WebSocket event handlers
      websocket.addEventListener('open', () => {
        console.log('Conversational AI WebSocket connected');
      });

      websocket.addEventListener('message', (event) => {
        this.handleIncomingAudio(event.data);
      });

      websocket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
      });

      websocket.addEventListener('close', () => {
        console.log('WebSocket connection closed');
      });
      
      this.currentSession = {
        session_id: sessionId,
        agent_id: config.agent_id,
        is_active: true,
        start_time: new Date(),
        websocket,
        audio_context: audioContext,
        media_stream: mediaStream,
      };

      return this.currentSession;
    } catch (error) {
      console.error('Failed to start conversation:', error);
      throw new Error('Failed to start voice conversation');
    }
  }

  /**
   * Handle incoming audio from the AI agent
   */
  private async handleIncomingAudio(audioData: any) {
    if (this.currentSession?.audio_context) {
      try {
        // Decode and play audio
        const audioBuffer = await this.currentSession.audio_context.decodeAudioData(audioData);
        const source = this.currentSession.audio_context.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.currentSession.audio_context.destination);
        source.start();
      } catch (error) {
        console.error('Error playing incoming audio:', error);
      }
    }
  }

  /**
   * Send voice message to the conversation
   */
  async sendVoiceMessage(audioBlob: Blob): Promise<VoiceMessage> {
    if (!this.currentSession?.websocket) {
      throw new Error('No active conversation session');
    }

    try {
      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      // Send via WebSocket
      this.currentSession.websocket.send(JSON.stringify({
        type: 'audio',
        data: base64Audio,
        session_id: this.currentSession.session_id
      }));

      const voiceMessage: VoiceMessage = {
        id: `voice_${Date.now()}`,
        type: 'user',
        content: '[Voice Message]',
        audio_url: URL.createObjectURL(audioBlob),
        timestamp: new Date(),
        duration: audioBlob.size / 16000, // Rough estimate
        is_voice_message: true,
      };

      return voiceMessage;
    } catch (error) {
      console.error('Failed to send voice message:', error);
      throw new Error('Failed to send voice message');
    }
  }

  /**
   * End the current conversation session
   */
  async endConversation(): Promise<void> {
    if (this.currentSession) {
      if (this.currentSession.websocket) {
        this.currentSession.websocket.close();
      }
      if (this.currentSession.media_stream) {
        this.currentSession.media_stream.getTracks().forEach(track => track.stop());
      }
      if (this.currentSession.audio_context) {
        await this.currentSession.audio_context.close();
      }
      this.currentSession.is_active = false;
      this.currentSession.end_time = new Date();
      this.currentSession = null;
    }
  }

  /**
   * Start a voice conference with multiple participants
   */
  async startConference(config: VoiceConferenceConfig): Promise<ConversationSession> {
    try {
      console.log('ElevenLabsService - startConference called with config:', config);
      const sessionId = `conference_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Initialize audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Get user media
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // For conference, we'll use the first agent as the primary voice
      const primaryAgentId = config.participants.find(p => p !== config.hostId) || config.participants[0];
      
      // Get signed URL for WebSocket connection
      console.log('ElevenLabsService - calling getConversationSignedUrl for conference with agent_id:', primaryAgentId);
      const signedUrl = await this.getConversationSignedUrl(primaryAgentId);
      const websocket = new WebSocket(signedUrl);

      // Set up WebSocket event handlers
      websocket.addEventListener('open', () => {
        console.log('Conference WebSocket connected');
      });

      websocket.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Conference WebSocket message:', data);
          
          // Handle different message types
          if (data.type === 'audio') {
            this.playAudio(data.audio, audioContext);
          } else if (data.type === 'transcript') {
            console.log('Conference transcript:', data.text);
          }
        } catch (error) {
          console.error('Error processing conference WebSocket message:', error);
        }
      });

      websocket.addEventListener('error', (error) => {
        console.error('Conference WebSocket error:', error);
      });

      websocket.addEventListener('close', () => {
        console.log('Conference WebSocket disconnected');
      });

      // Set up audio processing for conference
      const source = audioContext.createMediaStreamSource(mediaStream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (event) => {
        if (websocket.readyState === WebSocket.OPEN) {
          const audioData = event.inputBuffer.getChannelData(0);
          const audioBuffer = audioContext.createBuffer(1, audioData.length, audioContext.sampleRate);
          audioBuffer.copyToChannel(audioData, 0);
          
          // Send audio data to WebSocket
          websocket.send(JSON.stringify({
            type: 'audio',
            data: Array.from(audioData)
          }));
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      const session: ConversationSession = {
        session_id: sessionId,
        agent_id: primaryAgentId,
        voice_id: config.voiceId,
        websocket,
        audio_context: audioContext,
        media_stream: mediaStream,
        start_time: new Date(),
        is_active: true
      };

      this.currentSession = session;
      return session;

    } catch (error) {
      console.error('Error starting conference:', error);
      throw error;
    }
  }

  /**
   * Get the current conversation session
   */
  getCurrentSession(): ConversationSession | null {
    return this.currentSession;
  }

  /**
   * Check if a conversation is currently active
   */
  isConversationActive(): boolean {
    return this.currentSession?.is_active || false;
  }

  /**
   * Get available models
   */
  getAvailableModels() {
    return ELEVENLABS_MODELS;
  }

  /**
   * Get recommended models
   */
  getRecommendedModels() {
    return RECOMMENDED_MODELS;
  }

  /**
   * Get model information
   */
  getModelInfo(modelId: string) {
    return getModelInfo(modelId);
  }
}

// Export singleton instance
export const elevenLabsService = new ElevenLabsService();