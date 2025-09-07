'use client';

import React, { useState } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import type { CreateAgentForm } from '@/core/types';

/**
 * Component for creating new AI agents
 * Collects all necessary information and creates agents via Sensay API
 */
export const AgentCreator: React.FC = () => {
  const { sensay } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CreateAgentForm>({
    name: '',
    shortDescription: '',
    greeting: '',
    expertise: [],
    isPrivate: false,
    llmProvider: 'anthropic',
    llmModel: 'claude-3-7-sonnet-latest',
    systemMessage: ''
  });

  const [expertiseInput, setExpertiseInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get available LLM models
  const availableModels = sensay.getAvailableModels();

  // Handle form input changes
  const handleInputChange = (field: keyof CreateAgentForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle expertise tag addition
  const handleAddExpertise = () => {
    if (expertiseInput.trim() && !formData.expertise.includes(expertiseInput.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, expertiseInput.trim()]
      }));
      setExpertiseInput('');
    }
  };

  // Handle expertise tag removal
  const handleRemoveExpertise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.shortDescription.trim()) {
      return;
    }

    // Validate character limits
    if (formData.shortDescription.length > 50) {
      alert('Short description must be 50 characters or less');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const newAgent = await sensay.createAgent(formData);
      if (newAgent) {
        // Reset form and close modal
        setFormData({
          name: '',
          shortDescription: '',
          greeting: '',
          expertise: [],
          isPrivate: false,
          llmProvider: 'anthropic',
          llmModel: 'claude-3-7-sonnet-latest',
          systemMessage: ''
        });
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Failed to create agent:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle key press for expertise input
  const handleExpertiseKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddExpertise();
    }
  };

  return (
    <>
      {/* Create Agent Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary flex items-center gap-2"
        disabled={!sensay.isInitialized}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Create New Agent
      </button>

      {/* Create Agent Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New AI Agent</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Agent Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="input w-full"
                      placeholder="Enter agent name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description <span className="text-red-500">*</span>
                      <span className="ml-2 text-xs text-gray-500">
                        (Keep it concise - this appears in search results)
                      </span>
                    </label>
                    <textarea
                      id="description"
                      value={formData.shortDescription}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Limit to 50 characters
                        if (value.length <= 50) {
                          handleInputChange('shortDescription', value);
                        }
                      }}
                      className={`input w-full ${
                        formData.shortDescription.length > 50 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : formData.shortDescription.length > 40 
                            ? 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500'
                            : ''
                      }`}
                      rows={3}
                      placeholder="Brief description of what this agent does (max 50 characters)"
                      required
                      maxLength={50}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-xs ${
                        formData.shortDescription.length > 50 
                          ? 'text-red-500' 
                          : formData.shortDescription.length > 40 
                            ? 'text-yellow-600' 
                            : 'text-gray-500'
                      }`}>
                        {formData.shortDescription.length}/50 characters
                      </span>
                      {formData.shortDescription.length > 40 && (
                        <span className={`text-xs ${
                          formData.shortDescription.length > 50 
                            ? 'text-red-500' 
                            : 'text-yellow-600'
                        }`}>
                          {formData.shortDescription.length > 50 
                            ? 'Over limit!' 
                            : `${50 - formData.shortDescription.length} characters remaining`
                          }
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="greeting" className="block text-sm font-medium text-gray-700 mb-1">
                      Greeting Message
                    </label>
                    <textarea
                      id="greeting"
                      value={formData.greeting}
                      onChange={(e) => handleInputChange('greeting', e.target.value)}
                      className="input w-full"
                      rows={2}
                      placeholder="How the agent introduces itself"
                    />
                  </div>

                  <div>
                    <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-1">
                      Areas of Expertise
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        id="expertise"
                        type="text"
                        value={expertiseInput}
                        onChange={(e) => setExpertiseInput(e.target.value)}
                        onKeyPress={handleExpertiseKeyPress}
                        className="input flex-1"
                        placeholder="Add expertise area"
                      />
                      <button
                        type="button"
                        onClick={handleAddExpertise}
                        className="btn bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        Add
                      </button>
                    </div>
                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2">
                      {formData.expertise.map((exp, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {exp}
                          <button
                            type="button"
                            onClick={() => handleRemoveExpertise(index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">AI Configuration</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="llmProvider" className="block text-sm font-medium text-gray-700 mb-1">
                        AI Provider
                      </label>
                      <select
                        id="llmProvider"
                        value={formData.llmProvider}
                        onChange={(e) => {
                          handleInputChange('llmProvider', e.target.value);
                          // Reset model when provider changes
                          const models = availableModels[e.target.value as keyof typeof availableModels] || [];
                          handleInputChange('llmModel', models[0] || '');
                        }}
                        className="input w-full"
                      >
                        {Object.keys(availableModels).map(provider => (
                          <option key={provider} value={provider}>
                            {provider.charAt(0).toUpperCase() + provider.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="llmModel" className="block text-sm font-medium text-gray-700 mb-1">
                        AI Model
                      </label>
                      <select
                        id="llmModel"
                        value={formData.llmModel}
                        onChange={(e) => handleInputChange('llmModel', e.target.value)}
                        className="input w-full"
                      >
                        {availableModels[formData.llmProvider as keyof typeof availableModels]?.map(model => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        )) || []}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="systemMessage" className="block text-sm font-medium text-gray-700 mb-1">
                      System Message
                    </label>
                    <textarea
                      id="systemMessage"
                      value={formData.systemMessage}
                      onChange={(e) => handleInputChange('systemMessage', e.target.value)}
                      className="input w-full"
                      rows={4}
                      placeholder="Instructions for how the AI should behave and respond"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This message defines the AI's personality, behavior, and response style.
                    </p>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Privacy Settings</h3>
                  
                  <div className="flex items-center">
                    <input
                      id="isPrivate"
                      type="checkbox"
                      checked={formData.isPrivate}
                      onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
                      Make this agent private (only visible to you)
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="btn bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || !formData.name.trim() || !formData.shortDescription.trim() || formData.shortDescription.length > 50}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      'Create Agent'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
