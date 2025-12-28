
import React from 'react';
import { AppView, Language } from '../types';
import Logo from './Logo';
import { translations } from '../translations';

interface SidebarProps {
  activeView: AppView;
  setView: (view: AppView) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  lang: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, isOpen, setIsOpen, lang }) => {
  const t = (key: string) => translations[lang][key] || key;

  const menuItems = [
    { id: AppView.DASHBOARD, label: t('dashboard'), icon: 'fa-solid fa-gauge-high' },
    { id: AppView.GAME_PORTAL, label: 'Game Center', icon: 'fa-solid fa-gamepad' },
    { id: AppView.BETTING, label: t('betting'), icon: 'fa-solid fa-futbol' },
    { id: AppView.CASINO, label: t('casino'), icon: 'fa-solid fa-clover' },
    { id: AppView.PROFILE, label: t('profile'), icon: 'fa-solid fa-user-shield' },
    { id: AppView.REFERRAL, label: t('invite_friends'), icon: 'fa-solid fa-link' },
    { id: AppView.TEAM, label: t('team'), icon: 'fa-solid fa-users-rays' },
    { id: AppView.MLM_SALARY, label: t('salary'), icon: 'fa-solid fa-money-bill-trend-up' },
    { id: AppView.WALLET, label: t('wallet'), icon: 'fa-solid fa-wallet' },
    { id: AppView.TRANSACTIONS, label: 'History', icon: 'fa-solid fa-clock-rotate-left' },
    { id: AppView.SETTINGS, label: 'Settings', icon: 'fa-solid fa-sliders' },
    { id: AppView.SUPPORT, label: t('support'), icon: 'fa-solid fa-headset' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

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
          <div className="bg-slate-900/40 rounded-3xl p-5 border border-amber-500/5 shadow-inner-deep text-center">
            <span className="text-[10px] text-green-500 font-black uppercase tracking-widest font-rajdhani flex items-center justify-center">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Live & Secure
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
