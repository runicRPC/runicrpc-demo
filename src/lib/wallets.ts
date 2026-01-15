import { PublicKey } from '@solana/web3.js';

export interface WalletData {
  address: string;
  name: string;
  description: string;
}

export const DEMO_WALLETS: WalletData[] = [
  {
    address: 'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB',
    name: 'Jupiter Aggregator',
    description: 'Jupiter Protocol main program',
  },
  {
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    name: 'Bonk DAO Treasury',
    description: 'Community treasury wallet',
  },
  {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    name: 'USDC Token Mint',
    description: 'Circle USDC mint authority',
  },
  {
    address: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
    name: 'Binance Hot Wallet',
    description: 'Exchange hot wallet',
  },
];

export function validateAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatSOL(lamports: number): string {
  const sol = lamports / 1e9;
  if (sol >= 1000000) {
    return `${(sol / 1000000).toFixed(2)}M`;
  }
  if (sol >= 1000) {
    return `${(sol / 1000).toFixed(2)}K`;
  }
  return sol.toFixed(4);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return num.toLocaleString();
}
