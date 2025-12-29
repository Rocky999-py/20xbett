
import React, { useState, useEffect } from 'react';
import { User, Match, Language } from '../types';
import { SPORTS } from '../constants';
import { translations } from '../translations';

interface PlacedBet {
  id: string;
  matchId: string;
  side: 'over' | 'under';
  amount: number;
  multiplier: number;
  status: 'PENDING' | 'WIN' | 'LOSS';
  teamA: string;
  teamB: string;
  sport: string;
}

const getTeamIcon = (team: string): string => {
  const icons: Record<string, string> = {
    'India': 'https://flagcdn.com/w160/in.png',
    'Pakistan': 'https://flagcdn.com/w160/pk.png',
    'Man City': 'https://img.icons8.com/color/96/manchester-city.png',
    'Liverpool': 'https://img.icons8.com/color/96/liverpool-fc.png',
    'Alcaraz': 'https://flagcdn.com/w160/es.png',
    'Djokovic': 'https://flagcdn.com/w160/rs.png',
    'Australia': 'https://flagcdn.com/w160/au.png',
    'England': 'https://flagcdn.com/w160/gb.png',
    'Argentina': 'https://flagcdn.com/w160/ar.png',
    'France': 'https://flagcdn.com/w160/fr.png',
    'Brazil': 'https://flagcdn.com/w160/br.png',
    'Germany': 'https://flagcdn.com/w160/de.png'
  };
  return icons[team] || 'https://img.icons8.com/color/96/trophy.png';
};

const MOCK_MATCHES: Match[] = [
  { id: 'm1', sport: 'Cricket', teamA: 'India', teamB: 'Australia', startTime: 'LIVE', isLive: true, odds: { over: 1.85, under: 1.95, line: 310.5 }, marketLocked: false },
  { id: 'm2', sport: 'Football', teamA: 'Man City', teamB: 'Liverpool', startTime: 'LIVE', isLive: true, odds: { over: 2.10, under: 1.70, line: 2.5 }, marketLocked: false },
  { id: 'm3', sport: 'Tennis', teamA: 'Alcaraz', teamB: 'Djokovic', startTime: 'Starts in 4h', isLive: false, odds: { over: 1.90, under: 1.90, line: 21.5 }, marketLocked: false },
  { id: 'm4', sport: 'Cricket', teamA: 'Pakistan', teamB: 'England', startTime: 'Starts in 12h', isLive: false, odds: { over: 1.80, under: 2.00, line: 285.5 }, marketLocked: false },
  { id: 'm5', sport: 'Football', teamA: 'Argentina', teamB: 'France', startTime: 'Tomorrow', isLive: false, odds: { over: 1.95, under: 1.95, line: 2.5 }, marketLocked: false },
  { id: 'm6', sport: 'Football', teamA: 'Brazil', teamB: 'Germany', startTime: 'In 3 Days', isLive: false, odds: { over: 2.05, under: 1.85, line: 2.5 }, marketLocked: false },
];

interface BettingViewProps {
  user: User;
  onBet: (amount: number, isWin: boolean, multiplier?: number) => void;
  lang: Language;
}

