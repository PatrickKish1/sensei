/**
 * ElevenLabs Models - Complete list from official documentation
 * https://docs.elevenlabs.io/docs/models
 */

// Text-to-Speech Models
export const ELEVENLABS_TTS_MODELS = {
  // Latest Models
  ELEVEN_V3: 'eleven_v3',
  ELEVEN_TTV_V3: 'eleven_ttv_v3',
  ELEVEN_MULTILINGUAL_V2: 'eleven_multilingual_v2',
  ELEVEN_FLASH_V2_5: 'eleven_flash_v2_5',
  ELEVEN_FLASH_V2: 'eleven_flash_v2',
  ELEVEN_TURBO_V2_5: 'eleven_turbo_v2_5',
  ELEVEN_TURBO_V2: 'eleven_turbo_v2',
  
  // Voice Changer Models
  ELEVEN_MULTILINGUAL_STS_V2: 'eleven_multilingual_sts_v2',
  ELEVEN_MULTILINGUAL_TTV_V2: 'eleven_multilingual_ttv_v2',
  ELEVEN_ENGLISH_STS_V2: 'eleven_english_sts_v2',
  
  // Legacy Models
  ELEVEN_MULTILINGUAL_V1: 'eleven_multilingual_v1',
  ELEVEN_ENGLISH_STS_V1: 'eleven_english_sts_v1',
} as const;

// Speech-to-Text Models
export const ELEVENLABS_STT_MODELS = {
  SCRIBE_V1: 'scribe_v1',
  SCRIBE_V1_EXPERIMENTAL: 'scribe_v1_experimental',
} as const;

// All Models Combined
export const ELEVENLABS_MODELS = {
  ...ELEVENLABS_TTS_MODELS,
  ...ELEVENLABS_STT_MODELS,
} as const;

// Model Information Interface
export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  languages: string[];
  characterLimit: number;
  audioDuration: string;
  latency?: string;
  category: 'tts' | 'stt' | 'voice_changer' | 'voice_designer';
  useCase: string[];
}

