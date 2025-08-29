'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { AgentCreator } from '@/features/agents/components/AgentCreator';
import { TrainingInterface } from '@/features/training/components/TrainingInterface';
import { ChatInterface } from '@/features/chat/components/ChatInterface';
import type { AIAgent } from '@/core/types';

interface DashboardProps {
  onApiKeyRemove: () => void;
}

/**
 * Main dashboard component for the Digital Sensei platform
 */
export const Dashboard: React.FC<DashboardProps> = ({ onApiKeyRemove }) => {
  const { user, isAuthenticated, isLoading, login, logout, sensay } = useAuth();
  const [activeTab, setActiveTab] = useState<'agents' | 'training' | 'chat'>('agents');
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginUserId, setLoginUserId] = useState('');

  // Load user agents when authenticated
  useEffect(() => {
    if (isAuthenticated && sensay.isInitialized) {
      sensay.getUserAgents();
    }
  }, [isAuthenticated, sensay.isInitialized]);

  // Handle user login
  const handleUserLogin = async (userId: string, userData?: { name?: string; email?: string }) => {
    const success = await login(userId, userData);
    if (success) {
      setShowLogin(false);
      setLoginUserId('');
    }
  };

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

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Digital Sensei</h1>
            <p className="text-gray-600">Create AI agents that learn from your knowledge</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">
                Enter your user ID to continue
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleUserLogin(loginUserId); }} className="space-y-6">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <input
                  id="userId"
                  type="text"
                  value={loginUserId}
                  onChange={(e) => setLoginUserId(e.target.value)}
                  className="input w-full"
                  placeholder="Enter your user ID"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  This will be used to identify you in the system.
                </p>
              </div>

              <button
                type="submit"
                disabled={!loginUserId.trim()}
                className="btn btn-primary w-full"
              >
                Continue
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={onApiKeyRemove}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Use Different API Key
              </button>
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
              <div className="text-sm text-gray-700">
                Welcome, <span className="font-medium">{user?.name || user?.id}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('agents')}
              className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'agents'
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              AI Agents
            </button>
            <button
              onClick={() => setActiveTab('training')}
              disabled={!selectedAgent}
              className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
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
              className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
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
        {/* Agents Tab */}
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
                      
                      {/* Expertise Tags */}
                      {agent.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {agent.expertise.slice(0, 3).map((exp, index) => (
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

        {/* Training Tab */}
        {activeTab === 'training' && selectedAgent && (
          <TrainingInterface />
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && selectedAgent && (
          <ChatInterface />
        )}

        {/* No Agent Selected */}
        {activeTab !== 'agents' && !selectedAgent && (
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
