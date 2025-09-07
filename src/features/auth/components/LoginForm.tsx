'use client';

import React, { useState } from 'react';

interface LoginFormProps {
  onApiKeyConfigure: (apiKey: string) => void;
}

/**
 * Login form component for API key configuration
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onApiKeyConfigure }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('Please enter your API key');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Basic validation - check if it looks like a valid API key
      if (apiKey.length < 10) {
        throw new Error('API key appears to be invalid');
      }

      // Configure the API key
      onApiKeyConfigure(apiKey.trim());
    } catch (err: any) {
      setError(err.message || 'Failed to configure API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Digital Sensei</h2>
        <p className="text-gray-600">
          Enter your Sensay AI API key to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Configuration Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
            Sensay AI API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="input w-full"
            placeholder="Enter your API key"
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            Your API key is stored locally and never sent to our servers.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !apiKey.trim()}
          className="btn btn-primary w-full"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Configuring...
            </span>
          ) : (
            'Get Started'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-4">Don't have an API key?</p>
        <div className="space-y-2">
          <a
            href="https://docs.google.com/forms/d/11ExevrfKClc7IfQf7kjEpIiLqHtHE_E42Y752KV7mYY/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-primary hover:text-primary/80 font-medium"
          >
            Request API Key
          </a>
          <a
            href="https://docs.sensay.io"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-gray-500 hover:text-gray-700"
          >
            View Documentation
          </a>
        </div>
      </div>
    </div>
  );
};
