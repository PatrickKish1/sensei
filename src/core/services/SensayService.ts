import { SensayAPI } from '@/sensay-sdk';
import type { 
  AIAgent, 
  User, 
  TrainingContent, 
  KnowledgeBaseEntry, 
  ChatMessage,
  CreateAgentForm,
  ApiResponse,
  PaginatedResponse 
} from '../types';

/**
 * Core service for interacting with Sensay AI API
 * Handles all platform operations including user management, 
 * AI agent creation, training, and chat functionality
 */
export class SensayService {
  private client: SensayAPI;
  private orgClient: SensayAPI;
  private apiVersion: string;

  constructor(apiKey: string, apiVersion: string = '2025-03-25') {
    this.apiVersion = apiVersion;
    
    // Organization-level client for admin operations
    this.orgClient = new SensayAPI({
      HEADERS: {
        'X-ORGANIZATION-SECRET': apiKey,
        'Content-Type': 'application/json'
      }
    });

    // User-level client (will be set when user is authenticated)
    this.client = this.orgClient;
  }

  /**
   * Set user context for authenticated operations
   */
  setUserContext(userId: string, apiKey: string): void {
    this.client = new SensayAPI({
      HEADERS: {
        'X-ORGANIZATION-SECRET': apiKey,
        'X-USER-ID': userId,
        'Content-Type': 'application/json'
      }
    });
  }

  // ==================== USER MANAGEMENT ====================

