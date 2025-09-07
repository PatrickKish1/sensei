'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getSenseiBySlug, type MockSensei } from '@/data/mockSenseis';
import { ENSName } from '@/components/ENSName';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/features/chat/components/ChatInterface';
import { VoiceConversation } from '@/components/VoiceConversation';
import { ConnectButton } from '@particle-network/connectkit';
import { useWallet } from '@/hooks/useWallet';
import { useSubscription } from '@/hooks/useSubscription';
import Link from 'next/link';
import { useAuth } from '@/features/auth/components/AuthProvider';

function SenseiDetailContent() {
  const params = useParams();
  const slug = params.slug as string;
  const { isConnected, address } = useWallet();
  const { sensay } = useAuth();
  const { 
    getSubscriptionStatus, 
    createSubscription, 
    cancelSubscription,
    isLoading: subscriptionLoading,
    error: subscriptionError 
  } = useSubscription();
  
  const [sensei, setSensei] = useState<MockSensei | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [showVoiceChat, setShowVoiceChat] = useState(false);

  useEffect(() => {
    const foundSensei = getSenseiBySlug(slug);
    setSensei(foundSensei || null);
    
    // Check subscription status
    if (foundSensei && address) {
      checkSubscriptionStatus(foundSensei.uuid, address);
    }
    // Select this sensei's agent in global state so ChatInterface works
    if (foundSensei) {
      sensay.getAgent(foundSensei.uuid);
    }
  }, [slug, address]);

  const checkSubscriptionStatus = async (senseiId: string, userId: string) => {
    const status = await getSubscriptionStatus(userId, senseiId);
    setSubscriptionStatus(status);
  };

  if (!sensei) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sensei...</p>
        </div>
      </div>
    );
  }

  const handleSubscribe = async () => {
    if (!sensei || !address) return;
    
    try {
      // Create subscription with the first available plan
      const subscription = await createSubscription(
        address,
        sensei.uuid,
        sensei.ensSlug,
        'plan-1' // Use first plan for simplicity
      );
      
      if (subscription) {
        // Refresh subscription status
        await checkSubscriptionStatus(sensei.uuid, address);
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscriptionStatus?.subscription) return;
    
    try {
      const success = await cancelSubscription(subscriptionStatus.subscription.id);
      if (success) {
        // Refresh subscription status
        await checkSubscriptionStatus(sensei!.uuid, address!);
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Digital Sensei</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="text-sm text-gray-700">
                  <ENSName address={address || ''} showAddress={false} />
                </div>
              ) : (
                <ConnectButton />
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video/Avatar Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative aspect-video bg-gray-900">
                <img
                  src={sensei.coverImage || sensei.profileImage}
                  alt={sensei.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={sensei.profileImage}
                      alt={sensei.name}
                      className="w-16 h-16 rounded-full border-4 border-white"
                    />
                    <div>
                      <h1 className="text-2xl font-bold text-white">{sensei.name}</h1>
                      <p className="text-white/80">
                        <ENSName address={sensei.ownerID} showAddress={false} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About {sensei.name}</h2>
              <p className="text-gray-600 mb-6">{sensei.description}</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Purpose</h3>
                <p className="text-gray-600">{sensei.purpose}</p>
              </div>

              {/* Expertise Tags */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {sensei.expertise?.map((exp, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{sensei.rating}</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{sensei.subscriberCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{sensei.trainingProgress.totalContent}</div>
                  <div className="text-sm text-gray-500">Content Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{sensei.category}</div>
                  <div className="text-sm text-gray-500">Category</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {sensei.socialLinks && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Connect</h3>
                <div className="flex space-x-4">
                  {sensei.socialLinks.twitter && (
                    <a
                      href={sensei.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Twitter
                    </a>
                  )}
                  {sensei.socialLinks.linkedin && (
                    <a
                      href={sensei.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      LinkedIn
                    </a>
                  )}
                  {sensei.socialLinks.website && (
                    <a
                      href={sensei.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-700"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription</h3>
              
              {subscriptionStatus?.isSubscribed ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">Subscribed</div>
                    <p className="text-sm text-gray-600">
                      {subscriptionStatus.timeRemaining}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      onClick={() => setShowChat(!showChat)}
                      className="w-full bg-primary-700 text-white"
                      disabled={subscriptionLoading}
                    >
                      {showChat ? 'Hide Text Chat' : 'Start Text Chat'}
                    </Button>
                    
                    <Button
                      onClick={() => setShowVoiceChat(!showVoiceChat)}
                      variant="outline"
                      className="w-full bg-primary-700 text-white"
                      disabled={subscriptionLoading}
                    >
                      {showVoiceChat ? 'Hide Voice Chat' : 'Start Voice Chat'}
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full bg-primary-700 text-white"
                    onClick={handleCancelSubscription}
                    disabled={subscriptionLoading}
                  >
                    {subscriptionLoading ? 'Cancelling...' : 'Cancel Subscription'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {sensei.subscriptionPrice} ETH
                    </div>
                    <div className="text-sm text-gray-500">
                      per {sensei.subscriptionPeriod}
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleSubscribe}
                    className="w-full bg-primary-700 text-white"
                    disabled={!isConnected || subscriptionLoading}
                  >
                    {subscriptionLoading ? 'Subscribing...' : (isConnected ? 'Subscribe Now' : 'Connect Wallet to Subscribe')}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Cancel anytime. Access to all content and chat features.
                  </p>
                </div>
              )}
            </div>

            {/* Text Chat Interface */}
            {showChat && subscriptionStatus?.isSubscribed && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Text Chat with {sensei.name}</h3>
                </div>
                <div className="h-96">
                  <ChatInterface />
                </div>
              </div>
            )}

            {/* Voice Chat Interface */}
            {showVoiceChat && subscriptionStatus?.isSubscribed && (
              <VoiceConversation
                senseiId={sensei.uuid}
                senseiName={sensei.name}
                voiceId={sensei.voiceId || 'default'}
                elevenLabsAgentId={sensei.elevenLabsAgentId}
                onConversationStart={() => console.log('Voice conversation started')}
                onConversationEnd={() => console.log('Voice conversation ended')}
              />
            )}

            {/* Sensei Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sensei Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">ENS Name:</span>
                  <span className="font-medium">{sensei.ensName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium capitalize">{sensei.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span className="font-medium">
                    {new Date(sensei.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="font-medium">
                    {new Date(sensei.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SenseiDetailPage() {
  return <SenseiDetailContent />;
}
