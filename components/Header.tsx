
import React from 'react';
import { User } from '../types';
import Logo from './Logo';

interface HeaderProps {
  user: User;
  isConnected: boolean;
  onConnect: () => void;
  onToggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, isConnected, onConnect, onToggleMenu }) => {
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
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] font-rajdhani">Master Balance</span>
            </div>
            <span className="text-2xl font-rajdhani font-black text-white group-hover:text-amber-400 transition-colors leading-none">${user.balanceUSDT.toLocaleString()}</span>
          </div>
          <div className="flex flex-col group cursor-default">
             <div className="flex items-center space-x-2 mb-1">
              <i className="fa-brands fa-ethereum text-[10px] text-cyan-500"></i>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] font-rajdhani">Native Gas</span>
            </div>
            <span className="text-2xl font-rajdhani font-black text-cyan-400 group-hover:text-cyan-300 transition-colors leading-none">{user.balanceBNB} <span className="text-xs text-slate-600">BNB</span></span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-8">
        {/* Compact Wallet View for Small Screens */}
        <div className="flex lg:hidden flex-col items-end mr-3">
          <span className="text-[10px] text-white font-black font-rajdhani tracking-widest">${user.balanceUSDT.toLocaleString()}</span>
          <span className="text-[9px] text-cyan-500 font-black font-rajdhani tracking-widest">{user.balanceBNB} BNB</span>
        </div>

        {isConnected ? (
          <div className="flex items-center space-x-4 bg-slate-900/30 p-1.5 pr-6 rounded-[2rem] border border-slate-800/50 shadow-2xl group cursor-pointer hover-gold-gradient transition-all">
            <div className="relative">
              <img src={user.profilePic} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-slate-800 group-hover:border-amber-500/50 transition-all" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#010409] rounded-full"></div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-rajdhani font-black uppercase text-slate-100 tracking-wider group-hover:text-amber-400 transition-colors">{user.fullName}</span>
              <span className="text-[9px] text-slate-600 font-mono tracking-tighter uppercase opacity-70">Tier {user.currentLevel} Verified</span>
            </div>
          </div>
        ) : (
          <button 
            onClick={onConnect}
            className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-[0_10px_20px_rgba(146,64,14,0.3)] font-rajdhani"
          >
            Authorize Node
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
