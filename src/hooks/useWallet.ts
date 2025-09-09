'use client';

import { useAccount, useConnect, useDisconnect } from '@particle-network/connectkit';
import { useEffect, useState } from 'react';

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  ensName?: string;
}

export const useWallet = () => {
  const { address, isConnected, chainId } = useAccount();
  const { connect, isLoading: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const [ensName, setEnsName] = useState<string>();

  // Add debugging
  console.log('useWallet state:', { address, isConnected, chainId, ensName });

  // Handle potential errors from Particle ConnectKit
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if Particle environment variables are configured
      const hasParticleConfig = process.env.NEXT_PUBLIC_PROJECT_ID && 
                               process.env.NEXT_PUBLIC_CLIENT_KEY && 
                               process.env.NEXT_PUBLIC_APP_ID;
      
      if (!hasParticleConfig) {
        console.warn('useWallet: Particle Network not configured');
      }
    }
  }, []);

  // Create wallet state object
  const walletState: WalletState = {
    address: address || null,
    isConnected,
    isConnecting,
    chainId: chainId || null,
    ensName,
  };

  // Get user identifier for Sensay (ENS name or wallet address)
  const getUserId = (): string | null => {
    if (ensName) return ensName;
    if (address) return address;
    return null;
  };

  // Get user display name
  const getDisplayName = (): string | null => {
    if (ensName) return ensName;
    if (address) return `${address.slice(0, 6)}...${address.slice(-4)}`;
    return null;
  };

  return {
    ...walletState,
    connect,
    disconnect,
    getUserId,
    getDisplayName,
  };
};
