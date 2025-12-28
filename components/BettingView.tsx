
import React, { useState, useEffect } from 'react';
import { User, Match } from '../types';
import { SPORTS } from '../constants';

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

const getTeamFlag = (team: string): string => {
  const flags: Record<string, string> = {
    'India': '🇮🇳', 'Australia': '🇦🇺', 'Man City': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Liverpool': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'Alcaraz': '🇪🇸', 'Djokovic': '🇷🇸', 'Netherlands': '🇳🇱', 'Belgium': '🇧🇪',
    'Lakers': '🇺🇸', 'Warriors': '🇺🇸', 'Poland': '🇵🇱', 'Brazil': '🇧🇷',
    'Axelsen': '🇩🇰', 'Naraoka': '🇯🇵', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Pakistan': '🇵🇰'
  };
  return flags[team] || '🏳️';
};

const MOCK_MATCHES: Match[] = [
  { id: 'm1', sport: 'Cricket', teamA: 'India', teamB: 'Australia', startTime: 'LIVE', isLive: true, odds: { over: 1.85, under: 1.95, line: 310.5 }, marketLocked: false },
  { id: 'm2', sport: 'Football', teamA: 'Man City', teamB: 'Liverpool', startTime: 'LIVE', isLive: true, odds: { over: 2.10, under: 1.70, line: 2.5 }, marketLocked: false },
  { id: 'm3', sport: 'Tennis', teamA: 'Alcaraz', teamB: 'Djokovic', startTime: 'Starts in 20m', isLive: false, odds: { over: 1.90, under: 1.90, line: 21.5 }, marketLocked: false },
  { id: 'm4', sport: 'Hockey', teamA: 'Netherlands', teamB: 'Belgium', startTime: 'LIVE', isLive: true, odds: { over: 1.75, under: 2.05, line: 4.5 }, marketLocked: false },
  { id: 'm5', sport: 'Basketball', teamA: 'Lakers', teamB: 'Warriors', startTime: 'LIVE', isLive: true, odds: { over: 1.91, under: 1.91, line: 224.5 }, marketLocked: false },
  { id: 'm6', sport: 'Volleyball', teamA: 'Poland', teamB: 'Brazil', startTime: 'LIVE', isLive: true, odds: { over: 1.88, under: 1.88, line: 182.5 }, marketLocked: false },
  { id: 'm7', sport: 'Badminton', teamA: 'Axelsen', teamB: 'Naraoka', startTime: 'LIVE', isLive: true, odds: { over: 1.65, under: 2.15, line: 78.5 }, marketLocked: false },
  { id: 'm8', sport: 'Cricket', teamB: 'England', teamA: 'Pakistan', startTime: 'Tomorrow', isLive: false, odds: { over: 1.80, under: 2.00, line: 285.5 }, marketLocked: false },
];

interface BettingViewProps {
  user: User;
  onBet: (amount: number, isWin: boolean, multiplier?: number) => void;
}

