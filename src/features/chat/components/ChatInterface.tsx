'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import type { ChatMessage } from '@/core/types';

/**
 * Chat interface component for interacting with AI agents
 */
export const ChatInterface: React.FC = () => {
  const { sensay } = useAuth();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sensay.chatHistory]);

  // Load chat history when component mounts
  useEffect(() => {
    if (sensay.selectedAgent) {
      sensay.getChatHistory();
    }
  }, [sensay.selectedAgent]);

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    try {
      // Add user message to chat immediately
      const userChatMessage: ChatMessage = {
        id: Date.now().toString(),
        agentUUID: sensay.selectedAgent!.uuid,
        userID: sensay.currentUser?.id || '',
        role: 'user',
        content: userMessage,
        source: 'web',
        createdAt: new Date().toISOString()
      };

      // Update chat history with user message
      sensay.setChatHistory(prev => [...prev, userChatMessage]);
      console.log('User message added to chat:', userChatMessage);

      // Get AI response
      const aiResponse = await sensay.chatWithAgent(userMessage);
      
      if (aiResponse) {
        // Add AI response to chat history
        sensay.setChatHistory(prev => [...prev, aiResponse]);
        console.log('AI response added to chat:', aiResponse);
      } else {
        // If no AI response, add an error message
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          agentUUID: sensay.selectedAgent!.uuid,
          userID: 'system',
          role: 'assistant',
          content: 'Sorry, I encountered an error while processing your message. Please try again.',
          source: 'web',
          createdAt: new Date().toISOString()
        };
        sensay.setChatHistory(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        agentUUID: sensay.selectedAgent!.uuid,
        userID: 'system',
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        source: 'web',
        createdAt: new Date().toISOString()
      };

      sensay.setChatHistory(prev => [...prev, errorMessage]);
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

  if (!sensay.selectedAgent) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select an AI agent to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Chat with {sensay.selectedAgent.name}</h2>
        <p className="text-gray-600 mt-2">
          {sensay.selectedAgent.greeting || 'Start a conversation with your AI agent.'}
        </p>
      </div>

      {/* Chat Container */}
      <div className="card h-[600px] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {sensay.chatHistory.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 text-gray-300 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-lg font-medium">Start a conversation</p>
                <p className="text-sm">Send a message to begin chatting with your AI agent.</p>
              </div>
            </div>
          ) : (
            sensay.chatHistory.map((chatMessage) => (
              <div
                key={chatMessage.id}
                className={`flex ${chatMessage.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    chatMessage.role === 'user'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-300 text-gray-900'
                  }`}
                >
                  <div className="text-xs opacity-75 mb-1">
                    {chatMessage.role === 'user' ? 'You' : sensay.selectedAgent?.name}
                  </div>
                  <div className="whitespace-pre-wrap">
                    {formatMessage(chatMessage.content)}
                  </div>
                  <div className="text-xs opacity-75 mt-2 text-right">
                    {new Date(chatMessage.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="input flex-1 resize-none"
              rows={2}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="btn btn-primary px-6 self-end"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Send'
              )}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Agent Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">About {sensay.selectedAgent.name}</h3>
        <p className="text-blue-800 mb-3">{sensay.selectedAgent.shortDescription}</p>
        
        {sensay.selectedAgent.expertise && Array.isArray(sensay.selectedAgent.expertise) && sensay.selectedAgent.expertise.length > 0 && (
          <div>
            <p className="text-sm font-medium text-blue-700 mb-2">Areas of Expertise:</p>
            <div className="flex flex-wrap gap-2">
              {sensay.selectedAgent.expertise.map((exp, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {exp}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {sensay.error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Chat Error</h3>
              <div className="mt-2 text-sm text-red-700">
                {sensay.error}
              </div>
              <div className="mt-4">
                <button
                  onClick={sensay.clearError}
                  className="text-sm font-medium text-red-800 hover:text-red-900"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