const BettingView: React.FC<BettingViewProps> = ({ user, onBet, lang }) => {
  const t = (key: string) => translations[lang][key] || key;
  const [activeSport, setActiveSport] = useState('Cricket');
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState<{matchId: string, side: 'over' | 'under'} | null>(null);
  const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);
  const [betStatus, setBetStatus] = useState<'IDLE' | 'PROCESSING' | 'SETTLED'>('IDLE');

  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prev => prev.map(m => {
        if (!m.isLive) return m;
        const shouldLock = Math.random() > 0.96; 
        const change = (Math.random() - 0.5) * 0.06;
        return {
          ...m, marketLocked: shouldLock,
          odds: { 
            ...m.odds, 
            over: Number((m.odds.over + change).toFixed(2)), 
            under: Number((m.odds.under - change).toFixed(2)) 
          }
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePlaceBet = () => {
    const match = matches.find(m => m.id === selectedBet?.matchId);
    if (!match || match.marketLocked) return;
    
    if (user.balanceUSDT < betAmount) {
      alert("ERROR: Insufficient balance in your node wallet.");
      return;
    }

    setBetStatus('PROCESSING');
    const multiplier = selectedBet?.side === 'over' ? match.odds.over : match.odds.under;
    const betId = `B-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newPlacedBet: PlacedBet = {
      id: betId, 
      matchId: match.id, 
      side: selectedBet!.side, 
      amount: betAmount, 
      multiplier, 
      status: 'PENDING',
      teamA: match.teamA, 
      teamB: match.teamB, 
      sport: match.sport
    };
    
    setPlacedBets(prev => [newPlacedBet, ...prev]);

    setTimeout(() => {
      const isWin = Math.random() > 0.5;
      setPlacedBets(prev => prev.map(b => b.id === betId ? { ...b, status: isWin ? 'WIN' : 'LOSS' } : b));
      onBet(betAmount, isWin, multiplier);
      setBetStatus('SETTLED');
      setTimeout(() => {
        setBetStatus('IDLE');
        setSelectedBet(null);
      }, 2000);
    }, 2500);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 font-rajdhani">
      
      {/* 🎰 Banner Info */}
      <div className="bg-gradient-to-r from-blue-600/10 to-transparent border border-blue-500/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 flex items-center space-x-6">
           <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl text-white shadow-2xl">
             <i className="fa-solid fa-trophy"></i>
           </div>
           <div>
             <h4 className="text-3xl font-black text-white uppercase italic leading-none">Sportsbook Lobby</h4>
             <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.5em] mt-2">BEP20 Automated Market Settlement</p>
           </div>
        </div>
        <div className="flex space-x-4">
           <div className="px-6 py-3 bg-slate-900/50 rounded-xl border border-white/5 text-center">
              <span className="text-[9px] text-slate-500 font-black uppercase block mb-1">Available to Bet</span>
              <span className="text-xl font-black text-amber-500 italic">${user.balanceUSDT.toFixed(2)}</span>
           </div>
        </div>
      </div>

      {/* Category Nav */}
      <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
        {SPORTS.map(sport => (
          <button
            key={sport.name}
            onClick={() => setActiveSport(sport.name)}
            className={`px-8 py-4 rounded-[1.5rem] flex items-center space-x-3 transition-all border whitespace-nowrap ${
              activeSport === sport.name 
              ? 'bg-blue-600 border-blue-400 text-white shadow-xl' 
              : 'bg-slate-950 border-white/5 text-slate-500 hover:text-white'
            }`}
          >
            <span className="text-2xl">{sport.icon}</span>
            <span className="font-black text-xs uppercase tracking-widest">{sport.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Match List */}
        <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches.filter(m => m.sport === activeSport).map(match => (
            <div key={match.id} className={`bg-[#010409] border rounded-[2.5rem] overflow-hidden transition-all duration-300 relative group ${
              match.marketLocked ? 'border-red-500/30 grayscale' : 'border-white/5 hover:border-blue-500/30'
            }`}>
              {match.marketLocked && (
                <div className="absolute inset-0 z-20 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center">
                   <div className="bg-red-600 px-4 py-2 rounded-xl text-white font-black text-xs tracking-widest uppercase animate-pulse">Market Suspended</div>
                </div>
              )}
              
              <div className="p-4 bg-slate-950/50 border-b border-white/5 flex justify-between items-center">
                <span className={`text-[9px] font-black uppercase tracking-widest ${match.isLive ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
                  {match.isLive ? '● LIVE' : match.startTime}
                </span>
                <span className="text-[9px] text-slate-700 font-black uppercase tracking-widest">{match.sport}</span>
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex flex-col items-center flex-1">
                     <img src={getTeamIcon(match.teamA)} className="w-14 h-14 object-contain mb-3" />
                     <span className="text-[10px] font-black text-white uppercase truncate w-full text-center tracking-tighter">{match.teamA}</span>
                  </div>
                  <span className="text-slate-800 font-black text-2xl italic px-4">VS</span>
                  <div className="flex flex-col items-center flex-1">
                     <img src={getTeamIcon(match.teamB)} className="w-14 h-14 object-contain mb-3" />
                     <span className="text-[10px] font-black text-white uppercase truncate w-full text-center tracking-tighter">{match.teamB}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setSelectedBet({matchId: match.id, side: 'over'})}
                    className={`py-6 rounded-2xl border transition-all text-center group/btn relative overflow-hidden ${
                      selectedBet?.matchId === match.id && selectedBet.side === 'over'
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-blue-500/40'
                    }`}
                  >
                    <span className="text-[8px] font-black uppercase text-slate-500 block mb-1">Over {match.odds.line}</span>
                    <span className="text-3xl font-black italic">{match.odds.over}</span>
                  </button>
                  <button 
                    onClick={() => setSelectedBet({matchId: match.id, side: 'under'})}
                    className={`py-6 rounded-2xl border transition-all text-center group/btn relative overflow-hidden ${
                      selectedBet?.matchId === match.id && selectedBet.side === 'under'
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-blue-500/40'
                    }`}
                  >
                    <span className="text-[8px] font-black uppercase text-slate-500 block mb-1">Under {match.odds.line}</span>
                    <span className="text-3xl font-black italic">{match.odds.under}</span>
                  </button>
                </div>
              </div>

              {selectedBet?.matchId === match.id && (
                <div className="p-6 bg-blue-600/5 border-t border-blue-500/20 animate-in slide-in-from-bottom duration-300">
                   <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <span className="text-[9px] text-slate-500 font-black uppercase mb-2 block">Stake (USDT)</span>
                        <div className="flex items-center bg-black/40 rounded-xl p-2 border border-white/10">
                           <button onClick={() => setBetAmount(Math.max(1, betAmount - 10))} className="w-8 h-8 text-slate-500 hover:text-white">➖</button>
                           <input type="number" value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} className="w-full bg-transparent text-center font-black text-white outline-none" />
                           <button onClick={() => setBetAmount(betAmount + 10)} className="w-8 h-8 text-slate-500 hover:text-white">➕</button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-500 font-black uppercase mb-2 block">Potential Return</span>
                        <p className="text-2xl font-black text-blue-400 italic">${(betAmount * (selectedBet.side === 'over' ? match.odds.over : match.odds.under)).toFixed(2)}</p>
                      </div>
                   </div>
                   <button 
                    onClick={handlePlaceBet}
                    disabled={betStatus !== 'IDLE'}
                    className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.3em] text-xs transition-all italic shadow-2xl ${
                      betStatus === 'IDLE' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 text-slate-600'
                    }`}
                   >
                     {betStatus === 'PROCESSING' ? 'Processing Transaction...' : betStatus === 'SETTLED' ? 'Bet Placed Successfully!' : t('bet_now')}
                   </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recent Bets */}
        <div className="xl:col-span-1">
          <div className="bg-[#0b1223] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl h-fit sticky top-32 shadow-inner-deep">
            <h3 className="text-xl font-black text-white mb-8 uppercase italic border-l-4 border-amber-500 pl-4">Live Bets History</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar">
              {placedBets.length === 0 ? (
                <div className="text-center py-10 opacity-10">
                   <i className="fa-solid fa-receipt text-5xl mb-4"></i>
                   <p className="text-[10px] font-black uppercase tracking-widest">No active bets</p>
                </div>
              ) : (
                placedBets.map(bet => (
                  <div key={bet.id} className="p-5 bg-black/40 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-[9px] font-black text-slate-600">ID: {bet.id}</span>
                       <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                         bet.status === 'WIN' ? 'bg-green-600 text-white' : bet.status === 'LOSS' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white animate-pulse'
                       }`}>{bet.status}</span>
                    </div>
                    <p className="text-[11px] font-black text-slate-200 mb-1 truncate uppercase">{bet.teamA} v {bet.teamB}</p>
                    <div className="flex justify-between items-baseline">
                       <span className="text-[9px] text-blue-500 font-bold uppercase">{bet.side} • ${bet.amount}</span>
                       <span className="text-lg font-black text-white italic">${(bet.amount * bet.multiplier).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingView;
