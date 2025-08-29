// Core types for the Digital Sensei platform

// User Management
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  expertise?: string[];
  linkedAccounts?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

// AI Agent (Replica) Management
export interface AIAgent {
  uuid: string;
  name: string;
  slug: string;
  shortDescription: string;
  greeting: string;
  profileImage?: string;
  ownerID: string;
  isPrivate: boolean;
  status: 'draft' | 'training' | 'active' | 'paused';
  llm: {
    provider: 'openai' | 'anthropic' | 'groq' | 'deepseek' | 'huggingface';
    model: string;
    memoryMode: 'prompt-caching' | 'rag-search';
    systemMessage: string;
  };
  trainingProgress: {
    totalContent: number;
    processedContent: number;
    vectorizedContent: number;
    lastTrainingAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Training Content Management
export interface TrainingContent {
  id: string;
  agentUUID: string;
  type: 'text' | 'document' | 'audio' | 'video';
  title?: string;
  description?: string;
  content: string | File;
  status: 'pending' | 'processing' | 'ready' | 'error';
  metadata?: {
    fileSize?: number;
    duration?: number;
    pages?: number;
    language?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBaseEntry {
  knowledgeBaseID: number;
  agentUUID: string;
  type: 'text' | 'document';
  status: 'BLANK' | 'AWAITING_UPLOAD' | 'SUPABASE_ONLY' | 'PROCESSING' | 'READY' | 'SYNC_ERROR' | 'ERR_FILE_PROCESSING' | 'ERR_TEXT_PROCESSING' | 'ERR_TEXT_TO_VECTOR';
  rawText?: string;
  processedText?: string;
  filename?: string;
  createdAt: string;
  updatedAt: string;
}

// Chat & Interactions
export interface ChatMessage {
  id: string;
  agentUUID: string;
  userID: string;
  role: 'user' | 'assistant';
  content: string;
  source: 'web' | 'mobile' | 'api';
  metadata?: {
    responseTime?: number;
    tokensUsed?: number;
    confidence?: number;
  };
  createdAt: string;
}

export interface Conversation {
  uuid: string;
  agentUUID: string;
  userID: string;
  source: string;
  messageCount: number;
  firstMessageAt: string;
  lastMessageAt: string;
  status: 'active' | 'archived';
}

// File Upload & Processing
export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  signedURL?: string;
  downloadURL?: string;
  error?: string;
  createdAt: string;
}

// Platform Configuration
export interface PlatformConfig {
  maxFileSize: number;
  supportedFileTypes: string[];
  maxContentPerAgent: number;
  trainingBatchSize: number;
  supportedLanguages: string[];
  defaultLLMModels: {
    [key: string]: string[];
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Training Progress Tracking
export interface TrainingProgress {
  agentUUID: string;
  totalContent: number;
  processedContent: number;
  vectorizedContent: number;
  currentStage: 'content_upload' | 'processing' | 'training' | 'ready';
  estimatedCompletion?: string;
  lastActivity: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Form Types
export interface CreateAgentForm {
  name: string;
  shortDescription: string;
  greeting: string;
  expertise: string[];
  isPrivate: boolean;
  llmProvider: string;
  llmModel: string;
  systemMessage: string;
}

export interface UpdateProfileForm {
  name: string;
  bio: string;
  expertise: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}
