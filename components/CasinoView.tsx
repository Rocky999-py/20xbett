
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CASINO_CATEGORIES } from '../constants';
import { Game, User } from '../types';

const PLAYABLE_GAMES: Game[] = [
  { id: 'g1', name: 'Sweet Bonanza', provider: 'Pragmatic', category: 'Slots', img: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&q=80&w=400', demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20sweetbonanza&lang=en&cur=USD&sysName=WEB&jurisdiction=99' },
  { id: 'g3', name: 'Aviator', provider: 'Nexus', category: 'Crash Games', img: 'https://images.unsplash.com/photo-1506012733851-00f4e69b97b1?auto=format&fit=crop&q=80&w=400', demoUrl: 'INTERNAL_CRASH' },
  { id: 'g4', name: 'Roulette Pro', provider: 'Nexus', category: 'Table Games', img: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&q=80&w=400', demoUrl: 'INTERNAL_ROULETTE' },
  { id: 'g5', name: 'Sugar Rush', provider: 'Pragmatic', category: 'Slots', img: 'https://images.unsplash.com/photo-1533910534207-90f31029a78e?auto=format&fit=crop&q=80&w=400', demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20sugarrush&lang=en&cur=USD&sysName=WEB&jurisdiction=99' },
  { id: 'g6', name: 'Live Dealers', provider: 'Evolution', category: 'Live Casino', img: 'https://images.unsplash.com/photo-1518893063132-36e46dbe2428?auto=format&fit=crop&q=80&w=400', demoUrl: 'https://www.evolution.com/our-games/live-blackjack/' }
];

interface GameSimulatorProps {
  user: User;
  onBet: (amount: number, isWin: boolean, multiplier?: number) => void;
}

const RouletteSimulator: React.FC<GameSimulatorProps> = ({ user, onBet }) => {
  const [spinning, setSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([32, 15, 19, 4, 21]);
  const [rotation, setRotation] = useState(0);
  const [bets, setBets] = useState<Record<string, number>>({});
  const [selectedChip, setSelectedChip] = useState(10);
  const numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

  const placeBet = (key: string) => {
    if (spinning || user.balanceUSDT < selectedChip) return;
    setBets(prev => ({ ...prev, [key]: (prev[key] || 0) + selectedChip }));
  };

  const spin = () => {
    const totalBet = Object.values(bets).reduce((a, b) => a + b, 0);
    if (spinning || totalBet === 0 || user.balanceUSDT < totalBet) return;
    
    setSpinning(true);
    setWinningNumber(null);
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const selectedNum = numbers[randomIndex];
    const newRotation = rotation + (10 * 360) + (360 - (randomIndex * (360 / numbers.length)));
    setRotation(newRotation);
    
    setTimeout(() => {
      setSpinning(false);
      setWinningNumber(selectedNum);
      setHistory(prev => [selectedNum, ...prev].slice(0, 10));
      
      const isRedWin = redNumbers.includes(selectedNum) && bets['RED'] > 0;
      const isBlackWin = !redNumbers.includes(selectedNum) && selectedNum !== 0 && bets['BLACK'] > 0;
      const win = isRedWin || isBlackWin;
      
      onBet(totalBet, win, 2);
      setBets({});
    }, 4000);
  };

  const hasInsufficientLiquidity = user.balanceUSDT < selectedChip;

  return (
    <div className="flex flex-col h-full bg-[#020617] text-white overflow-y-auto no-scrollbar font-rajdhani">
      <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-950 border-b border-white/5 gap-4">
        <div className="flex items-center space-x-6 w-full md:w-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Live Node Yield</span>
            <span className="text-2xl font-black text-amber-500 italic">${user.balanceUSDT.toLocaleString()}</span>
          </div>
          <div className="flex space-x-2 overflow-x-auto no-scrollbar max-w-[200px] md:max-w-none">
            {history.map((h, i) => (
              <div key={i} className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-black border border-white/5 ${redNumbers.includes(h) ? 'bg-red-600/20 text-red-500 border-red-500/20' : h === 0 ? 'bg-green-600/20 text-green-500 border-green-500/20' : 'bg-slate-800/20 text-slate-400'}`}>{h}</div>
            ))}
          </div>
        </div>
        <div className="flex space-x-3 bg-black/40 p-2 rounded-2xl border border-white/5">
          {[10, 50, 100, 500].map(v => (
            <button key={v} onClick={() => setSelectedChip(v)} className={`w-12 h-12 rounded-xl font-black text-xs transition-all ${selectedChip === v ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 hover:text-amber-400'}`}>${v}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 gap-10">
        <div className="relative w-full max-w-[320px] md:max-w-[500px] aspect-square transition-transform duration-[4000ms] ease-out flex items-center justify-center" style={{ transform: `rotate(${rotation}deg)` }}>
           <div className="absolute inset-0 rounded-full border-[20px] border-slate-900 bg-[#010409] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden border-t-amber-500/30">
              <div className="text-5xl text-slate-900 font-black opacity-10 tracking-[0.5em] italic">NEXUS ROULETTE</div>
              <div className="absolute inset-0 border-[2px] border-white/5 rounded-full"></div>
           </div>
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-12 bg-white rounded-b-full z-20 shadow-2xl"></div>
        </div>
        
        <div className="w-full max-w-xl grid grid-cols-6 gap-4 bg-[#010409] p-6 rounded-[2.5rem] border border-slate-800 shadow-inner-deep">
          <button onClick={() => placeBet('RED')} className="col-span-3 h-20 bg-red-600/10 border border-red-500/20 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-600/20 transition-all text-red-500">
             RED {bets['RED'] && <span className="block text-white mt-1 italic">${bets['RED']}</span>}
          </button>
          <button onClick={() => placeBet('BLACK')} className="col-span-3 h-20 bg-slate-900 border border-white/5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all text-slate-400">
             BLACK {bets['BLACK'] && <span className="block text-white mt-1 italic">${bets['BLACK']}</span>}
          </button>
          
          <button 
            onClick={spin} 
            disabled={spinning || Object.keys(bets).length === 0 || hasInsufficientLiquidity} 
            className={`col-span-6 h-20 rounded-2xl font-black text-xl uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 border italic ${
              spinning || Object.keys(bets).length === 0 || hasInsufficientLiquidity
              ? 'bg-slate-900 text-slate-700 border-slate-800 grayscale'
              : 'bg-gradient-to-r from-amber-600 to-amber-800 text-white border-amber-500/30'
            }`}
          >
            {spinning ? 'PROCESSING...' : hasInsufficientLiquidity ? 'LIQUIDITY ERROR' : 'INITIALIZE SPIN'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AviatorSimulator: React.FC<GameSimulatorProps> = ({ user, onBet }) => {
  const [multiplier, setMultiplier] = useState(1.0);
  const [status, setStatus] = useState<'IDLE' | 'FLYING' | 'CRASHED'>('IDLE');
  const [betAmount, setBetAmount] = useState(10.0);
  const intervalRef = useRef<number | null>(null);

  const startRound = () => {
    if (status === 'FLYING' || user.balanceUSDT < betAmount) return;
    setStatus('FLYING');
    setMultiplier(1.0);
    const crashAt = 1.1 + Math.random() * 5;
    intervalRef.current = window.setInterval(() => {
      setMultiplier(m => {
        const next = m + 0.02 * (m * 0.5);
        if (next >= crashAt) {
          clearInterval(intervalRef.current!);
          setStatus('CRASHED');
          onBet(betAmount, false, 0);
          return next;
        }
        return next;
      });
    }, 100);
  };

  const cashOut = () => {
    if (status !== 'FLYING') return;
    clearInterval(intervalRef.current!);
    setStatus('IDLE');
    onBet(betAmount, true, multiplier);
  };

  const hasInsufficientLiquidity = user.balanceUSDT < betAmount;

  return (
    <div className="h-full flex flex-col bg-black text-white font-rajdhani overflow-hidden p-6 md:p-12 relative">
      <div className="absolute top-10 left-10 z-10">
         <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.5em] block mb-2">Network Yield</span>
         <span className="text-3xl font-black text-amber-500 italic">${user.balanceUSDT.toLocaleString()}</span>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
        <div className={`text-7xl md:text-[14rem] font-black transition-all duration-300 italic tracking-tighter ${status === 'CRASHED' ? 'text-red-600 animate-pulse scale-90' : 'text-white'}`}>
          {multiplier.toFixed(2)}<span className="text-4xl md:text-6xl">x</span>
        </div>
        {status === 'CRASHED' && <div className="text-red-500 font-black uppercase tracking-[0.5em] text-2xl mt-8 italic animate-bounce">SIGNAL LOST</div>}
      </div>
      
      <div className="bg-[#0a0a0b] p-8 md:p-12 rounded-[3.5rem] border border-white/5 flex flex-col md:flex-row gap-8 items-center shadow-inner-deep">
        <div className="flex items-center space-x-6 bg-black p-5 rounded-3xl border border-white/10 w-full md:w-auto shadow-xl">
          <button onClick={() => setBetAmount(b => Math.max(1, b - 10))} className="text-3xl font-black text-slate-600 hover:text-amber-500 transition-colors">➖</button>
          <span className="text-3xl font-black w-32 text-center italic">${betAmount.toFixed(0)}</span>
          <button onClick={() => setBetAmount(b => b + 10)} className="text-3xl font-black text-slate-600 hover:text-amber-500 transition-colors">➕</button>
        </div>
        
        {status === 'FLYING' ? (
          <button 
            onClick={cashOut}
            className="flex-1 w-full bg-amber-600 hover:bg-amber-500 py-8 rounded-[2.5rem] font-black text-3xl uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all italic border border-amber-400/30"
          >
            CASH OUT
          </button>
        ) : (
          <button 
            onClick={startRound}
            /* Fix: Remove redundant status check as narrowing ensures status is not 'FLYING' in this branch */
            disabled={hasInsufficientLiquidity}
            className={`flex-1 w-full py-8 rounded-[2.5rem] font-black text-3xl uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all italic border ${
              hasInsufficientLiquidity 
              ? 'bg-slate-900 text-slate-700 border-slate-800 grayscale' 
              : 'bg-green-600 hover:bg-green-500 text-white border-green-400/30'
            }`}
          >
            {hasInsufficientLiquidity ? 'INSUFFICIENT' : 'PLACE BET'}
          </button>
        )}
      </div>
    </div>
  );
};

interface CasinoViewProps {
  user: User;
  onBet: (amount: number, isWin: boolean, multiplier?: number) => void;
}

const CasinoView: React.FC<CasinoViewProps> = ({ user, onBet }) => {
  const [activeCategory, setActiveCategory] = useState('Slots');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  return (
    <div className="space-y-6 md:space-y-12 animate-in fade-in duration-700 h-full pb-20">
      {selectedGame && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-0 md:p-10">
          <div className="relative w-full h-full bg-[#020617] overflow-hidden md:rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            <button 
              onClick={() => setSelectedGame(null)} 
              className="absolute top-8 right-8 z-[210] bg-red-600 hover:bg-red-500 text-white w-14 h-14 rounded-2xl font-black flex items-center justify-center shadow-2xl transition-all active:scale-90"
            >
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
            {selectedGame.demoUrl === 'INTERNAL_CRASH' ? (
              <AviatorSimulator user={user} onBet={onBet} />
            ) : selectedGame.demoUrl === 'INTERNAL_ROULETTE' ? (
              <RouletteSimulator user={user} onBet={onBet} />
            ) : (
              <iframe src={selectedGame.demoUrl} className="w-full h-full border-none" />
            )}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-[#1e1b4b] via-[#020617] to-[#0f172a] p-10 md:p-16 rounded-[3.5rem] border border-purple-500/20 shadow-2xl relative overflow-hidden group shadow-inner-deep">
        <div className="absolute top-0 right-0 p-12 text-[15rem] text-purple-500/5 font-black italic tracking-tighter group-hover:scale-110 transition-transform">CASINO</div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-7xl font-rajdhani font-black text-white mb-6 uppercase italic tracking-widest">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">NEXUS</span> LOBBY
          </h2>
          <p className="text-slate-500 text-sm md:text-xl max-w-2xl font-rajdhani font-black uppercase tracking-[0.3em]">Premium crypto gaming engine with real-time USDT payout synchronization.</p>
        </div>
      </div>

      <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
        {CASINO_CATEGORIES.map(cat => (
          <button 
            key={cat.name} onClick={() => setActiveCategory(cat.name)}
            className={`whitespace-nowrap px-8 py-4 rounded-2xl font-black border transition-all font-rajdhani uppercase tracking-widest flex items-center space-x-3 ${activeCategory === cat.name ? 'bg-purple-600 border-purple-400 text-white shadow-xl shadow-purple-900/40' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-purple-400 hover-gold-gradient'}`}
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-xs">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
        {PLAYABLE_GAMES.filter(g => g.category === activeCategory || activeCategory === 'Slots').map(game => (
          <div 
            key={game.id} 
            onClick={() => setSelectedGame(game)} 
            className="group bg-[#010409] rounded-[2.5rem] border border-slate-800 overflow-hidden cursor-pointer hover:border-purple-500/50 transition-all shadow-xl hover:-translate-y-2 duration-500"
          >
            <div className="aspect-[4/5] bg-slate-800 relative overflow-hidden">
               <img src={game.img} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt={game.name} />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform">
                     <i className="fa-solid fa-play text-white text-xl"></i>
                  </div>
               </div>
            </div>
            <div className="p-6">
              <span className="text-[9px] font-black text-purple-500 uppercase tracking-[0.4em] font-rajdhani">{game.provider}</span>
              <h4 className="text-sm font-black truncate text-slate-100 uppercase mt-2 font-rajdhani tracking-wider">{game.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasinoView;
