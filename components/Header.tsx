
import React from 'react';
import { User, Language, AppView } from '../types';
import Logo from './Logo';
import { translations } from '../translations';

interface HeaderProps {
  user: User;
  isConnected: boolean;
  onConnect: () => void;
  onToggleMenu: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  setView: (v: AppView) => void;
  activeView: AppView;
}

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'EN', name: 'English', flag: '🇺🇸' },
  { code: 'BN', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'HI', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'UR', name: 'اردو', flag: '🇵🇰' },
];

const Header: React.FC<HeaderProps> = ({ user, isConnected, onConnect, lang, setLang, setView, activeView }) => {
  const t = (key: string) => translations[lang][key] || key;

  const mainNav = [
    { id: AppView.DASHBOARD, label: t('dashboard'), icon: 'fa-house' },
    { id: AppView.BETTING, label: t('betting'), icon: 'fa-volleyball' },
    { id: AppView.CASINO, label: t('casino'), icon: 'fa-gamepad' },
    { id: AppView.MLM_SALARY, label: 'MLM SYSTEM', icon: 'fa-share-nodes' },
    { id: AppView.WALLET, label: t('wallet'), icon: 'fa-wallet' },
    { id: AppView.SUPPORT, label: t('support'), icon: 'fa-headset' },
  ];

  return (
    <div className="flex flex-col w-full z-[100] sticky top-0 shadow-2xl">
      {/* Top Layer */}
      <header className="h-16 bg-[#0b1223] border-b border-white/5 flex items-center justify-between px-4 md:px-10">
        <div className="flex items-center space-x-8">
          <div onClick={() => setView(AppView.DASHBOARD)} className="cursor-pointer">
            <Logo size="sm" />
          </div>
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">USDT Balance</span>
              <span className="text-xl font-rajdhani font-black text-blue-400 italic leading-none">${user.balanceUSDT.toFixed(2)}</span>
            </div>
            <div className="w-px h-6 bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">BNB Balance</span>
              <span className="text-xl font-rajdhani font-black text-amber-500 italic leading-none">{user.balanceBNB.toFixed(3)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Language Selector */}
          <div className="relative group">
            <button className="flex items-center space-x-2 bg-slate-900 border border-white/10 px-3 py-1.5 rounded-lg text-[11px] font-bold font-rajdhani uppercase">
              <span>{LANGUAGES.find(l => l.code === lang)?.flag} {lang}</span>
              <i className="fa-solid fa-chevron-down text-[8px] opacity-50"></i>
            </button>
            <div className="absolute right-0 top-full mt-1 w-40 bg-[#0f172a] border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-2xl overflow-hidden">
              {LANGUAGES.map(l => (
                <button key={l.code} onClick={() => setLang(l.code)} className="w-full text-left px-4 py-3 text-xs font-bold font-rajdhani hover:bg-blue-600 transition-colors flex items-center space-x-3">
                  <span>{l.flag}</span>
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div onClick={() => setView(AppView.PROFILE)} className="flex items-center space-x-3 bg-blue-600/10 border border-blue-600/30 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-blue-600/20 transition-all">
            <img src={user.profilePic} className="w-7 h-7 rounded-lg object-cover" />
            <span className="hidden sm:inline text-xs font-black text-white uppercase tracking-wider">{user.fullName.split(' ')[0]}</span>
          </div>
        </div>
      </header>

      {/* Nav Layer */}
      <nav className="h-14 bg-[#1a56db] flex items-center justify-center px-4 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center space-x-2 md:space-x-4 max-w-full">
          {mainNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeView === item.id 
                ? 'bg-white text-blue-700 shadow-xl scale-105' 
                : 'text-white hover:bg-white/10'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-sm`}></i>
              <span className="font-rajdhani font-black text-[11px] uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Header;
