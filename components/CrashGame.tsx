
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User } from '../types';

interface CrashGameProps {
  user: User;
  onBet: (amount: number, isWin: boolean, multiplier?: number) => void;
}

interface ActiveBet {
  amount: number;
  cashedOut: boolean;
  multiplier: number;
  placed: boolean;
}

interface MockBet {
  user: string;
  amount: number;
  multiplier: number | null;
  win: number | null;
}

const CrashGame: React.FC<CrashGameProps> = ({ user, onBet }) => {
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameState, setGameState] = useState<'IDLE' | 'FLYING' | 'CRASHED'>('IDLE');
  const [history, setHistory] = useState<number[]>([1.61, 4.32, 19.66, 2.73, 15.44, 1.66, 2.37, 1.42, 1.89, 1.00]);
  
  const [bet1, setBet1] = useState<ActiveBet>({ amount: 1.0, cashedOut: false, multiplier: 0, placed: false });
  const [bet2, setBet2] = useState<ActiveBet>({ amount: 1.0, cashedOut: false, multiplier: 0, placed: false });
  
  const timerRef = useRef<number | null>(null);
  const crashPointRef = useRef<number>(2.0);

  const mockBets = useMemo<MockBet[]>(() => [
    { user: 'd***3', amount: 100.00, multiplier: 2.00, win: 200.00 },
    { user: 'm***9', amount: 100.00, multiplier: 1.31, win: 131.00 },
    { user: 'k***2', amount: 100.00, multiplier: null, win: null },
    { user: 'x***0', amount: 100.00, multiplier: 2.37, win: 237.00 },
    { user: 'p***5', amount: 100.00, multiplier: 1.65, win: 165.00 },
    { user: 'a***1', amount: 100.00, multiplier: null, win: null },
    { user: 's***8', amount: 100.00, multiplier: 5.30, win: 530.00 },
  ], [gameState]);

  const startGame = () => {
    if (gameState === 'FLYING') return;
    const totalRequired = (bet1.placed ? bet1.amount : 0) + (bet2.placed ? bet2.amount : 0);
    if (totalRequired > user.balanceUSDT) {
      alert("Insufficient Balance!");
      return;
    }

    const crashAt = 1 + Math.random() * (Math.random() < 0.1 ? 15 : 4);
    crashPointRef.current = crashAt;
    setMultiplier(1.0);
    setGameState('FLYING');

    timerRef.current = window.setInterval(() => {
      setMultiplier(prev => {
        const next = prev + 0.006 * Math.pow(prev, 1.15);
        if (next >= crashPointRef.current) {
          clearInterval(timerRef.current!);
          handleCrash();
          return Number(crashPointRef.current.toFixed(2));
        }
        return Number(next.toFixed(2));
      });
    }, 50);
  };

  const handleCrash = () => {
    setGameState('CRASHED');
    setHistory(h => [Number(crashPointRef.current.toFixed(2)), ...h].slice(0, 15));
    if (bet1.placed && !bet1.cashedOut) onBet(bet1.amount, false);
    if (bet2.placed && !bet2.cashedOut) onBet(bet2.amount, false);

    setTimeout(() => {
      setGameState('IDLE');
      setBet1(prev => ({ ...prev, placed: false, cashedOut: false }));
      setBet2(prev => ({ ...prev, placed: false, cashedOut: false }));
    }, 3000);
  };

  const handleCashOut = (betNum: 1 | 2) => {
    const bet = betNum === 1 ? bet1 : bet2;
    if (gameState !== 'FLYING' || bet.cashedOut || !bet.placed) return;
    const winMultiplier = multiplier;
    if (betNum === 1) setBet1(prev => ({ ...prev, cashedOut: true, multiplier: winMultiplier }));
    else setBet2(prev => ({ ...prev, cashedOut: true, multiplier: winMultiplier }));
    onBet(bet.amount, true, winMultiplier);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const getPathData = () => {
    // Parabolic progression for visual curve
    const progress = Math.min((multiplier - 1) / 10, 0.95); // Scale based on mult but cap it
    const width = 1000;
    const height = 500;
    
    // x follows multiplier linearly, y follows quadratically
    const targetX = 50 + (progress * 850);
    const targetY = height - 50 - (Math.pow(progress, 1.8) * 400);
    
    // Control point for Bezier curve (creates the "bend")
    const ctrlX = targetX * 0.4;
    const ctrlY = height - 50;

    return { x: targetX, y: targetY, cx: ctrlX, cy: ctrlY };
  };

  const p = getPathData();
  const rotation = Math.max(-45, -20 * ((multiplier - 1) / 5)); // Bank aircraft as it climbs

  return (
    <div className="w-full h-full flex bg-[#0d0d0d] font-rajdhani text-white overflow-hidden">
      
      {/* 📊 LEFT SIDEBAR */}
      <div className="hidden lg:flex w-72 flex-col bg-[#141516] border-r border-white/5">
        <div className="flex p-3 gap-1 bg-[#1b1c1d]">
          <button className="flex-1 bg-[#2c2d2f] py-1 rounded-md text-[9px] font-black uppercase">All Bets</button>
          <button className="flex-1 text-slate-500 py-1 text-[9px] font-black uppercase">My Bets</button>
          <button className="flex-1 text-slate-500 py-1 text-[9px] font-black uppercase">Top</button>
        </div>
        <div className="flex justify-between px-4 py-2 text-[8px] text-slate-500 font-black uppercase border-b border-white/5">
          <span>User</span>
          <span>Bet, USD</span>
          <span>Cash out, USD</span>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar bg-[#111213]">
          {mockBets.map((mb, i) => (
            <div key={i} className={`flex items-center justify-between px-3 py-1.5 border-b border-white/5 ${mb.win ? 'bg-green-500/5' : ''}`}>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[8px]">👤</div>
                <span className="text-[9px] text-slate-400 font-bold">{mb.user}</span>
              </div>
              <span className="text-[9px] font-black text-slate-300">{mb.amount.toFixed(2)}</span>
              <div className="flex items-center gap-2 min-w-[70px] justify-end">
                {mb.multiplier && <span className="text-[8px] font-black text-purple-400 bg-purple-400/10 px-1 rounded">{mb.multiplier.toFixed(2)}x</span>}
                <span className="text-[9px] font-black text-green-500">{mb.win ? mb.win.toFixed(2) : ''}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🚀 MAIN GAME */}
      <div className="flex-1 flex flex-col">
        
        {/* History Bar */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-2 px-4 bg-[#141516] items-center">
          {history.map((h, i) => (
            <span key={i} className={`px-2 py-0.5 rounded-full text-[9px] font-black whitespace-nowrap ${h > 10 ? 'bg-[#913ef8]' : h > 2 ? 'bg-[#4361ee]' : 'bg-[#1b1c1d] border border-white/10'} text-white`}>
              {h.toFixed(2)}x
            </span>
          ))}
          <button className="ml-auto text-slate-500 text-xs"><i className="fa-solid fa-clock-rotate-left"></i></button>
        </div>

        {/* Canvas Area */}
        <div className="relative flex-1 bg-gradient-to-b from-[#141516] via-[#0d0d0d] to-[#010101] overflow-hidden flex items-center justify-center">
          
          <div className="absolute top-0 left-0 right-0 h-8 bg-[#f2a900] flex items-center justify-center z-10 shadow-lg">
            <span className="text-black text-[10px] font-black uppercase tracking-widest italic">Fun Mode</span>
          </div>

          {/* Grid Background */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

          {/* Large Multiplier */}
          <div className="relative z-20 text-center select-none">
            <h1 className={`text-8xl md:text-[10rem] font-black italic transition-all duration-100 ${gameState === 'CRASHED' ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {multiplier.toFixed(2)}x
            </h1>
            {gameState === 'CRASHED' && <p className="text-red-500 text-xl font-black uppercase tracking-[0.5em] mt-2 animate-bounce">FLEW AWAY!</p>}
          </div>

          {/* Flight SVG with Trail and Large Helicopter */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <defs>
              <linearGradient id="trailGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0)" />
                <stop offset="100%" stopColor="rgba(239, 68, 68, 0.4)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {gameState === 'FLYING' && (
              <>
                {/* Running Movement Shadow (Fill) */}
                <path 
                  d={`M 50 450 Q ${p.cx} 450 ${p.x} ${p.y} L ${p.x} 450 Z`} 
                  fill="url(#trailGradient)" 
                  className="transition-all duration-100"
                />

                {/* Main Curve Line */}
                <path 
                  d={`M 50 450 Q ${p.cx} 450 ${p.x} ${p.y}`} 
                  stroke="#ef4444" 
                  strokeWidth="5" 
                  fill="none" 
                  filter="url(#glow)"
                  className="transition-all duration-100"
                />

                {/* 3X BIGGER HELICOPTER */}
                <g transform={`translate(${p.x}, ${p.y}) rotate(${rotation}) scale(3)`} className="transition-all duration-100">
                  {/* Helicopter Body */}
                  <path d="M-10,0 L10,0 L12,2 L-8,2 Z" fill="#ef4444" filter="url(#glow)" />
                  <path d="M-5,-2 L8,-2 L10,0 L-7,0 Z" fill="#b91c1c" />
                  {/* Main Rotor */}
                  <rect x="-12" y="-4" width="24" height="0.5" fill="white" className="animate-pulse">
                     <animateTransform attributeName="transform" type="scale" values="1 1; 0.1 1; 1 1" dur="0.1s" repeatCount="indefinite" />
                  </rect>
                  {/* Tail */}
                  <path d="M-10,0 L-15,-4 L-14,-5 L-9,-1 Z" fill="#ef4444" />
                  {/* Cockpit */}
                  <path d="M5,-1 L9,-1 L11,2 L7,2 Z" fill="rgba(255,255,255,0.6)" />
                  
                  {/* Dynamic Motion Lines */}
                  <line x1="-15" y1="2" x2="-25" y2="2" stroke="white" strokeWidth="0.5" opacity="0.6">
                     <animate attributeName="x2" values="-20;-40" dur="0.2s" repeatCount="indefinite" />
                  </line>
                </g>
              </>
            )}
          </svg>
          
          {gameState === 'IDLE' && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-30">
               <div className="w-20 h-20 border-4 border-white/10 border-t-red-500 rounded-full animate-spin mb-4"></div>
               <p className="font-black uppercase tracking-[0.3em] text-white animate-pulse">Waiting for next round...</p>
            </div>
          )}
        </div>

        {/* 🎮 BETTING PANEL */}
        <div className="bg-[#141516] p-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5">
          {[1, 2].map((num) => {
            const currentBet = num === 1 ? bet1 : bet2;
            const setBet = num === 1 ? setBet1 : setBet2;

            return (
              <div key={num} className="bg-[#1b1c1d] rounded-xl p-4 flex gap-4 items-center border border-white/5 relative">
                <div className="flex flex-col gap-2 flex-1">
                   <div className="flex gap-1">
                      <button className="px-3 py-1 bg-[#2c2d2f] text-[9px] font-black uppercase rounded">Bet</button>
                      <button className="px-3 py-1 text-slate-500 text-[9px] font-black uppercase">Auto</button>
                   </div>
                   <div className="flex items-center bg-[#0d0d0d] rounded-lg border border-white/10 px-3 py-2">
                      <button onClick={() => setBet(p => ({...p, amount: Math.max(1, p.amount - 1)}))} className="text-slate-500">➖</button>
                      <input 
                        type="number" 
                        value={currentBet.amount} 
                        onChange={(e) => setBet(p => ({...p, amount: Number(e.target.value)}))}
                        className="w-full bg-transparent text-center font-black text-xl outline-none" 
                      />
                      <button onClick={() => setBet(p => ({...p, amount: p.amount + 1}))} className="text-slate-500">➕</button>
                   </div>
                   <div className="grid grid-cols-4 gap-1">
                      {[1, 2, 5, 10].map(amt => (
                        <button key={amt} onClick={() => setBet(p => ({...p, amount: amt}))} className="bg-[#2c2d2f] py-1 rounded text-[9px] font-bold hover:bg-slate-700 transition-colors">{amt}</button>
                      ))}
                   </div>
                </div>

                <div className="w-40 h-24">
                  {gameState === 'FLYING' && currentBet.placed && !currentBet.cashedOut ? (
                    <button 
                      onClick={() => handleCashOut(num as 1 | 2)}
                      className="w-full h-full bg-gradient-to-b from-[#f2a900] to-[#d99700] rounded-xl flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-black/80">Cash Out</span>
                      <span className="text-xl font-black italic text-black">{(currentBet.amount * multiplier).toFixed(2)} USD</span>
                    </button>
                  ) : currentBet.cashedOut ? (
                    <div className="w-full h-full bg-[#28a745]/10 border border-[#28a745]/30 rounded-xl flex flex-col items-center justify-center">
                       <span className="text-[10px] font-black text-[#28a745] uppercase">Success</span>
                       <span className="text-xl font-black italic">{currentBet.multiplier.toFixed(2)}x</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setBet(p => ({...p, placed: !p.placed}));
                        if (gameState === 'IDLE' && !currentBet.placed) startGame();
                      }}
                      className={`w-full h-full rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 shadow-xl ${
                        currentBet.placed ? 'bg-red-600/20 border border-red-500/40 text-red-500' : 'bg-[#28a745] hover:bg-[#218838] text-white'
                      }`}
                    >
                      <span className="text-2xl font-black italic tracking-tighter uppercase">{currentBet.placed ? 'CANCEL' : 'BET'}</span>
                      <span className="text-[10px] font-black opacity-80">{currentBet.amount.toFixed(2)} USD</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CrashGame;
