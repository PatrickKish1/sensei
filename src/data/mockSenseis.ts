import type { AIAgent } from '@/core/types';

export interface MockSensei extends AIAgent {
  ensName: string;
  ensSlug: string;
  ownerENS: string;
  subscriptionPrice: number;
  subscriptionPeriod: 'monthly' | 'yearly';
  subscriberCount: number;
  rating: number;
  category: string;
  tags: string[];
  description: string;
  purpose: string;
  avatar?: string;
  coverImage?: string;
  voiceId?: string;
  elevenLabsAgentId?: string; // ElevenLabs conversational AI agent ID
  voiceSettings?: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export const mockSenseis: MockSensei[] = [
  {
    uuid: 'sensei-1',
    name: 'Jerry Sensei',
    slug: 'jerry-sensei-eth',
    ensName: 'jerry-sensei.eth',
    ensSlug: 'jerry-sensei-eth',
    shortDescription: 'Expert in DeFi protocols and yield farming strategies',
    greeting: 'Hello! I\'m Jerry, your DeFi trading companion. Ready to explore the world of decentralized finance?',
    description: 'Jerry is a seasoned DeFi expert with over 5 years of experience in yield farming, liquidity provision, and protocol analysis. He specializes in identifying high-yield opportunities while managing risk effectively.',
    purpose: 'To help users navigate the complex world of DeFi, providing insights on yield farming, liquidity mining, and protocol security.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    ownerID: '0x1234567890123456789012345678901234567890',
    ownerENS: 'jerry-sensei.eth',
    isPrivate: false,
    status: 'active',
    expertise: ['DeFi', 'Yield Farming', 'Liquidity Mining', 'Protocol Analysis'],
    tags: ['defi', 'yield-farming', 'trading', 'crypto'],
    category: 'Finance',
    subscriptionPrice: 0.05, // ETH
    subscriptionPeriod: 'monthly',
    subscriberCount: 1247,
    rating: 4.8,
    llm: {
      provider: 'anthropic',
      model: 'claude-3-7-sonnet-latest',
      memoryMode: 'prompt-caching',
      systemMessage: 'You are Jerry, a DeFi expert who helps users understand and navigate decentralized finance protocols.'
    },
    trainingProgress: {
      totalContent: 150,
      processedContent: 150,
      vectorizedContent: 150
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    voiceId: 'jerry-voice-001',
    elevenLabsAgentId: 'agent_1', // Mock ElevenLabs agent ID
    voiceSettings: {
      stability: 0.7,
      similarity_boost: 0.8,
      style: 0.3,
      use_speaker_boost: true,
    },
    socialLinks: {
      twitter: 'https://twitter.com/jerry_sensei',
      linkedin: 'https://linkedin.com/in/jerry-sensei',
      website: 'https://jerry-sensei.eth'
    }
  },
  {
    uuid: 'sensei-2',
    name: 'Alice Sensei',
    slug: 'alice-sensei-eth',
    ensName: 'alice-sensei.eth',
    ensSlug: 'alice-sensei-eth',
    shortDescription: 'NFT marketplace expert and digital art curator',
    greeting: 'Hi there! I\'m Alice, your guide to the NFT universe. Let\'s discover amazing digital art together!',
    description: 'Alice is a passionate NFT expert and digital art curator with deep knowledge of market trends, collection analysis, and investment strategies in the NFT space.',
    purpose: 'To educate users about NFTs, help them discover valuable collections, and provide insights on digital art investment.',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=400&fit=crop',
    ownerID: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    ownerENS: 'alice-sensei.eth',
    isPrivate: false,
    status: 'active',
    expertise: ['NFTs', 'Digital Art', 'Market Analysis', 'Collection Curation'],
    tags: ['nft', 'digital-art', 'curation', 'market-analysis'],
    category: 'Art & Culture',
    subscriptionPrice: 0.03, // ETH
    subscriptionPeriod: 'monthly',
    subscriberCount: 892,
    rating: 4.6,
    llm: {
      provider: 'anthropic',
      model: 'claude-3-7-sonnet-latest',
      memoryMode: 'prompt-caching',
      systemMessage: 'You are Alice, an NFT expert and digital art curator who helps users navigate the NFT marketplace.'
    },
    trainingProgress: {
      totalContent: 200,
      processedContent: 200,
      vectorizedContent: 200
    },
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z',
    voiceId: 'alice-voice-002',
    elevenLabsAgentId: 'agent_2', // Mock ElevenLabs agent ID
    voiceSettings: {
      stability: 0.6,
      similarity_boost: 0.7,
      style: 0.4,
      use_speaker_boost: true,
    },
    socialLinks: {
      twitter: 'https://twitter.com/alice_sensei',
      website: 'https://alice-sensei.eth'
    }
  },
  {
    uuid: 'sensei-3',
    name: 'Bob Sensei',
    slug: 'bob-sensei-eth',
    ensName: 'bob-sensei.eth',
    ensSlug: 'bob-sensei-eth',
    shortDescription: 'Smart contract developer and security auditor',
    greeting: 'Hey! I\'m Bob, your smart contract development mentor. Let\'s build secure and efficient contracts!',
    description: 'Bob is a senior smart contract developer with expertise in Solidity, security auditing, and gas optimization. He has audited over 100 smart contracts.',
    purpose: 'To teach developers how to write secure smart contracts, perform security audits, and optimize gas usage.',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    ownerID: '0x9876543210987654321098765432109876543210',
    ownerENS: 'bob-sensei.eth',
    isPrivate: false,
    status: 'active',
    expertise: ['Solidity', 'Smart Contracts', 'Security Auditing', 'Gas Optimization'],
    tags: ['solidity', 'smart-contracts', 'security', 'development'],
    category: 'Development',
    subscriptionPrice: 0.08, // ETH
    subscriptionPeriod: 'monthly',
    subscriberCount: 2156,
    rating: 4.9,
    llm: {
      provider: 'anthropic',
      model: 'claude-3-7-sonnet-latest',
      memoryMode: 'prompt-caching',
      systemMessage: 'You are Bob, a smart contract developer and security auditor who helps developers build secure contracts.'
    },
    trainingProgress: {
      totalContent: 300,
      processedContent: 300,
      vectorizedContent: 300
    },
    createdAt: '2024-01-05T06:00:00Z',
    updatedAt: '2024-01-22T09:00:00Z',
    voiceId: 'bob-voice-003',
    elevenLabsAgentId: 'agent_3', // Mock ElevenLabs agent ID
    voiceSettings: {
      stability: 0.8,
      similarity_boost: 0.6,
      style: 0.2,
      use_speaker_boost: true,
    },
    socialLinks: {
      twitter: 'https://twitter.com/bob_sensei',
      linkedin: 'https://linkedin.com/in/bob-sensei',
      website: 'https://bob-sensei.eth'
    }
  },
  {
    uuid: 'sensei-4',
    name: 'Crypto Guru',
    slug: 'crypto-guru-eth',
    ensName: 'crypto-guru.eth',
    ensSlug: 'crypto-guru-eth',
    shortDescription: 'Blockchain technology educator and crypto market analyst',
    greeting: 'Welcome! I\'m the Crypto Guru, here to demystify blockchain technology and crypto markets for you.',
    description: 'Crypto Guru is a blockchain educator with 7+ years of experience in cryptocurrency markets, technical analysis, and blockchain technology education.',
    purpose: 'To educate users about blockchain technology, cryptocurrency markets, and provide technical analysis insights.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop',
    ownerID: '0x1111111111111111111111111111111111111111',
    ownerENS: 'crypto-guru.eth',
    isPrivate: false,
    status: 'active',
    expertise: ['Blockchain', 'Technical Analysis', 'Market Research', 'Education'],
    tags: ['blockchain', 'crypto', 'education', 'analysis'],
    category: 'Education',
    subscriptionPrice: 0.04, // ETH
    subscriptionPeriod: 'monthly',
    subscriberCount: 3421,
    rating: 4.7,
    llm: {
      provider: 'anthropic',
      model: 'claude-3-7-sonnet-latest',
      memoryMode: 'prompt-caching',
      systemMessage: 'You are the Crypto Guru, a blockchain educator who helps users understand cryptocurrency and blockchain technology.'
    },
    trainingProgress: {
      totalContent: 500,
      processedContent: 500,
      vectorizedContent: 500
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
    voiceId: 'crypto-guru-voice-004',
    elevenLabsAgentId: 'agent_4', // Mock ElevenLabs agent ID
    voiceSettings: {
      stability: 0.5,
      similarity_boost: 0.9,
      style: 0.5,
      use_speaker_boost: true,
    },
    socialLinks: {
      twitter: 'https://twitter.com/crypto_guru',
      linkedin: 'https://linkedin.com/in/crypto-guru',
      website: 'https://crypto-guru.eth'
    }
  },
  {
    uuid: 'sensei-5',
    name: 'DeFi Expert',
    slug: 'defi-expert-eth',
    ensName: 'defi-expert.eth',
    ensSlug: 'defi-expert-eth',
    shortDescription: 'Advanced DeFi strategist and protocol researcher',
    greeting: 'Hello! I\'m the DeFi Expert, specializing in advanced DeFi strategies and protocol research.',
    description: 'DeFi Expert is a protocol researcher and strategist with deep knowledge of emerging DeFi protocols, risk management, and yield optimization strategies.',
    purpose: 'To provide advanced DeFi strategies, protocol research, and risk management insights for sophisticated users.',
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    ownerID: '0x2222222222222222222222222222222222222222',
    ownerENS: 'defi-expert.eth',
    isPrivate: false,
    status: 'active',
    expertise: ['DeFi Protocols', 'Risk Management', 'Strategy Development', 'Research'],
    tags: ['defi', 'protocols', 'strategy', 'research'],
    category: 'Finance',
    subscriptionPrice: 0.1, // ETH
    subscriptionPeriod: 'monthly',
    subscriberCount: 567,
    rating: 4.9,
    llm: {
      provider: 'anthropic',
      model: 'claude-3-7-sonnet-latest',
      memoryMode: 'prompt-caching',
      systemMessage: 'You are the DeFi Expert, a protocol researcher who provides advanced DeFi strategies and insights.'
    },
    trainingProgress: {
      totalContent: 400,
      processedContent: 400,
      vectorizedContent: 400
    },
    createdAt: '2024-01-08T12:00:00Z',
    updatedAt: '2024-01-23T16:00:00Z',
    voiceId: 'defi-expert-voice-005',
    elevenLabsAgentId: 'agent_5', // Mock ElevenLabs agent ID
    voiceSettings: {
      stability: 0.9,
      similarity_boost: 0.5,
      style: 0.1,
      use_speaker_boost: true,
    },
    socialLinks: {
      twitter: 'https://twitter.com/defi_expert',
      linkedin: 'https://linkedin.com/in/defi-expert',
      website: 'https://defi-expert.eth'
    }
  }
];

export function getSenseiBySlug(slug: string): MockSensei | undefined {
  return mockSenseis.find(sensei => sensei.ensSlug === slug);
}

export function getSenseisByCategory(category: string): MockSensei[] {
  return mockSenseis.filter(sensei => sensei.category.toLowerCase() === category.toLowerCase());
}

export function searchSenseis(query: string): MockSensei[] {
  const lowercaseQuery = query.toLowerCase();
  return mockSenseis.filter(sensei => 
    sensei.name.toLowerCase().includes(lowercaseQuery) ||
    sensei.shortDescription.toLowerCase().includes(lowercaseQuery) ||
    sensei.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    sensei.expertise?.some(exp => exp.toLowerCase().includes(lowercaseQuery))
  );
}
