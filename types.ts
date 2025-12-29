
export type Language = 'EN' | 'BN' | 'HI' | 'UR' | 'NE' | 'AF' | 'MY' | 'BT' | 'MV';

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PROFILE = 'PROFILE',
  REFERRAL = 'REFERRAL',
  TEAM = 'TEAM',
  INCOME_SUMMARY = 'INCOME_SUMMARY',
  BETTING = 'BETTING',
  CASINO = 'CASINO',
  GAME_PORTAL = 'GAME_PORTAL',
  MLM_SALARY = 'MLM_SALARY',
  WALLET = 'WALLET',
  TRANSACTIONS = 'TRANSACTIONS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  SETTINGS = 'SETTINGS',
  SUPPORT = 'SUPPORT',
  AUTH = 'AUTH'
}

export interface UserCredentials {
  name: string;
  email: string;
  phone: string;
  metamask?: string;
  trustwallet?: string;
  password?: string;
  isMLM: boolean;
  referralId?: string;
}

export interface Game {
  id: string;
  name: string;
  category: 'Slots' | 'Table Games' | 'Live Casino' | 'Crash Games';
  provider: string;
  img: string;
  demoUrl: string;
}

export interface User {
  id: string;
  fullName: string;
  profilePic: string;
  walletAddress: string;
  uplineId: string;
  joinDate: string;
  currentLevel: number;
  balanceUSDT: number;
  balanceBNB: number;
  isMLM: boolean;
  email?: string;
  phone?: string;
  password?: string;
}

export interface MLMStats {
  totalProfit: number;
  referralIncome: number;
  referralCommission: number;
  monthlySalary: number;
  bettingCommission: number;
  bettingMonthlySalary: number;
  mlmMonthlyFund: number;
  bettingMonthlyFund: number;
  directPartners: number;
  totalTeam: number;
  totalWebsiteUsers: number;
  bettingVolume: number;
}

export interface Level {
  id: number;
  name: string;
  priceUSD: number;
  description: string;
}

export interface Match {
  id: string;
  sport: string;
  teamA: string;
  teamB: string;
  startTime: string; // ISO or human-readable
  isLive: boolean;
  marketLocked?: boolean;
  odds: {
    over: number;
    under: number;
    line: number;
  };
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'LEVEL_PAY' | 'COMMISSION' | 'BET_WIN' | 'BET_LOSS' | 'SALARY';
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  date: string;
}

export interface LiveEvent {
  id: string;
  type: 'COMMISSION' | 'INCOME' | 'TEAM' | 'LEVEL' | 'BONUS';
  message: string;
  timestamp: string;
}
