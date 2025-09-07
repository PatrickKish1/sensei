'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSensay } from '@/core/hooks/useSensay';
import { useWallet } from '@/hooks/useWallet';
import type { User } from '@/core/types';

// Authentication context interface
interface AuthContextType {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Authentication methods
  login: (userId: string, userData?: { name?: string; email?: string }) => Promise<boolean>;
  logout: () => void;
  
  // Sensay integration
  sensay: ReturnType<typeof useSensay>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication provider props
interface AuthProviderProps {
  children: React.ReactNode;
  apiKey: string;
  onFirstConnection?: () => void;
}

/**
 * Authentication provider component
 * Manages user authentication state and provides Sensay integration
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children, apiKey, onFirstConnection }) => {
  // Sensay hook for all platform operations
  const sensay = useSensay(apiKey);
  
  // Wallet hook for wallet-based authentication
  const { isConnected, getUserId, getDisplayName } = useWallet();
  
  // Local authentication state
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasShownWalletPrompt, setHasShownWalletPrompt] = useState(false);

  // Initialize services and check for existing user
  useEffect(() => {
    const initializeAuth = async () => {
      if (!apiKey) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Initialize Sensay services
        const initialized = await sensay.initializeServices();
        if (!initialized) {
          setIsLoading(false);
          return;
        }

        // If wallet is connected, use wallet-based authentication
        if (isConnected) {
          console.log('Wallet connected, attempting authentication...');
          const walletUserId = getUserId();
          console.log('Wallet User ID:', walletUserId);
          if (walletUserId) {
            const userData = {
              name: getDisplayName() || undefined,
            };
            console.log('Creating/getting user with data:', userData);
            const authenticatedUser = await sensay.createOrGetUser(walletUserId, userData);
            console.log('Authentication result:', authenticatedUser);
            if (authenticatedUser) {
              setUser(authenticatedUser);
              // Mark first connection
              if (onFirstConnection) {
                onFirstConnection();
              }
            }
          } else {
            console.log('No wallet user ID available');
          }
        }
      } catch (error) {
        console.error('Authentication initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [apiKey, sensay.isInitialized, isConnected]);

  // Update local user state when Sensay user changes
  useEffect(() => {
    if (sensay.currentUser) {
      setUser(sensay.currentUser);
      // Store user ID in localStorage for persistence
      localStorage.setItem('sensei_user_id', sensay.currentUser.id);
    } else {
      setUser(null);
      localStorage.removeItem('sensei_user_id');
    }
  }, [sensay.currentUser]);

  // Optimize loading state to prevent unnecessary re-renders
  useEffect(() => {
    if (isConnected && user) {
      setIsLoading(false);
    }
  }, [isConnected, user]);

  // Login method
  const login = async (userId: string, userData?: { name?: string; email?: string }): Promise<boolean> => {
    try {
      const authenticatedUser = await sensay.createOrGetUser(userId, userData);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem('sensei_user_id', authenticatedUser.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // Logout method
  const logout = () => {
    setUser(null);
    localStorage.removeItem('sensei_user_id');
    sensay.resetState();
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    sensay,
    error: sensay.error,
    clearError: sensay.clearError
  };

  // If wallet is not connected and we're not loading, show wallet connection interface
  if (!isLoading && !isConnected && !user && !hasShownWalletPrompt) {
    console.log('Showing wallet connection interface:', { isLoading, isConnected, user, hasShownWalletPrompt });
    
    // Check if Particle environment variables are configured
    const hasParticleConfig = process.env.NEXT_PUBLIC_PROJECT_ID && 
                             process.env.NEXT_PUBLIC_CLIENT_KEY && 
                             process.env.NEXT_PUBLIC_APP_ID;
    
    // Mark that we've shown the wallet prompt
    setHasShownWalletPrompt(true);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Digital Sensei</h1>
            <p className="text-gray-600">Create AI agents that learn from your knowledge</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
              <p className="text-gray-600">
                Connect your wallet to access your AI agents workspace
              </p>
            </div>

            {!hasParticleConfig ? (
              <div className="text-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Particle Network not configured. Please create a .env.local file with:
                  </p>
                  <code className="block text-xs text-yellow-700 mt-2 p-2 bg-yellow-100 rounded">
                    NEXT_PUBLIC_PROJECT_ID=your_project_id<br/>
                    NEXT_PUBLIC_CLIENT_KEY=your_client_key<br/>
                    NEXT_PUBLIC_APP_ID=your_app_id
                  </code>
                </div>
                <p className="text-xs text-gray-500">
                  Get these values from <a href="https://dashboard.particle.network" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Particle Dashboard</a>
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-4">
                  We'll use your wallet address or ENS name as your user ID
                </p>
                <p className="text-sm text-gray-600">
                  Please connect your wallet using the button in the top right corner
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  console.log('AuthProvider render state:', { isLoading, isConnected, user, isAuthenticated: !!user });
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

/**
 * Hook to get current user
 */
export const useCurrentUser = (): User | null => {
  const { user } = useAuth();
  return user;
};
