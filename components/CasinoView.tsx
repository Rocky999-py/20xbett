
import React, { useState, useEffect, useRef } from 'react';
import { CASINO_CATEGORIES } from '../constants.tsx';
import { Game, User, Language } from '../types.ts';

const PLAYABLE_GAMES: Game[] = [
  { id: 'g1', name: 'Sweet Bonanza', provider: 'Pragmatic', category: 'Slots', img: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&q=80&w=400', demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20sweetbonanza&lang=en&cur=USD&sysName=WEB&jurisdiction=99' },
  { id: 'g3', name: 'Aviator Pro', provider: 'Spribe', category: 'Crash Games', img: 'https://images.unsplash.com/photo-1506012733851-00f4e69b97b1?auto=format&fit=crop&q=80&w=400', demoUrl: 'INTERNAL_AVIATOR' },
  { id: 'g4', name: 'Roulette Royale', provider: 'Evolution', category: 'Table Games', img: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&q=80&w=400', demoUrl: 'INTERNAL_ROULETTE' },
  { id: 'g5', name: 'Gates of Olympus', provider: 'Pragmatic', category: 'Slots', img: 'https://images.unsplash.com/photo-1533910534207-90f31029a78e?auto=format&fit=crop&q=80&w=400', demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympus&lang=en&cur=USD&sysName=WEB&jurisdiction=99' },
  { id: 'g6', name: 'Lightning Blackjack', provider: 'Evolution', category: 'Live Casino', img: 'https://images.unsplash.com/photo-1518893063132-36e46dbe2428?auto=format&fit=crop&q=80&w=400', demoUrl: 'https://www.evolution.com/our-games/live-blackjack/' },
  { id: 'g7', name: 'Big Bass Bonanza', provider: 'Pragmatic', category: 'Slots', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400', demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs10bbbonanza&lang=en&cur=USD&sysName=WEB&jurisdiction=99' },
  { id: 'g8', name: 'Dog House Megaways', provider: 'Pragmatic', category: 'Slots', img: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=400', demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vswaysdoghouse&lang=en&cur=USD&sysName=WEB&jurisdiction=99' },
  { id: 'g9', name: 'Crazy Time', provider: 'Evolution', category: 'Live Casino', img: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&q=80&w=400', demoUrl: 'https://www.evolution.com/our-games/crazy-time/' }
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

  return (
    <div className="flex flex-col h-full bg-[#020617] text-white overflow-y-auto no-scrollbar font-rajdhani">
      <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-950 border-b border-white/5 gap-4">
        <div className="flex items-center space-x-6 w-full md:w-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Live Node Yield</span>
            <span className="text-2xl font-black text-amber-500 italic">${user.balanceUSDT.toLocaleString()}</span>
          </div>
          <div className="flex space-x-2 overflow-x-auto no-scrollbar">
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
            disabled={spinning || Object.keys(bets).length === 0} 
            className={`col-span-6 h-20 rounded-2xl font-black text-xl uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 border italic ${
              spinning || Object.keys(bets).length === 0
              ? 'bg-slate-900 text-slate-700 border-slate-800 grayscale'
              : 'bg-gradient-to-r from-amber-600 to-amber-800 text-white border-amber-500/30'
            }`}
          >
            {spinning ? 'PROCESSING...' : 'INITIALIZE SPIN'}
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
  
  // Visual position state
  const [planePos, setPlanePos] = useState({ x: 0, y: 100 });
  const [path, setPath] = useState<string>('M 0 100');

  const startRound = () => {
    if (status === 'FLYING' || user.balanceUSDT < betAmount) return;
    setStatus('FLYING');
    setMultiplier(1.0);
    setPlanePos({ x: 0, y: 100 });
    setPath('M 0 100');

    const crashAt = 1.1 + Math.random() * 8; // Longer potential flights for better visual
    
    intervalRef.current = window.setInterval(() => {
      setMultiplier(m => {
        const next = m + 0.02 * (m * 0.45);
        
        // Update visual position (rightward and upward)
        const progress = Math.min(95, (next - 1) * 20); // 0 to 95 for rightward sweep
        const vertical = Math.min(90, Math.pow(progress / 8, 1.9)); // Curved upward sweep
        
        const newX = progress;
        const newY = 100 - vertical;
        
        setPlanePos({ x: newX, y: newY });
        setPath(prev => `${prev} L ${newX} ${newY}`);

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

  return (
    <div className="h-full flex flex-col bg-[#050505] text-white font-rajdhani overflow-hidden relative">
      <div className="absolute top-6 left-10 z-20 flex flex-col">
         <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.5em] block mb-1">Network Yield</span>
         <span className="text-3xl font-black text-amber-500 italic">${user.balanceUSDT.toLocaleString()}</span>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-4">
        {/* Game Arena Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="cyber-grid w-full h-full"></div>
        </div>

        {/* Flight Canvas Area */}
        <div className="relative w-full h-[80%] md:h-[70%] max-w-5xl bg-slate-900/10 rounded-[4rem] border border-white/5 overflow-hidden shadow-inner-deep">
           {/* Trailing Shadow Curve / Glow Trail */}
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
             <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="trailGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
             </defs>
             {/* Main Path Trail */}
             <path 
               d={path} 
               fill="none" 
               stroke="url(#trailGradient)" 
               strokeWidth="0.8" 
               strokeLinecap="round"
               filter="url(#glow)"
               className="transition-all duration-100 ease-linear"
             />
             {/* Secondary Shadow Curve (Deeper) */}
             <path 
               d={path} 
               fill="none" 
               stroke="#ef4444" 
               strokeWidth="2" 
               strokeLinecap="round"
               opacity="0.1"
               className="transition-all duration-100 ease-linear"
             />
           </svg>

           {/* The Helicopter (3x Scale) */}
           <div 
             className="absolute transition-all duration-100 ease-linear z-10"
             style={{ 
               left: `${planePos.x}%`, 
               top: `${planePos.y}%`,
               transform: `translate(-50%, -50%) ${status === 'CRASHED' ? 'scale(0) rotate(90deg)' : 'scale(1)'}` 
             }}
           >
             <div className="relative">
               {/* Large Helicopter Icon (3x Scale) */}
               <div className="text-[120px] md:text-[180px] filter drop-shadow-[0_0_30px_#ef4444] leading-none select-none">
                 <i className={`fa-solid fa-helicopter text-red-500 transform transition-transform duration-300 ${status === 'FLYING' ? '-rotate-12' : ''}`}></i>
               </div>
               
               {/* Dynamic Exhaust Glow */}
               {status === 'FLYING' && (
                 <div className="absolute top-[60%] right-[10%] -translate-y-1/2">
                    <div className="w-20 h-4 md:w-32 md:h-6 bg-gradient-to-l from-red-600 via-orange-500/40 to-transparent blur-md animate-pulse rounded-full transform rotate-[15deg]"></div>
                 </div>
               )}
               
               {/* Rotor Blur Effect */}
               {status === 'FLYING' && (
                 <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[80%] h-4 md:h-6 bg-white/10 blur-sm rounded-full animate-spin [animation-duration:0.1s]"></div>
               )}
             </div>
           </div>

           {/* Multiplier Display - Centered but Large */}
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-0">
              <div className={`text-[8rem] md:text-[15rem] font-rajdhani font-black italic tracking-tighter drop-shadow-[0_0_40px_rgba(0,0,0,0.8)] transition-all duration-300 ${status === 'CRASHED' ? 'text-red-700 scale-90 blur-sm' : 'text-white'}`}>
                {multiplier.toFixed(2)}<span className="text-4xl md:text-6xl">x</span>
              </div>
              {status === 'CRASHED' && (
                <div className="mt-4 px-12 py-4 bg-red-600/20 border border-red-500/40 rounded-full backdrop-blur-md">
                  <span className="text-red-500 font-black uppercase tracking-[0.5em] text-xl md:text-3xl animate-pulse italic">FLEW AWAY!</span>
                </div>
              )}
           </div>

           {/* Arena Info Overlays */}
           <div className="absolute bottom-10 left-10 pointer-events-none">
              <span className="text-[10px] text-slate-700 font-black uppercase tracking-[0.8em] font-rajdhani">Automated Settlement Engaged</span>
           </div>
        </div>
      </div>
      
      {/* Betting Controls */}
      <div className="p-8 md:p-12 bg-[#0a0a0b] border-t border-white/5 flex flex-col md:flex-row gap-8 items-center shadow-inner-deep shrink-0 z-30">
        <div className="flex items-center space-x-8 bg-black p-6 rounded-[2rem] border border-white/10 w-full md:w-auto shadow-2xl">
          <button onClick={() => setBetAmount(b => Math.max(1, b - 10))} className="text-3xl font-black text-slate-600 hover:text-amber-500 transition-colors">➖</button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-700 font-black uppercase tracking-widest mb-1">Stake</span>
            <span className="text-3xl font-black w-28 text-center italic text-white">${betAmount.toFixed(0)}</span>
          </div>
          <button onClick={() => setBetAmount(b => b + 10)} className="text-3xl font-black text-slate-600 hover:text-amber-500 transition-colors">➕</button>
        </div>
        
        {status === 'FLYING' ? (
          <button 
            onClick={cashOut}
            className="flex-1 w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 py-8 rounded-[2rem] font-black text-3xl uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(245,158,11,0.4)] active:scale-95 transition-all italic border-t border-amber-400/50"
          >
            CASH OUT
          </button>
        ) : (
          <button 
            onClick={startRound}
            disabled={user.balanceUSDT < betAmount}
            className={`flex-1 w-full py-8 rounded-[2rem] font-black text-3xl uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all italic border-t ${
              user.balanceUSDT < betAmount 
              ? 'bg-slate-900 text-slate-700 border-slate-800 grayscale cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-500 text-white border-green-400/50 shadow-[0_0_50px_rgba(34,197,94,0.3)]'
            }`}
          >
            {user.balanceUSDT < betAmount ? 'LOW FUNDS' : 'BET'}
          </button>
        )}
      </div>
    </div>
  );
};

interface CasinoViewProps {
  user: User;
  onBet: (amount: number, isWin: boolean, multiplier?: number) => void;
  lang: Language;
}

const CasinoView: React.FC<CasinoViewProps> = ({ user, onBet, lang }) => {
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
            {selectedGame.demoUrl === 'INTERNAL_AVIATOR' ? (
              <AviatorSimulator user={user} onBet={onBet} />
            ) : selectedGame.demoUrl === 'INTERNAL_ROULETTE' ? (
              <RouletteSimulator user={user} onBet={onBet} />
            ) : (
              <iframe 
                src={selectedGame.demoUrl} 
                className="w-full h-full border-none bg-black" 
                allow="autoplay; encrypted-media; fullscreen"
                title={selectedGame.name}
              />
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
        {PLAYABLE_GAMES.filter(g => activeCategory === 'Slots' || g.category === activeCategory).map(game => (
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
               <div className="absolute top-4 left-4">
                  <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black text-slate-300 uppercase tracking-widest border border-white/5">{game.provider}</span>
               </div>
            </div>
            <div className="p-6">
              <h4 className="text-sm font-black truncate text-slate-100 uppercase font-rajdhani tracking-wider">{game.name}</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{game.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasinoView;
