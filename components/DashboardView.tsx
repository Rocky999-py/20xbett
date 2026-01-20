
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
    <div className="min-w-[340px] bg-[#141d33] border border-white/5 rounded-[2.5rem] p-6 flex flex-col hover:border-blue-500/50 transition-all group shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center space-x-2">
           <span className={`w-1.5 h-4 rounded-full ${match.isLive ? 'bg-red-600' : 'bg-blue-600'}`}></span>
           <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{match.sport}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-[9px] font-black text-white flex items-center gap-2 ${match.isLive ? 'bg-red-600/20 border border-red-500/30' : 'bg-slate-800'}`}>
          {match.isLive && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>}
          {match.isLive ? 'LIVE NODE' : timeLeft}
        </div>
      </div>
      
      {match.isLive && (
        <div className="mb-4 bg-slate-950/80 rounded-2xl px-4 py-3 border border-white/5 text-center shadow-inner-deep">
          <p className="text-[11px] font-black text-white uppercase tracking-tighter leading-tight italic">
            {match.startTime}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex flex-col items-center flex-1">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center p-2.5 mb-3 shadow-inner-deep border border-white/5 group-hover:scale-110 transition-transform">
            <img src={getTeamIcon(match.teamA)} alt={match.teamA} className="w-full h-full object-contain" />
          </div>
          <p className="text-[11px] font-black text-slate-100 uppercase truncate text-center w-full tracking-tighter italic">{match.teamA}</p>
        </div>
        <div className="flex flex-col items-center mx-4">
           <div className="text-slate-700 font-rajdhani font-black text-2xl italic leading-none opacity-40">VS</div>
        </div>
        <div className="flex flex-col items-center flex-1">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center p-2.5 mb-3 shadow-inner-deep border border-white/5 group-hover:scale-110 transition-transform">
            <img src={getTeamIcon(match.teamB)} alt={match.teamB} className="w-full h-full object-contain" />
          </div>
          <p className="text-[11px] font-black text-slate-100 uppercase truncate text-center w-full tracking-tighter italic">{match.teamB}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        <button 
          onClick={() => onBetNow(match, 'W1')}
          disabled={match.marketLocked}
          className="bg-[#0b1223] rounded-2xl py-4 text-center border border-white/5 hover:border-blue-600/50 hover:bg-blue-600/10 transition-all flex flex-col items-center group/btn shadow-xl"
        >
          <p className="text-[9px] text-slate-600 font-black mb-1 uppercase tracking-widest group-hover/btn:text-blue-400 italic">Win {match.teamA.split(' ')[0]}</p>
          <p className="text-2xl font-rajdhani font-black text-amber-500 italic leading-none">{match.odds.over}</p>
        </button>
        <button 
          onClick={() => onBetNow(match, 'W2')}
          disabled={match.marketLocked}
          className="bg-[#0b1223] rounded-2xl py-4 text-center border border-white/5 hover:border-blue-600/50 hover:bg-blue-600/10 transition-all flex flex-col items-center group/btn shadow-xl"
        >
          <p className="text-[9px] text-slate-600 font-black mb-1 uppercase tracking-widest group-hover/btn:text-blue-400 italic">Win {match.teamB.split(' ')[0]}</p>
          <p className="text-2xl font-rajdhani font-black text-amber-500 italic leading-none">{match.odds.under}</p>
        </button>
      </div>
    </div>
  );
};

const DashboardView: React.FC<DashboardViewProps> = ({ stats, lang, setView, user, onBet }) => {
  const [liveArenaMatches, setLiveArenaMatches] = useState<Match[]>([]);
  const [groundingSources, setGroundingSources] = useState<any[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState(true);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const data = await SportsAPI.fetchLiveCricket();
        if (data && data.matches.length > 0) {
          setLiveArenaMatches(data.matches.filter(m => m.isLive || m.startTime.toLowerCase().includes('result') || m.startTime.includes('/')).slice(0, 10));
          setGroundingSources(data.sources);
        }
      } catch (e) {
        console.error("Live Arena Load Error", e);
      } finally {
        setIsLoadingLive(false);
      }
    };
    fetchLive();
    const interval = setInterval(fetchLive, 60000); 
    return () => clearInterval(interval);
  }, []);

  const handleQuickBet = (match: Match, side: 'W1'|'W2') => {
    setView(AppView.BETTING);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20 font-rajdhani">
      {/* 🚀 Dynamic Promotion Slider */}
      <div className="relative h-[320px] md:h-[550px] rounded-[4rem] overflow-hidden shadow-2xl group border border-white/5">
        <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[25s]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1223] via-[#0b1223]/70 to-transparent"></div>
        <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-10 md:px-24 max-w-4xl">
          <div className="flex items-center space-x-3 mb-6">
            <span className="px-3 py-1 bg-amber-600 text-white text-[10px] font-black rounded uppercase tracking-widest shadow-xl">AI-DRIVEN ODDS NODE</span>
            <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest italic animate-pulse">Sync Protocol Active</span>
          </div>
          <h2 className="text-6xl md:text-9xl font-black text-white leading-[0.9] italic uppercase mb-8">
            ELITE <br /><span className="text-blue-500">SPORTS HUB</span>
          </h2>
          <p className="text-slate-300 text-base md:text-2xl mb-12 max-w-xl font-medium leading-relaxed italic opacity-90">
            Premium sports betting integrated with Gemini AI and real-time live nodes. Automated 5-tier MLM commissions with instant settlement.
          </p>
          <div className="flex gap-5">
            <button onClick={() => setView(AppView.BETTING)} className="px-14 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] font-black italic shadow-2xl active:scale-95 transition-all text-xl border border-blue-400/30">OPEN SPORTSBOOK</button>
            {user.isMLM && (
               <button onClick={() => setView(AppView.MLM_SALARY)} className="px-14 py-6 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white rounded-[2.5rem] font-black italic shadow-2xl active:scale-95 transition-all text-xl border border-white/10">MLM DASHBOARD</button>
            )}
          </div>
        </div>
      </div>

      {/* 🏟️ Live Events Scroller */}
      <section>
        <div className="flex justify-between items-end mb-10 px-4 md:px-0">
          <div>
            <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">Live Arena</h3>
            <div className="flex items-center gap-3 mt-3">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              <p className="text-[11px] text-red-500 font-black tracking-[0.4em] uppercase italic">Real-Time Data Feed established</p>
            </div>
          </div>
          <button onClick={() => setView(AppView.BETTING)} className="text-[12px] text-blue-500 font-black uppercase tracking-widest hover:text-white transition-colors border-b border-blue-500/20 pb-1">All Markets ⌵</button>
        </div>
        
        <div className="flex space-x-6 overflow-x-auto no-scrollbar pb-10 px-4 md:px-0 scroll-smooth">
          {isLoadingLive ? (
            <div className="flex gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="min-w-[340px] h-[320px] bg-slate-900/40 rounded-[2.5rem] border border-white/5 animate-pulse flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full mb-4"></div>
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Establishing Secure Link...</span>
                </div>
              ))}
            </div>
          ) : liveArenaMatches.length === 0 ? (
             <div className="w-full h-48 flex flex-col items-center justify-center border border-white/5 rounded-[3rem] bg-slate-900/20 opacity-40 italic">
               <i className="fa-solid fa-tower-broadcast text-4xl mb-3 text-slate-600"></i>
               <p className="text-sm uppercase font-black tracking-widest">No Matches Live at this Timestamp</p>
               <button onClick={() => window.location.reload()} className="mt-4 text-blue-500 text-[10px] font-black uppercase hover:underline">Re-establish Node</button>
             </div>
          ) : (
            liveArenaMatches.map(match => <MatchCard key={match.id} match={match} onBetNow={handleQuickBet} />)
          )}
        </div>

        {/* 🔗 Data Source Grounding (Compliant with AI Search Rules) */}
        {groundingSources.length > 0 && (
          <div className="mt-4 px-4 py-3 bg-blue-600/5 rounded-3xl border border-blue-500/10">
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
              <i className="fa-solid fa-link text-blue-500"></i> Verified Data Sources
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {groundingSources.map((chunk, idx) => (
                chunk.web && (
                  <a 
                    key={idx} 
                    href={chunk.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-400 hover:text-white transition-colors truncate max-w-[200px]"
                  >
                    {chunk.web.title || chunk.web.uri}
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 🎰 Casino Hot-list */}
      <section>
        <div className="flex justify-between items-end mb-10 px-4 md:px-0">
          <div>
            <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">Casino Lobby</h3>
            <p className="text-[11px] text-purple-500 font-black tracking-[0.4em] uppercase mt-3 italic">Premium BEP20 Gaming Nodes</p>
          </div>
          <button onClick={() => setView(AppView.CASINO)} className="text-[12px] text-blue-500 font-black uppercase tracking-widest hover:text-white transition-colors border-b border-blue-500/20 pb-1">Browse Games ⌵</button>
        </div>
        <div className="flex space-x-8 overflow-x-auto no-scrollbar pb-10 px-4 md:px-0">
          {[
            { id: 'g1', name: 'Aviator', provider: 'Spribe', category: 'Crash Games', img: 'https://images.unsplash.com/photo-1551732998-9573f695fdbb?auto=format&fit=crop&w=600' },
            { id: 'g2', name: 'Sweet Bonanza', provider: 'Pragmatic', category: 'Slots', img: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=600' },
            { id: 'g3', name: 'Crazy Time', provider: 'Evolution', category: 'Live Casino', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600' },
            { id: 'g4', name: 'Gates of Olympus', provider: 'Pragmatic', category: 'Slots', img: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?auto=format&fit=crop&w=600' },
          ].map(game => (
            <div key={game.id} onClick={() => setView(AppView.CASINO)} className="min-w-[220px] group cursor-pointer">
              <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/5 group-hover:border-purple-500 transition-all shadow-2xl mb-5">
                <img src={game.img} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1223] via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[9px] font-black text-slate-300 uppercase tracking-tighter">{game.provider}</span>
                </div>
              </div>
              <h4 className="text-base font-black text-slate-100 uppercase tracking-widest truncate text-center group-hover:text-purple-400 transition-colors italic">{game.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 🔗 MLM Link Hub */}
      {user.isMLM && (
        <div className="bg-[#141d33] border border-white/5 p-10 rounded-[4rem] flex flex-wrap items-center justify-between gap-8 shadow-inner-deep group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="flex items-center space-x-16 relative z-10">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest mb-2">Direct Partners</span>
              <span className="text-4xl font-black text-blue-400 italic leading-none">{stats.directPartners}</span>
            </div>
            <div className="w-px h-14 bg-white/5"></div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest mb-2">Network Size</span>
              <span className="text-4xl font-black text-amber-500 italic leading-none">{stats.totalTeam}</span>
            </div>
          </div>
          <div className="flex-1 flex items-center space-x-5 bg-black/40 border border-white/10 px-10 py-6 rounded-[2.5rem] max-w-2xl group-hover:border-blue-500/30 transition-colors relative z-10">
             <div className="flex flex-col flex-1 truncate">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Referral Node URL</span>
               <span className="text-sm font-mono text-blue-400 truncate tracking-tight">https://20xbet.site/ref/{user.id}</span>
             </div>
             <button 
               onClick={() => { navigator.clipboard.writeText(`https://20xbet.site/ref/${user.id}`); alert('Referral URL copied to Node!'); }} 
               className="w-14 h-14 bg-blue-600/20 text-blue-500 rounded-3xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center text-xl shadow-2xl"
             >
               <i className="fa-solid fa-copy"></i>
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
