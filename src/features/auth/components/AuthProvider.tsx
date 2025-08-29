'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSensay } from '@/core/hooks/useSensay';
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
}

/**
 * Authentication provider component
 * Manages user authentication state and provides Sensay integration
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children, apiKey }) => {
  // Sensay hook for all platform operations
  const sensay = useSensay(apiKey);
  
  // Local authentication state
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

        // Check for stored user ID in localStorage
        const storedUserId = localStorage.getItem('sensei_user_id');
        if (storedUserId) {
          // Try to authenticate with stored user ID
          const authenticatedUser = await sensay.createOrGetUser(storedUserId);
          if (authenticatedUser) {
            setUser(authenticatedUser);
          }
        }
      } catch (error) {
        console.error('Authentication initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [apiKey, sensay]);

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
