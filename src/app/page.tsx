'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user has been here before
    const firstTimeFlag = localStorage.getItem('sensei_first_time');
    
    if (firstTimeFlag === 'false') {
      // User has been here before, redirect to dashboard
      router.push('/dashboard');
    } else {
      // First time user, show welcome and redirect to dashboard
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl w-full mx-4 text-center">
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 mt-3">Digital Sensei</h1>
          <p className="text-xl text-gray-600 mb-8">
            Create AI agents that learn from your knowledge
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Welcome to the future of AI-powered knowledge management. 
            Connect your wallet to start building intelligent agents that understand your domain expertise.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Started</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to access your personalized AI workspace
          </p>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-primary-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Launch Digital Sensei
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            We'll use your wallet address or ENS name as your unique identifier
          </p>
        </div>

        {/* <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create AI Agents</h3>
            <p className="text-gray-600">Build intelligent assistants tailored to your expertise</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Train with Knowledge</h3>
            <p className="text-gray-600">Upload documents and teach your agents your domain</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s9-3.582 9-8-4.03-8-9-8-9 3.582-9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat & Interact</h3>
            <p className="text-gray-600">Have intelligent conversations with your trained agents</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}