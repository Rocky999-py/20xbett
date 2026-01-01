
import React, { useState, useEffect } from 'react';
import { MLMStats, LiveEvent, Language, Match, Game, User, AppView } from '../types.ts';
import { translations } from '../translations.ts';
import { SportsAPI } from '../api.ts';

interface DashboardViewProps {
  stats: MLMStats;
  liveFeed: LiveEvent[];
  lang: Language;
  setView: (v: AppView) => void;
  onBet: (amount: number, isWin: boolean, multiplier?: number) => void;
  user: User;
}

const getTeamIcon = (team: string): string => {
  const normalized = team.toLowerCase();
  const mapping: Record<string, string> = {
    'india': 'in', 'pakistan': 'pk', 'australia': 'au', 'england': 'gb',
    'south africa': 'za', 'new zealand': 'nz', 'west indies': 'vg',
    'sri lanka': 'lk', 'bangladesh': 'bd', 'afghanistan': 'af',
    'ireland': 'ie', 'zimbabwe': 'zw', 'netherlands': 'nl',
    'scotland': 'gb-sct', 'usa': 'us', 'nepal': 'np', 'oman': 'om',
    'namibia': 'na', 'uae': 'ae', 'canada': 'ca', 'man city': 'gb-eng',
    'liverpool': 'gb-eng', 'real madrid': 'es', 'barcelona': 'es'
  };

  for (const [key, code] of Object.entries(mapping)) {
    if (normalized.includes(key)) return `https://flagcdn.com/w160/${code}.png`;
  }
  return 'https://img.icons8.com/color/96/trophy.png';
};

