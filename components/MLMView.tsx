
import React from 'react';
import { MLMStats, User } from '../types';
import { LEVELS } from '../constants';

interface MLMViewProps {
  stats: MLMStats;
  user: User;
  onUpgrade: (levelId: number, price: number) => void;
}

const MLMView: React.FC<MLMViewProps> = ({ stats, user, onUpgrade }) => {
  const handleActivate = (levelId: number, price: number) => {
    if (user.balanceUSDT < price) {
      alert(`Insufficient balance: Level ${levelId} requires $${price}.`);
      return;
    }
    onUpgrade(levelId, price);
  };

  return (
    <div className="space-y-12 md:space-y-16 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-rajdhani font-black text-white tracking-widest uppercase italic flex items-center">
            <span className="w-12 h-[2px] bg-gradient-to-r from-amber-500 to-transparent mr-4"></span>
            ELITE HIERARCHY
          </h2>
          <p className="text-[10px] text-amber-500/70 font-bold tracking-[0.4em] ml-16 mt-1 uppercase">Instant BEP20 Activation Protocol</p>
        </div>
        <div className="flex items-center space-x-4 bg-slate-900/50 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
           <div className="px-4 py-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Global Status: Active</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {LEVELS.map((level) => {
          const isActive = user.currentLevel >= level.id;
          return (
            <div key={level.id} className={`group relative p-1 rounded-[2.5rem] transition-all duration-500 ${isActive ? 'shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'hover:border-cyan-500/20'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className={`relative h-full bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#1e1b4b] p-8 rounded-[2.4rem] border ${isActive ? 'border-amber-500/30' : 'border-white/5'} overflow-hidden shadow-inner-deep transition-all duration-500 group-hover:translate-y-[-5px]`}>
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="text-4xl transform group-hover:rotate-12 transition-transform duration-500">
                    {isActive ? '👑' : '💎'}
                  </div>
                  <div className="px-3 py-1 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tier 0{level.id}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-rajdhani font-black text-white mb-2 uppercase tracking-tight group-hover:text-amber-400 transition-colors">{level.name}</h3>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-8 h-12 overflow-hidden">{level.description}</p>
                
                <div className="flex justify-between items-end mb-8 pt-4 border-t border-white/5">
                  <div>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">Activation Fee</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-rajdhani font-black text-white italic">${level.priceUSD}</span>
                      <span className="text-[10px] text-slate-600 font-bold">USDT</span>
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 text-xs">
                      ✓
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => handleActivate(level.id, level.priceUSD)}
                  disabled={isActive}
                  className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all relative overflow-hidden group/btn ${
                    isActive ? 'bg-slate-800 text-slate-600 cursor-default' : 'bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-lg active:scale-95'
                  }`}
                >
                  <span className="relative z-10">{isActive ? 'Access Unlocked' : 'Initialize Tier'}</span>
                  {!isActive && <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>}
                </button>

                {/* Depth shading */}
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Generational Matrix */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/20 via-blue-500/20 to-purple-600/20 rounded-[3.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-gradient-to-b from-[#0f172a] to-[#020617] border border-slate-800 p-10 rounded-[3.4rem] shadow-2xl overflow-hidden shadow-inner-deep">
            <h3 className="text-2xl font-rajdhani font-black text-white mb-10 tracking-widest uppercase flex items-center">
              <span className="relative flex h-3 w-3 mr-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              GENERATION YIELD
            </h3>
            
            <div className="space-y-4 relative z-10">
              {[
                { gen: 'Gen 1: Primary', count: stats.directPartners, rate: '10%', sub: 'Direct Partners', color: 'from-cyan-500' },
                { gen: 'Gen 2: Secondary', count: 42, rate: '5%', sub: 'Indirect Yield', color: 'from-blue-500' },
                { gen: 'Gen 3: Tertiary', count: 128, rate: '3%', sub: 'Network Matrix', color: 'from-indigo-500' },
                { gen: 'Gen 4: Quaternary', count: 350, rate: '2%', sub: 'Global Scale', color: 'from-purple-500' },
                { gen: 'Gen 5: Quinary', count: 980, rate: '1%', sub: 'Royalty Node', color: 'from-rose-500' },
              ].map((g, i) => (
                <div key={i} className="group/item flex items-center justify-between p-5 bg-slate-950/50 rounded-3xl border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                  <div className="flex items-center space-x-6">
                    <span className="text-3xl font-rajdhani font-black text-slate-800 group-hover/item:text-cyan-500 transition-colors">0{i+1}</span>
                    <div>
                      <p className="text-sm font-black text-slate-100 uppercase tracking-tight">{g.gen}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{g.sub}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-rajdhani font-black text-white leading-none mb-1 group-hover/item:scale-110 transition-transform">{g.rate}</p>
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{g.count} Active Nodes</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(30,58,138,0.1),transparent_50%)] pointer-events-none"></div>
          </div>
        </div>

        {/* Salary Engine */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-b from-indigo-600/20 to-slate-900/20 rounded-[3.5rem] blur opacity-75"></div>
          <div className="relative bg-gradient-to-b from-[#0f172a] via-[#020617] to-[#020617] p-10 rounded-[3.4rem] border border-slate-800 shadow-2xl overflow-hidden shadow-inner-deep">
            <h3 className="text-2xl font-rajdhani font-black text-white mb-4 tracking-widest uppercase">FOUNDER SALARY NODE</h3>
            <p className="text-xs text-slate-500 mb-12 font-bold leading-relaxed uppercase tracking-wider">Synchronize 200 active team nodes to trigger the automated BEP20 monthly salary stream.</p>
            
            <div className="space-y-8 relative z-10">
              <div className="p-6 bg-slate-950/50 rounded-3xl border border-white/5">
                <div className="flex justify-between items-end mb-4 px-2">
                   <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Network Saturation</span>
                   <span className="text-sm font-black text-cyan-400 font-mono tracking-widest">{stats.totalTeam} / 200</span>
                </div>
                <div className="h-6 bg-slate-900 rounded-full border border-white/5 p-1 relative overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-2000 ease-out" style={{ width: `${Math.min(100, (stats.totalTeam/200)*100)}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-[marquee_2s_linear_infinite] w-[200%] opacity-20"></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                 <div className="group/stat bg-slate-950/80 p-8 rounded-[2rem] border border-white/5 text-center hover:border-green-500/30 transition-all shadow-inner">
                    <div className="text-3xl mb-4 group-hover/stat:scale-125 transition-transform duration-500">💳</div>
                    <p className="text-[9px] text-slate-600 font-black uppercase mb-2 tracking-widest">Allocated Share</p>
                    <div className="flex items-baseline justify-center space-x-1">
                      <p className="text-3xl font-rajdhani font-black text-white italic">${stats.monthlySalary}</p>
                      <span className="text-[10px] text-slate-600 font-bold">USDT</span>
                    </div>
                 </div>
                 <div className="group/stat bg-slate-950/80 p-8 rounded-[2rem] border border-white/5 text-center hover:border-amber-500/30 transition-all shadow-inner">
                    <div className="text-3xl mb-4 group-hover/stat:scale-125 transition-transform duration-500">🏦</div>
                    <p className="text-[9px] text-slate-600 font-black uppercase mb-2 tracking-widest">Global Reservoir</p>
                    <div className="flex items-baseline justify-center space-x-1">
                      <p className="text-3xl font-rajdhani font-black text-white italic">${stats.mlmMonthlyFund}</p>
                      <span className="text-[10px] text-slate-600 font-bold">USDT</span>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLMView;
