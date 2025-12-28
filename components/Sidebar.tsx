
import React from 'react';
import { AppView } from '../types';
import Logo from './Logo';

interface SidebarProps {
  activeView: AppView;
  setView: (view: AppView) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: 'fa-solid fa-gauge-high' },
    { id: AppView.GAME_PORTAL, label: 'Game Portal', icon: 'fa-solid fa-gamepad' },
    { id: AppView.BETTING, label: 'Betting', icon: 'fa-solid fa-futbol' },
    { id: AppView.CASINO, label: 'Casino', icon: 'fa-solid fa-clover' },
    { id: AppView.PROFILE, label: 'Profile', icon: 'fa-solid fa-user-shield' },
    { id: AppView.REFERRAL, label: 'Referral', icon: 'fa-solid fa-link' },
    { id: AppView.TEAM, label: 'My Team', icon: 'fa-solid fa-users-rays' },
    { id: AppView.MLM_SALARY, label: 'Salary Hub', icon: 'fa-solid fa-money-bill-trend-up' },
    { id: AppView.WALLET, label: 'Wallet', icon: 'fa-solid fa-wallet' },
    { id: AppView.TRANSACTIONS, label: 'Logs', icon: 'fa-solid fa-clock-rotate-left' },
    { id: AppView.SETTINGS, label: 'Settings', icon: 'fa-solid fa-sliders' },
    { id: AppView.SUPPORT, label: 'Help Desk', icon: 'fa-solid fa-headset' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Main Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-[#010409] border-r border-slate-800/50 z-[110] 
        transform transition-transform duration-500 ease-in-out lg:relative lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)]
      `}>
        <div className="p-10 flex items-center justify-between">
          <Logo size="md" />
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-2xl p-2 text-slate-500 hover:text-amber-500">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <nav className="flex-1 px-5 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all duration-300 hover-gold-gradient border border-transparent ${
                activeView === item.id 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                : 'text-slate-500 hover:text-slate-100'
              }`}
            >
              <span className={`w-8 text-lg ${activeView === item.id ? 'text-amber-400' : 'text-slate-600'}`}>
                <i className={item.icon}></i>
              </span>
              <span className="font-rajdhani font-bold text-xs tracking-[0.2em] uppercase ml-3">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8">
          <div className="bg-slate-900/40 rounded-3xl p-5 border border-amber-500/5 shadow-inner-deep">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest font-rajdhani">Mainnet Sync</span>
              <span className="flex h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_12px_#f59e0b]"></span>
            </div>
            <p className="text-[9px] text-slate-400 font-mono truncate tracking-tight opacity-50 uppercase">BEP20 Node Operational</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
