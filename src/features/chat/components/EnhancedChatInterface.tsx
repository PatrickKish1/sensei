'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { ConversationHistory } from '@/components/ConversationHistory';
import { VoiceChatIntegration } from '@/components/VoiceChatIntegration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  History, 
  Plus, 
  Settings,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  Phone,
  Users
} from 'lucide-react';
import type { ChatMessage, Conversation } from '@/core/types';

interface EnhancedChatInterfaceProps {
  className?: string;
}

export const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  className = ''
}) => {
  const { sensay } = useAuth();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [conversationMessages, setConversationMessages] = useState<ChatMessage[]>([]);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isConferenceMode, setIsConferenceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations when component mounts
  useEffect(() => {
    if (sensay.currentUser && sensay.selectedAgent) {
      sensay.getConversations(sensay.selectedAgent.uuid);
    }
  }, [sensay.currentUser, sensay.selectedAgent]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  // Load chat history when agent changes
  useEffect(() => {
    if (sensay.selectedAgent && !currentConversation) {
      sensay.getChatHistory();
      setConversationMessages(sensay.chatHistory);
    }
  }, [sensay.selectedAgent, currentConversation]);

  // Handle conversation selection
  const handleSelectConversation = async (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setShowHistory(false);
    
    try {
      const messages = await sensay.getConversationMessages(sensay.selectedAgent!.uuid, conversation.uuid);
      setConversationMessages(messages);
    } catch (error) {
      console.error('Failed to load conversation messages:', error);
    }
  };

  // Handle new conversation
  const handleNewConversation = async () => {
    if (!sensay.selectedAgent) return;
    
    try {
      const newConversation = await sensay.createConversation(
        sensay.selectedAgent.uuid,
        sensay.currentUser?.id
      );
      
      if (newConversation) {
        setCurrentConversation(newConversation);
        setConversationMessages([]);
        setShowHistory(false);
      }
    } catch (error) {
      console.error('Failed to create new conversation:', error);
    }
  };

  // Handle voice messages
  const handleVoiceMessage = (voiceMessage: any) => {
    // Add voice message to conversation
    const chatMessage: ChatMessage = {
      id: voiceMessage.id,
      agentUUID: sensay.selectedAgent!.uuid,
      userID: sensay.currentUser?.id || '',
      role: voiceMessage.type,
      content: voiceMessage.content,
      source: 'web',
      createdAt: voiceMessage.timestamp.toISOString(),
      metadata: {
        isVoiceMessage: true,
        audioUrl: voiceMessage.audioUrl,
        duration: voiceMessage.duration
      }
    };

    setConversationMessages(prev => [...prev, chatMessage]);
  };

  // Toggle voice mode
  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    setShowVoiceChat(!showVoiceChat);
  };

  // Toggle conference mode
  const toggleConferenceMode = () => {
    setIsConferenceMode(!isConferenceMode);
  };

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading || !sensay.selectedAgent) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    try {
      // Add user message to chat immediately
      const userChatMessage: ChatMessage = {
        id: Date.now().toString(),
        agentUUID: sensay.selectedAgent.uuid,
        userID: sensay.currentUser?.id || '',
        role: 'user',
        content: userMessage,
        source: 'web',
        createdAt: new Date().toISOString()
      };

      // Update conversation messages
      setConversationMessages(prev => [...prev, userChatMessage]);

      // Get AI response
      const aiResponse = await sensay.chatWithAgent(userMessage);
      
      if (aiResponse) {
        setConversationMessages(prev => [...prev, aiResponse]);
      } else {
        // Add error message
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          agentUUID: sensay.selectedAgent.uuid,
          userID: 'system',
          role: 'assistant',
          content: 'Sorry, I encountered an error while processing your message. Please try again.',
          source: 'web',
          createdAt: new Date().toISOString()
        };
        setConversationMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        agentUUID: sensay.selectedAgent!.uuid,
        userID: 'system',
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        source: 'web',
        createdAt: new Date().toISOString()
      };

      setConversationMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press for Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  // Format message content
  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!sensay.selectedAgent) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Agent Selected</h3>
          <p className="text-gray-500">Please select an AI agent to start chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-full bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Conversation History Sidebar */}
      {showHistory && (
        <div className="w-80 border-r border-gray-200">
          <ConversationHistory
            conversations={sensay.conversations}
            selectedConversation={currentConversation}
            onSelectConversation={handleSelectConversation}
            onLoadMessages={async (conversationId) => {
              const response = await sensay.getConversationMessages(sensay.selectedAgent!.uuid, conversationId);
              return response;
            }}
            isLoading={sensay.isLoading}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="p-2"
              >
                <History className="w-4 h-4" />
              </Button>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentConversation?.conversationName || `Chat with ${sensay.selectedAgent.name}`}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {sensay.selectedAgent.name}
                  </Badge>
                  {currentConversation && (
                    <span className="text-xs text-gray-500">
                      {formatDate(currentConversation.lastMessageAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isVoiceMode ? "default" : "outline"}
                size="sm"
                onClick={toggleVoiceMode}
                className="flex items-center gap-2"
              >
                {isVoiceMode ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isVoiceMode ? 'Text Mode' : 'Voice Mode'}
              </Button>
              
              {isVoiceMode && (
                <Button
                  variant={isConferenceMode ? "default" : "outline"}
                  size="sm"
                  onClick={toggleConferenceMode}
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  {isConferenceMode ? 'Exit Conference' : 'Conference'}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewConversation}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Voice Chat Integration */}
          {showVoiceChat && (
            <VoiceChatIntegration
              agentId={sensay.selectedAgent.uuid}
              agentName={sensay.selectedAgent.name}
              voiceId={sensay.selectedAgent.uuid} // Use agent UUID as voice ID
              isConferenceMode={isConferenceMode}
              onVoiceMessage={handleVoiceMessage}
              className="mb-4"
            />
          )}

          {conversationMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
                <p className="text-gray-500 mb-4">
                  {currentConversation?.summary || sensay.selectedAgent.greeting || 'Send a message to begin chatting.'}
                </p>
                
                {/* Suggested topics */}
                {currentConversation?.commonTopics && currentConversation.commonTopics.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {currentConversation.commonTopics.slice(0, 3).map(topic => (
                      <Button
                        key={topic}
                        variant="outline"
                        size="sm"
                        onClick={() => setMessage(`Tell me about ${topic}`)}
                        className="text-xs"
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            conversationMessages.map((chatMessage) => (
              <div
                key={chatMessage.id}
                className={`flex ${chatMessage.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    chatMessage.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="text-xs opacity-75 mb-1">
                    {chatMessage.role === 'user' ? 'You' : sensay.selectedAgent?.name}
                  </div>
                  
                  {/* Voice message indicator */}
                  {chatMessage.metadata?.isVoiceMessage ? (
                    <div className="flex items-center space-x-2">
                      <Mic className="h-4 w-4" />
                      <span className="text-sm">Voice Message</span>
                      {chatMessage.metadata.duration && (
                        <span className="text-xs opacity-75">
                          ({Math.round(chatMessage.metadata.duration)}s)
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">
                      {formatMessage(chatMessage.content)}
                    </div>
                  )}
                  
                  <div className="text-xs opacity-75 mt-2 text-right">
                    {formatDate(chatMessage.createdAt)}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          {isVoiceMode ? (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Voice mode is active. Use the voice controls above to record and send voice messages.
              </p>
              <Button
                variant="outline"
                onClick={toggleVoiceMode}
                className="flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Switch to Text Mode
              </Button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex space-x-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="px-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
              
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