const generateSchedule = (): Match[] => {
  const sports = ['Cricket', 'Football', 'Tennis', 'Basketball'];
  const teams = ['India', 'Australia', 'England', 'Argentina', 'France', 'Brazil'];
  const schedule: Match[] = [];

  for (let i = 1; i <= 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() + (i * 3));
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

const MOCK_GAMES: Game[] = [
  { id: 'g1', name: 'Aviator', provider: 'Spribe', category: 'Crash Games', img: 'https://images.unsplash.com/photo-1551732998-9573f695fdbb?auto=format&fit=crop&w=600', demoUrl: 'INTERNAL_AVIATOR' },
  { id: 'g2', name: 'Sweet Bonanza', provider: 'Pragmatic', category: 'Slots', img: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=600', demoUrl: '#' },
  { id: 'g3', name: 'Crazy Time', provider: 'Evolution', category: 'Live Casino', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600', demoUrl: '#' },
  { id: 'g4', name: 'Gates of Olympus', provider: 'Pragmatic', category: 'Slots', img: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?auto=format&fit=crop&w=600', demoUrl: '#' },
];

const MatchCard: React.FC<{ match: Match; onBetNow: (m: Match, side: 'W1'|'W2') => void }> = ({ match, onBetNow }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (match.isLive) return;
    const interval = setInterval(() => {
      const diff = new Date(match.startTime).getTime() - new Date().getTime();
      if (isNaN(diff) || diff <= 0) {
        setTimeLeft(match.startTime.includes(' ') ? match.startTime : 'STARTING...');
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
    <div className="min-w-[320px] bg-[#141d33] border border-white/5 rounded-[2.5rem] p-5 flex flex-col hover:border-blue-500/50 transition-all group shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center space-x-2">
           <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
           <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{match.sport}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-[9px] font-black text-white flex items-center gap-2 ${match.isLive ? 'bg-red-600 animate-pulse' : 'bg-slate-800'}`}>
          {match.isLive && <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>}
          {match.isLive ? 'LIVE' : timeLeft}
        </div>
      </div>
      
      {match.isLive && (
        <div className="mb-4 bg-black/30 rounded-xl px-3 py-2 border border-white/5 text-center">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-tighter leading-none">{match.startTime}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex flex-col items-center flex-1">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center p-2 mb-3 shadow-inner-deep border border-white/5 group-hover:scale-110 transition-transform">
            <img src={getTeamIcon(match.teamA)} alt={match.teamA} className="w-full h-full object-contain" />
          </div>
          <p className="text-[10px] font-black text-slate-100 uppercase truncate text-center w-full tracking-tighter">{match.teamA}</p>
        </div>
        <div className="flex flex-col items-center">
           <span className="text-slate-800 font-rajdhani font-black text-xl italic px-4 leading-none">VS</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center p-2 mb-3 shadow-inner-deep border border-white/5 group-hover:scale-110 transition-transform">
            <img src={getTeamIcon(match.teamB)} alt={match.teamB} className="w-full h-full object-contain" />
          </div>
          <p className="text-[10px] font-black text-slate-100 uppercase truncate text-center w-full tracking-tighter">{match.teamB}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button 
          onClick={() => onBetNow(match, 'W1')}
          className="bg-[#0b1223] rounded-2xl p-3 text-center border border-white/5 hover:border-blue-600/50 hover:bg-blue-600/10 transition-all flex flex-col items-center group/btn"
        >
          <p className="text-[8px] text-slate-600 font-bold mb-1 uppercase tracking-widest group-hover/btn:text-blue-400">W1</p>
          <p className="text-xl font-rajdhani font-black text-amber-500 italic leading-none">{match.odds.over}</p>
        </button>
        <button 
          onClick={() => onBetNow(match, 'W2')}
          className="bg-[#0b1223] rounded-2xl p-3 text-center border border-white/5 hover:border-blue-600/50 hover:bg-blue-600/10 transition-all flex flex-col items-center group/btn"
        >
          <p className="text-[8px] text-slate-600 font-bold mb-1 uppercase tracking-widest group-hover/btn:text-blue-400">W2</p>
          <p className="text-xl font-rajdhani font-black text-amber-500 italic leading-none">{match.odds.under}</p>
        </button>
      </div>
    </div>
  );
};

const DashboardView: React.FC<DashboardViewProps> = ({ stats, lang, setView, user, onBet }) => {
  const t = (key: string) => translations[lang][key] || key;
  const [liveArenaMatches, setLiveArenaMatches] = useState<Match[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState(true);
  const schedule = generateSchedule();

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const data = await SportsAPI.fetchLiveCricket();
        if (data && data.length > 0) {
          setLiveArenaMatches(data.filter(m => m.isLive).slice(0, 8));
        }
      } catch (e) {
        console.error("Live Arena Load Error", e);
      } finally {
        setIsLoadingLive(false);
      }
    };
    fetchLive();
  }, []);

  const handleQuickBet = (match: Match, side: 'W1'|'W2') => {
    // We navigate to betting view and could ideally pre-select, but for now we'll just show the feedback
    // and let the user explore. Real betable logic can be added here or we can jump to BettingView.
    setView(AppView.BETTING);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20 font-rajdhani">
      {/* 🚀 Dynamic Promotion Slider */}
      <div className="relative h-[300px] md:h-[520px] rounded-[3.5rem] overflow-hidden shadow-2xl group border border-white/5">
        <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[20s]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1223] via-[#0b1223]/70 to-transparent"></div>
        <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-10 md:px-24 max-w-4xl">
          <div className="flex items-center space-x-3 mb-6">
            <span className="px-3 py-1 bg-amber-600 text-white text-[10px] font-black rounded uppercase tracking-widest">Node Verified</span>
            <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest italic animate-pulse">Live Link Established</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-white leading-tight italic uppercase mb-6">
            GLOBAL <br /><span className="text-blue-500">BETTING HUB</span>
          </h2>
          <p className="text-slate-300 text-base md:text-xl mb-10 max-w-lg font-medium leading-relaxed">
            Premium sports betting on the BNB Smart Chain. Real-time cricket updates, instant MLM settlement, and 5-generation automated rewards.
          </p>
          <div className="flex gap-5">
            <button onClick={() => setView(AppView.BETTING)} className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black italic shadow-2xl active:scale-95 transition-all text-lg border border-blue-400/30">START BETTING</button>
            {user.isMLM && (
               <button onClick={() => setView(AppView.MLM_SALARY)} className="px-12 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-[2rem] font-black italic shadow-2xl active:scale-95 transition-all text-lg border border-white/10">SYSTEM UPGRADE</button>
            )}
          </div>
        </div>
      </div>

      {/* 🏟️ Live Events Scroller */}
      <section>
        <div className="flex justify-between items-end mb-8 px-4 md:px-0">
          <div>
            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Live Arena</h3>
            <p className="text-[10px] text-red-500 font-black tracking-[0.4em] uppercase mt-2 animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              Live Feed from CricData Node
            </p>
          </div>
          <button onClick={() => setView(AppView.BETTING)} className="text-[11px] text-blue-500 font-black uppercase tracking-widest hover:text-white transition-colors">Full Sportsbook ⌵</button>
        </div>
        
        <div className="flex space-x-5 overflow-x-auto no-scrollbar pb-8 px-4 md:px-0 scroll-smooth">
          {isLoadingLive ? (
            <div className="flex gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="min-w-[320px] h-[280px] bg-slate-900/50 rounded-[2.5rem] border border-white/5 animate-pulse flex flex-col items-center justify-center">
                  <i className="fa-solid fa-satellite-dish text-4xl text-slate-800 mb-4"></i>
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Scanning Markets...</span>
                </div>
              ))}
            </div>
          ) : liveArenaMatches.length === 0 ? (
             <div className="w-full h-40 flex flex-col items-center justify-center border border-white/5 rounded-[2.5rem] opacity-30 italic">
               <i className="fa-solid fa-cloud-moon text-3xl mb-2"></i>
               <p className="text-xs uppercase font-black tracking-widest">No Matches Currently Live</p>
             </div>
          ) : (
            liveArenaMatches.map(match => <MatchCard key={match.id} match={match} onBetNow={handleQuickBet} />)
          )}
        </div>
      </section>

      {/* 🔗 MLM Link Hub */}
      {user.isMLM && (
        <div className="bg-[#141d33] border border-white/5 p-8 rounded-[3.5rem] flex flex-wrap items-center justify-between gap-8 shadow-inner-deep group">
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
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Referral Node URL</span>
               <span className="text-sm font-mono text-blue-400 truncate">https://20xbet.site/ref/{user.id}</span>
             </div>
             <button 
               onClick={() => { navigator.clipboard.writeText(`https://20xbet.site/ref/${user.id}`); alert('Link Copied to Node!'); }} 
               className="w-12 h-12 bg-blue-600/20 text-blue-500 rounded-2xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center text-lg"
             >
               <i className="fa-solid fa-copy"></i>
             </button>
          </div>
        </div>
      )}

      {/* 🎰 Casino Hot-list */}
      <section>
        <div className="flex justify-between items-end mb-8 px-4 md:px-0">
          <div>
            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Casino Lobby</h3>
            <p className="text-[10px] text-purple-500 font-black tracking-[0.4em] uppercase mt-2">500+ Premium Titles Available</p>
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
            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Upcoming Schedule</h3>
            <p className="text-[10px] text-slate-500 font-black tracking-[0.4em] uppercase mt-2 italic">Next 60 Days Imported Nodes</p>
          </div>
          <button onClick={() => setView(AppView.BETTING)} className="text-[11px] text-blue-500 font-black uppercase tracking-widest hover:text-white transition-colors">See Calendar ⌵</button>
        </div>
        <div className="flex space-x-5 overflow-x-auto no-scrollbar pb-8 px-4 md:px-0 opacity-80 hover:opacity-100 transition-opacity">
          {schedule.map(match => <MatchCard key={match.id} match={match} onBetNow={handleQuickBet} />)}
        </div>
      </section>
    </div>
  );
};

export default DashboardView;
