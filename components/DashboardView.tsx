
import React from 'react';
import { MLMStats, LiveEvent, Language } from '../types.ts';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { translations } from '../translations.ts';

interface DashboardViewProps {
  stats: MLMStats;
  liveFeed: LiveEvent[];
  lang: Language;
}

const data = [
  { name: '10:00', val: 400 },
  { name: '11:00', val: 700 },
  { name: '12:00', val: 500 },
  { name: '13:00', val: 1200 },
  { name: '14:00', val: 900 },
  { name: '15:00', val: 1500 },
  { name: '16:00', val: 1100 },
];

const DashboardView: React.FC<DashboardViewProps> = ({ stats, liveFeed, lang }) => {
  const t = (key: string) => translations[lang][key] || key;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 font-rajdhani">
      {/* Easy Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('total_balance'), val: `$${stats.totalProfit.toLocaleString()}`, icon: 'fa-solid fa-wallet', sub: 'Safe Wallet', color: 'text-amber-500' },
          { label: t('referral_income'), val: `$${stats.referralIncome.toLocaleString()}`, icon: 'fa-solid fa-users', sub: 'Invite Earnings', color: 'text-cyan-500' },
          { label: 'Level Bonus', val: `$${stats.referralCommission.toLocaleString()}`, icon: 'fa-solid fa-up-long', sub: 'Matrix Rewards', color: 'text-blue-500' },
          { label: t('salary'), val: `$${stats.monthlySalary.toLocaleString()}`, icon: 'fa-solid fa-money-bill-wave', sub: 'Monthly Pay', color: 'text-emerald-500' },
        ].map((item, idx) => (
          <div key={idx} className="relative group p-1 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent hover:from-amber-500/20 transition-all duration-700 hover-gold-gradient shadow-2xl">
            <div className="relative bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#1e1b4b] p-8 rounded-[2.4rem] border border-white/5 overflow-hidden shadow-inner-deep">
              <div className="flex justify-between items-start mb-8">
                <div className={`text-3xl ${item.color} transition-all duration-700 group-hover:scale-125 group-hover:rotate-12`}><i className={item.icon}></i></div>
                <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10"><span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.sub}</span></div>
              </div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-3">{item.label}</p>
              <h3 className="text-4xl font-black text-white italic tracking-tighter group-hover:text-amber-400 transition-colors">{item.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 relative bg-[#010409] border border-slate-800 p-12 rounded-[3.4rem] shadow-2xl shadow-inner-deep">
           <div className="flex justify-between items-center mb-14">
              <h3 className="text-3xl font-black text-white tracking-widest uppercase italic">Earnings Graph</h3>
              <span className="flex items-center text-[10px] text-amber-500 font-black animate-pulse uppercase tracking-[0.5em] italic">
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-3"></span> LIVE UPDATE
              </span>
           </div>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.1} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <Area type="monotone" dataKey="val" stroke="#f59e0b" strokeWidth={5} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="relative bg-[#020617] border border-slate-800 rounded-[3.4rem] h-[640px] flex flex-col shadow-inner-deep">
           <div className="p-10 border-b border-white/5">
              <h3 className="text-2xl font-black text-white tracking-widest uppercase italic leading-none">Live History</h3>
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mt-3">Recent Activity</p>
           </div>
           <div className="flex-1 overflow-y-auto p-8 space-y-5 custom-scrollbar">
              {liveFeed.map((event) => (
                <div key={event.id} className="p-6 bg-slate-900/40 rounded-[2rem] border border-white/5 flex items-center space-x-5 group hover:border-amber-500/20 transition-all">
                  <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-2xl border border-white/5 shadow-inner-deep group-hover:scale-110 transition-transform">
                    {event.type === 'COMMISSION' ? '💰' : event.type === 'TEAM' ? '👥' : '⚡'}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-white uppercase tracking-wider mb-1 italic">{event.message}</p>
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{event.timestamp}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
