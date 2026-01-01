
import React, { useState } from 'react';
import { CASINO_CATEGORIES } from '../constants.tsx';
import { Game, User, Language } from '../types.ts';
import { translations } from '../translations.ts';
import CrashGame from './CrashGame.tsx';
import RouletteGame from './RouletteGame.tsx';

const PLAYABLE_GAMES: Game[] = [
  { id: 'g1', name: 'Sweet Bonanza', provider: 'Pragmatic', category: 'Slots', img: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&q=80&w=600', demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20sweetbonanza&lang=en&cur=USD&sysName=WEB&jurisdiction=99' },
  { id: 'g3', name: 'Aviator Pro', provider: 'Spribe', category: 'Crash Games', img: 'https://images.unsplash.com/photo-1551732998-9573f695fdbb?auto=format&fit=crop&q=80&w=600', demoUrl: 'INTERNAL_AVIATOR' },
  { id: 'g4', name: 'Roulette Royale', provider: 'Evolution', category: 'Table Games', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600', demoUrl: 'INTERNAL_ROULETTE' },
  { id: 'g5', name: 'Gates of Olympus', provider: 'Pragmatic', category: 'Slots', img: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?auto=format&fit=crop&q=80&w=600', demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympus&lang=en&cur=USD&sysName=WEB&jurisdiction=99' },
  { id: 'g6', name: 'Lightning Blackjack', provider: 'Evolution', category: 'Live Casino', img: 'https://images.unsplash.com/photo-1518893063132-36e46dbe2428?auto=format&fit=crop&q=80&w=600', demoUrl: 'https://www.evolution.com/our-games/live-blackjack/' },
  { id: 'g7', name: 'Big Bass Bonanza', provider: 'Pragmatic', category: 'Slots', img: 'https://images.unsplash.com/photo-1533910534207-90f31029a78e?auto=format&fit=crop&q=80&w=600', demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs10bbbonanza&lang=en&cur=USD&sysName=WEB&jurisdiction=99' },
  { id: 'g8', name: 'Dog House Megaways', provider: 'Pragmatic', category: 'Slots', img: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=600', demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vswaysdoghouse&lang=en&cur=USD&sysName=WEB&jurisdiction=99' },
  { id: 'g9', name: 'Crazy Time', provider: 'Evolution', category: 'Live Casino', img: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&q=80&w=600', demoUrl: 'https://www.evolution.com/our-games/crazy-time/' }
];

interface CasinoViewProps {
  user: User;
  onBet: (amount: number, isWin: boolean, multiplier?: number) => void;
  lang: Language;
}

const CasinoView: React.FC<CasinoViewProps> = ({ user, onBet, lang }) => {
  const t = (key: string) => translations[lang][key] || key;
  const [activeCategory, setActiveCategory] = useState('Slots');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const renderInternalGame = () => {
    if (!selectedGame) return null;
    if (selectedGame.demoUrl === 'INTERNAL_AVIATOR') {
      return <CrashGame user={user} onBet={onBet} />;
    }
    if (selectedGame.demoUrl === 'INTERNAL_ROULETTE') {
      return <RouletteGame user={user} onBet={onBet} />;
    }
    return null;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 h-full pb-20 font-rajdhani">
      
      {/* 🚀 Game Portal Modal (Full Screen) */}
      {selectedGame && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-0 md:p-6 lg:p-10">
          <div className="relative w-full h-full bg-[#020617] md:rounded-[4rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl">
             <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-950/50">
                <div className="flex items-center space-x-4">
                  <span className="hidden md:block text-[10px] text-purple-500 font-black uppercase tracking-widest">Now Playing:</span>
                  <h3 className="text-xl font-black text-white uppercase italic">{selectedGame.name}</h3>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="hidden lg:flex flex-col items-end">
                    <span className="text-[9px] text-slate-500 font-black uppercase">Wallet Balance</span>
                    <span className="text-amber-500 font-black italic leading-none">${user.balanceUSDT.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedGame(null)} 
                    className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-2xl"
                  >
                    <i className="fa-solid fa-xmark text-xl"></i>
                  </button>
                </div>
             </div>
             <div className="flex-1 overflow-hidden">
                {selectedGame.demoUrl.startsWith('https') ? (
                  <iframe src={selectedGame.demoUrl} className="w-full h-full border-none" allow="autoplay; encrypted-media; fullscreen" title={selectedGame.name} />
                ) : (
                  renderInternalGame()
                )}
             </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#1e1b4b] via-[#020617] to-black p-12 md:p-20 rounded-[4rem] border border-purple-500/20 relative overflow-hidden shadow-inner-deep">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="relative z-10">
          <h2 className="text-5xl md:text-8xl font-black text-white mb-6 uppercase italic tracking-tighter leading-none">VEGAS <br /><span className="text-purple-500">DIGITAL</span></h2>
          <p className="text-slate-400 text-lg md:text-2xl max-w-2xl font-medium tracking-wide">Premium Slots and Live Dealer experiences with decentralized BEP20 settlement.</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex space-x-4 overflow-x-auto no-scrollbar">
        {CASINO_CATEGORIES.map(cat => (
          <button 
            key={cat.name} 
            onClick={() => setActiveCategory(cat.name)}
            className={`px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest flex items-center space-x-4 border transition-all ${
              activeCategory === cat.name 
              ? 'bg-purple-600 border-purple-400 text-white shadow-xl' 
              : 'bg-slate-900/50 border-white/5 text-slate-500 hover:text-white'
            }`}
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-xs">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {PLAYABLE_GAMES.filter(g => activeCategory === 'Slots' || g.category === activeCategory).map(game => (
          <div key={game.id} onClick={() => setSelectedGame(game)} className="group cursor-pointer">
            <div className={`relative aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-purple-500 group-hover:-translate-y-2 shadow-2xl ${game.demoUrl === 'INTERNAL_AVIATOR' ? 'bg-[#1b1a4a]' : ''}`}>
               <img src={game.img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" alt={game.name} />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
               {game.demoUrl === 'INTERNAL_AVIATOR' && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform">
                    <p className="text-3xl font-black italic text-white/20 uppercase tracking-tighter" style={{ fontFamily: 'Montserrat, sans-serif' }}>Aviator</p>
                 </div>
               )}
               <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-xl">
                    <i className="fa-solid fa-play ml-1"></i>
                  </div>
               </div>
               <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest mb-1">{game.provider}</p>
                  <h4 className="text-lg font-black text-white uppercase italic tracking-tighter truncate leading-none">{game.name}</h4>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasinoView;
