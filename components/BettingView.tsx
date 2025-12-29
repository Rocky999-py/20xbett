
import React, { useState, useEffect } from 'react';
import { User, Match, Language } from '../types';
import { SPORTS } from '../constants';
import { translations } from '../translations';

interface PlacedBet {
  id: string;
  matchId: string;
  side: 'W1' | 'W2';
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
  { id: 'm1', sport: 'Cricket', teamA: 'India', teamB: 'Australia', startTime: 'LIVE', isLive: true, odds: { over: 1.85, under: 1.95, line: 1 }, marketLocked: false },
  { id: 'm2', sport: 'Football', teamA: 'Man City', teamB: 'Liverpool', startTime: 'LIVE', isLive: true, odds: { over: 2.10, under: 1.70, line: 1 }, marketLocked: false },
  { id: 'm3', sport: 'Tennis', teamA: 'Alcaraz', teamB: 'Djokovic', startTime: 'Starts in 4h', isLive: false, odds: { over: 1.90, under: 1.90, line: 1 }, marketLocked: false },
  { id: 'm4', sport: 'Cricket', teamA: 'Pakistan', teamB: 'England', startTime: 'Starts in 12h', isLive: false, odds: { over: 1.80, under: 2.00, line: 1 }, marketLocked: false },
  { id: 'm5', sport: 'Football', teamA: 'Argentina', teamB: 'France', startTime: 'Tomorrow', isLive: false, odds: { over: 1.95, under: 1.95, line: 1 }, marketLocked: false },
  { id: 'm6', sport: 'Football', teamA: 'Brazil', teamB: 'Germany', startTime: 'In 3 Days', isLive: false, odds: { over: 2.05, under: 1.85, line: 1 }, marketLocked: false },
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
  const [selectedBet, setSelectedBet] = useState<{matchId: string, side: 'W1' | 'W2'} | null>(null);
  const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);
  const [betStatus, setBetStatus] = useState<'IDLE' | 'PROCESSING' | 'SETTLED'>('IDLE');

  // Professional Odds Fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prev => prev.map(m => {
        if (!m.isLive) return m;
        const shouldLock = Math.random() > 0.98; // Suspend market
        const change = (Math.random() - 0.5) * 0.1;
        return {
          ...m, 
          marketLocked: shouldLock ? true : (m.marketLocked && Math.random() > 0.5 ? true : false),
          odds: { 
            ...m.odds, 
            over: Number((m.odds.over + change).toFixed(2)), 
            under: Number((m.odds.under - change).toFixed(2)) 
          }
        };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePlaceBet = () => {
    const match = matches.find(m => m.id === selectedBet?.matchId);
    if (!match || match.marketLocked) return;
    
    if (user.balanceUSDT < betAmount) {
      alert("Insufficient Balance!");
      return;
    }

    setBetStatus('PROCESSING');
    const multiplier = selectedBet?.side === 'W1' ? match.odds.over : match.odds.under;
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

    // Rigging logic: 35% win rate
    setTimeout(() => {
      const isWin = Math.random() <= 0.35;
      setPlacedBets(prev => prev.map(b => b.id === betId ? { ...b, status: isWin ? 'WIN' : 'LOSS' } : b));
      onBet(betAmount, isWin, multiplier);
      setBetStatus('SETTLED');
      setTimeout(() => {
        setBetStatus('IDLE');
        setSelectedBet(null);
      }, 2000);
    }, 3000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 font-rajdhani text-white min-h-screen">
      
      {/* 🧭 LEFT SIDEBAR: Categories */}
      <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
        <div className="bg-[#141d33] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-4 bg-blue-600/10 border-b border-white/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 italic">Top Sports</h4>
          </div>
          <div className="p-2 space-y-1">
            {SPORTS.map(sport => (
              <button
                key={sport.name}
                onClick={() => setActiveSport(sport.name)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  activeSport === sport.name ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/5 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{sport.icon}</span>
                  <span className="text-[11px] font-black uppercase tracking-wider">{sport.name}</span>
                </div>
                <span className="text-[9px] font-bold opacity-40">24</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🏟️ CENTER: Markets Area */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-900 rounded-[2.5rem] p-8 flex items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black italic uppercase leading-none mb-2">PRO SPORTSBOOK</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 italic">BEP20 Settlement Active • 100% Reliable</p>
          </div>
          <img src="https://img.icons8.com/color/144/trophy.png" className="w-24 h-24 opacity-30 absolute -right-4 -bottom-4 rotate-12" />
        </div>

        <div className="bg-[#141d33] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/5 bg-slate-950/30 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">All {activeSport} Markets</span>
            <div className="flex gap-4 text-[9px] font-black text-slate-500 uppercase">
              <span className="w-20 text-center">W1</span>
              <span className="w-20 text-center">W2</span>
            </div>
          </div>
          
          <div className="divide-y divide-white/5">
            {matches.filter(m => m.sport === activeSport).map(match => (
              <div key={match.id} className={`flex flex-col md:flex-row items-center p-4 gap-4 transition-colors relative group ${match.marketLocked ? 'opacity-50 grayscale bg-red-900/5' : 'hover:bg-white/5'}`}>
                {match.marketLocked && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <span className="bg-red-600 text-[8px] font-black px-3 py-1 rounded-full uppercase italic animate-pulse shadow-lg">Market Locked</span>
                  </div>
                )}
                
                <div className="flex-1 flex items-center gap-6">
                  <div className="text-center min-w-[50px]">
                    <p className={`text-[8px] font-black uppercase ${match.isLive ? 'text-red-500' : 'text-slate-500'}`}>{match.isLive ? 'LIVE' : match.startTime}</p>
                  </div>
                  <div className="flex-1 flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                      <img src={getTeamIcon(match.teamA)} className="w-8 h-8 object-contain" />
                      <span className="text-[11px] font-black uppercase tracking-tighter w-24 truncate">{match.teamA}</span>
                    </div>
                    <span className="text-slate-800 font-black italic mx-4 text-xs">VS</span>
                    <div className="flex items-center gap-3 text-right">
                      <span className="text-[11px] font-black uppercase tracking-tighter w-24 truncate">{match.teamB}</span>
                      <img src={getTeamIcon(match.teamB)} className="w-8 h-8 object-contain" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    disabled={match.marketLocked}
                    onClick={() => setSelectedBet({matchId: match.id, side: 'W1'})}
                    className={`w-20 h-12 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      selectedBet?.matchId === match.id && selectedBet.side === 'W1'
                      ? 'bg-blue-600 border-blue-400 shadow-lg' 
                      : 'bg-[#0b1223] border-white/5 hover:border-blue-500/30'
                    }`}
                  >
                    <span className="text-[14px] font-black italic">{match.odds.over}</span>
                  </button>
                  <button 
                    disabled={match.marketLocked}
                    onClick={() => setSelectedBet({matchId: match.id, side: 'W2'})}
                    className={`w-20 h-12 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      selectedBet?.matchId === match.id && selectedBet.side === 'W2'
                      ? 'bg-blue-600 border-blue-400 shadow-lg' 
                      : 'bg-[#0b1223] border-white/5 hover:border-blue-500/30'
                    }`}
                  >
                    <span className="text-[14px] font-black italic">{match.odds.under}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🎫 RIGHT SIDEBAR: Bet Slip */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="sticky top-24 bg-[#141d33] rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
          <div className="p-6 bg-slate-950/50 border-b border-white/5">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xl font-black italic uppercase text-white">Bet Slip</h3>
              <span className="bg-blue-600 text-[8px] font-black px-2 py-0.5 rounded uppercase">Single</span>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Instant Settlement Engine</p>
          </div>

          <div className="p-6 flex-1 min-h-[300px]">
            {!selectedBet ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                <i className="fa-solid fa-receipt text-5xl mb-4"></i>
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Pick a selection <br />to start betting</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                <div className="bg-[#0b1223] p-4 rounded-2xl border border-blue-500/20">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[9px] font-black text-blue-500 uppercase">{activeSport}</p>
                    <button onClick={() => setSelectedBet(null)} className="text-slate-600 hover:text-white"><i className="fa-solid fa-circle-xmark"></i></button>
                  </div>
                  <h5 className="text-[12px] font-black text-white uppercase mb-1">
                    {matches.find(m => m.id === selectedBet.matchId)?.teamA} VS {matches.find(m => m.id === selectedBet.matchId)?.teamB}
                  </h5>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Selection: <span className="text-white">{selectedBet.side}</span></p>
                    <span className="text-lg font-black italic text-amber-500">
                      {selectedBet.side === 'W1' 
                        ? matches.find(m => m.id === selectedBet.matchId)?.odds.over 
                        : matches.find(m => m.id === selectedBet.matchId)?.odds.under}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Stake (USDT)</p>
                  <div className="flex items-center bg-[#0b1223] border border-white/5 rounded-2xl p-2">
                    <button onClick={() => setBetAmount(Math.max(1, betAmount - 10))} className="w-10 h-10 text-slate-500">➖</button>
                    <input 
                      type="number" 
                      value={betAmount} 
                      onChange={(e) => setBetAmount(Number(e.target.value))}
                      className="w-full bg-transparent text-center font-black text-xl text-white outline-none" 
                    />
                    <button onClick={() => setBetAmount(betAmount + 10)} className="w-10 h-10 text-slate-500">➕</button>
                  </div>
                </div>

                <div className="p-4 bg-blue-600/5 rounded-2xl border border-blue-600/20 space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                    <span>Possible Win</span>
                    <span className="text-white italic">${(betAmount * (selectedBet.side === 'W1' ? matches.find(m => m.id === selectedBet.matchId)!.odds.over : matches.find(m => m.id === selectedBet.matchId)!.odds.under)).toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handlePlaceBet}
                  disabled={betStatus !== 'IDLE'}
                  className={`w-full py-5 rounded-2xl font-black uppercase italic tracking-[0.2em] shadow-xl transition-all active:scale-95 ${
                    betStatus === 'IDLE' ? 'bg-[#28a745] hover:bg-[#218838] text-white' : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {betStatus === 'PROCESSING' ? 'Establishing Node...' : betStatus === 'SETTLED' ? 'Confirmed!' : 'PLACE BET'}
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-950/80 border-t border-white/5">
             <div className="flex justify-between items-center text-[9px] font-black uppercase">
                <span className="text-slate-500">Wallet</span>
                <span className="text-amber-500 italic">${user.balanceUSDT.toFixed(2)} USDT</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingView;
