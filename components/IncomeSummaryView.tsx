
import React from 'react';
import { MLMStats, Language } from '../types.ts';
import { translations } from '../translations.ts';

interface IncomeSummaryViewProps {
  stats: MLMStats;
  lang: Language;
}

const IncomeSummaryView: React.FC<IncomeSummaryViewProps> = ({ stats, lang }) => {
  const t = (key: string) => translations[lang][key] || key;

  const incomeItems = [
    { label: 'Direct Referral Income', val: stats.referralIncome, icon: 'fa-solid fa-hand-holding-dollar', color: 'text-cyan-400' },
    { label: 'Downline Team Commission', val: stats.referralCommission, icon: 'fa-solid fa-users-rays', color: 'text-purple-400' },
    { label: 'Monthly Founder Salary', val: stats.monthlySalary, icon: 'fa-solid fa-calendar-check', color: 'text-emerald-400' },
    { label: 'Betting Loss Commission', val: stats.bettingCommission, icon: 'fa-solid fa-shield-heart', color: 'text-amber-400' },
    { label: 'MLM Monthly Salary Fund', val: stats.mlmMonthlyFund, icon: 'fa-solid fa-vault', color: 'text-blue-400' },
    { label: 'Betting Monthly Salary Fund', val: stats.bettingMonthlyFund, icon: 'fa-solid fa-sack-dollar', color: 'text-rose-400' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-rajdhani">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Income Summary</h2>
          <p className="text-[10px] text-amber-500 font-black tracking-[0.5em] mt-3 uppercase italic">BEP20 Ledger Detailed Report</p>
        </div>
        <div className="bg-slate-900 border border-white/10 px-8 py-6 rounded-3xl text-center shadow-2xl">
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Distributed Profit</p>
           <p className="text-4xl font-black text-white italic tracking-tighter">${stats.totalProfit.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {incomeItems.map((item, i) => (
          <div key={i} className="group relative bg-[#010409] border border-slate-800 p-8 rounded-[2.5rem] hover:border-amber-500/30 transition-all duration-500 shadow-inner-deep overflow-hidden">
            <div className={`absolute top-0 right-0 p-8 text-5xl opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-10 transition-all duration-700 ${item.color}`}>
              <i className={item.icon}></i>
            </div>
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl mb-6 ${item.color}`}>
                <i className={item.icon}></i>
              </div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 leading-relaxed">{item.label}</h4>
              <div className="flex items-baseline space-x-2">
                 <span className="text-3xl font-black text-white italic tracking-tighter">${item.val.toLocaleString()}</span>
                 <span className="text-[10px] text-slate-600 font-black">USDT</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-950/40 border border-slate-800 p-10 rounded-[3rem] text-center italic">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-3xl mx-auto">
          Notice: All MLM earnings are automatically converted to USDT and settled on the BNB Smart Chain. Distribution triggers are real-time, with a 48-hour security buffer for betting loss commissions.
        </p>
      </div>
    </div>
  );
};

export default IncomeSummaryView;
