
import React, { useState, useEffect, useCallback } from 'react';
import { User, Match, Language } from '../types';
import { SPORTS } from '../constants';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";
import { SportsAPI } from '../api.ts';

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
  const normalized = team.toLowerCase();
  const mapping: Record<string, string> = {
    'india': 'in', 'pakistan': 'pk', 'australia': 'au', 'england': 'gb',
    'south africa': 'za', 'new zealand': 'nz', 'west indies': 'vg',
    'sri lanka': 'lk', 'bangladesh': 'bd', 'afghanistan': 'af',
    'ireland': 'ie', 'zimbabwe': 'zw', 'netherlands': 'nl',
    'scotland': 'gb-sct', 'usa': 'us', 'nepal': 'np', 'oman': 'om',
    'namibia': 'na', 'uae': 'ae', 'canada': 'ca', 'man city': 'gb-eng',
    'liverpool': 'gb-eng', 'real madrid': 'es', 'barcelona': 'es',
    'france': 'fr', 'argentina': 'ar', 'brazil': 'br', 'germany': 'de'
  };

  for (const [key, code] of Object.entries(mapping)) {
    if (normalized.includes(key)) return `https://flagcdn.com/w160/${code}.png`;
  }
  return 'https://img.icons8.com/color/96/trophy.png';
};

const DEFAULT_MATCHES: Match[] = [
  { id: 'm1', sport: 'Cricket', teamA: 'India', teamB: 'Australia', startTime: 'LIVE', isLive: true, odds: { over: 1.85, under: 1.95, line: 1 }, marketLocked: false },
  { id: 'm2', sport: 'Football', teamA: 'Man City', teamB: 'Liverpool', startTime: 'LIVE', isLive: true, odds: { over: 2.10, under: 1.70, line: 1 }, marketLocked: false },
];

interface BettingViewProps {
  user: User;
  onBet: (amount: number, isWin: boolean, multiplier?: number) => void;
  lang: Language;
}