// Complete Model Information
export const MODEL_INFO: Record<string, ModelInfo> = {
  // Text-to-Speech Models
  [ELEVENLABS_TTS_MODELS.ELEVEN_V3]: {
    id: ELEVENLABS_TTS_MODELS.ELEVEN_V3,
    name: 'Eleven v3',
    description: 'Human-like and expressive speech generation',
    languages: ['70+ languages'],
    characterLimit: 3000,
    audioDuration: '~3 minutes',
    category: 'tts',
    useCase: ['content_creation', 'high_quality'],
  },
  
  [ELEVENLABS_TTS_MODELS.ELEVEN_TTV_V3]: {
    id: ELEVENLABS_TTS_MODELS.ELEVEN_TTV_V3,
    name: 'Eleven TTV v3',
    description: 'Human-like and expressive voice design model (Text to Voice)',
    languages: ['70+ languages'],
    characterLimit: 3000,
    audioDuration: '~3 minutes',
    category: 'voice_designer',
    useCase: ['voice_design', 'high_quality'],
  },
  
  [ELEVENLABS_TTS_MODELS.ELEVEN_MULTILINGUAL_V2]: {
    id: ELEVENLABS_TTS_MODELS.ELEVEN_MULTILINGUAL_V2,
    name: 'Eleven Multilingual v2',
    description: 'Our most lifelike model with rich emotional expression',
    languages: ['en', 'ja', 'zh', 'de', 'hi', 'fr', 'ko', 'pt', 'it', 'es', 'id', 'nl', 'tr', 'fil', 'pl', 'sv', 'bg', 'ro', 'ar', 'cs', 'el', 'fi', 'hr', 'ms', 'sk', 'da', 'ta', 'uk', 'ru'],
    characterLimit: 10000,
    audioDuration: '~10 minutes',
    category: 'tts',
    useCase: ['content_creation', 'multilingual', 'high_quality'],
  },
  
  [ELEVENLABS_TTS_MODELS.ELEVEN_FLASH_V2_5]: {
    id: ELEVENLABS_TTS_MODELS.ELEVEN_FLASH_V2_5,
    name: 'Eleven Flash v2.5',
    description: 'Ultra-fast model optimized for real-time use',
    languages: ['All eleven_multilingual_v2 languages plus: hu', 'no', 'vi'],
    characterLimit: 40000,
    audioDuration: '~40 minutes',
    latency: '~75ms',
    category: 'tts',
    useCase: ['conversational_ai', 'real_time', 'low_latency', 'multilingual'],
  },
  
  [ELEVENLABS_TTS_MODELS.ELEVEN_FLASH_V2]: {
    id: ELEVENLABS_TTS_MODELS.ELEVEN_FLASH_V2,
    name: 'Eleven Flash v2',
    description: 'Ultra-fast model optimized for real-time use',
    languages: ['en'],
    characterLimit: 30000,
    audioDuration: '~30 minutes',
    latency: '~75ms',
    category: 'tts',
    useCase: ['conversational_ai', 'real_time', 'low_latency'],
  },
  
  [ELEVENLABS_TTS_MODELS.ELEVEN_TURBO_V2_5]: {
    id: ELEVENLABS_TTS_MODELS.ELEVEN_TURBO_V2_5,
    name: 'Eleven Turbo v2.5',
    description: 'High quality, low-latency model with a good balance of quality and speed',
    languages: ['en', 'ja', 'zh', 'de', 'hi', 'fr', 'ko', 'pt', 'it', 'es', 'id', 'nl', 'tr', 'fil', 'pl', 'sv', 'bg', 'ro', 'ar', 'cs', 'el', 'fi', 'hr', 'ms', 'sk', 'da', 'ta', 'uk', 'ru', 'hu', 'no', 'vi'],
    characterLimit: 40000,
    audioDuration: '~40 minutes',
    latency: '~250ms-300ms',
    category: 'tts',
    useCase: ['conversational_ai', 'balanced', 'multilingual'],
  },
  
  [ELEVENLABS_TTS_MODELS.ELEVEN_TURBO_V2]: {
    id: ELEVENLABS_TTS_MODELS.ELEVEN_TURBO_V2,
    name: 'Eleven Turbo v2',
    description: 'High quality, low-latency model with a good balance of quality and speed',
    languages: ['en'],
    characterLimit: 30000,
    audioDuration: '~30 minutes',
    latency: '~250ms-300ms',
    category: 'tts',
    useCase: ['conversational_ai', 'balanced'],
  },
  
  // Voice Changer Models
  [ELEVENLABS_TTS_MODELS.ELEVEN_MULTILINGUAL_STS_V2]: {
    id: ELEVENLABS_TTS_MODELS.ELEVEN_MULTILINGUAL_STS_V2,
    name: 'Eleven Multilingual STS v2',
    description: 'State-of-the-art multilingual voice changer model (Speech to Speech)',
    languages: ['en', 'ja', 'zh', 'de', 'hi', 'fr', 'ko', 'pt', 'it', 'es', 'id', 'nl', 'tr', 'fil', 'pl', 'sv', 'bg', 'ro', 'ar', 'cs', 'el', 'fi', 'hr', 'ms', 'sk', 'da', 'ta', 'uk', 'ru'],
    characterLimit: 10000,
    audioDuration: '~10 minutes',
    category: 'voice_changer',
    useCase: ['voice_changer', 'multilingual'],
  },
  
  [ELEVENLABS_TTS_MODELS.ELEVEN_MULTILINGUAL_TTV_V2]: {
    id: ELEVENLABS_TTS_MODELS.ELEVEN_MULTILINGUAL_TTV_V2,
    name: 'Eleven Multilingual TTV v2',
    description: 'State-of-the-art multilingual voice designer model (Text to Voice)',
    languages: ['en', 'ja', 'zh', 'de', 'hi', 'fr', 'ko', 'pt', 'it', 'es', 'id', 'nl', 'tr', 'fil', 'pl', 'sv', 'bg', 'ro', 'ar', 'cs', 'el', 'fi', 'hr', 'ms', 'sk', 'da', 'ta', 'uk', 'ru'],
    characterLimit: 10000,
    audioDuration: '~10 minutes',
    category: 'voice_designer',
    useCase: ['voice_design', 'multilingual'],
  },
  
  [ELEVENLABS_TTS_MODELS.ELEVEN_ENGLISH_STS_V2]: {
    id: ELEVENLABS_TTS_MODELS.ELEVEN_ENGLISH_STS_V2,
    name: 'Eleven English STS v2',
    description: 'English-only voice changer model (Speech to Speech)',
    languages: ['en'],
    characterLimit: 10000,
    audioDuration: '~10 minutes',
    category: 'voice_changer',
    useCase: ['voice_changer'],
  },
  
  // Speech-to-Text Models
  [ELEVENLABS_STT_MODELS.SCRIBE_V1]: {
    id: ELEVENLABS_STT_MODELS.SCRIBE_V1,
    name: 'Scribe v1',
    description: 'State-of-the-art speech recognition model',
    languages: ['99 languages'],
    characterLimit: 0, // Not applicable for STT
    audioDuration: 'N/A',
    category: 'stt',
    useCase: ['speech_recognition', 'transcription', 'multilingual'],
  },
  
  [ELEVENLABS_STT_MODELS.SCRIBE_V1_EXPERIMENTAL]: {
    id: ELEVENLABS_STT_MODELS.SCRIBE_V1_EXPERIMENTAL,
    name: 'Scribe v1 Experimental',
    description: 'State-of-the-art speech recognition model with experimental features: improved multilingual performance, reduced hallucinations during silence, fewer audio tags, and better handling of early transcript termination',
    languages: ['99 languages'],
    characterLimit: 0, // Not applicable for STT
    audioDuration: 'N/A',
    category: 'stt',
    useCase: ['speech_recognition', 'transcription', 'multilingual', 'experimental'],
  },
};

