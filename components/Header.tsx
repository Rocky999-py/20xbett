
import React from 'react';
import { User, Language } from '../types';
import Logo from './Logo';
import { translations } from '../translations';

interface HeaderProps {
  user: User;
  isConnected: boolean;
  onConnect: () => void;
  onToggleMenu: () => void;
  lang: Language;
  setLang: (l: Language) => void;
}

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'EN', name: 'English', flag: '🇺🇸' },
  { code: 'BN', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'HI', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'UR', name: 'اردو', flag: '🇵🇰' },
  { code: 'NE', name: 'नेपाली', flag: '🇳🇵' },
  { code: 'AF', name: 'Afghani', flag: '🇦🇫' },
  { code: 'MY', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻' },
];

const Header: React.FC<HeaderProps> = ({ user, isConnected, onConnect, onToggleMenu, lang, setLang }) => {
  const t = (key: string) => translations[lang][key] || key;

  return (
    <header className="h-24 bg-[#010409]/90 border-b border-slate-800/50 flex items-center justify-between px-6 md:px-12 sticky top-0 z-[60] backdrop-blur-2xl">
      <div className="flex items-center">
        <button 
          onClick={onToggleMenu}
          className="lg:hidden p-3 mr-5 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 hover:text-amber-500 transition-colors"
        >
          <i className="fa-solid fa-bars-staggered text-xl"></i>
        </button>
        <div className="lg:hidden scale-75 origin-left">
          <Logo size="sm" />
        </div>
        <div className="hidden lg:flex items-center space-x-14">
          <div className="flex flex-col group cursor-default">
            <div className="flex items-center space-x-2 mb-1">
              <i className="fa-solid fa-coins text-[10px] text-amber-500"></i>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] font-rajdhani">{t('total_balance')}</span>
            </div>
            <span className="text-2xl font-rajdhani font-black text-white group-hover:text-amber-400 transition-colors leading-none">${user.balanceUSDT.toLocaleString()}</span>
          </div>
          <div className="flex flex-col group cursor-default">
             <div className="flex items-center space-x-2 mb-1">
              <i className="fa-brands fa-ethereum text-[10px] text-cyan-500"></i>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] font-rajdhani">Network Fee (BNB)</span>
            </div>
            <span className="text-2xl font-rajdhani font-black text-cyan-400 group-hover:text-cyan-300 transition-colors leading-none">{user.balanceBNB} <span className="text-xs text-slate-600">BNB</span></span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-8">
        {/* Language Selector */}
        <div className="relative group">
          <button className="flex items-center space-x-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold font-rajdhani hover:border-amber-500/50 transition-all">
            <span>{LANGUAGES.find(l => l.code === lang)?.flag}</span>
            <span className="hidden sm:inline">{LANGUAGES.find(l => l.code === lang)?.name}</span>
            <i className="fa-solid fa-chevron-down text-[10px] opacity-50"></i>
          </button>
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto no-scrollbar">
              {LANGUAGES.map(l => (
                <button 
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`w-full text-left px-5 py-3 text-xs font-bold font-rajdhani hover:bg-amber-500/10 flex items-center justify-between ${lang === l.code ? 'text-amber-400 bg-amber-500/5' : 'text-slate-400'}`}
                >
                  <span className="flex items-center space-x-3">
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </span>
                  {lang === l.code && <i className="fa-solid fa-check"></i>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isConnected ? (
          <div className="flex items-center space-x-4 bg-slate-900/30 p-1.5 pr-6 rounded-[2rem] border border-slate-800/50 shadow-2xl group cursor-pointer hover-gold-gradient transition-all">
            <div className="relative">
              <img src={user.profilePic} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-slate-800 group-hover:border-amber-500/50 transition-all" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#010409] rounded-full"></div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-rajdhani font-black uppercase text-slate-100 tracking-wider group-hover:text-amber-400 transition-colors">{user.fullName}</span>
              <span className="text-[9px] text-slate-600 font-mono tracking-tighter uppercase opacity-70">{t('level')} {user.currentLevel} Verified</span>
            </div>
          </div>
        ) : (
          <button 
            onClick={onConnect}
            className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-[0_10px_20px_rgba(146,64,14,0.3)] font-rajdhani"
          >
            {t('connect_wallet')}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
