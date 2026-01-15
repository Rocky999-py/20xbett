
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
  
  const [bet1, setBet1] = useState<ActiveBet>({ amount: 10.0, cashedOut: false, multiplier: 0, placed: false });
  const [bet2, setBet2] = useState<ActiveBet>({ amount: 10.0, cashedOut: false, multiplier: 0, placed: false });
  
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

    const houseRig = Math.random();
    let crashAt;
    if (houseRig > 0.35) {
      crashAt = 1.0 + (Math.random() * 0.45); 
    } else {
      crashAt = 1.5 + Math.random() * (Math.random() < 0.2 ? 20 : 5);
    }
    
    crashPointRef.current = crashAt;
    setMultiplier(1.0);
    setGameState('FLYING');

    if (bet1.placed) onBet(bet1.amount, false);
    if (bet2.placed) onBet(bet2.amount, false);

    timerRef.current = window.setInterval(() => {
      setMultiplier(prev => {
        const growthRate = 0.012 * Math.pow(prev, 1.25); 
        const next = prev + growthRate;
        if (next >= crashPointRef.current) {
          clearInterval(timerRef.current!);
          handleCrash();
          return Number(crashPointRef.current.toFixed(2));
        }
        return Number(next.toFixed(2));
      });
    }, 40); 
  };

  const handleCrash = () => {
    setGameState('CRASHED');
    setHistory(h => [Number(crashPointRef.current.toFixed(2)), ...h].slice(0, 15));
    
    setTimeout(() => {
      setGameState('IDLE');
      setBet1(prev => ({ ...prev, placed: false, cashedOut: false }));
      setBet2(prev => ({ ...prev, placed: false, cashedOut: false }));
    }, 3500);
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
    const progress = Math.min((multiplier - 1) / 15, 0.95);
    const height = 500;
    const targetX = 50 + (progress * 850);
    const targetY = height - 50 - (Math.pow(progress, 2.2) * 380);
    const ctrlX = targetX * 0.5;
    const ctrlY = height - 50;
    return { x: targetX, y: targetY, cx: ctrlX, cy: ctrlY };
  };

  const p = getPathData();
  const rotation = Math.max(-45, -30 * ((multiplier - 1) / 5));

  return (
    <div className="w-full h-full flex bg-[#0d0d0d] font-rajdhani text-white overflow-hidden flex-col lg:flex-row">
      <style>{`
        @keyframes sunburst-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .sunburst-container {
          animation: sunburst-rotate 60s linear infinite;
        }
        .aviator-font {
          font-family: 'Montserrat', sans-serif;
          font-style: italic;
        }
      `}</style>
      
      {/* Sidebar - Desktop Only */}
      <div className="hidden lg:flex w-72 flex-col bg-[#141516] border-r border-white/5 shadow-2xl">
        <div className="flex p-3 gap-1 bg-[#1b1c1d]">
          <button className="flex-1 bg-[#2c2d2f] py-1 rounded-md text-[9px] font-black uppercase tracking-widest">All Bets</button>
          <button className="flex-1 text-slate-500 py-1 text-[9px] font-black uppercase tracking-widest">My Bets</button>
        </div>
        <div className="flex justify-between px-4 py-2 text-[8px] text-slate-500 font-black uppercase border-b border-white/5">
          <span>User Node</span>
          <span>Stake</span>
          <span>Payout</span>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar bg-[#111213]">
          {mockBets.map((mb, i) => (
            <div key={i} className={`flex items-center justify-between px-3 py-2 border-b border-white/5 ${mb.win ? 'bg-green-500/5' : ''}`}>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[7px] font-black">{mb.user[0].toUpperCase()}</div>
                <span className="text-[9px] text-slate-400 font-bold">{mb.user}</span>
              </div>
              <span className="text-[9px] font-black text-slate-300">${mb.amount.toFixed(0)}</span>
              <div className="flex items-center gap-2 min-w-[70px] justify-end">
                {mb.multiplier && <span className="text-[8px] font-black text-purple-400 bg-purple-400/10 px-1 rounded">{mb.multiplier.toFixed(2)}x</span>}
                <span className="text-[9px] font-black text-green-500">{mb.win ? `$${mb.win.toFixed(0)}` : ''}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {/* History Bar */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-2 px-3 bg-[#141516] items-center border-b border-white/5 shrink-0">
          {history.map((h, i) => (
            <span key={i} className={`px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-black whitespace-nowrap ${h > 10 ? 'bg-[#913ef8]' : h > 2 ? 'bg-[#4361ee]' : 'bg-[#1b1c1d] border border-white/10'} text-white`}>
              {h.toFixed(2)}x
            </span>
          ))}
          <button className="ml-auto text-slate-500 text-xs pl-2"><i className="fa-solid fa-clock-rotate-left"></i></button>
        </div>

        {/* Game Canvas */}
        <div className="relative flex-1 bg-gradient-to-br from-[#1b1a4a] via-[#0b0a2a] to-[#010101] overflow-hidden flex items-center justify-center min-h-[300px]">
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="sunburst-container w-[200%] h-[200%] absolute flex items-center justify-center">
              {[...Array(24)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-1 h-[2000px] bg-gradient-to-t from-transparent via-blue-500/20 to-transparent" 
                  style={{ transform: `rotate(${i * 15}deg)` }}
                />
              ))}
            </div>
          </div>

          <div className="absolute top-0 left-0 right-0 h-6 md:h-8 bg-[#e91e63] flex items-center justify-center z-10 shadow-lg border-b border-black/20">
            <span className="text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] italic">Aviator • Provably Fair</span>
          </div>
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full h-40 opacity-40 blur-3xl bg-blue-400/10 rounded-full"></div>
            <div className="absolute top-20 right-20 w-32 h-32 opacity-20 blur-2xl bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute top-40 left-20 w-48 h-48 opacity-20 blur-3xl bg-white/5 rounded-full animate-pulse"></div>
          </div>
          
          <div className="relative z-20 text-center select-none transform scale-90 md:scale-110">
            <h1 className={`text-7xl md:text-9xl lg:text-[13rem] font-black italic tracking-tighter transition-all duration-100 ${gameState === 'CRASHED' ? 'text-red-600 animate-pulse' : 'text-white'}`}>
              {multiplier.toFixed(2)}x
            </h1>
            {gameState === 'FLYING' && (
              <div className="mt-[-1rem] md:mt-[-2rem] opacity-30 animate-in fade-in duration-1000">
                <p className="aviator-font text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase">Aviator</p>
              </div>
            )}
            {gameState === 'CRASHED' && (
              <p className="text-red-500 text-xl md:text-3xl font-black uppercase tracking-[0.4em] md:tracking-[0.8em] mt-2 animate-bounce drop-shadow-[0_0_20px_rgba(239,68,68,0.7)]">FLEW AWAY!</p>
            )}
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="trailGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(233, 30, 99, 0)" />
                <stop offset="100%" stopColor="rgba(233, 30, 99, 0.4)" />
              </linearGradient>
              <linearGradient id="redDarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b91c1c" />
                <stop offset="100%" stopColor="#450a0a" />
              </linearGradient>
              <filter id="planeGlow">
                <feGaussianBlur stdDeviation="6" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {gameState === 'FLYING' && (
              <>
                <path 
                  d={`M 50 450 Q ${p.cx} 450 ${p.x} ${p.y} L ${p.x} 450 Z`} 
                  fill="url(#trailGradient)" 
                  className="transition-all duration-100"
                />
                <path 
                  d={`M 50 450 Q ${p.cx} 450 ${p.x} ${p.y}`} 
                  stroke="#e91e63" 
                  strokeWidth="8" 
                  fill="none" 
                  filter="url(#planeGlow)"
                  className="transition-all duration-100 opacity-80"
                />
                
                <g transform={`translate(${p.x}, ${p.y}) rotate(${rotation}) scale(12 md:16)`} className="transition-all duration-100">
                  <path d="M-8,0 L8,0 L10,1 L8,2 L-8,2 Z" fill="url(#redDarkGradient)" filter="url(#planeGlow)" stroke="#e91e63" strokeWidth="0.1" />
                  <path d="M-4,-2 L4,-2 L6,0 L-6,0 Z" fill="#7f1d1d" />
                  <circle cx="10" cy="1" r="1" fill="#ef4444" />
                  <ellipse cx="11.5" cy="1" rx="0.5" ry="5" fill="rgba(255,255,255,0.6)">
                    <animate attributeName="ry" values="5;0.5;5" dur="0.04s" repeatCount="indefinite" />
                  </ellipse>
                  <path d="M2,-1 L6,-1 L7.5,1 L3,1 Z" fill="rgba(135, 206, 235, 0.6)" stroke="white" strokeWidth="0.1" />
                  <path d="M-2,1 L-3,-4 L1,-4 L2,1 Z" fill="url(#redDarkGradient)" stroke="#e91e63" strokeWidth="0.1" />
                  <path d="M-2,1 L-3,6 L1,6 L2,1 Z" fill="#450a0a" />
                  <g opacity="0.8">
                    <circle r="0.4" fill="#ff4d4d">
                      <animate attributeName="cx" values="-10;-30" dur="0.08s" repeatCount="indefinite" />
                      <animate attributeName="cy" values="1;2" dur="0.08s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1;0" dur="0.08s" repeatCount="indefinite" />
                    </circle>
                  </g>
                </g>
              </>
            )}
          </svg>
          
          {gameState === 'IDLE' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-30">
               <div className="w-16 h-16 md:w-24 md:h-24 border-8 border-white/5 border-t-red-500 rounded-full animate-spin mb-6"></div>
               <p className="aviator-font font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-white text-2xl md:text-3xl animate-pulse italic">AVIATOR</p>
               <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Connecting to Secure Node...</p>
            </div>
          )}
        </div>

        {/* Betting Controls */}
        <div className="bg-[#141516] p-3 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 border-t border-white/10 shadow-inner-deep overflow-y-auto max-h-[40%] md:max-h-none shrink-0">
          {[1, 2].map((num) => {
            const currentBet = num === 1 ? bet1 : bet2;
            const setBet = num === 1 ? setBet1 : setBet2;

            return (
              <div key={num} className="bg-[#1b1c1d] rounded-2xl md:rounded-3xl p-3 md:p-6 flex flex-col sm:flex-row gap-3 md:gap-6 items-center border border-white/5 relative group hover:border-[#e91e63]/30 transition-all">
                <div className="flex flex-col gap-2 md:gap-3 flex-1 w-full">
                   <div className="flex gap-2">
                      <button className="px-3 md:px-4 py-1 bg-[#2c2d2f] text-[8px] md:text-[10px] font-black uppercase rounded-lg border border-white/5">Bet</button>
                      <button className="px-3 md:px-4 py-1 text-slate-500 text-[8px] md:text-[10px] font-black uppercase">Auto</button>
                   </div>
                   <div className="flex items-center bg-[#0d0d0d] rounded-xl md:rounded-2xl border border-white/10 px-3 md:px-4 py-2 md:py-3">
                      <button onClick={() => setBet(p => ({...p, amount: Math.max(1, p.amount - 10)}))} className="text-slate-500 hover:text-white transition-colors">➖</button>
                      <input 
                        type="number" 
                        value={currentBet.amount} 
                        onChange={(e) => setBet(p => ({...p, amount: Number(e.target.value)}))}
                        className="w-full bg-transparent text-center font-black text-xl md:text-2xl outline-none text-white italic" 
                      />
                      <button onClick={() => setBet(p => ({...p, amount: p.amount + 10}))} className="text-slate-500 hover:text-white transition-colors">➕</button>
                   </div>
                   <div className="grid grid-cols-4 gap-1.5 md:gap-2">
                      {[10, 50, 100, 500].map(amt => (
                        <button key={amt} onClick={() => setBet(p => ({...p, amount: amt}))} className="bg-[#2c2d2f] py-1 md:py-1.5 rounded-lg text-[8px] md:text-[10px] font-black text-slate-300 hover:bg-slate-700 transition-colors border border-white/5">{amt}</button>
                      ))}
                   </div>
                </div>

                <div className="w-full sm:w-40 md:w-48 h-20 md:h-28 shrink-0">
                  {gameState === 'FLYING' && currentBet.placed && !currentBet.cashedOut ? (
                    <button 
                      onClick={() => handleCashOut(num as 1 | 2)}
                      className="w-full h-full bg-gradient-to-b from-[#ff8a00] to-[#e52e71] rounded-2xl md:rounded-3xl flex flex-col items-center justify-center shadow-[0_0_30px_rgba(229,46,113,0.3)] active:scale-95 transition-all border border-pink-400/20"
                    >
                      <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-white/70 mb-0.5">Cash Out</span>
                      <span className="text-xl md:text-3xl font-black italic text-white leading-none">${(currentBet.amount * multiplier).toFixed(2)}</span>
                    </button>
                  ) : currentBet.cashedOut ? (
                    <div className="w-full h-full bg-[#28a745]/10 border border-[#28a745]/30 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center animate-in zoom-in duration-300">
                       <span className="text-[9px] md:text-[10px] font-black text-[#28a745] uppercase tracking-widest mb-0.5">Win</span>
                       <span className="text-xl md:text-3xl font-black italic text-[#28a745]">{currentBet.multiplier.toFixed(2)}x</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        if (user.balanceUSDT < currentBet.amount && !currentBet.placed) {
                            alert("Insufficient balance.");
                            return;
                        }
                        setBet(p => ({...p, placed: !p.placed}));
                        if (gameState === 'IDLE' && !currentBet.placed) {
                            setTimeout(startGame, 100);
                        }
                      }}
                      className={`w-full h-full rounded-2xl md:rounded-3xl flex flex-col items-center justify-center transition-all active:scale-95 shadow-xl border-2 ${
                        currentBet.placed ? 'bg-red-600/20 border-red-500/40 text-red-500' : 'bg-[#28a745] hover:bg-[#218838] border-[#218838] text-white'
                      }`}
                    >
                      <span className="text-xl md:text-3xl font-black italic tracking-tighter uppercase leading-none">{currentBet.placed ? 'CANCEL' : 'BET'}</span>
                      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-80 mt-0.5">${currentBet.amount.toFixed(0)} USDT</span>
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
