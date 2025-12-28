
import React from 'react';
import { AppView, Language } from '../types';

interface GamePortalViewProps {
  setView: (view: AppView) => void;
  lang: Language;
}

const GamePortalView: React.FC<GamePortalViewProps> = ({ setView, lang }) => {
  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
      {/* 🚀 Dynamic Global Ticker */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-slate-900/80 border border-slate-800 h-14 flex items-center overflow-hidden whitespace-nowrap rounded-2xl backdrop-blur-md">
          <div className="absolute left-0 top-0 bottom-0 bg-cyan-600 flex items-center px-4 z-10 font-rajdhani font-bold text-sm skew-x-[-15deg] translate-x-[-10px]">
            <span className="skew-x-[15deg]">LIVE ODDS</span>
          </div>
          <div className="flex animate-[marquee_30s_linear_infinite] space-x-12 px-24">
            {[
              "🏏 IPL: MI vs CSK - MI Win @ 1.92",
              "⚽ Champions League: Real Madrid vs City - Real @ 3.10",
              "🎾 US Open: Alcaraz vs Sinner - Over 3.5 Sets @ 1.55",
              "🏏 BPL: Dhaka vs Comilla - Over 165.5 @ 1.80",
              "🎰 MEGA JACKPOT: $4,582,102.40",
              "🚀 Aviator: 14.5x last round",
              "🏀 NBA: Lakers vs GSW - Over 220.5 @ 1.90"
            ].map((text, i) => (
              <span key={i} className="text-sm font-bold font-mono text-cyan-400 flex items-center tracking-tighter">
                <span className="w-2 h-2 rounded-full bg-cyan-500 mr-3 shadow-[0_0_8px_#22d3ee]"></span>
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 💎 Featured Hero Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div 
          className="xl:col-span-2 relative h-[450px] rounded-[3rem] overflow-hidden group cursor-pointer border border-white/5"
          onClick={() => setView(AppView.BETTING)}
        >
          <img 
            src="https://images.unsplash.com/photo-1540747913346-19e3adca174f?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            alt="Sports Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>
          <div className="absolute bottom-10 left-10 right-10">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-cyan-500 text-white text-[10px] font-bold rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]">FEATURED MATCH</span>
              <span className="text-xs text-white/70 font-bold uppercase tracking-[0.2em]">60 Days Schedule Import active</span>
            </div>
            <h2 className="text-5xl font-rajdhani font-bold text-white mb-4 leading-none">WORLD CLASS <br /><span className="text-cyan-400">SPORTS BOOK</span></h2>
            <p className="text-slate-300 max-w-lg mb-8 text-lg leading-relaxed">Automated market engine with real-time odds fluctuation and 48h MLM distribution cycle.</p>
            <button className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-2xl font-bold text-white shadow-2xl transition-all transform hover:translate-y-[-4px] active:scale-95">
              Launch Sports Lobby
            </button>
          </div>
        </div>

        <div 
          className="relative h-[450px] rounded-[3rem] overflow-hidden group cursor-pointer border border-white/5"
          onClick={() => setView(AppView.CASINO)}
        >
          <img 
            src="https://images.unsplash.com/photo-1518893063132-36e46dbe2428?auto=format&fit=crop&q=80&w=800" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            alt="Casino Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b] via-[#1e1b4b]/60 to-transparent"></div>
          <div className="absolute bottom-10 left-10">
            <span className="px-3 py-1 bg-purple-500 text-white text-[10px] font-bold rounded-full mb-4 inline-block">500+ GAMES LIVE</span>
            <h2 className="text-4xl font-rajdhani font-bold text-white mb-2">PREMIUM <br /><span className="text-purple-400">CASINO</span></h2>
            <p className="text-slate-300 text-sm mb-6">Slots, Teen Patti & <br />Live Dealers</p>
            <button className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-2xl font-bold text-white shadow-2xl transition-all transform hover:translate-y-[-4px]">
              Play Now
            </button>
          </div>
        </div>
      </div>

      {/* 🎡 Quick Action Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { name: 'Cricket', icon: '🏏', count: '14 Games', color: 'from-blue-600/20' },
          { name: 'Football', icon: '⚽', count: '28 Games', color: 'from-emerald-600/20' },
          { name: 'Casino', icon: '🎰', count: '500+ Slots', color: 'from-purple-600/20' },
          { name: 'Crash', icon: '✈️', count: 'HOT', color: 'from-red-600/20' },
          { name: 'Tennis', icon: '🎾', count: '8 Games', color: 'from-yellow-600/20' },
          { name: 'Lottery', icon: '🎫', count: 'Starts 2PM', color: 'from-indigo-600/20' },
        ].map((item, i) => (
          <div 
            key={i} 
            className={`bg-slate-900 border border-slate-800 p-6 rounded-[2rem] text-center hover:bg-slate-800 transition-all cursor-pointer group hover:border-white/10 relative overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            <div className="relative z-10">
              <div className="text-4xl mb-3 transition-transform group-hover:scale-125 duration-500">{item.icon}</div>
              <p className="font-bold text-sm text-slate-200">{item.name}</p>
              <p className="text-[10px] text-cyan-500 font-bold uppercase mt-1 tracking-widest">{item.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 📊 Real-time System Status */}
      <div className="bg-slate-900/30 border border-slate-800 p-10 rounded-[3rem] flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <h4 className="text-2xl font-rajdhani font-bold mb-4 flex items-center">
            <span className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center mr-4">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
            </span>
            Decentralized Settlement Engine
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
            All wins are automatically calculated and processed on the BNB Smart Chain. 
            MLM commissions are instantly locked for a 48-hour security buffer before 
            being distributed up to 5 generations of your downline.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
          <div className="bg-slate-800/40 p-5 rounded-3xl border border-white/5">
             <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Payouts</p>
             <p className="text-2xl font-rajdhani font-bold text-green-400">$1,245,280</p>
          </div>
          <div className="bg-slate-800/40 p-5 rounded-3xl border border-white/5">
             <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Active Bets</p>
             <p className="text-2xl font-rajdhani font-bold text-cyan-400">14,208</p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
};

export default GamePortalView;
