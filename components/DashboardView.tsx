
import React from 'react';
import { MLMStats, LiveEvent } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardViewProps {
  stats: MLMStats;
  liveFeed: LiveEvent[];
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

const DashboardView: React.FC<DashboardViewProps> = ({ stats, liveFeed }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* 🚀 Creative Stats Prism Grid */}
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 relative z-10 gap-6">
          <div>
            <h2 className="text-4xl font-rajdhani font-black flex items-center text-white tracking-widest uppercase italic leading-none">
              <span className="w-16 h-[2px] bg-gradient-to-r from-amber-500 to-transparent mr-5"></span>
              Neural Command
            </h2>
            <p className="text-[10px] text-amber-500/70 font-black tracking-[0.5em] ml-20 mt-2 uppercase">Core Financial Synchronization</p>
          </div>
          <div className="flex items-center space-x-6 bg-slate-900/30 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Global Node</span>
                <span className="text-xs font-mono text-amber-400 font-bold tracking-widest">ENCRYPTED-ACTIVE</span>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-[#020617] border border-amber-500/20 flex items-center justify-center shadow-inner-deep">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Network Wealth', val: `$${stats.totalProfit.toLocaleString()}`, icon: 'fa-solid fa-vault', sub: 'Main Balance', glow: 'shadow-[0_0_40px_rgba(245,158,11,0.15)]', border: 'hover:border-amber-500/50' },
            { label: 'Direct Yield', val: `$${stats.referralIncome.toLocaleString()}`, icon: 'fa-solid fa-diagram-next', sub: 'Referral Net', glow: 'shadow-[0_0_40px_rgba(6,182,212,0.1)]', border: 'hover:border-cyan-500/50' },
            { label: 'Global Matrix', val: `$${stats.referralCommission.toLocaleString()}`, icon: 'fa-solid fa-users-viewfinder', sub: 'Team Bonus', glow: 'shadow-[0_0_40px_rgba(59,130,246,0.1)]', border: 'hover:border-blue-500/50' },
            { label: 'Salary Node', val: `$${stats.monthlySalary.toLocaleString()}`, icon: 'fa-solid fa-briefcase', sub: 'Fixed Stream', glow: 'shadow-[0_0_40px_rgba(16,185,129,0.1)]', border: 'hover:border-emerald-500/50' },
            { label: 'Betting Rebate', val: `$${stats.bettingCommission.toLocaleString()}`, icon: 'fa-solid fa-futbol', sub: 'Risk Cover', glow: 'shadow-[0_0_40px_rgba(244,63,94,0.1)]', border: 'hover:border-rose-500/50' },
            { label: 'Volume Royalty', val: `$${stats.bettingMonthlySalary.toLocaleString()}`, icon: 'fa-solid fa-award', sub: 'Betting Salary', glow: 'shadow-[0_0_40px_rgba(99,102,241,0.1)]', border: 'hover:border-indigo-500/50' },
            { label: 'Reserve Pool', val: `$${stats.mlmMonthlyFund.toLocaleString()}`, icon: 'fa-solid fa-building-columns', sub: 'MLM Monthly', glow: 'shadow-[0_0_40px_rgba(139,92,246,0.1)]', border: 'hover:border-violet-500/50' },
            { label: 'Jackpot Sink', val: `$${stats.bettingMonthlyFund.toLocaleString()}`, icon: 'fa-solid fa-clover', sub: 'Global Fund', glow: 'shadow-[0_0_40px_rgba(249,115,22,0.1)]', border: 'hover:border-orange-500/50' },
          ].map((item, idx) => (
            <div key={idx} className={`group relative p-1 rounded-[2.5rem] transition-all duration-700 ${item.glow} ${item.border} hover-gold-gradient`}>
              <div className="relative h-full bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#1e1b4b] p-8 rounded-[2.4rem] border border-white/5 overflow-hidden shadow-inner-deep">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full translate-x-16 -translate-y-16 group-hover:bg-amber-500/10 transition-colors"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className={`text-3xl text-slate-600 transition-all duration-700 group-hover:text-amber-400 group-hover:scale-125 group-hover:rotate-12`}>
                    <i className={item.icon}></i>
                  </div>
                  <div className="px-3 py-1 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 group-hover:border-amber-500/30 transition-colors">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-rajdhani group-hover:text-amber-500 transition-colors">{item.sub}</span>
                  </div>
                </div>
                
                <div className="relative z-10">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-3 font-rajdhani">{item.label}</p>
                  <div className="flex items-baseline space-x-2">
                    <h3 className="text-4xl font-rajdhani font-black text-white group-hover:text-amber-400 transition-all duration-700 tracking-tighter italic">
                      {item.val}
                    </h3>
                    <span className="text-[10px] text-slate-600 font-black tracking-widest group-hover:text-amber-600 transition-colors">USDT</span>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* 📉 Deep Blue Gradient Performance Section */}
        <div className="xl:col-span-2 group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/10 via-slate-800/20 to-transparent rounded-[3.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
          
          <div className="relative bg-gradient-to-b from-[#0f172a] to-[#020617] border border-slate-800 p-12 rounded-[3.4rem] shadow-2xl overflow-hidden shadow-inner-deep">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-14 relative z-10 gap-6">
              <div>
                <h3 className="text-3xl font-rajdhani font-black flex items-center text-white tracking-widest uppercase italic leading-none">
                  <span className="relative flex h-3 w-3 mr-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                  Market Dynamics
                </h3>
                <p className="text-[10px] text-slate-600 mt-2 uppercase font-black tracking-[0.4em] ml-12">Neural Odds Synchronization Pulse</p>
              </div>
              <div className="flex space-x-3 bg-black/40 p-2 rounded-2xl border border-white/5">
                {['1H', '24H', '7D', 'ALL'].map(t => (
                  <button key={t} className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all font-rajdhani uppercase ${t === '24H' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40' : 'bg-slate-900 text-slate-500 hover:text-amber-400'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[400px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.2} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} dy={15} />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} dx={-15} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.95)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '24px', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}
                    itemStyle={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="val" stroke="#f59e0b" strokeWidth={5} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(146,64,14,0.05),transparent_50%)] pointer-events-none"></div>
          </div>
        </div>

        {/* 🔔 Deep Activity Feed with Glowing Borders */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-b from-amber-700/10 to-transparent rounded-[3.5rem] blur opacity-50"></div>
          
          <div className="relative bg-[#010409] border border-slate-800 rounded-[3.4rem] flex flex-col h-[640px] overflow-hidden shadow-2xl backdrop-blur-3xl shadow-inner-deep">
            <div className="p-10 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/10">
              <div>
                <h3 className="text-2xl font-rajdhani font-black text-white tracking-widest uppercase italic">Live Pulse</h3>
                <p className="text-[10px] text-amber-500 font-black animate-pulse uppercase tracking-widest mt-1">Matrix Synchronization Active</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#020617] flex items-center justify-center border border-amber-500/10 shadow-xl group-hover:border-amber-500/40 transition-all">
                <i className="fa-solid fa-tower-broadcast text-xl text-slate-700 group-hover:text-amber-500 animate-pulse transition-colors"></i>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-5 custom-scrollbar">
              {liveFeed.map((event) => (
                <div key={event.id} className="relative group/item">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent rounded-3xl opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center space-x-5 p-6 bg-slate-900/20 rounded-[2rem] border border-white/5 hover:border-amber-500/20 transition-all duration-500 cursor-default">
                    <div className="w-14 h-14 bg-[#020617] rounded-2xl flex items-center justify-center text-2xl border border-white/5 shadow-inner-deep transform group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-500">
                      {event.type === 'COMMISSION' && <i className="fa-solid fa-coins text-amber-500"></i>}
                      {event.type === 'INCOME' && <i className="fa-solid fa-chart-line text-emerald-500"></i>}
                      {event.type === 'TEAM' && <i className="fa-solid fa-user-plus text-cyan-500"></i>}
                      {event.type === 'LEVEL' && <i className="fa-solid fa-crown text-amber-400"></i>}
                      {event.type === 'BONUS' && <i className="fa-solid fa-gift text-rose-500"></i>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black leading-relaxed text-slate-100 mb-1 line-clamp-2 uppercase font-rajdhani tracking-wider">{event.message}</p>
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] font-rajdhani">{event.timestamp}</span>
                         <span className="text-[9px] text-amber-500/30 font-mono tracking-tighter uppercase">Nexus-Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 bg-slate-950/50 border-t border-slate-800/50 text-center">
               <button className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] hover:text-amber-400 transition-colors font-rajdhani">Establish Archive Link ⌵</button>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
};

export default DashboardView;
