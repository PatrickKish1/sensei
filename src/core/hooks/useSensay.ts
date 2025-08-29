import { useState, useCallback, useRef } from 'react';
import { SensayService } from '../services/SensayService';
import { FileUploadService } from '../services/FileUploadService';
import type {
  AIAgent,
  User,
  TrainingContent,
  KnowledgeBaseEntry,
  ChatMessage,
  CreateAgentForm,
  ApiResponse,
  FileUpload
} from '../types';

/**
 * Custom hook for Sensay AI platform operations
 * Provides state management and methods for all platform functionality
 */
export const useSensay = (apiKey: string) => {
  // Core services
  const sensayServiceRef = useRef<SensayService | null>(null);
  const fileUploadServiceRef = useRef<FileUploadService | null>(null);

  // State management
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userAgents, setUserAgents] = useState<AIAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [trainingContent, setTrainingContent] = useState<TrainingContent[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [fileUploads, setFileUploads] = useState<FileUpload[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Error handling
  const [error, setError] = useState<string | null>(null);

  // Initialize services
  const initializeServices = useCallback(async () => {
    if (!apiKey) {
      setError('API key is required');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Initialize Sensay service
      const sensayService = new SensayService(apiKey);
      sensayServiceRef.current = sensayService;

      // Initialize file upload service
      const fileUploadService = new FileUploadService();
      fileUploadServiceRef.current = fileUploadService;

      // Validate API key
      const isValid = await sensayService.validateApiKey();
      if (!isValid) {
        setError('Invalid API key');
        return false;
      }

      setIsInitialized(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to initialize services');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  // User management
  const createOrGetUser = useCallback(async (userId: string, userData?: { name?: string; email?: string }) => {
    if (!sensayServiceRef.current) {
      setError('Services not initialized');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const sensayService = sensayServiceRef.current;

      // Check if user exists
      const userExists = await sensayService.userExists(userId);
      
      let user: User;
      if (userExists) {
        // Get existing user
        const response = await sensayService.getUser(userId);
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to get user');
        }
        user = response.data;
      } else {
        // Create new user
        const response = await sensayService.createUser({ id: userId, ...userData });
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to create user');
        }
        user = response.data;
      }

      // Set user context for authenticated operations
      sensayService.setUserContext(userId, apiKey);
      
      setCurrentUser(user);
      return user;
    } catch (err: any) {
      setError(err.message || 'Failed to create or get user');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  // AI Agent management
  const createAgent = useCallback(async (agentData: CreateAgentForm): Promise<AIAgent | null> => {
    if (!sensayServiceRef.current || !currentUser) {
      setError('Services not initialized or user not authenticated');
      return null;
    }

    try {
      setIsCreatingAgent(true);
      setError(null);

      const sensayService = sensayServiceRef.current;
      const response = await sensayService.createAgent(agentData, currentUser.id);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create agent');
      }

      const newAgent = response.data;
      setUserAgents(prev => [...prev, newAgent]);
      setSelectedAgent(newAgent);

      return newAgent;
    } catch (err: any) {
      setError(err.message || 'Failed to create agent');
      return null;
    } finally {
      setIsCreatingAgent(false);
    }
  }, [currentUser]);

  const getUserAgents = useCallback(async () => {
    if (!sensayServiceRef.current || !currentUser) {
      setError('Services not initialized or user not authenticated');
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);

      const sensayService = sensayServiceRef.current;
      const response = await sensayService.getUserAgents();

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to get user agents');
      }

      setUserAgents(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to get user agents');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const getAgent = useCallback(async (agentUUID: string): Promise<AIAgent | null> => {
    if (!sensayServiceRef.current || !currentUser) {
      setError('Services not initialized or user not authenticated');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const sensayService = sensayServiceRef.current;
      const response = await sensayService.getAgent(agentUUID);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to get agent');
      }

      setSelectedAgent(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to get agent');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Training and knowledge base
  const addTrainingContent = useCallback(async (content: string, title?: string): Promise<TrainingContent | null> => {
    if (!sensayServiceRef.current || !selectedAgent) {
      setError('Services not initialized or no agent selected');
      return null;
    }

    try {
      setIsTraining(true);
      setError(null);

      const sensayService = sensayServiceRef.current;

      // Create knowledge base entry
      const kbResponse = await sensayService.createKnowledgeBaseEntry(selectedAgent.uuid);
      if (!kbResponse.success || !kbResponse.data) {
        throw new Error('Failed to create knowledge base entry');
      }

      // Add content to knowledge base
      const addContentResponse = await sensayService.addTextToKnowledgeBase(
        selectedAgent.uuid,
        kbResponse.data.knowledgeBaseID,
        content
      );

      if (!addContentResponse.success) {
        throw new Error('Failed to add content to knowledge base');
      }

      const trainingContent: TrainingContent = {
        id: Date.now().toString(),
        agentUUID: selectedAgent.uuid,
        type: 'text',
        title: title || 'Manual input',
        description: 'Text content added manually',
        content: content,
        status: 'ready',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setTrainingContent(prev => [...prev, trainingContent]);
      return trainingContent;
    } catch (err: any) {
      setError(err.message || 'Failed to add training content');
      return null;
    } finally {
      setIsTraining(false);
    }
  }, [selectedAgent]);

  const uploadTrainingFile = useCallback(async (file: File): Promise<TrainingContent | null> => {
    if (!sensayServiceRef.current || !fileUploadServiceRef.current || !selectedAgent) {
      setError('Services not initialized or no agent selected');
      return null;
    }

    try {
      setIsUploading(true);
      setError(null);

      const fileUploadService = fileUploadServiceRef.current;
      const sensayService = sensayServiceRef.current;

      // Validate file
      const validation = fileUploadService.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error || 'File validation failed');
      }

      // Create file upload record
      const fileUpload = fileUploadService.createFileUpload(file);
      setFileUploads(prev => [...prev, fileUpload]);

      // Process file content
      const response = await fileUploadService.processFileContent(file, selectedAgent.uuid, sensayService);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to process file content');
      }

      // Update file upload status
      setFileUploads(prev => prev.map(fu => 
        fu.id === fileUpload.id 
          ? { ...fu, status: 'completed', progress: 100 }
          : fu
      ));

      // Add to training content
      setTrainingContent(prev => [...prev, response.data]);
      
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to upload training file');
      
      // Update file upload status to failed
      setFileUploads(prev => prev.map(fu => 
        fu.originalName === file.name 
          ? { ...fu, status: 'failed', error: err.message }
          : fu
      ));
      
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [selectedAgent]);

  const getKnowledgeBaseEntries = useCallback(async (): Promise<KnowledgeBaseEntry[]> => {
    if (!sensayServiceRef.current || !selectedAgent) {
      setError('Services not initialized or no agent selected');
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);

      const sensayService = sensayServiceRef.current;
      const response = await sensayService.getKnowledgeBaseEntries(selectedAgent.uuid);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to get knowledge base entries');
      }

      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to get knowledge base entries');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [selectedAgent]);

  // Chat functionality
  const chatWithAgent = useCallback(async (message: string): Promise<ChatMessage | null> => {
    if (!sensayServiceRef.current || !selectedAgent) {
      setError('Services not initialized or no agent selected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const sensayService = sensayServiceRef.current;
      const response = await sensayService.chatWithAgent(selectedAgent.uuid, message);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to chat with agent');
      }

      const chatMessage = response.data;
      chatMessage.userID = currentUser?.id || '';

      // Add to chat history
      setChatHistory(prev => [...prev, chatMessage]);
      
      return chatMessage;
    } catch (err: any) {
      setError(err.message || 'Failed to chat with agent');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [selectedAgent, currentUser]);

  const getChatHistory = useCallback(async (): Promise<ChatMessage[]> => {
    if (!sensayServiceRef.current || !selectedAgent) {
      setError('Services not initialized or no agent selected');
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);

      const sensayService = sensayServiceRef.current;
      const response = await sensayService.getChatHistory(selectedAgent.uuid);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to get chat history');
      }

      setChatHistory(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to get chat history');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [selectedAgent]);

  // Utility methods
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetState = useCallback(() => {
    setCurrentUser(null);
    setUserAgents([]);
    setSelectedAgent(null);
    setTrainingContent([]);
    setChatHistory([]);
    setFileUploads([]);
    setError(null);
    setIsInitialized(false);
  }, []);

  const getAvailableModels = useCallback(() => {
    if (!sensayServiceRef.current) return {};
    return sensayServiceRef.current.getAvailableModels();
  }, []);

  const getFileUploadInfo = useCallback(() => {
    if (!fileUploadServiceRef.current) return { maxSize: 0, supportedTypes: [] };
    
    return {
      maxSize: fileUploadServiceRef.current.getMaxFileSize(),
      supportedTypes: fileUploadServiceRef.current.getSupportedFileTypes()
    };
  }, []);

  return {
    // State
    isInitialized,
    currentUser,
    userAgents,
    selectedAgent,
    trainingContent,
    chatHistory,
    fileUploads,
    isLoading,
    isCreatingAgent,
    isTraining,
    isUploading,
    error,

    // Methods
    initializeServices,
    createOrGetUser,
    createAgent,
    getUserAgents,
    getAgent,
    addTrainingContent,
    uploadTrainingFile,
    getKnowledgeBaseEntries,
    chatWithAgent,
    getChatHistory,
    clearError,
    resetState,
    getAvailableModels,
    getFileUploadInfo,

    // Setters
    setSelectedAgent,
    setError
  };
};
