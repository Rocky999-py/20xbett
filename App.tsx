
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, User, MLMStats, Transaction, LiveEvent } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ProfileView from './components/ProfileView';
import MLMView from './components/MLMView';
import BettingView from './components/BettingView';
import CasinoView from './components/CasinoView';
import WalletView from './components/WalletView';
import SupportView from './components/SupportView';
import GamePortalView from './components/GamePortalView';
import Logo from './components/Logo';
import RegistrationGuide from './components/RegistrationGuide';
import AuthView from './components/AuthView';
import { NexusAPI } from './api';

const INITIAL_USER: User = {
  id: 'NEX-9821-V',
  fullName: 'Guest Node',
  profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nexus',
  walletAddress: '0x3E2F...8A12',
  uplineId: 'NEX-0001-A',
  joinDate: new Date().toLocaleDateString(),
  currentLevel: 1,
  balanceUSDT: 0.00,
  balanceBNB: 0.15
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
  directPartners: 0,
  totalTeam: 0,
  totalWebsiteUsers: 12450
};

const App: React.FC = () => {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [stats, setStats] = useState<MLMStats>(INITIAL_STATS);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isAuthMode, setIsAuthMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [liveFeed, setLiveFeed] = useState<LiveEvent[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Handshake with backend database on mount
  useEffect(() => {
    const initNexus = async () => {
      try {
        const session = localStorage.getItem('nexus_active_session');
        if (session) {
          const userData = JSON.parse(session);
          // Re-verify session with backend
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
  }, []);

  const addLiveEvent = useCallback((type: LiveEvent['type'], message: string) => {
    const newEvent: LiveEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setLiveFeed(prev => [newEvent, ...prev].slice(0, 15));
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('nexus_active_session', JSON.stringify(userData));
    setIsWalletConnected(true);
    setIsAuthMode(false);
    addLiveEvent('TEAM', `Node Established: ${userData.fullName}`);
    
    // Refresh stats from backend database
    setStats({
      ...INITIAL_STATS,
      totalProfit: userData.balanceUSDT,
      totalWebsiteUsers: 12450 + Math.floor(Math.random() * 500)
    });
  };

  const handleBet = async (amount: number, isWin: boolean, multiplier: number = 2) => {
    const finalChange = isWin ? (amount * multiplier) - amount : -amount;
    const newBalance = user.balanceUSDT + finalChange;

    try {
      // Sync balance update to backend database
      const response = await NexusAPI.updateProfile(user.id, { balanceUSDT: newBalance });
      setUser(response.user);

      const type = isWin ? 'BET_WIN' : 'BET_LOSS';
      const newTx: Transaction = {
        id: `TX-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        type,
        amount: finalChange,
        status: 'COMPLETED',
        date: new Date().toISOString().split('T')[0]
      };
      setTransactions(prev => [newTx, ...prev]);
      addLiveEvent(isWin ? 'INCOME' : 'BONUS', `${isWin ? 'Win' : 'Loss'}: $${Math.abs(finalChange).toFixed(2)}`);
    } catch (e) {
      console.error('BACKEND_SYNC_ERROR: Bet results failed to persist.');
    }
  };

  const handleUpgrade = async (levelId: number, price: number) => {
    const newBalance = user.balanceUSDT - price;
    try {
      // Sync level upgrade to backend database
      const response = await NexusAPI.updateProfile(user.id, { 
        currentLevel: Math.max(user.currentLevel, levelId),
        balanceUSDT: newBalance
      });
      setUser(response.user);

      const newTx: Transaction = {
        id: `TX-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        type: 'LEVEL_PAY',
        amount: -price,
        status: 'COMPLETED',
        date: new Date().toISOString().split('T')[0]
      };
      setTransactions(prev => [newTx, ...prev]);
      addLiveEvent('LEVEL', `Upgraded to Level ${levelId}`);
    } catch (e) {
      alert('SYNC_ERROR: Level activation failed on mainnet.');
    }
  };

  useEffect(() => {
    if (!isWalletConnected) return;
    const interval = setInterval(() => {
      const types: LiveEvent['type'][] = ['COMMISSION', 'INCOME', 'TEAM', 'LEVEL', 'BONUS'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const msgs = {
        COMMISSION: 'Backend Sync: Commission index updated',
        INCOME: 'Income Pulse: USDT Balance Refreshed',
        TEAM: 'New Node detected in generational matrix',
        LEVEL: 'Global Protocol: Node upgrade confirmed',
        BONUS: 'Matrix Reward Distributed'
      };
      addLiveEvent(randomType, msgs[randomType]);
    }, 8000);
    return () => clearInterval(interval);
  }, [isWalletConnected, addLiveEvent]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
           <Logo size="lg" className="mb-8 animate-rolling" />
           <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-cyan-500 animate-[marquee_1.5s_linear_infinite] w-[200%]"></div>
           </div>
           <p className="mt-4 text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Establishing Secure Handshake...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (isAuthMode) return <AuthView onLoginSuccess={handleLoginSuccess} />;
    if (!isWalletConnected) {
      return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-[#020617]">
          {/* 🏟️ NEW: Futuristic Green Playground Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617] z-10"></div>
            <div className="absolute inset-0 bg-[#020617]/40 z-10 backdrop-blur-[2px]"></div>
            <img 
              src="https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover opacity-25 mix-blend-luminosity animate-slow-zoom" 
              alt="Gaming Arena"
            />
            <div className="cyber-grid opacity-30"></div>
          </div>

          <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center">
            {/* 🔄 Rolling Brand Logo Centered */}
            <div className="mb-8 md:mb-16 flex justify-center w-full">
              <div className="animate-rolling">
                <Logo size="xl" />
              </div>
            </div>

            <h1 className="text-4xl md:text-8xl font-rajdhani font-black mb-8 tracking-tighter text-white uppercase leading-none px-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              NEXUS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">DECENTRALIZED ARENA</span>
            </h1>
            
            <p className="text-slate-300 max-w-2xl mb-14 text-lg md:text-2xl leading-relaxed px-4 font-rajdhani font-medium tracking-wide">
              The world's first fully automated sports, casino, and MLM ecosystem on the <span className="text-amber-500 font-bold">BNB Smart Chain</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl px-6">
              <button onClick={() => setIsAuthMode(true)} className="flex-1 py-6 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-3xl font-black text-2xl shadow-[0_0_50px_rgba(8,145,178,0.3)] border border-cyan-400/30 uppercase tracking-[0.2em] hover:scale-[1.05] transition-all active:scale-95 font-rajdhani">
                Establish Node
              </button>
              <button className="flex-1 py-6 bg-slate-900/80 backdrop-blur-md rounded-3xl font-black text-2xl shadow-2xl border border-slate-700 text-slate-300 uppercase tracking-[0.2em] hover:bg-slate-800 transition-all font-rajdhani">
                Whitepaper
              </button>
            </div>

            <div className="w-full max-w-full overflow-x-hidden">
              <RegistrationGuide />
            </div>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case AppView.DASHBOARD: return <DashboardView stats={stats} liveFeed={liveFeed} />;
      case AppView.GAME_PORTAL: return <GamePortalView setView={setCurrentView} />;
      case AppView.PROFILE: 
      case AppView.SETTINGS: return <ProfileView user={user} setUser={setUser} />;
      case AppView.REFERRAL: 
      case AppView.TEAM: 
      case AppView.MLM_SALARY: return <MLMView stats={stats} user={user} onUpgrade={handleUpgrade} />;
      case AppView.BETTING: return <BettingView user={user} onBet={handleBet} />;
      case AppView.CASINO: return <CasinoView user={user} onBet={handleBet} />;
      case AppView.WALLET: return <WalletView user={user} transactions={transactions} />;
      case AppView.SUPPORT: return <SupportView />;
      default: return <DashboardView stats={stats} liveFeed={liveFeed} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30 font-inter">
      {(isWalletConnected && !isAuthMode) && (
        <Sidebar activeView={currentView} setView={setCurrentView} isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      )}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {!isAuthMode && isWalletConnected && (
          <Header user={user} isConnected={isWalletConnected} onConnect={() => setIsAuthMode(true)} onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        )}
        <main className={`flex-1 overflow-y-auto ${isAuthMode ? '' : 'p-4 md:p-6 lg:p-10'} custom-scrollbar`}>
          <div className="max-w-[1600px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
