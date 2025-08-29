'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider } from '@/features/auth/components/AuthProvider';
import { Dashboard } from '@/features/dashboard/components/Dashboard';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function Home() {
  const [apiKey, setApiKey] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState(false);

  // Check for API key on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('sensei_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsConfigured(true);
    }
  }, []);

  // Handle API key configuration
  const handleApiKeyConfigure = (key: string) => {
    setApiKey(key);
    localStorage.setItem('sensei_api_key', key);
    setIsConfigured(true);
  };

  // Handle API key removal
  const handleApiKeyRemove = () => {
    setApiKey('');
    localStorage.removeItem('sensei_api_key');
    setIsConfigured(false);
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Digital Sensei</h1>
            <p className="text-gray-600">Create AI agents that learn from your knowledge</p>
          </div>
          
          <LoginForm onApiKeyConfigure={handleApiKeyConfigure} />
        </div>
      </div>
    );
  }

  return (
    <AuthProvider apiKey={apiKey}>
      <Dashboard onApiKeyRemove={handleApiKeyRemove} />
    </AuthProvider>
  );
}