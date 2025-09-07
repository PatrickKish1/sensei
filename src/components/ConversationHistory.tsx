'use client';

import React, { useState, useEffect } from 'react';
import { Conversation, ChatMessage } from '@/core/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Calendar, 
  Hash,
  Clock,
  User,
  Bot,
  MoreHorizontal,
  Archive,
  Trash2,
  Star
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ConversationHistoryProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onLoadMessages: (conversationId: string) => Promise<ChatMessage[]>;
  isLoading?: boolean;
  className?: string;
}

interface GroupedConversations {
  [topic: string]: Conversation[];
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onLoadMessages,
  isLoading = false,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('');
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [conversationMessages, setConversationMessages] = useState<{ [key: string]: ChatMessage[] }>({});

  // Group conversations by topic
  const groupedConversations: GroupedConversations = conversations.reduce((groups, conversation) => {
    const topic = conversation.conversationName || 
                  conversation.commonTopics[0] || 
                  'General';
    
    if (!groups[topic]) {
      groups[topic] = [];
    }
    groups[topic].push(conversation);
    return groups;
  }, {} as GroupedConversations);

  // Filter conversations based on search and topic filter
  const filteredConversations = Object.entries(groupedConversations).reduce((filtered, [topic, convos]) => {
    if (filterTopic && filterTopic !== topic) {
      return filtered;
    }

    const topicConversations = convos.filter(conversation => {
      if (!searchQuery) return true;
      
      const searchLower = searchQuery.toLowerCase();
      return (
        conversation.conversationName?.toLowerCase().includes(searchLower) ||
        conversation.summary.toLowerCase().includes(searchLower) ||
        conversation.commonTopics.some(t => t.toLowerCase().includes(searchLower)) ||
        conversation.commonQuestions.some(q => q.toLowerCase().includes(searchLower))
      );
    });

    if (topicConversations.length > 0) {
      filtered[topic] = topicConversations;
    }

    return filtered;
  }, {} as GroupedConversations);

  // Get all unique topics for filter dropdown
  const allTopics = Array.from(new Set(conversations.flatMap(c => 
    [c.conversationName, ...c.commonTopics].filter(Boolean)
  )));

  const toggleTopicExpansion = (topic: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topic)) {
      newExpanded.delete(topic);
    } else {
      newExpanded.add(topic);
    }
    setExpandedTopics(newExpanded);
  };

  const handleConversationSelect = async (conversation: Conversation) => {
    onSelectConversation(conversation);
    
    // Load messages if not already loaded
    if (!conversationMessages[conversation.uuid]) {
      try {
        const messages = await onLoadMessages(conversation.uuid);
        setConversationMessages(prev => ({
          ...prev,
          [conversation.uuid]: messages
        }));
      } catch (error) {
        console.error('Failed to load conversation messages:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  const getTopicIcon = (topic: string) => {
    if (topic.toLowerCase().includes('code') || topic.toLowerCase().includes('programming')) {
      return <Hash className="w-4 h-4" />;
    }
    if (topic.toLowerCase().includes('business') || topic.toLowerCase().includes('marketing')) {
      return <User className="w-4 h-4" />;
    }
    if (topic.toLowerCase().includes('ai') || topic.toLowerCase().includes('machine learning')) {
      return <Bot className="w-4 h-4" />;
    }
    return <MessageSquare className="w-4 h-4" />;
  };

  return (
    <div className={`flex flex-col h-full bg-white border-r border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Conversation History</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Topic Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterTopic === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterTopic('')}
            className="text-xs"
          >
            All Topics
          </Button>
          {allTopics.slice(0, 5).map(topic => (
            <Button
              key={topic}
              variant={filterTopic === topic ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterTopic(topic)}
              className="text-xs"
            >
              {topic}
            </Button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            Loading conversations...
          </div>
        ) : Object.keys(filteredConversations).length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No conversations found</p>
            {searchQuery && (
              <p className="text-sm mt-1">Try adjusting your search terms</p>
            )}
          </div>
        ) : (
          <div className="p-2">
            {Object.entries(filteredConversations).map(([topic, topicConversations]) => (
              <div key={topic} className="mb-4">
                {/* Topic Header */}
                <button
                  onClick={() => toggleTopicExpansion(topic)}
                  className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {getTopicIcon(topic)}
                    <span className="font-medium text-gray-900">{topic}</span>
                    <Badge variant="secondary" className="text-xs">
                      {topicConversations.length}
                    </Badge>
                  </div>
                  <div className={`transform transition-transform ${expandedTopics.has(topic) ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Topic Conversations */}
                {expandedTopics.has(topic) && (
                  <div className="ml-6 space-y-1">
                    {topicConversations
                      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
                      .map(conversation => (
                        <div
                          key={conversation.uuid}
                          onClick={() => handleConversationSelect(conversation)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedConversation?.uuid === conversation.uuid
                              ? 'bg-blue-50 border border-blue-200'
                              : 'hover:bg-gray-50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {conversation.conversationName || 'Untitled Conversation'}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {conversation.summary}
                              </p>
                              
                              {/* Conversation Stats */}
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  {conversation.messageCount}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Bot className="w-3 h-3" />
                                  {conversation.replicaReplyCount}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDate(conversation.lastMessageAt)}
                                </div>
                              </div>

                              {/* Topics */}
                              {conversation.commonTopics.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {conversation.commonTopics.slice(0, 3).map(topic => (
                                    <Badge key={topic} variant="outline" className="text-xs">
                                      {topic}
                                    </Badge>
                                  ))}
                                  {conversation.commonTopics.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{conversation.commonTopics.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 ml-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // TODO: Implement star functionality
                                }}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                              >
                                <Star className="w-3 h-3 text-gray-400" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // TODO: Implement more actions
                                }}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                              >
                                <MoreHorizontal className="w-3 h-3 text-gray-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Total Conversations:</span>
            <span className="font-medium">{conversations.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Topics:</span>
            <span className="font-medium">{Object.keys(groupedConversations).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
