
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, User, MLMStats, Transaction, LiveEvent, Language } from './types.ts';
import Header from './components/Header.tsx';
import DashboardView from './components/DashboardView.tsx';
import ProfileView from './components/ProfileView.tsx';
import MLMView from './components/MLMView.tsx';
import BettingView from './components/BettingView.tsx';
import CasinoView from './components/CasinoView.tsx';
import WalletView from './components/WalletView.tsx';
import SupportView from './components/SupportView.tsx';
import Logo from './components/Logo.tsx';
import RegistrationGuide from './components/RegistrationGuide.tsx';
import AuthView from './components/AuthView.tsx';
import IncomeSummaryView from './components/IncomeSummaryView.tsx';
import AdminPortalView from './components/AdminPortalView.tsx'; // Import Admin Portal
import { NexusAPI } from './api.ts';
import { translations } from './translations.ts';

const INITIAL_USER: User = {
  id: 'USER-9821',
  fullName: 'Guest User',
  profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nexus',
  walletAddress: '0x3E2F...8A12',
  uplineId: 'NEX-0001-A',
  joinDate: new Date().toLocaleDateString(),
  currentLevel: 1,
  balanceUSDT: 1000.00,
  balanceBNB: 0.15,
  isMLM: false
};

const INITIAL_STATS: MLMStats = {
  totalProfit: 0.00,
  referralIncome: 0.00,
  referralCommission: 0.00,
  monthlySalary: 0.00,
  bettingCommission: 0.00,
  bettingMonthlySalary: 0.00,
  mlmMonthlyFund: 0.00,
  bettingMonthlyFund: 0.00,
  directPartners: 12,
  totalTeam: 48,
  totalWebsiteUsers: 12450,
  bettingVolume: 5200.00
};

const App: React.FC = () => {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [stats, setStats] = useState<MLMStats>(INITIAL_STATS);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [lang, setLang] = useState<Language>('EN');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isAuthMode, setIsAuthMode] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [liveFeed, setLiveFeed] = useState<LiveEvent[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false); // Admin Modal State

  useEffect(() => {
    const handleOpenAdmin = () => {
      console.log("App Received Admin Trigger Event");
      setIsAdminOpen(true);
    };
    
    window.addEventListener('OPEN_ADMIN_PORTAL', handleOpenAdmin);
    
    const initNexus = async () => {
      try {
        const session = localStorage.getItem('nexus_active_session');
        if (session) {
          const userData = JSON.parse(session);
          const response = await NexusAPI.login({ email: userData.email, password: userData.password });
          setUser(response.user);
          setIsWalletConnected(true);
        }
      } catch (e) {
        localStorage.removeItem('nexus_active_session');
      } finally {
        setIsInitializing(false);
      }
    };
    initNexus();
    
    return () => window.removeEventListener('OPEN_ADMIN_PORTAL', handleOpenAdmin);
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('nexus_active_session', JSON.stringify(userData));
    setIsWalletConnected(true);
    setIsAuthMode(false);
  };

  const handleBet = async (amount: number, isWin: boolean, multiplier: number = 0) => {
    let netChange = 0;
    let txType: Transaction['type'] = 'BET_LOSS';

    if (!isWin) {
      netChange = -amount;
      txType = 'BET_LOSS';
    } else {
      netChange = amount * multiplier;
      txType = 'BET_WIN';
    }
    
    const newBalance = Number((user.balanceUSDT + netChange).toFixed(2));
    
    // Persist to Supabase if possible
    try {
      await NexusAPI.updateProfile(user.id, { balanceUSDT: newBalance });
    } catch(err) {
      console.warn("Could not sync balance to server, updating locally.");
    }
    
    setUser(prev => ({ 
      ...prev, 
      balanceUSDT: newBalance 
    }));
    
    const newTx: Transaction = {
      id: `TX-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      type: txType,
      amount: netChange,
      status: 'COMPLETED',
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleUpgrade = async (levelId: number, price: number) => {
    const newBalance = user.balanceUSDT - price;
    try {
      await NexusAPI.updateProfile(user.id, { currentLevel: levelId, balanceUSDT: newBalance });
    } catch(err) {
      console.warn("Update profile failed, local only.");
    }
    setUser(prev => ({ ...prev, currentLevel: levelId, balanceUSDT: newBalance }));
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Logo size="lg" className="animate-rolling" />
      </div>
    );
  }

  const renderContent = () => {
    if (isAuthMode) return <AuthView onLoginSuccess={handleLoginSuccess} />;
    if (!isWalletConnected) {
      return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-[#020617]">
          <div className="absolute inset-0 z-0"><div className="cyber-grid opacity-20"></div></div>
          <div className="relative z-20 w-full max-w-4xl">
            <Logo size="xl" className="mx-auto mb-12 animate-rolling" />
            <h1 className="text-5xl md:text-8xl font-rajdhani font-black mb-8 text-white uppercase italic tracking-tighter">
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">PREMIUM</span> <br />BETTING NODE
            </h1>
            <button onClick={() => setIsAuthMode(true)} className="px-16 py-6 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-2xl text-white shadow-2xl transition-all active:scale-95">
              SYNC WALLET
            </button>
            <RegistrationGuide />
          </div>
        </div>
      );
    }

    switch (currentView) {
      case AppView.DASHBOARD: return <DashboardView stats={stats} liveFeed={liveFeed} lang={lang} setView={setCurrentView} onBet={handleBet} user={user} />;
      case AppView.PROFILE: return <ProfileView user={user} setUser={setUser} lang={lang} />;
      case AppView.TEAM: 
      case AppView.REFERRAL:
      case AppView.MLM_SALARY: return <MLMView stats={stats} user={user} onUpgrade={handleUpgrade} lang={lang} />;
      case AppView.INCOME_SUMMARY: return <IncomeSummaryView stats={stats} lang={lang} />;
      case AppView.BETTING: return <BettingView user={user} onBet={handleBet} lang={lang} />;
      case AppView.CASINO: return <CasinoView user={user} onBet={handleBet} lang={lang} />;
      case AppView.WALLET: return <WalletView user={user} transactions={transactions} lang={lang} />;
      case AppView.SUPPORT: return <SupportView lang={lang} />;
      default: return <DashboardView stats={stats} liveFeed={liveFeed} lang={lang} setView={setCurrentView} onBet={handleBet} user={user} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0b1223] text-slate-200">
      {isAdminOpen && <AdminPortalView onClose={() => setIsAdminOpen(false)} />}
      {!isAuthMode && isWalletConnected && (
        <Header user={user} isConnected={isWalletConnected} onConnect={() => setIsAuthMode(true)} onToggleMenu={() => {}} lang={lang} setLang={setLang} setView={setCurrentView} activeView={currentView} />
      )}
      <main className={`flex-1 overflow-y-auto ${isAuthMode ? '' : 'p-4 md:p-6 lg:p-10'} custom-scrollbar`}>
        <div className="max-w-[1800px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