  /**
   * Create a new user in the organization
   */
  async createUser(userData: { id: string; name?: string; email?: string }): Promise<ApiResponse<User>> {
    try {
      const user = await this.orgClient.users.postV1Users(this.apiVersion, userData);
      
      return {
        success: true,
        data: {
          id: user.id,
          name: user.name || '',
          email: user.email || '',
          avatar: undefined,
          bio: undefined,
          expertise: [],
          linkedAccounts: user.linkedAccounts || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create user'
      };
    }
  }

  /**
   * Get user information
   */
  async getUser(userId: string): Promise<ApiResponse<User>> {
    try {
      const user = await this.orgClient.users.getV1Users(userId);
      
      return {
        success: true,
        data: {
          id: user.id,
          name: user.name || '',
          email: user.email || '',
          avatar: undefined,
          bio: undefined,
          expertise: [],
          linkedAccounts: user.linkedAccounts || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get user'
      };
    }
  }

  /**
   * Check if user exists
   */
  async userExists(userId: string): Promise<boolean> {
    try {
      await this.orgClient.users.getV1Users(userId);
      return true;
    } catch {
      return false;
    }
  }

  // ==================== AI AGENT MANAGEMENT ====================

  /**
   * Create a new AI agent (replica)
   */
  async createAgent(agentData: CreateAgentForm, ownerId: string): Promise<ApiResponse<AIAgent>> {
    try {
      // Generate unique slug
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const uniqueSlug = `${agentData.name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}-${randomStr}`;

      const replica = await this.client.replicas.postV1Replicas(this.apiVersion, {
        name: agentData.name,
        shortDescription: agentData.shortDescription,
        greeting: agentData.greeting,
        slug: uniqueSlug,
        ownerID: ownerId,
        private: agentData.isPrivate,
        llm: {
          provider: agentData.llmProvider as any,
          model: agentData.llmModel,
          memoryMode: 'prompt-caching' as any,
          systemMessage: agentData.systemMessage
        }
      });

      const agent: AIAgent = {
        uuid: replica.uuid,
        name: agentData.name,
        slug: uniqueSlug,
        shortDescription: agentData.shortDescription,
        greeting: agentData.greeting,
        profileImage: undefined,
        ownerID: ownerId,
        isPrivate: agentData.isPrivate,
        status: 'draft',
        llm: {
          provider: agentData.llmProvider as any,
          model: agentData.llmModel,
          memoryMode: 'prompt-caching',
          systemMessage: agentData.systemMessage
        },
        trainingProgress: {
          totalContent: 0,
          processedContent: 0,
          vectorizedContent: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return { success: true, data: agent };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create AI agent'
      };
    }
  }

  /**
   * Get all AI agents for a user
   */
  async getUserAgents(): Promise<ApiResponse<AIAgent[]>> {
    try {
      const replicas = await this.client.replicas.getV1Replicas();
      
      if (!replicas.items) {
        return { success: true, data: [] };
      }

      const agents: AIAgent[] = replicas.items.map(replica => ({
        uuid: replica.uuid,
        name: replica.name || '',
        slug: replica.slug || '',
        shortDescription: replica.short_description || '',
        greeting: replica.introduction || '',
        profileImage: replica.profile_image,
        ownerID: replica.owner_uuid || '',
        isPrivate: replica.private || false,
        status: 'active', // Default status
        llm: {
          provider: 'anthropic', // Default provider
          model: 'claude-3-7-sonnet-latest',
          memoryMode: 'prompt-caching',
          systemMessage: replica.system_message || ''
        },
        trainingProgress: {
          totalContent: replica.chat_history_count || 0,
          processedContent: 0,
          vectorizedContent: 0
        },
        createdAt: replica.created_at || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      return { success: true, data: agents };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get user agents'
      };
    }
  }

  /**
   * Get a specific AI agent by UUID
   */
  async getAgent(agentUUID: string): Promise<ApiResponse<AIAgent>> {
    try {
      const replica = await this.client.replicas.getV1ReplicasReplicaUUID(agentUUID);
      
      const agent: AIAgent = {
        uuid: replica.uuid,
        name: replica.name || '',
        slug: replica.slug || '',
        shortDescription: replica.short_description || '',
        greeting: replica.introduction || '',
        profileImage: replica.profile_image,
        ownerID: replica.owner_uuid || '',
        isPrivate: replica.private || false,
        status: 'active',
        llm: {
          provider: 'anthropic',
          model: 'claude-3-7-sonnet-latest',
          memoryMode: 'prompt-caching',
          systemMessage: replica.system_message || ''
        },
        trainingProgress: {
          totalContent: replica.chat_history_count || 0,
          processedContent: 0,
          vectorizedContent: 0
        },
        createdAt: replica.created_at || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return { success: true, data: agent };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get agent'
      };
    }
  }

  // ==================== TRAINING & KNOWLEDGE BASE ====================

  /**
   * Create a new knowledge base entry for training
   */
  async createKnowledgeBaseEntry(agentUUID: string): Promise<ApiResponse<KnowledgeBaseEntry>> {
    try {
      const response = await this.client.training.postV1ReplicasTraining(agentUUID, this.apiVersion, {});
      
      const entry: KnowledgeBaseEntry = {
        knowledgeBaseID: response.knowledgeBaseID,
        agentUUID,
        type: 'text',
        status: 'BLANK',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return { success: true, data: entry };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create knowledge base entry'
      };
    }
  }

  /**
   * Add text content to knowledge base entry
   */
  async addTextToKnowledgeBase(
    agentUUID: string, 
    knowledgeBaseID: number, 
    text: string
  ): Promise<ApiResponse<boolean>> {
    try {
      await this.client.training.putV1ReplicasTrainingTrainingUUID(
        agentUUID,
        knowledgeBaseID,
        this.apiVersion,
        { rawText: text }
      );

      return { success: true, data: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to add text to knowledge base'
      };
    }
  }

  /**
   * Get signed URL for file upload
   */
  async getFileUploadURL(agentUUID: string, filename: string): Promise<ApiResponse<{ signedURL: string; knowledgeBaseID: number }>> {
    try {
      const response = await this.client.training.getV1ReplicasTrainingFilesUpload(
        agentUUID,
        this.apiVersion,
        { filename }
      );

      return {
        success: true,
        data: {
          signedURL: response.signedURL,
          knowledgeBaseID: response.knowledgeBaseID
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get file upload URL'
      };
    }
  }

  /**
   * Get knowledge base entries for an agent
   */
  async getKnowledgeBaseEntries(agentUUID: string): Promise<ApiResponse<KnowledgeBaseEntry[]>> {
    try {
      const response = await this.client.training.getV1ReplicasTraining(agentUUID, this.apiVersion);
      
      if (!response.items) {
        return { success: true, data: [] };
      }

      const entries: KnowledgeBaseEntry[] = response.items.map(item => ({
        knowledgeBaseID: item.id,
        agentUUID,
        type: item.type as 'text' | 'document',
        status: item.status as any,
        rawText: item.raw_text,
        processedText: item.processed_text,
        filename: item.filename,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      return { success: true, data: entries };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get knowledge base entries'
      };
    }
  }

  // ==================== CHAT FUNCTIONALITY ====================

  /**
   * Send a message to an AI agent and get response
   */
  async chatWithAgent(
    agentUUID: string, 
    message: string, 
    source: string = 'web'
  ): Promise<ApiResponse<ChatMessage>> {
    try {
      const response = await this.client.chatCompletions.postV1ReplicasChatCompletions(
        agentUUID,
        this.apiVersion,
        {
          content: message,
          source: source as any,
          skip_chat_history: false
        }
      );

      const chatMessage: ChatMessage = {
        id: Date.now().toString(), // Generate temporary ID
        agentUUID,
        userID: '', // Will be set by caller
        role: 'assistant',
        content: response.content,
        source: 'web',
        createdAt: new Date().toISOString()
      };

      return { success: true, data: chatMessage };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to chat with agent'
      };
    }
  }

  /**
   * Get chat history for an agent
   */
  async getChatHistory(agentUUID: string): Promise<ApiResponse<ChatMessage[]>> {
    try {
      const response = await this.client.chatHistory.getV1ReplicasChatHistory(agentUUID, this.apiVersion);
      
      if (!response.items) {
        return { success: true, data: [] };
      }

      const messages: ChatMessage[] = response.items.map(item => ({
        id: item.id.toString(),
        agentUUID: item.replica_uuid,
        userID: item.user_uuid,
        role: item.role as 'user' | 'assistant',
        content: item.content,
        source: item.source as any,
        createdAt: item.created_at
      }));

      return { success: true, data: messages };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get chat history'
      };
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get available LLM models
   */
  getAvailableModels(): { [key: string]: string[] } {
    return {
      anthropic: [
        'claude-3-5-haiku-latest',
        'claude-3-7-sonnet-latest',
        'claude-3-opus-latest'
      ],
      openai: [
        'gpt-4o',
        'gpt-4o-mini',
        'gpt-4-turbo'
      ],
      groq: [
        'grok-2-latest',
        'grok-3-beta'
      ],
      deepseek: [
        'deepseek-chat'
      ],
      huggingface: [
        'huggingface-eva',
        'huggingface-dolphin-llama'
      ]
    };
  }

  /**
   * Validate API key
   */
  async validateApiKey(): Promise<boolean> {
    try {
      // Try to list replicas as a simple validation
      await this.orgClient.replicas.getV1Replicas();
      return true;
    } catch {
      return false;
    }
  }
}
