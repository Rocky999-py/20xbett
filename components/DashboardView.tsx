
import React, { useState, useEffect } from 'react';
import { MLMStats, LiveEvent, Language, Match, Game, User, AppView } from '../types.ts';
import { translations } from '../translations.ts';

interface DashboardViewProps {
  stats: MLMStats;
  liveFeed: LiveEvent[];
  lang: Language;
  setView: (v: AppView) => void;
  onBet: (amount: number, isWin: boolean) => void;
  user: User;
}

// Utility to get high-quality flags or icons
const getTeamIcon = (team: string): string => {
  const icons: Record<string, string> = {
    'India': 'https://flagcdn.com/w160/in.png',
    'Pakistan': 'https://flagcdn.com/w160/pk.png',
    'Man City': 'https://img.icons8.com/color/96/manchester-city.png',
    'Real Madrid': 'https://img.icons8.com/color/96/real-madrid.png',
    'Bangladesh': 'https://flagcdn.com/w160/bd.png',
    'Sri Lanka': 'https://flagcdn.com/w160/lk.png',
    'Australia': 'https://flagcdn.com/w160/au.png',
    'England': 'https://flagcdn.com/w160/gb.png',
    'Argentina': 'https://flagcdn.com/w160/ar.png',
    'France': 'https://flagcdn.com/w160/fr.png',
    'Brazil': 'https://flagcdn.com/w160/br.png',
    'Germany': 'https://flagcdn.com/w160/de.png'
  };
  return icons[team] || 'https://img.icons8.com/color/96/trophy.png';
};

// Generates a schedule for the next 60 days
const generateSchedule = (): Match[] => {
  const sports = ['Cricket', 'Football', 'Tennis', 'Basketball'];
  const teams = ['India', 'Pakistan', 'Australia', 'England', 'Argentina', 'France', 'Brazil', 'Germany'];
  const schedule: Match[] = [];

  for (let i = 1; i <= 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() + (i * 3)); // Spread over 60 days
    const teamA = teams[Math.floor(Math.random() * teams.length)];
    let teamB = teams[Math.floor(Math.random() * teams.length)];
    while (teamB === teamA) teamB = teams[Math.floor(Math.random() * teams.length)];

    schedule.push({
      id: `sch-${i}`,
      sport: sports[Math.floor(Math.random() * sports.length)],
      teamA,
      teamB,
      startTime: date.toISOString(),
      isLive: false,
      odds: { over: 1.70 + Math.random(), under: 1.70 + Math.random(), line: 2.5 }
    });
  }
  return schedule;
};

const MOCK_LIVE: Match[] = [
  { id: 'l1', sport: 'Cricket', teamA: 'India', teamB: 'Pakistan', startTime: 'LIVE 14.2 Ov', isLive: true, odds: { over: 1.65, under: 2.10, line: 310.5 } },
  { id: 'l2', sport: 'Football', teamA: 'Man City', teamB: 'Real Madrid', startTime: '82\' LIVE', isLive: true, odds: { over: 1.88, under: 1.88, line: 2.5 } },
];