// Recommended Models for Different Use Cases
export const RECOMMENDED_MODELS = {
  // Text-to-Speech
  HIGH_QUALITY: ELEVENLABS_TTS_MODELS.ELEVEN_MULTILINGUAL_V2,
  CONVERSATIONAL_AI: ELEVENLABS_TTS_MODELS.ELEVEN_FLASH_V2_5,
  LOW_LATENCY: ELEVENLABS_TTS_MODELS.ELEVEN_FLASH_V2_5,
  MULTILINGUAL: ELEVENLABS_TTS_MODELS.ELEVEN_MULTILINGUAL_V2,
  BALANCED: ELEVENLABS_TTS_MODELS.ELEVEN_TURBO_V2_5,
  CONTENT_CREATION: ELEVENLABS_TTS_MODELS.ELEVEN_MULTILINGUAL_V2,
  
  // Speech-to-Text
  SPEECH_RECOGNITION: ELEVENLABS_STT_MODELS.SCRIBE_V1,
  SPEECH_RECOGNITION_EXPERIMENTAL: ELEVENLABS_STT_MODELS.SCRIBE_V1_EXPERIMENTAL,
  
  // Voice Changer
  VOICE_CHANGER: ELEVENLABS_TTS_MODELS.ELEVEN_MULTILINGUAL_STS_V2,
} as const;

// Helper Functions
export function getModelInfo(modelId: string): ModelInfo | undefined {
  return MODEL_INFO[modelId];
}

export function getModelsByCategory(category: ModelInfo['category']): ModelInfo[] {
  return Object.values(MODEL_INFO).filter(model => model.category === category);
}

export function getModelsByUseCase(useCase: string): ModelInfo[] {
  return Object.values(MODEL_INFO).filter(model => 
    model.useCase.includes(useCase)
  );
}

export function isTTSModel(modelId: string): boolean {
  return Object.values(ELEVENLABS_TTS_MODELS).includes(modelId as any);
}

export function isSTTModel(modelId: string): boolean {
  return Object.values(ELEVENLABS_STT_MODELS).includes(modelId as any);
}

export function isVoiceChangerModel(modelId: string): boolean {
  return [
    ELEVENLABS_TTS_MODELS.ELEVEN_MULTILINGUAL_STS_V2,
    ELEVENLABS_TTS_MODELS.ELEVEN_ENGLISH_STS_V2,
  ].includes(modelId as any);
}

export function isVoiceDesignerModel(modelId: string): boolean {
  return [
    ELEVENLABS_TTS_MODELS.ELEVEN_TTV_V3,
    ELEVENLABS_TTS_MODELS.ELEVEN_MULTILINGUAL_TTV_V2,
  ].includes(modelId as any);
}
