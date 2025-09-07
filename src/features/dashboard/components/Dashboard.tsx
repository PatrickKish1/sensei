'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { AgentCreator } from '@/features/agents/components/AgentCreator';
import { TrainingInterface } from '@/features/training/components/TrainingInterface';
import { EnhancedChatInterface } from '@/features/chat/components/EnhancedChatInterface';
import { ConnectButton } from '@particle-network/connectkit';
import { useWallet } from '@/hooks/useWallet';
import type { AIAgent } from '@/core/types';
import { Button } from '@/components/ui/button';
import { ENSName } from '@/components/ENSName';
import { mockSenseis, type MockSensei } from '@/data/mockSenseis';
import Link from 'next/link';

interface DashboardProps {
  isFirstTime: boolean;
}

/**
 * Main dashboard component for the Digital Sensei platform
 */
export const Dashboard: React.FC<DashboardProps> = ({ isFirstTime }) => {
  const { user, isAuthenticated, isLoading, login, logout, sensay } = useAuth();
  const { isConnected, address, getDisplayName, getUserId } = useWallet();
  const [activeTab, setActiveTab] = useState<'agents' | 'training' | 'chat' | 'discover'>('agents');
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Load user agents when authenticated
  useEffect(() => {
    if (isAuthenticated && sensay.isInitialized) {
      sensay.getUserAgents();
    }
  }, [isAuthenticated, sensay.isInitialized]);

  // Handle agent selection
  const handleAgentSelect = (agent: AIAgent) => {
    setSelectedAgent(agent);
    sensay.setSelectedAgent(agent);
    
    // Switch to training tab when agent is selected
    if (activeTab === 'agents') {
      setActiveTab('training');
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setSelectedAgent(null);
    setActiveTab('agents');
  };

  // Filter senseis based on search and category
  const filteredSenseis = mockSenseis.filter(sensei => {
    const matchesSearch = !searchQuery || 
      sensei.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sensei.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sensei.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || sensei.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(mockSenseis.map(sensei => sensei.category)));

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Digital Sensei...</p>
        </div>
      </div>
    ); 
  }

  // Show wallet connection prompt if not authenticated and this is first time
  if (!isAuthenticated && isFirstTime) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Digital Sensei</h1>
            <p className="text-gray-600">Create AI agents that learn from your knowledge</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Digital Sensei</h2>
              <p className="text-gray-600">
                Connect your wallet to get started with your AI agents workspace
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 mb-4">
                We'll use your wallet address or ENS name as your user ID
              </p>
              <ConnectButton />
              <p className="text-sm text-gray-600">
                Please connect your wallet
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Digital Sensei</h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">             
              {/* User Info */}
              <div className="text-sm text-gray-700">
                Welcome, <span className="font-medium">
                  {user?.name || (address ? <ENSName address={address} showAddress={false} /> : user?.id)}
                </span>
              </div>

              {/* Connect Wallet Button */}
                <ConnectButton />
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-12">
            <button
              onClick={() => setActiveTab('agents')}
              className={`py-2 px-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'agents'
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My AI Agents
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`py-2 px-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'discover'
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Discover Senseis
            </button>
            <button
              onClick={() => setActiveTab('training')}
              disabled={!selectedAgent}
              className={`py-2 px-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'training'
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              } ${!selectedAgent ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Training
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              disabled={!selectedAgent}
              className={`py-2 px-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'chat'
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              } ${!selectedAgent ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Chat
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Agents Tab - Creator Mode */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your AI Agents</h2>
                <p className="text-gray-600 mt-1">
                  Create and manage your AI agents
                </p>
              </div>
              <AgentCreator />
            </div>

            {/* Agents List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sensay.userAgents.map((agent) => (
                <div
                  key={agent.uuid}
                  className={`card cursor-pointer transition-all hover:shadow-lg ${
                    selectedAgent?.uuid === agent.uuid ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleAgentSelect(agent)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{agent.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{agent.shortDescription}</p>
                      
                      {/* Expertise Tags - Only show if expertise exists */}
                      {'expertise' in agent && Array.isArray(agent.expertise) && agent.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {agent.expertise.slice(0, 3).map((exp: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                            >
                              {exp}
                            </span>
                          ))}
                          {agent.expertise.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                              +{agent.expertise.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Status and Progress */}
                      <div className="flex items-center justify-between text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          agent.status === 'active' ? 'bg-green-100 text-green-800' :
                          agent.status === 'training' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {agent.status}
                        </span>
                        <span className="text-gray-500">
                          {agent.trainingProgress.totalContent} content items
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAgentSelect(agent); }}
                      className="btn btn-primary flex-1 text-sm"
                    >
                      {selectedAgent?.uuid === agent.uuid ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {sensay.userAgents.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No AI Agents Yet</h3>
                <p className="text-gray-500 mb-6">
                  Create your first AI agent to get started with Digital Sensei.
                </p>
                <AgentCreator />
              </div>
            )}
          </div>
        )}

        {/* Discover Tab - Browse Public Senseis */}
        {activeTab === 'discover' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Discover AI Senseis</h2>
              <p className="text-gray-600 mt-1">
                Browse and interact with AI agents created by the community
              </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search for AI senseis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  variant="outline"
                  className="px-6"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Senseis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSenseis.map((sensei) => (
                <Link 
                  key={sensei.uuid} 
                  href={`/sensei/${sensei.ensSlug}`}
                  className="group"
                >
                  <div className="card hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                    {/* Cover Image */}
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      <img
                        src={sensei.coverImage || sensei.profileImage}
                        alt={sensei.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={sensei.profileImage}
                            alt={sensei.name}
                            className="w-12 h-12 rounded-full border-2 border-white"
                          />
                          <div>
                            <h3 className="text-white font-semibold text-lg">{sensei.name}</h3>
                            <p className="text-white/80 text-sm">
                              <ENSName address={sensei.ownerID} showAddress={false} />
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {sensei.shortDescription}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {sensei.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {sensei.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                            +{sensei.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {sensei.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                            </svg>
                            {sensei.subscriberCount.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {sensei.category}
                        </span>
                      </div>

                      {/* Subscription Info */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-500">Subscription:</span>
                          <span className="font-semibold text-gray-900 ml-1">
                            {sensei.subscriptionPrice} ETH/{sensei.subscriptionPeriod}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {sensei.ensName}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {filteredSenseis.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Senseis Found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search criteria or browse all categories.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && selectedAgent && (
          <TrainingInterface />
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && selectedAgent && (
          <EnhancedChatInterface className="h-[600px]" />
        )}

        {/* No Agent Selected */}
        {activeTab !== 'agents' && activeTab !== 'discover' && !selectedAgent && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select an AI Agent</h3>
            <p className="text-gray-500">
              Choose an AI agent from the Agents tab to start training or chatting.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};