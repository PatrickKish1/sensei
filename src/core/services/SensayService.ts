import { SensayAPI } from '@/sensay-sdk';
import type { 
  AIAgent, 
  User, 
  TrainingContent, 
  KnowledgeBaseEntry, 
  ChatMessage,
  CreateAgentForm,
  ApiResponse,
  PaginatedResponse,
  Conversation
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
          model: agentData.llmModel as 'gpt-4o' | 'claude-3-5-haiku-latest' | 'claude-3-7-sonnet-latest' | 'grok-2-latest' | 'grok-3-beta' | 'deepseek-chat' | 'o3-mini' | 'gpt-4o-mini' | 'huggingface-eva' | 'huggingface-dolphin-llama',
          memoryMode: 'prompt-caching',
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
          provider: 'anthropic', // Default provider
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
        profileImage: replica.profile_image || undefined,
        ownerID: replica.owner_uuid || '',
        isPrivate: replica.private || false,
        status: 'active', // Default status
        expertise: replica.tags || [], // Map tags to expertise
        llm: {
          provider: 'anthropic', // Default provider
          model: 'claude-3-7-sonnet-latest',
          memoryMode: 'prompt-caching',
          systemMessage: replica.system_message || ''
        },
        trainingProgress: {
          totalContent: 0, // This would need to be fetched separately
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
      const replica = await this.client.replicas.getV1Replicas1(agentUUID);
      
      const agent: AIAgent = {
        uuid: replica.uuid,
        name: replica.name || '',
        slug: replica.slug || '',
        shortDescription: replica.shortDescription || '',
        greeting: replica.greeting || '',
        profileImage: replica.profileImage,
        ownerID: replica.ownerID || '',
        isPrivate: replica.private || false,
        status: 'active',
        llm: {
          provider: 'anthropic',
          model: 'claude-3-7-sonnet-latest',
          memoryMode: 'prompt-caching',
          systemMessage: replica.llm?.systemMessage || ''
        },
        trainingProgress: {
          totalContent: 0, // This would need to be fetched separately
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
      const response = await this.client.training.postV1ReplicasTraining(agentUUID, this.apiVersion);
      
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
      await this.client.training.putV1ReplicasTraining(
        agentUUID,
        knowledgeBaseID,
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
        filename
      );

      return {
        success: true,
        data: {
          signedURL: response.signedURL || '',
          knowledgeBaseID: response.knowledgeBaseID || 0
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
      const response = await this.client.training.getV1Training1(null, this.apiVersion);
      
      if (!response) {
        return { success: true, data: [] };
      }

      const entry: KnowledgeBaseEntry = {
        knowledgeBaseID: response.id,
        agentUUID: response.replica_uuid || agentUUID,
        type: response.type as 'text' | 'document',
        status: response.status as any,
        rawText: response.raw_text || undefined,
        processedText: response.processed_text || undefined,
        filename: response.filename || undefined,
        createdAt: response.created_at,
        updatedAt: response.updated_at
      };

      const entries: KnowledgeBaseEntry[] = [entry];

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
        agentUUID: agentUUID,
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

  // ==================== CONVERSATION MANAGEMENT ====================

  /**
   * List conversations for a specific agent
   */
  async getConversations(
    agentUUID: string,
    pageSize: number = 24,
    page: number = 1,
    sortBy: 'replicaReplies' | 'firstMessageAt' | 'lastReplicaReplyAt' = 'lastReplicaReplyAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<ApiResponse<Conversation[]>> {
    try {
      // Since the conversation endpoints might not be available in the current SDK,
      // we'll implement this as a mock for now and can be updated when the endpoints are available
      
      // Mock conversation data to demonstrate the conversation history feature
      const mockConversations: Conversation[] = [
        {
          uuid: 'conv-1',
          agentUUID: agentUUID,
          userID: 'user-1',
          source: 'web',
          messageCount: 12,
          replicaReplyCount: 8,
          firstMessageAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          lastReplicaReplyAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          conversationName: 'React Development Help',
          conversationImageURL: undefined,
          summary: 'Discussion about React hooks, state management, and component architecture. Covered useState, useEffect, and custom hooks.',
          commonQuestions: [
            'How do I use useEffect properly?',
            'What is the difference between useState and useReducer?',
            'How can I optimize React performance?'
          ],
          commonTopics: ['React', 'JavaScript', 'Frontend Development', 'Hooks'],
          conversationType: 'individual',
          status: 'active'
        },
        {
          uuid: 'conv-2',
          agentUUID: agentUUID,
          userID: 'user-1',
          source: 'web',
          messageCount: 8,
          replicaReplyCount: 6,
          firstMessageAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          lastReplicaReplyAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          conversationName: 'AI and Machine Learning',
          conversationImageURL: undefined,
          summary: 'Explored machine learning concepts, neural networks, and AI applications. Discussed supervised vs unsupervised learning.',
          commonQuestions: [
            'What is the difference between AI and ML?',
            'How do neural networks work?',
            'What are the best ML frameworks?'
          ],
          commonTopics: ['Artificial Intelligence', 'Machine Learning', 'Neural Networks', 'Data Science'],
          conversationType: 'individual',
          status: 'active'
        },
        {
          uuid: 'conv-3',
          agentUUID: agentUUID,
          userID: 'user-1',
          source: 'web',
          messageCount: 15,
          replicaReplyCount: 12,
          firstMessageAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
          lastMessageAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          lastReplicaReplyAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          conversationName: 'Business Strategy',
          conversationImageURL: undefined,
          summary: 'Strategic planning discussion covering market analysis, competitive advantage, and growth strategies for startups.',
          commonQuestions: [
            'How do I create a business plan?',
            'What is a competitive analysis?',
            'How can I scale my business?'
          ],
          commonTopics: ['Business Strategy', 'Entrepreneurship', 'Marketing', 'Finance'],
          conversationType: 'individual',
          status: 'active'
        },
        {
          uuid: 'conv-4',
          agentUUID: agentUUID,
          userID: 'user-1',
          source: 'web',
          messageCount: 6,
          replicaReplyCount: 4,
          firstMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          lastMessageAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          lastReplicaReplyAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          conversationName: 'General Questions',
          conversationImageURL: undefined,
          summary: 'Quick questions about various topics including technology trends and best practices.',
          commonQuestions: [
            'What are the latest tech trends?',
            'How do I stay updated with technology?'
          ],
          commonTopics: ['Technology', 'General'],
          conversationType: 'individual',
          status: 'active'
        }
      ];

      return { success: true, data: mockConversations };
      
      // TODO: Implement when conversation endpoints are available in SDK
      // const response = await this.orgClient.replicas.getV1ReplicasConversations(
      //   agentUUID,
      //   pageSize,
      //   page,
      //   sortBy,
      //   sortOrder,
      //   this.apiVersion
      // );
      
      // const conversations: Conversation[] = response.items.map(item => ({
      //   uuid: item.uuid,
      //   agentUUID: agentUUID,
      //   userID: item.userID || '',
      //   source: item.source,
      //   messageCount: item.messageCount,
      //   replicaReplyCount: item.replicaReplyCount,
      //   firstMessageAt: item.firstMessageAt,
      //   lastMessageAt: item.lastMessageAt,
      //   lastReplicaReplyAt: item.lastReplicaReplyAt,
      //   conversationName: item.conversationName,
      //   conversationImageURL: item.conversationImageURL,
      //   summary: item.summary,
      //   commonQuestions: item.commonQuestions,
      //   commonTopics: item.commonTopics,
      //   conversationType: item.conversationType,
      //   status: 'active'
      // }));

      // return { success: true, data: conversations };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch conversations'
      };
    }
  }

  /**
   * Get conversation details
   */
  async getConversation(agentUUID: string, conversationUUID: string): Promise<ApiResponse<Conversation>> {
    try {
      // TODO: Implement when conversation endpoints are available in SDK
      return {
        success: false,
        error: 'Conversation endpoints not yet available in SDK'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch conversation'
      };
    }
  }

  /**
   * Get messages for a specific conversation
   */
  async getConversationMessages(
    agentUUID: string,
    conversationUUID: string,
    pageSize: number = 50,
    cursor?: string
  ): Promise<ApiResponse<ChatMessage[]>> {
    try {
      // Mock conversation messages for demonstration
      const mockMessages: ChatMessage[] = [
        {
          id: 'msg-1',
          agentUUID: agentUUID,
          userID: 'user-1',
          role: 'user',
          content: 'Hello! I need help with React hooks.',
          source: 'web',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-2',
          agentUUID: agentUUID,
          userID: 'user-1',
          role: 'assistant',
          content: 'I\'d be happy to help you with React hooks! React hooks are functions that let you use state and other React features in functional components. The most common hooks are useState and useEffect. What specific aspect of hooks would you like to learn about?',
          source: 'web',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-3',
          agentUUID: agentUUID,
          userID: 'user-1',
          role: 'user',
          content: 'How do I use useEffect properly? I keep getting infinite loops.',
          source: 'web',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-4',
          agentUUID: agentUUID,
          userID: 'user-1',
          role: 'assistant',
          content: 'Great question! Infinite loops in useEffect usually happen when the dependency array is missing or incorrect. Here are the key rules:\n\n1. Always include all dependencies that are used inside the effect\n2. Use the ESLint plugin to catch missing dependencies\n3. If you need to use a function, either define it inside the effect or wrap it with useCallback\n4. For objects and arrays, be careful about reference equality\n\nWould you like me to show you a specific example?',
          source: 'web',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 1000).toISOString()
        }
      ];

      return {
        success: true,
        data: mockMessages
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch conversation messages'
      };
    }
  }

  /**
   * Create a new conversation (this happens automatically when first message is sent)
   */
  async createConversation(agentUUID: string, userID: string): Promise<ApiResponse<Conversation>> {
    try {
      // Conversations are typically created automatically when the first message is sent
      // This method is here for future use if manual conversation creation is needed
      return {
        success: false,
        error: 'Conversations are created automatically when first message is sent'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create conversation'
      };
    }
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
