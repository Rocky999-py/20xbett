
import React, { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon: string;
  category: string;
}

const SupportView: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [tickets] = useState([
    { id: 'TKT-001', subject: 'Deposit Sync Error', status: 'RESOLVED', date: '2023-11-01' },
    { id: 'TKT-002', subject: 'Bet Settlement Delay', status: 'PENDING', date: '2023-11-03' },
  ]);

  const faqs: FAQItem[] = [
    {
      id: 1,
      category: 'PROTOCOL',
      icon: 'fa-solid fa-link-slash',
      question: 'How do I synchronize my BEP20 node for registration?',
      answer: 'To complete registration, ensure your wallet (MetaMask/Trust Wallet) is switched to the BNB Smart Chain (BEP20). You need at least 0.15 BNB or equivalent USDT plus a small amount of BNB for gas fees. The system will automatically detect the network and initialize your account.'
    },
    {
      id: 2,
      category: 'MATRIX',
      icon: 'fa-solid fa-diagram-project',
      question: 'When is the 5-generation commission distributed?',
      answer: 'MLM commissions are calculated instantly but held in a 48-hour security buffer to ensure transaction integrity on the blockchain. After this period, funds are automatically distributed up to 5 generations of your downline directly to their MLM wallets.'
    },
    {
      id: 3,
      category: 'BETTING',
      icon: 'fa-solid fa-lock',
      question: 'Why is my betting market currently suspended?',
      answer: 'Markets are automatically locked by the Neural Odds Engine during high-volatility events (e.g., a wicket in cricket, a goal in football, or an injury). This prevents arbitrage and ensures fair odds for all nodes. Markets unlock automatically once the event is settled.'
    },
    {
      id: 4,
      category: 'FINANCIAL',
      icon: 'fa-solid fa-money-bill-transfer',
      question: 'What is the limit for USDT withdrawals?',
      answer: '20XBet features an unlimited withdrawal protocol. You can withdraw any amount from your Main Wallet at any time. Processing is handled via automated BEP20 smart contracts, usually completing within 2-10 minutes depending on network congestion.'
    },
    {
      id: 5,
      category: 'SALARY',
      icon: 'fa-solid fa-award',
      question: 'How do I qualify for the Founder Monthly Salary?',
      answer: 'Qualification requires a network saturation of at least 200 active team members across your 5-generation matrix. Once reached, the Founder Salary Node activates, delivering a monthly USDT stream based on your team betting volume and rank.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl md:text-5xl font-rajdhani font-black text-white tracking-widest uppercase italic flex items-center">
            <span className="w-12 h-[2px] bg-gradient-to-r from-amber-500 to-transparent mr-4"></span>
            NEURAL ASSIST
          </h2>
          <p className="text-[10px] text-amber-500/70 font-black tracking-[0.4em] ml-16 mt-1 uppercase">24/7 Global Synchronization Support</p>
        </div>
        <button className="relative group/btn px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-2xl font-black uppercase tracking-[0.2em] text-white transition-all shadow-2xl active:scale-95 border border-amber-400/30 overflow-hidden font-rajdhani">
          <span className="relative z-10"><i className="fa-solid fa-ticket mr-2"></i> Open Support Node</span>
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
        </button>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Live Matrix Chat', desc: 'Instant reply within 5 mins', icon: 'fa-solid fa-comments', color: 'shadow-[0_0_30px_rgba(245,158,11,0.1)]' },
          { title: 'Ledger Support', desc: 'Detailed node verification', icon: 'fa-solid fa-envelope-open-text', color: 'shadow-[0_0_30px_rgba(6,182,212,0.1)]' },
          { title: 'Neural AI', desc: 'Automated synapse answers', icon: 'fa-solid fa-robot', color: 'shadow-[0_0_30px_rgba(139,92,246,0.1)]' },
        ].map((box, i) => (
          <div key={i} className={`group relative p-px rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-transparent transition-all duration-500 hover:border-amber-500/30 ${box.color} hover-gold-gradient`}>
            <div className="relative bg-[#020617] p-8 rounded-[2.4rem] border border-white/5 text-center overflow-hidden h-full flex flex-col items-center shadow-inner-deep">
              <div className="text-4xl mb-6 text-slate-600 transition-all duration-700 group-hover:text-amber-500 group-hover:scale-125 group-hover:rotate-12">
                <i className={box.icon}></i>
              </div>
              <h4 className="text-xl font-rajdhani font-black text-white tracking-widest uppercase">{box.title}</h4>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-3 font-rajdhani">{box.desc}</p>
              
              <div className="mt-8 pt-4 border-t border-white/5 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest font-rajdhani">Initiate Sync <i className="fa-solid fa-arrow-right ml-1"></i></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quantum Knowledge Base (FAQ) */}
      <div className="group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/20 via-slate-800/20 to-transparent rounded-[3.5rem] blur opacity-50"></div>
        <div className="relative bg-[#010409] border border-slate-800 rounded-[3.4rem] overflow-hidden shadow-2xl shadow-inner-deep">
          <div className="p-10 border-b border-slate-800/50 bg-slate-900/10">
             <h3 className="text-2xl font-rajdhani font-black text-white tracking-widest uppercase italic flex items-center">
               <i className="fa-solid fa-brain mr-4 text-amber-500"></i>
               Quantum Knowledge Base
             </h3>
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2 ml-10">Instant Automated Node Intelligence</p>
          </div>
          
          <div className="p-8 md:p-10 space-y-4">
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className={`group/faq border rounded-3xl transition-all duration-500 overflow-hidden hover-gold-gradient ${
                  activeFaq === faq.id ? 'bg-slate-900/40 border-amber-500/30' : 'bg-slate-950/40 border-slate-800'
                }`}
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <div className="flex items-center space-x-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                      activeFaq === faq.id ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-slate-900 border-white/5 text-slate-600'
                    }`}>
                      <i className={faq.icon}></i>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.3em] font-rajdhani mb-1 block">{faq.category}</span>
                      <h4 className={`text-sm md:text-base font-rajdhani font-bold uppercase tracking-wide transition-colors ${
                        activeFaq === faq.id ? 'text-amber-400' : 'text-slate-200'
                      }`}>
                        {faq.question}
                      </h4>
                    </div>
                  </div>
                  <div className={`text-slate-600 transition-transform duration-500 ${activeFaq === faq.id ? 'rotate-180 text-amber-500' : ''}`}>
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>
                </button>
                
                <div className={`transition-all duration-500 ease-in-out ${
                  activeFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-8 pt-2 ml-16 border-t border-white/5">
                    <p className="text-slate-400 text-sm leading-relaxed font-inter font-medium italic">
                      <span className="text-amber-500 font-black mr-2">SYNC ANSWER:</span>
                      {faq.answer}
                    </p>
                    <div className="mt-6 flex items-center space-x-4">
                      <button className="text-[10px] font-black text-slate-600 hover:text-amber-500 uppercase tracking-widest font-rajdhani transition-colors">
                        <i className="fa-solid fa-thumbs-up mr-1"></i> Helpful
                      </button>
                      <button className="text-[10px] font-black text-slate-600 hover:text-rose-500 uppercase tracking-widest font-rajdhani transition-colors">
                        <i className="fa-solid fa-thumbs-down mr-1"></i> Not Helpful
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Support Tickets */}
      <div className="group relative">
        <div className="absolute -inset-1 bg-gradient-to-b from-slate-700/20 to-slate-950/20 rounded-[3.4rem] blur opacity-50"></div>
        <div className="relative bg-[#020617] border border-slate-800 rounded-[3.4rem] overflow-hidden shadow-2xl shadow-inner-deep">
          <div className="p-8 border-b border-slate-800/50 bg-slate-950/30 flex items-center justify-between">
             <h3 className="text-xl font-rajdhani font-black text-white tracking-widest uppercase italic">ACTIVE TRANSMISSIONS</h3>
             <div className="flex items-center space-x-2">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mr-2">Monitoring...</span>
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                   <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                </div>
             </div>
          </div>
          <div className="divide-y divide-slate-800/30">
            {tickets.map(ticket => (
              <div key={ticket.id} className="group/item p-8 flex items-center justify-between hover:bg-slate-900/40 transition-all cursor-pointer hover-gold-gradient">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-3xl border border-white/5 shadow-inner-deep transform group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-500 text-slate-700 group-hover:text-amber-500">
                    <i className="fa-solid fa-receipt"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-rajdhani font-black text-slate-100 uppercase tracking-tight">{ticket.subject}</h4>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 font-rajdhani">{ticket.id} • {ticket.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-lg font-rajdhani ${
                    ticket.status === 'RESOLVED' 
                    ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-green-900/10' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-900/10 animate-pulse'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 bg-slate-950/50 border-t border-slate-800/50 text-center">
             <button className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] hover:text-amber-400 transition-colors font-rajdhani">Archives Encryption ⌵</button>
          </div>
        </div>
      </div>
      
      {/* AI Bot Oracle Section */}
      <div className="group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/30 to-purple-600/30 rounded-[3.5rem] blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative bg-gradient-to-br from-[#0f172a] to-[#020617] border border-amber-500/20 p-10 md:p-12 rounded-[3.4rem] shadow-2xl overflow-hidden shadow-inner-deep">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-950 rounded-[2.5rem] flex items-center justify-center text-6xl border border-amber-500/10 shadow-inner-deep transform hover:rotate-12 transition-transform text-amber-500">
              <i className="fa-solid fa-robot"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-2xl md:text-3xl font-rajdhani font-black text-white tracking-widest uppercase mb-4">CYBERNETIC ORACLE <span className="text-[10px] bg-amber-500 text-[#020617] px-3 py-1 rounded-full align-middle ml-2 font-black font-rajdhani">AI-V1</span></h4>
              <p className="text-xs text-amber-200/60 font-bold uppercase leading-relaxed tracking-wider mb-8 max-w-2xl font-rajdhani">Ask the Nexus AI regarding level distribution, referral matrix triggers, or blockchain transaction confirmations instantly via natural synapse processing.</p>
              <div className="flex items-center space-x-3 p-2 bg-black/40 border border-white/5 rounded-3xl backdrop-blur-md">
                <input 
                  type="text" 
                  placeholder="TRANSMIT QUERY TO ORACLE..." 
                  className="flex-1 bg-transparent border-none text-white px-6 py-4 outline-none font-bold text-sm placeholder:text-slate-700 font-rajdhani tracking-widest"
                />
                <button className="bg-gradient-to-r from-amber-600 to-amber-800 px-8 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-xl shadow-amber-900/40 font-rajdhani">Transmit</button>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.05),transparent_50%)] pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default SupportView;
