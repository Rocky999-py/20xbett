
import React, { useState, useRef } from 'react';
import { User } from '../types';

interface RouletteGameProps {
  user: User;
  onBet: (amount: number, isWin: boolean, multiplier?: number) => void;
}

const RouletteGame: React.FC<RouletteGameProps> = ({ user, onBet }) => {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedType, setSelectedType] = useState<'RED' | 'BLACK' | 'ZERO' | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  const spin = () => {
    if (!selectedType) {
      alert("Please select a bet target!");
      return;
    }
    if (user.balanceUSDT < betAmount) {
      alert("Insufficient balance!");
      return;
    }

    setIsSpinning(true);
    setResult(null);

    setTimeout(() => {
      const num = Math.floor(Math.random() * 37);
      setResult(num);
      setIsSpinning(false);
      setHistory(h => [num, ...h].slice(0, 10));

      let isWin = false;
      let multiplier = 2;

      if (num === 0) {
        if (selectedType === 'ZERO') {
          isWin = true;
          multiplier = 35;
        }
      } else if (num % 2 === 0) {
        if (selectedType === 'RED') isWin = true;
      } else {
        if (selectedType === 'BLACK') isWin = true;
      }

      onBet(betAmount, isWin, multiplier);
    }, 2000);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 md:p-8 bg-[#0b1223] font-rajdhani overflow-hidden">
      {/* History */}
      <div className="w-full flex justify-center gap-2 mb-6">
        {history.map((h, i) => (
          <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border border-white/10 ${
            h === 0 ? 'bg-green-600' : h % 2 === 0 ? 'bg-red-600' : 'bg-slate-900'
          }`}>
            {h}
          </div>
        ))}
      </div>

      {/* Wheel Area */}
      <div className="relative flex-1 flex flex-col items-center justify-center">
        <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-amber-900 bg-slate-900 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.2)] ${isSpinning ? 'animate-spin' : ''}`}>
           <div className="text-4xl md:text-6xl font-black text-white italic">
             {result !== null ? result : '?'}
           </div>
           {/* Decorative spokes */}
           <div className="absolute inset-0 rounded-full border border-white/5 opacity-50"></div>
        </div>
        {result !== null && (
          <div className={`mt-6 px-8 py-2 rounded-full font-black uppercase italic tracking-widest text-white shadow-xl animate-bounce ${
            result === 0 ? 'bg-green-600' : result % 2 === 0 ? 'bg-red-600' : 'bg-slate-800'
          }`}>
            {result === 0 ? 'ZERO' : result % 2 === 0 ? 'RED WINS' : 'BLACK WINS'}
          </div>
        )}
      </div>

      {/* Betting Board */}
      <div className="w-full max-w-3xl bg-slate-900/60 p-8 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
        <div className="grid grid-cols-3 gap-4">
          <button 
            onClick={() => setSelectedType('RED')}
            className={`py-8 rounded-[2rem] border transition-all flex flex-col items-center justify-center ${
              selectedType === 'RED' ? 'bg-red-600 border-red-400 scale-105 shadow-2xl' : 'bg-red-900/20 border-red-600/30 text-red-500 hover:bg-red-600/20'
            }`}
          >
            <span className="text-2xl mb-2 font-black italic">RED</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Payout 2x</span>
          </button>
          <button 
            onClick={() => setSelectedType('ZERO')}
            className={`py-8 rounded-[2rem] border transition-all flex flex-col items-center justify-center ${
              selectedType === 'ZERO' ? 'bg-green-600 border-green-400 scale-105 shadow-2xl' : 'bg-green-900/20 border-green-600/30 text-green-500 hover:bg-green-600/20'
            }`}
          >
            <span className="text-2xl mb-2 font-black italic">ZERO</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Payout 35x</span>
          </button>
          <button 
            onClick={() => setSelectedType('BLACK')}
            className={`py-8 rounded-[2rem] border transition-all flex flex-col items-center justify-center ${
              selectedType === 'BLACK' ? 'bg-slate-800 border-slate-600 scale-105 shadow-2xl' : 'bg-slate-900 border-white/10 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span className="text-2xl mb-2 font-black italic">BLACK</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Payout 2x</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 w-full space-y-2">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-4">Stake Amount (USDT)</span>
            <div className="flex items-center bg-black/40 rounded-3xl p-3 border border-white/10">
              <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))} className="w-12 h-12 text-slate-500 hover:text-white">➖</button>
              <input type="number" value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} className="w-full bg-transparent text-center font-black text-2xl text-white outline-none" />
              <button onClick={() => setBetAmount(betAmount + 10)} className="w-12 h-12 text-slate-500 hover:text-white">➕</button>
            </div>
          </div>
          <button 
            onClick={spin}
            disabled={isSpinning}
            className={`w-full md:w-64 h-20 rounded-3xl font-black italic uppercase tracking-[0.2em] transition-all shadow-2xl ${
              isSpinning ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-500 text-white active:scale-95'
            }`}
          >
            {isSpinning ? 'SPINNING...' : 'PLACE BET'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouletteGame;
