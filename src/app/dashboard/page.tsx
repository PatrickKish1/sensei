'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider } from '@/features/auth/components/AuthProvider';
import { Dashboard } from '@/features/dashboard/components/Dashboard';

export default function DashboardPage() {
  // Get API key from environment (your organization's key)
  const apiKey = process.env.NEXT_PUBLIC_SENSAY_API_KEY_SECRET;

  // Check if this is the user's first time
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    // Check localStorage for first time flag
    const firstTimeFlag = localStorage.getItem('sensei_first_time');
    if (firstTimeFlag === 'false') {
      setIsFirstTime(false);
    }
  }, []);

  // Mark as not first time when user connects wallet
  const handleFirstConnection = () => {
    localStorage.setItem('sensei_first_time', 'false');
    setIsFirstTime(false);
  };

  return (
    <AuthProvider apiKey={apiKey || ''} onFirstConnection={handleFirstConnection}>
      <Dashboard isFirstTime={isFirstTime} />
    </AuthProvider>
  );
}