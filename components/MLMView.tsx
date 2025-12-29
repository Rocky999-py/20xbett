
import React from 'react';
import { MLMStats, User, Language } from '../types.ts';
import { LEVELS } from '../constants.tsx';
import { translations } from '../translations.ts';

interface MLMViewProps {
  stats: MLMStats;
  user: User;
  onUpgrade: (levelId: number, price: number) => void;
  lang: Language;
}

const MLMView: React.FC<MLMViewProps> = ({ stats, user, onUpgrade, lang }) => {
  const t = (key: string) => translations[lang][key] || key;
  
  const handleActivate = (levelId: number, price: number) => {
    if (user.balanceUSDT < price) {
      alert(`BALANCE ERROR: Need $${price} USDT to buy this level.`);
      return;
    }
    onUpgrade(levelId, price);
  };

  const salaryProgress = Math.min(100, (stats.totalTeam / 200) * 100);
  const volumeProgress = Math.min(100, (stats.bettingVolume / 20000) * 100);

  return (
    <div className="space-y-12 md:space-y-16 animate-in fade-in duration-700 pb-20 font-rajdhani">
      {/* 8-Tier Level Program */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {LEVELS.map((level) => {
          const isActive = user.currentLevel >= level.id;
          return (
            <div key={level.id} className={`group relative p-1 rounded-[2.5rem] transition-all duration-500 ${isActive ? 'shadow-[0_0_40px_rgba(245,158,11,0.2)]' : 'hover:border-amber-500/20'}`}>
              <div className={`relative h-full bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#1e1b4b] p-8 rounded-[2.4rem] border ${isActive ? 'border-amber-500/40' : 'border-white/5'} overflow-hidden shadow-inner-deep transition-all duration-500 group-hover:-translate-y-2`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    {level.id === 8 ? '💎' : level.id >= 6 ? '🏆' : '👑'}
                  </div>
                  <div className="px-3 py-1 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('level')} 0{level.id}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight group-hover:text-amber-400 transition-colors italic">{level.name}</h3>
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed mb-8 h-12 uppercase tracking-wider">{level.description}</p>
                
                <div className="flex justify-between items-end mb-8 pt-4 border-t border-white/5">
                  <div>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">{t('amount')}</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-black text-white italic">${level.priceUSD}</span>
                      <span className="text-[10px] text-amber-500 font-black">USDT</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleActivate(level.id, level.priceUSD)}
                  disabled={isActive}
                  className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-[0.3em] transition-all relative overflow-hidden group/btn ${
                    isActive ? 'bg-slate-800 text-slate-600 cursor-default' : 'bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-xl active:scale-95'
                  }`}
                >
                  <span className="relative z-10 italic">{isActive ? t('active') : t('activate')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* 5-Generation Matrix Distribution */}
        <div className="relative bg-gradient-to-b from-[#0f172a] to-[#020617] border border-slate-800 p-10 rounded-[3.4rem] shadow-2xl overflow-hidden shadow-inner-deep">
          <div className="flex justify-between items-center mb-10">
             <h3 className="text-2xl font-black text-white tracking-widest uppercase italic">{t('referral_income')} (5 Gen)</h3>
             <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse">Live Sync</span>
          </div>
          
          <div className="space-y-4 relative z-10">
            {[
              { gen: 'Generation 1', rate: '10%', income: stats.referralIncome, desc: 'Level 1 Friends' },
              { gen: 'Generation 2', rate: '5%', income: 420.50, desc: 'Level 2 Friends' },
              { gen: 'Generation 3', rate: '3%', income: 128.00, desc: 'Level 3 Friends' },
              { gen: 'Generation 4', rate: '2%', income: 65.20, desc: 'Level 4 Friends' },
              { gen: 'Generation 5', rate: '1%', income: 12.00, desc: 'Level 5 Friends' },
            ].map((g, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-slate-950/50 rounded-3xl border border-white/5 hover:border-amber-500/30 transition-all cursor-default group">
                <div className="flex items-center space-x-6">
                  <span className="text-3xl font-black text-slate-800 group-hover:text-amber-500 transition-colors italic">0{i+1}</span>
                  <div>
                    <p className="text-sm font-black text-white uppercase italic">{g.gen}</p>
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{g.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white leading-none mb-1">{g.rate}</p>
                  <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">+ ${g.income.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Founder Salary Engine (Progress Tracking) */}
        <div className="relative bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#1e1b4b] p-10 rounded-[3.4rem] border border-white/5 shadow-2xl overflow-hidden shadow-inner-deep">
          <h3 className="text-2xl font-black text-white mb-4 tracking-widest uppercase italic">{t('salary')} Goal</h3>
          <p className="text-[10px] text-slate-500 mb-12 font-black uppercase tracking-widest leading-relaxed italic">Get 200 members & $20k Team Volume to unlock your monthly pay.</p>
          
          <div className="space-y-10 relative z-10">
            {/* Team Nodes Requirement */}
            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                 <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">{t('total_team')}</span>
                 <span className="text-sm font-black text-amber-500 italic">{stats.totalTeam} / 200 {t('active')}</span>
              </div>
              <div className="h-5 bg-black rounded-full border border-white/5 p-1">
                <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all duration-1000" style={{ width: `${salaryProgress}%` }}></div>
              </div>
            </div>

            {/* Betting Volume Requirement */}
            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                 <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Team Play Volume</span>
                 <span className="text-sm font-black text-cyan-400 italic">${stats.bettingVolume.toLocaleString()} / $20,000</span>
              </div>
              <div className="h-5 bg-black rounded-full border border-white/5 p-1">
                <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-1000" style={{ width: `${volumeProgress}%` }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-12">
               <div className="bg-slate-950/80 p-8 rounded-[2rem] border border-white/5 text-center shadow-inner-deep">
                  <p className="text-[9px] text-slate-600 font-black uppercase mb-3 tracking-widest italic">MLM Monthly Fund</p>
                  <div className="flex items-baseline justify-center space-x-1">
                    <p className="text-4xl font-black text-white italic">${stats.mlmMonthlyFund.toFixed(0)}</p>
                    <span className="text-[10px] text-amber-500 font-black">USDT</span>
                  </div>
               </div>
               <div className="bg-slate-950/80 p-8 rounded-[2rem] border border-white/5 text-center shadow-inner-deep">
                  <p className="text-[9px] text-slate-600 font-black uppercase mb-3 tracking-widest italic">Betting Monthly Fund</p>
                  <div className="flex items-baseline justify-center space-x-1">
                    <p className="text-4xl font-black text-white italic">${stats.bettingMonthlyFund.toFixed(0)}</p>
                    <span className="text-[10px] text-cyan-500 font-black">USDT</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-amber-500/5 rounded-3xl border border-amber-500/10 text-center mt-6">
               <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.2em] italic">
                 <i className="fa-solid fa-triangle-exclamation mr-2"></i> 
                 Salary is paid every 30 days automatically.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLMView;
