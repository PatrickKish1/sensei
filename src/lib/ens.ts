/**
 * ENS (Ethereum Name Service) utilities
 * Handles ENS name resolution and address formatting
 */

export interface ENSResult {
  name?: string;
  address: string;
  isResolved: boolean;
}

/**
 * Resolve ENS name from Ethereum address
 * This is a simplified implementation - in production you'd use a proper ENS resolver
 */
export async function resolveENSName(address: string): Promise<ENSResult> {
  try {
    // For now, we'll use a mock implementation
    // In production, you'd use ethers.js or web3.js with ENS resolver
    const mockENSMap: Record<string, string> = {
      '0x1234567890123456789012345678901234567890': 'jerry-sensei.eth',
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd': 'alice-sensei.eth',
      '0x9876543210987654321098765432109876543210': 'bob-sensei.eth',
      '0x1111111111111111111111111111111111111111': 'crypto-guru.eth',
      '0x2222222222222222222222222222222222222222': 'defi-expert.eth',
    };

    const ensName = mockENSMap[address.toLowerCase()];
    
    if (ensName) {
      return {
        name: ensName,
        address,
        isResolved: true
      };
    }

    return {
      address,
      isResolved: false
    };
  } catch (error) {
    console.error('Error resolving ENS name:', error);
    return {
      address,
      isResolved: false
    };
  }
}

/**
 * Format address for display
 */
export function formatAddress(address: string, length: number = 6): string {
  if (!address) return '';
  
  if (address.length <= length * 2 + 2) {
    return address;
  }
  
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
}

/**
 * Generate ENS slug from name
 */
export function generateENSSlug(ensName: string): string {
  return ensName
    .toLowerCase()
    .replace(/\.eth$/, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Check if string is a valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