const BettingView: React.FC<BettingViewProps> = ({ user, onBet }) => {
  const [activeSport, setActiveSport] = useState('Cricket');
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState<{matchId: string, side: 'over' | 'under'} | null>(null);
  const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prev => prev.map(m => {
        if (!m.isLive) return m;
        const shouldLock = Math.random() > 0.95; 
        const change = (Math.random() - 0.5) * 0.04;
        return {
          ...m, marketLocked: shouldLock,
          odds: { ...m.odds, over: Number((m.odds.over + change).toFixed(2)), under: Number((m.odds.under - change).toFixed(2)) }
        };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePlaceBet = () => {
    const match = matches.find(m => m.id === selectedBet?.matchId);
    if (!match || match.marketLocked) return;
    
    // Strict Balance Validation
    if (user.balanceUSDT <= 0) {
      alert("CRITICAL ERROR: Zero liquidity detected. Please recharge your Mainnet Wallet.");
      return;
    }
    if (betAmount > user.balanceUSDT) {
      alert("INSUFFICIENT BALANCE: Bet exceeds live USDT liquidity.");
      return;
    }

    const multiplier = selectedBet?.side === 'over' ? match.odds.over : match.odds.under;
    const betId = `BET-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const newPlacedBet: PlacedBet = {
      id: betId, matchId: match.id, side: selectedBet!.side, amount: betAmount, multiplier, status: 'PENDING',
      teamA: match.teamA, teamB: match.teamB, sport: match.sport
    };
    setPlacedBets(prev => [newPlacedBet, ...prev]);
    setSelectedBet(null);
    setTimeout(() => {
      const isWin = Math.random() > 0.5;
      setPlacedBets(prev => prev.map(b => b.id === betId ? { ...b, status: isWin ? 'WIN' : 'LOSS' } : b));
      onBet(betAmount, isWin, multiplier);
    }, 3000);
  };

  const hasInsufficientBalance = user.balanceUSDT < betAmount;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Sports Categories */}
      <div className="flex flex-nowrap md:flex-wrap gap-2 md:gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {SPORTS.map(sport => (
          <button
            key={sport.name}
            onClick={() => setActiveSport(sport.name)}
            className={`whitespace-nowrap px-6 md:px-8 py-3.5 md:py-4 rounded-2xl md:rounded-[2rem] flex items-center space-x-3 transition-all border shrink-0 ${
              activeSport === sport.name 
              ? 'bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-900/40' 
              : 'bg-slate-900 border-slate-800 text-slate-400 hover-gold-gradient'
            }`}
          >
            <span className="text-xl md:text-2xl">{sport.icon}</span>
            <span className="font-rajdhani font-bold text-xs md:text-sm tracking-widest uppercase">{sport.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {matches.filter(m => m.sport === activeSport).map(match => {
            const hasPendingBet = placedBets.some(b => b.matchId === match.id && b.status === 'PENDING');
            return (
              <div key={match.id} className={`bg-[#010409] border rounded-3xl md:rounded-[2.5rem] overflow-hidden transition-all duration-300 relative group ${
                match.marketLocked ? 'border-red-500/20' : 'border-slate-800'
              }`}>
                <div className="bg-slate-950/40 p-4 md:p-6 flex justify-between items-center border-b border-slate-800/50">
                  <span className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest font-rajdhani ${match.isLive ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                    {match.startTime}
                  </span>
                  {match.marketLocked && (
                    <span className="text-[9px] md:text-[10px] text-red-500 font-black uppercase tracking-widest flex items-center font-rajdhani">
                       <i className="fa-solid fa-lock mr-2"></i> SUSPENDED
                    </span>
                  )}
                </div>
                
                <div className="p-6 md:p-10 text-center relative">
                  {match.marketLocked && <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] z-10 flex items-center justify-center"></div>}
                  
                  <div className="flex items-center justify-between space-x-2 md:space-x-4 mb-6 md:mb-10">
                    <div className="flex flex-col items-center flex-1 min-w-0">
                       <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-900 rounded-[1.5rem] mb-3 flex items-center justify-center text-3xl md:text-5xl shadow-inner-deep border border-white/5 group-hover:border-amber-500/20 transition-all">
                          {getTeamFlag(match.teamA)}
                       </div>
                       <span className="text-[10px] md:text-xs font-black text-slate-300 truncate w-full uppercase font-rajdhani tracking-widest">{match.teamA}</span>
                    </div>
                    <span className="text-slate-800 font-rajdhani font-black text-xl md:text-4xl italic px-4">VS</span>
                    <div className="flex flex-col items-center flex-1 min-w-0">
                       <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-900 rounded-[1.5rem] mb-3 flex items-center justify-center text-3xl md:text-5xl shadow-inner-deep border border-white/5 group-hover:border-amber-500/20 transition-all">
                          {getTeamFlag(match.teamB)}
                       </div>
                       <span className="text-[10px] md:text-xs font-black text-slate-300 truncate w-full uppercase font-rajdhani tracking-widest">{match.teamB}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:gap-5">
                    <button 
                      disabled={match.marketLocked || hasPendingBet}
                      onClick={() => setSelectedBet({matchId: match.id, side: 'over'})}
                      className={`py-5 md:py-8 rounded-3xl border transition-all flex flex-col items-center relative overflow-hidden group/btn ${
                        selectedBet?.matchId === match.id && selectedBet.side === 'over'
                        ? 'bg-amber-600 border-amber-400 shadow-xl shadow-amber-900/40'
                        : 'bg-slate-950 border-slate-800 hover-gold-gradient'
                      }`}
                    >
                      <span className="text-[9px] md:text-[10px] uppercase font-black text-slate-500 mb-2 font-rajdhani tracking-widest">Over {match.odds.line}</span>
                      <span className="text-2xl md:text-4xl font-rajdhani font-black leading-none italic">{match.odds.over}</span>
                    </button>
                    <button 
                      disabled={match.marketLocked || hasPendingBet}
                      onClick={() => setSelectedBet({matchId: match.id, side: 'under'})}
                      className={`py-5 md:py-8 rounded-3xl border transition-all flex flex-col items-center relative overflow-hidden group/btn ${
                        selectedBet?.matchId === match.id && selectedBet.side === 'under'
                        ? 'bg-amber-600 border-amber-400 shadow-xl shadow-amber-900/40'
                        : 'bg-slate-950 border-slate-800 hover-gold-gradient'
                      }`}
                    >
                      <span className="text-[9px] md:text-[10px] uppercase font-black text-slate-500 mb-2 font-rajdhani tracking-widest">Under {match.odds.line}</span>
                      <span className="text-2xl md:text-4xl font-rajdhani font-black leading-none italic">{match.odds.under}</span>
                    </button>
                  </div>
                </div>

                {selectedBet?.matchId === match.id && (
                  <div className="p-6 md:p-8 bg-amber-950/5 border-t border-amber-500/10 animate-in slide-in-from-bottom duration-500">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6 md:mb-8">
                      <div className="w-full sm:w-auto">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-3 font-rajdhani">Bet Amount (USDT)</span>
                        <div className="flex items-center space-x-3">
                          <input 
                            type="number" value={betAmount} 
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                            className="bg-[#020617] border border-slate-800 text-white rounded-xl px-4 py-3 outline-none w-full sm:w-32 font-black text-sm font-rajdhani tracking-widest focus:border-amber-500/50"
                          />
                          <div className="flex gap-2">
                            {[10, 50, 100].map(v => (
                              <button key={v} onClick={() => setBetAmount(v)} className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black font-rajdhani hover:bg-slate-800 uppercase transition-all tracking-widest">{v}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-center sm:text-right">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-2 font-rajdhani">Est. Return Node</span>
                        <p className="text-3xl font-rajdhani font-black text-amber-500 italic">
                          ${(betAmount * (selectedBet.side === 'over' ? match.odds.over : match.odds.under)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Error Banner for Zero/Low Balance */}
                    {hasInsufficientBalance && (
                      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
                        <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em] font-rajdhani italic animate-pulse">
                          <i className="fa-solid fa-triangle-exclamation mr-2"></i> 
                          Insufficient live balance for this transaction
                        </p>
                      </div>
                    )}

                    <button 
                      onClick={handlePlaceBet}
                      disabled={hasInsufficientBalance}
                      className={`w-full relative group/btn-confirm overflow-hidden py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] transition-all shadow-xl font-rajdhani ${
                        hasInsufficientBalance 
                        ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-slate-800 grayscale opacity-60' 
                        : 'bg-gradient-to-r from-amber-600 to-amber-800 text-white hover:from-amber-500 active:scale-95'
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {hasInsufficientBalance ? (
                          <> <i className="fa-solid fa-lock mr-2 text-[10px]"></i> INSUFFICIENT LIQUIDITY </>
                        ) : (
                          <> <i className="fa-solid fa-check-double mr-2"></i> CONFIRM MATRIX BET </>
                        )}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Recent Bets Log */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-[#010409] border border-slate-800 p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-2xl h-fit shadow-inner-deep">
            <h3 className="text-xl font-rajdhani font-black mb-8 flex items-center text-white tracking-widest uppercase italic">
              <span className="w-1.5 h-8 bg-amber-500 rounded-full mr-4 shadow-[0_0_15px_#f59e0b]"></span>
              Node Activity
            </h3>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {placedBets.length === 0 ? (
                <div className="text-center py-20 opacity-20 italic text-[10px] font-black uppercase tracking-[0.5em] font-rajdhani flex flex-col items-center">
                   <i className="fa-solid fa-ghost text-4xl mb-4"></i>
                   No recent signals
                </div>
              ) : (
                placedBets.map(bet => (
                  <div key={bet.id} className="p-5 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden hover-gold-gradient transition-all group/betlog">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      bet.status === 'WIN' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : bet.status === 'LOSS' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-amber-500 shadow-[0_0_10px_#f59e0b] animate-pulse'
                    }`}></div>
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-[9px] font-black text-slate-600 uppercase font-rajdhani tracking-widest">#{bet.id}</span>
                       <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase font-rajdhani tracking-widest border ${
                         bet.status === 'WIN' ? 'bg-green-500/10 text-green-400 border-green-500/20' : bet.status === 'LOSS' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                       }`}>{bet.status}</span>
                    </div>
                    <div className="text-[11px] font-black text-slate-200 mb-3 truncate font-rajdhani uppercase tracking-wide">
                      {getTeamFlag(bet.teamA)} {bet.teamA} <span className="text-slate-700 mx-1 italic">v</span> {getTeamFlag(bet.teamB)} {bet.teamB}
                    </div>
                    <div className="flex justify-between items-end border-t border-white/5 pt-3">
                       <span className="text-[9px] text-amber-500 font-black uppercase font-rajdhani tracking-[0.2em]">{bet.side} • ${bet.amount}</span>
                       <span className="text-lg font-rajdhani font-black text-white italic tracking-tighter">${(bet.amount * bet.multiplier).toFixed(2)}</span>
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