const BettingView: React.FC<BettingViewProps> = ({ user, onBet, lang }) => {
  const t = (key: string) => translations[lang][key] || key;
  const [activeSport, setActiveSport] = useState('Cricket');
  const [matches, setMatches] = useState<Match[]>(DEFAULT_MATCHES);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState<{matchId: string, side: 'W1' | 'W2'} | null>(null);
  const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);
  const [betStatus, setBetStatus] = useState<'IDLE' | 'PROCESSING' | 'SETTLED'>('IDLE');
  const [isSyncing, setIsSyncing] = useState(false);
  const [dataSource, setDataSource] = useState<'MOCK' | 'AI' | 'REAL_TIME'>('MOCK');

  const syncRealTimeData = useCallback(async () => {
    setIsSyncing(true);
    try {
      // 1. Try Real-Time External API first
      const externalData = await SportsAPI.fetchLiveCricket();
      if (externalData && externalData.length > 0) {
        setMatches(prev => {
          const nonCricket = prev.filter(m => m.sport !== 'Cricket');
          return [...externalData, ...nonCricket];
        });
        setDataSource('REAL_TIME');
        setIsSyncing(false);
        return;
      }

      // 2. Fallback to Gemini AI if API Key is missing or failed
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `
        List current live, recent (finished today), and upcoming international or major league cricket matches (IPL, BBL, PSL, etc.).
        Include the following JSON structure for each match:
        {
          "id": "unique_string",
          "sport": "Cricket",
          "teamA": "Team Name",
          "teamB": "Team Name",
          "startTime": "Status or Start Time (e.g., 8:00 PM or LIVE 20.4 Ov)",
          "isLive": boolean,
          "odds": { "over": number_multiplier, "under": number_multiplier, "line": 1 }
        }
        Provide at least 6 matches. Return ONLY the raw JSON array.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        },
      });

      const text = response.text || "[]";
      const cleanJson = text.replace(/```json|```/g, "").trim();
      const newMatches: Match[] = JSON.parse(cleanJson);
      
      if (newMatches && Array.isArray(newMatches)) {
        setMatches(prev => {
          const nonCricket = prev.filter(m => m.sport !== 'Cricket');
          return [...newMatches, ...nonCricket];
        });
        setDataSource('AI');
      }
    } catch (error) {
      console.error("Failed to sync live data:", error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prev => prev.map(m => {
        if (!m.isLive) return m;
        const shouldLock = Math.random() > 0.99; // Slightly rarer locking
        const change = (Math.random() - 0.5) * 0.08;
        return {
          ...m, 
          marketLocked: shouldLock ? true : (m.marketLocked && Math.random() > 0.4 ? true : false),
          odds: { 
            ...m.odds, 
            over: Number(Math.max(1.01, m.odds.over + change).toFixed(2)), 
            under: Number(Math.max(1.01, m.odds.under - change).toFixed(2)) 
          }
        };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    syncRealTimeData();
  }, [syncRealTimeData]);

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
      <div className="w-full lg:w-64 flex flex-col gap-4 shrink-0">
        <div className="bg-[#141d33] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-4 bg-blue-600/10 border-b border-white/5 flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 italic">Top Sports</h4>
            {isSyncing && <i className="fa-solid fa-circle-notch animate-spin text-blue-500"></i>}
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
              </button>
            ))}
          </div>
        </div>

        {/* Sync Info */}
        <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 text-center">
           <p className="text-[8px] text-slate-500 font-black uppercase mb-2">Node Connection Source</p>
           <div className={`text-[10px] font-black px-3 py-1.5 rounded-lg border uppercase italic ${
             dataSource === 'REAL_TIME' ? 'bg-green-600/10 border-green-500/30 text-green-400' : 
             dataSource === 'AI' ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' : 'bg-slate-800 border-white/5 text-slate-500'
           }`}>
             {dataSource === 'REAL_TIME' ? 'Direct API Link' : dataSource === 'AI' ? 'Gemini AI Sync' : 'Mock Data'}
           </div>
        </div>

        <button 
          onClick={syncRealTimeData}
          disabled={isSyncing}
          className="w-full py-4 bg-slate-900 hover:bg-slate-800 rounded-2xl border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95"
        >
          <i className={`fa-solid fa-rotate ${isSyncing ? 'animate-spin' : ''}`}></i>
          {isSyncing ? 'Syncing Radar...' : 'Update Live Data'}
        </button>
      </div>

      {/* 🏟️ CENTER: Markets Area */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-900 rounded-[2.5rem] p-8 flex items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black italic uppercase leading-none mb-2">{activeSport.toUpperCase()} RADAR</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 italic">Real-Time Match Nodes Established</p>
          </div>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-20 text-8xl">
            {SPORTS.find(s => s.name === activeSport)?.icon || '🏏'}
          </div>
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
            {matches.filter(m => m.sport === activeSport).length === 0 ? (
               <div className="p-20 text-center opacity-30 flex flex-col items-center">
                 <i className="fa-solid fa-satellite-dish text-6xl mb-4"></i>
                 <p className="text-xs font-black uppercase tracking-widest">No active markets for {activeSport}</p>
                 <button onClick={syncRealTimeData} className="mt-4 text-blue-500 font-bold hover:underline">Sync Now</button>
               </div>
            ) : (
              matches.filter(m => m.sport === activeSport).map(match => (
                <div key={match.id} className={`flex flex-col md:flex-row items-center p-4 gap-4 transition-colors relative group ${match.marketLocked ? 'opacity-50 grayscale bg-red-900/5' : 'hover:bg-white/5'}`}>
                  {match.marketLocked && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                      <span className="bg-red-600 text-[8px] font-black px-3 py-1 rounded-full uppercase italic animate-pulse shadow-lg">Market Locked</span>
                    </div>
                  )}
                  
                  <div className="flex-1 flex items-center gap-6">
                    <div className="text-center min-w-[70px]">
                      <p className={`text-[8px] font-black uppercase ${match.isLive ? 'text-red-500' : 'text-slate-500'}`}>{match.isLive ? 'LIVE' : match.startTime}</p>
                    </div>
                    <div className="flex-1 flex items-center justify-between px-4">
                      <div className="flex items-center gap-3">
                        <img src={getTeamIcon(match.teamA)} className="w-8 h-8 rounded-full object-cover bg-slate-800" />
                        <span className="text-[11px] font-black uppercase tracking-tighter w-24 truncate">{match.teamA}</span>
                      </div>
                      <span className="text-slate-800 font-black italic mx-4 text-xs">VS</span>
                      <div className="flex items-center gap-3 text-right">
                        <span className="text-[11px] font-black uppercase tracking-tighter w-24 truncate">{match.teamB}</span>
                        <img src={getTeamIcon(match.teamB)} className="w-8 h-8 rounded-full object-cover bg-slate-800" />
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
              ))
            )}
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
                  <div className="flex justify-between items-center ml-2">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Stake (USDT)</p>
                    <span className="text-[8px] text-slate-600 font-black">Min: $10</span>
                  </div>
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
                    <span className="text-white italic">${(betAmount * (selectedBet.side === 'W1' ? (matches.find(m => m.id === selectedBet.matchId)?.odds.over || 1) : (matches.find(m => m.id === selectedBet.matchId)?.odds.under || 1))).toFixed(2)}</span>
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
