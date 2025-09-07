import { useState, useCallback, useEffect } from 'react';
import { SubscriptionService } from '@/core/services/SubscriptionService';
import type { 
  Subscription, 
  SubscriptionPlan, 
  SubscriptionStatus 
} from '@/core/types';

/**
 * Hook for managing subscriptions to senseis
 */
export const useSubscription = () => {
  const [subscriptionService] = useState(() => new SubscriptionService());
  const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get subscription plans for a sensei
   */
  const getSubscriptionPlans = useCallback(async (senseiId: string): Promise<SubscriptionPlan[]> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await subscriptionService.getSubscriptionPlans(senseiId);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to get subscription plans');
      }
      
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to get subscription plans');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionService]);

  /**
   * Create a new subscription
   */
  const createSubscription = useCallback(async (
    userId: string,
    senseiId: string,
    senseiSlug: string,
    planId: string
  ): Promise<Subscription | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await subscriptionService.createSubscription(
        userId,
        senseiId,
        senseiSlug,
        planId
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create subscription');
      }
      
      // Update local state
      setUserSubscriptions(prev => [...prev, response.data!]);
      
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create subscription');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionService]);

  /**
   * Get subscription status for a user and sensei
   */
  const getSubscriptionStatus = useCallback(async (
    userId: string,
    senseiId: string
  ): Promise<SubscriptionStatus | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await subscriptionService.getSubscriptionStatus(userId, senseiId);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to get subscription status');
      }
      
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to get subscription status');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionService]);

  /**
   * Cancel a subscription
   */
  const cancelSubscription = useCallback(async (subscriptionId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await subscriptionService.cancelSubscription(subscriptionId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to cancel subscription');
      }
      
      // Update local state
      setUserSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, status: 'cancelled' as const, updatedAt: new Date().toISOString() }
            : sub
        )
      );
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to cancel subscription');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionService]);

  /**
   * Get all subscriptions for a user
   */
  const getUserSubscriptions = useCallback(async (userId: string): Promise<Subscription[]> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await subscriptionService.getUserSubscriptions(userId);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to get user subscriptions');
      }
      
      setUserSubscriptions(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to get user subscriptions');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionService]);

  /**
   * Renew a subscription
   */
  const renewSubscription = useCallback(async (subscriptionId: string): Promise<Subscription | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await subscriptionService.renewSubscription(subscriptionId);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to renew subscription');
      }
      
      // Update local state
      setUserSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId ? response.data! : sub
        )
      );
      
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to renew subscription');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionService]);

  /**
   * Check if user has access to a sensei
   */
  const hasAccess = useCallback(async (userId: string, senseiId: string): Promise<boolean> => {
    try {
      return await subscriptionService.hasAccess(userId, senseiId);
    } catch {
      return false;
    }
  }, [subscriptionService]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    userSubscriptions,
    isLoading,
    error,
    
    // Methods
    getSubscriptionPlans,
    createSubscription,
    getSubscriptionStatus,
    cancelSubscription,
    getUserSubscriptions,
    renewSubscription,
    hasAccess,
    clearError
  };
};
