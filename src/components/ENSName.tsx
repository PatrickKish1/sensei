'use client';

import React, { useState, useEffect } from 'react';
import { resolveENSName, formatAddress, type ENSResult } from '@/lib/ens';

interface ENSNameProps {
  address: string;
  showAddress?: boolean;
  className?: string;
  fallbackLength?: number;
}

/**
 * Component that displays ENS name or formatted address
 */
export const ENSName: React.FC<ENSNameProps> = ({ 
  address, 
  showAddress = true, 
  className = '',
  fallbackLength = 6 
}) => {
  const [ensResult, setEnsResult] = useState<ENSResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    const resolveName = async () => {
      try {
        setIsLoading(true);
        const result = await resolveENSName(address);
        setEnsResult(result);
      } catch (error) {
        console.error('Error resolving ENS name:', error);
        setEnsResult({
          address,
          isResolved: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    resolveName();
  }, [address]);

  if (isLoading) {
    return (
      <span className={`animate-pulse ${className}`}>
        Loading...
      </span>
    );
  }

  if (!ensResult) {
    return (
      <span className={className}>
        {formatAddress(address, fallbackLength)}
      </span>
    );
  }

  return (
    <span className={className}>
      {ensResult.isResolved ? (
        <span className="flex items-center gap-2">
          <span className="font-medium text-blue-600">
            {ensResult.name}
          </span>
          {showAddress && (
            <span className="text-sm text-gray-500">
              ({formatAddress(address, fallbackLength)})
            </span>
          )}
        </span>
      ) : (
        formatAddress(address, fallbackLength)
      )}
    </span>
  );
};

export default ENSName;