const MOCK_GAMES: Game[] = [
  { id: 'g1', name: 'Aviator', provider: 'Spribe', category: 'Crash Games', img: 'https://images.unsplash.com/photo-1551732998-9573f695fdbb?auto=format&fit=crop&w=600', demoUrl: 'INTERNAL_AVIATOR' },
  { id: 'g2', name: 'Sweet Bonanza', provider: 'Pragmatic', category: 'Slots', img: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=600', demoUrl: '#' },
  { id: 'g3', name: 'Crazy Time', provider: 'Evolution', category: 'Live Casino', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600', demoUrl: '#' },
  { id: 'g4', name: 'Gates of Olympus', provider: 'Pragmatic', category: 'Slots', img: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?auto=format&fit=crop&w=600', demoUrl: '#' },
];

const MatchCard: React.FC<{ match: Match }> = ({ match }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (match.isLive) return;
    const interval = setInterval(() => {
      const diff = new Date(match.startTime).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft('STARTING...');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${days}d ${hours}h ${mins}m`);
    }, 1000);
    return () => clearInterval(interval);
  }, [match.startTime, match.isLive]);

  return (
    <div className="min-w-[320px] bg-[#141d33] border border-white/5 rounded-[2rem] p-5 flex flex-col hover:border-blue-500/50 transition-all cursor-pointer group shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center space-x-2">
           <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
           <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{match.sport}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-[9px] font-black text-white ${match.isLive ? 'bg-red-600 animate-pulse' : 'bg-slate-800'}`}>
          {match.isLive ? match.startTime : `STARTS IN ${timeLeft}`}
        </span>
      </div>
      
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex flex-col items-center flex-1">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center p-2 mb-3 shadow-inner-deep border border-white/5 group-hover:scale-110 transition-transform">
            <img src={getTeamIcon(match.teamA)} alt={match.teamA} className="w-full h-full object-contain" />
          </div>
          <p className="text-[11px] font-black text-slate-100 uppercase truncate text-center w-full tracking-tighter">{match.teamA}</p>
        </div>
        <div className="flex flex-col items-center">
           <span className="text-slate-800 font-rajdhani font-black text-xl italic px-4 leading-none">VS</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center p-2 mb-3 shadow-inner-deep border border-white/5 group-hover:scale-110 transition-transform">
            <img src={getTeamIcon(match.teamB)} alt={match.teamB} className="w-full h-full object-contain" />
          </div>
          <p className="text-[11px] font-black text-slate-100 uppercase truncate text-center w-full tracking-tighter">{match.teamB}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0b1223] rounded-2xl p-3 text-center border border-white/5 group-hover:border-blue-600/30 transition-all">
          <p className="text-[8px] text-slate-600 font-bold mb-1 uppercase tracking-widest">W1</p>
          <p className="text-xl font-rajdhani font-black text-amber-500 italic">{match.odds.over}</p>
        </div>
        <div className="bg-[#0b1223] rounded-2xl p-3 text-center border border-white/5 group-hover:border-blue-600/30 transition-all">
          <p className="text-[8px] text-slate-600 font-bold mb-1 uppercase tracking-widest">W2</p>
          <p className="text-xl font-rajdhani font-black text-amber-500 italic">{match.odds.under}</p>
        </div>
      </div>
    </div>
  );
};

const DashboardView: React.FC<DashboardViewProps> = ({ stats, lang, setView, user }) => {
  const t = (key: string) => translations[lang][key] || key;
  const schedule = generateSchedule();

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20 font-rajdhani">
      {/* 🚀 Dynamic Promotion Slider (Static for now but designed for slider) */}
      <div className="relative h-[300px] md:h-[480px] rounded-[3rem] overflow-hidden shadow-2xl group border border-white/5">
        <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[20s]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1223] via-[#0b1223]/60 to-transparent"></div>
        <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-10 md:px-24 max-w-4xl">
          <div className="flex items-center space-x-3 mb-6">
            <span className="px-3 py-1 bg-amber-600 text-white text-[10px] font-black rounded uppercase tracking-widest">World Cup imported</span>
            <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">60 Days Active Market</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-white leading-tight italic uppercase mb-6">
            GLOBAL <br /><span className="text-blue-500">BETTING HUB</span>
          </h2>
          <p className="text-slate-300 text-base md:text-xl mb-10 max-w-lg font-medium leading-relaxed">
            The most advanced automated betting and MLM ecosystem on BNB Smart Chain. 
            Real-time odds, instant settlement, and 5-generation rewards.
          </p>
          <div className="flex gap-5">
            <button onClick={() => setView(AppView.BETTING)} className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black italic shadow-2xl active:scale-95 transition-all text-lg">START BETTING</button>
            {user.isMLM && (
               <button onClick={() => setView(AppView.MLM_SALARY)} className="px-12 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-[1.5rem] font-black italic shadow-2xl active:scale-95 transition-all text-lg border border-white/10">MLM UPGRADE</button>
            )}
          </div>
        </div>
      </div>

      {/* 🔗 MLM Link Hub */}
      {user.isMLM && (
        <div className="bg-[#141d33] border border-white/5 p-8 rounded-[3rem] flex flex-wrap items-center justify-between gap-8 shadow-inner-deep group">
          <div className="flex items-center space-x-12">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Direct Partners</span>
              <span className="text-3xl font-black text-blue-400 italic leading-none">{stats.directPartners}</span>
            </div>
            <div className="w-px h-12 bg-white/5"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Network Size</span>
              <span className="text-3xl font-black text-amber-500 italic leading-none">{stats.totalTeam}</span>
            </div>
          </div>
          <div className="flex-1 flex items-center space-x-4 bg-black/40 border border-white/10 px-8 py-4 rounded-[2rem] max-w-2xl group-hover:border-blue-500/30 transition-colors">
             <div className="flex flex-col flex-1 truncate">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Your Referral Node</span>
               <span className="text-sm font-mono text-blue-400 truncate">https://20xbet.site/ref/{user.id}</span>
             </div>
             <button 
               onClick={() => { navigator.clipboard.writeText(`https://20xbet.site/ref/${user.id}`); alert('Link Copied to Node!'); }} 
               className="w-12 h-12 bg-blue-600/20 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center text-lg"
             >
               <i className="fa-solid fa-copy"></i>
             </button>
          </div>
        </div>
      )}

      {/* 🏟️ Live Events Scroller */}
      <section>
        <div className="flex justify-between items-end mb-8 px-4 md:px-0">
          <div>
            <h3 className="text-3xl font-rajdhani font-black text-white italic uppercase tracking-tighter leading-none">Live Arena</h3>
            <p className="text-[10px] text-red-500 font-black tracking-[0.4em] uppercase mt-2 animate-pulse">In-Play Markets Active</p>
          </div>
          <button onClick={() => setView(AppView.BETTING)} className="text-[11px] text-blue-500 font-black uppercase tracking-widest hover:text-white transition-colors">Full Sportsbook ⌵</button>
        </div>
        <div className="flex space-x-5 overflow-x-auto no-scrollbar pb-8 px-4 md:px-0">
          {MOCK_LIVE.map(match => <MatchCard key={match.id} match={match} />)}
        </div>
      </section>

      {/* 🎰 Casino Hot-list */}
      <section>
        <div className="flex justify-between items-end mb-8 px-4 md:px-0">
          <div>
            <h3 className="text-3xl font-rajdhani font-black text-white italic uppercase tracking-tighter leading-none">Casino Lobby</h3>
            <p className="text-[10px] text-purple-500 font-black tracking-[0.4em] uppercase mt-2">500+ Premium Titles</p>
          </div>
          <button onClick={() => setView(AppView.CASINO)} className="text-[11px] text-blue-500 font-black uppercase tracking-widest hover:text-white transition-colors">Browse Games ⌵</button>
        </div>
        <div className="flex space-x-6 overflow-x-auto no-scrollbar pb-8 px-4 md:px-0">
          {MOCK_GAMES.map(game => (
            <div key={game.id} onClick={() => setView(AppView.CASINO)} className="min-w-[200px] group cursor-pointer">
              <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/5 group-hover:border-purple-500 transition-all shadow-xl mb-4">
                <img src={game.img} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1223] via-transparent to-transparent"></div>
                <div className="absolute bottom-5 left-5">
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[9px] font-black text-slate-300 uppercase tracking-tighter">{game.provider}</span>
                </div>
              </div>
              <h4 className="text-sm font-black text-slate-100 uppercase tracking-wider truncate text-center group-hover:text-purple-400 transition-colors">{game.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 📅 2-Month Schedule Highlights */}
      <section>
        <div className="flex justify-between items-end mb-8 px-4 md:px-0">
          <div>
            <h3 className="text-3xl font-rajdhani font-black text-white italic uppercase tracking-tighter leading-none">Upcoming Schedule</h3>
            <p className="text-[10px] text-slate-500 font-black tracking-[0.4em] uppercase mt-2">Next 60 Days Imported</p>
          </div>
          <button onClick={() => setView(AppView.BETTING)} className="text-[11px] text-blue-500 font-black uppercase tracking-widest hover:text-white transition-colors">See Calendar ⌵</button>
        </div>
        <div className="flex space-x-5 overflow-x-auto no-scrollbar pb-8 px-4 md:px-0 opacity-80 hover:opacity-100 transition-opacity">
          {schedule.map(match => <MatchCard key={match.id} match={match} />)}
        </div>
      </section>
    </div>
  );
};

export default DashboardView;
