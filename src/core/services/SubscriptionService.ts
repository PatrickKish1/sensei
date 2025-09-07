import type { 
  Subscription, 
  SubscriptionPlan, 
  SubscriptionStatus, 
  ApiResponse 
} from '../types';

/**
 * Service for managing subscriptions to senseis
 * Handles subscription creation, management, and status tracking
 */
export class SubscriptionService {
  private subscriptions: Map<string, Subscription> = new Map();
  private subscriptionPlans: Map<string, SubscriptionPlan[]> = new Map();

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialize mock subscription data
   */
  private initializeMockData() {
    // Mock subscription plans for each sensei
    const mockPlans: SubscriptionPlan[] = [
      {
        id: 'plan-1',
        senseiId: 'sensei-1',
        name: 'Basic Access',
        description: 'Access to basic chat and content',
        price: 0.05,
        period: 'monthly',
        features: ['Chat with sensei', 'Basic content access', 'Community support'],
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'plan-2',
        senseiId: 'sensei-1',
        name: 'Premium Access',
        description: 'Full access to all features',
        price: 0.08,
        period: 'monthly',
        features: ['Unlimited chat', 'All content access', 'Priority support', 'Advanced features'],
        isPopular: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'plan-3',
        senseiId: 'sensei-2',
        name: 'NFT Expert Access',
        description: 'Access to NFT expertise and market insights',
        price: 0.03,
        period: 'monthly',
        features: ['NFT market analysis', 'Collection insights', 'Investment advice'],
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];

    // Store plans by sensei ID
    mockPlans.forEach(plan => {
      if (!this.subscriptionPlans.has(plan.senseiId)) {
        this.subscriptionPlans.set(plan.senseiId, []);
      }
      this.subscriptionPlans.get(plan.senseiId)!.push(plan);
    });
  }

  /**
   * Get subscription plans for a sensei
   */
  async getSubscriptionPlans(senseiId: string): Promise<ApiResponse<SubscriptionPlan[]>> {
    try {
      const plans = this.subscriptionPlans.get(senseiId) || [];
      return {
        success: true,
        data: plans
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get subscription plans'
      };
    }
  }

  /**
   * Create a new subscription
   */
  async createSubscription(
    userId: string,
    senseiId: string,
    senseiSlug: string,
    planId: string
  ): Promise<ApiResponse<Subscription>> {
    try {
      // Find the plan
      const plans = this.subscriptionPlans.get(senseiId) || [];
      const plan = plans.find(p => p.id === planId);
      
      if (!plan) {
        return {
          success: false,
          error: 'Subscription plan not found'
        };
      }

      // Create subscription
      const now = new Date();
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + (plan.period === 'yearly' ? 12 : 1));

      const subscription: Subscription = {
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        senseiId,
        senseiSlug,
        status: 'active',
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        price: plan.price,
        period: plan.period,
        autoRenew: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };

      this.subscriptions.set(subscription.id, subscription);

      return {
        success: true,
        data: subscription
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create subscription'
      };
    }
  }

  /**
   * Get subscription status for a user and sensei
   */
  async getSubscriptionStatus(
    userId: string, 
    senseiId: string
  ): Promise<ApiResponse<SubscriptionStatus>> {
    try {
      // Find active subscription
      const subscription = Array.from(this.subscriptions.values())
        .find(sub => sub.userId === userId && sub.senseiId === senseiId && sub.status === 'active');

      if (!subscription) {
        return {
          success: true,
          data: {
            isSubscribed: false,
            canRenew: false
          }
        };
      }

      const now = new Date();
      const endDate = new Date(subscription.endDate);
      const timeDiff = endDate.getTime() - now.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      const timeRemaining = daysRemaining > 0 
        ? `${daysRemaining} days remaining`
        : 'Expired';

      const nextBillingDate = new Date(subscription.endDate);
      nextBillingDate.setDate(nextBillingDate.getDate() + 1);

      return {
        success: true,
        data: {
          isSubscribed: daysRemaining > 0,
          subscription: daysRemaining > 0 ? subscription : undefined,
          timeRemaining,
          daysRemaining: Math.max(0, daysRemaining),
          canRenew: daysRemaining <= 7,
          nextBillingDate: nextBillingDate.toISOString()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get subscription status'
      };
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<ApiResponse<boolean>> {
    try {
      const subscription = this.subscriptions.get(subscriptionId);
      
      if (!subscription) {
        return {
          success: false,
          error: 'Subscription not found'
        };
      }

      subscription.status = 'cancelled';
      subscription.updatedAt = new Date().toISOString();
      this.subscriptions.set(subscriptionId, subscription);

      return {
        success: true,
        data: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to cancel subscription'
      };
    }
  }

  /**
   * Get all subscriptions for a user
   */
  async getUserSubscriptions(userId: string): Promise<ApiResponse<Subscription[]>> {
    try {
      const userSubscriptions = Array.from(this.subscriptions.values())
        .filter(sub => sub.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return {
        success: true,
        data: userSubscriptions
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get user subscriptions'
      };
    }
  }

  /**
   * Renew a subscription
   */
  async renewSubscription(subscriptionId: string): Promise<ApiResponse<Subscription>> {
    try {
      const subscription = this.subscriptions.get(subscriptionId);
      
      if (!subscription) {
        return {
          success: false,
          error: 'Subscription not found'
        };
      }

      const now = new Date();
      const currentEndDate = new Date(subscription.endDate);
      const newEndDate = new Date(currentEndDate);
      newEndDate.setMonth(newEndDate.getMonth() + (subscription.period === 'yearly' ? 12 : 1));

      subscription.endDate = newEndDate.toISOString();
      subscription.updatedAt = now.toISOString();

      this.subscriptions.set(subscriptionId, subscription);

      return {
        success: true,
        data: subscription
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to renew subscription'
      };
    }
  }

  /**
   * Check if user has access to a sensei
   */
  async hasAccess(userId: string, senseiId: string): Promise<boolean> {
    try {
      const statusResponse = await this.getSubscriptionStatus(userId, senseiId);
      return statusResponse.success && statusResponse.data?.isSubscribed === true;
    } catch {
      return false;
    }
  }
}
