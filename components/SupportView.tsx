
import React, { useState } from 'react';
import { Language } from '../types';

interface SupportViewProps {
  lang: Language;
}

const SupportView: React.FC<SupportViewProps> = ({ lang }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ type: 'Deposit Issue', subject: '', desc: '' });

  const complaintTypes = [
    'Deposit Issue', 'Withdrawal Issue', 'Wrong Amount', 'Betting Error', 
    'Casino Settlement Problem', 'Program Upgrade Issue', 'Not Receiving MLM Income'
  ];

  const faqs = [
    { id: 1, q: 'How do I synchronize my BEP20 node?', a: 'Switch your wallet to BNB Smart Chain and ensure you have 0.15 BNB + gas fees.' },
    { id: 2, q: 'When is the 5-gen commission distributed?', a: 'Commissions are processed after a 48-hour security buffer following the loss event.' },
    { id: 3, q: 'Unlimited Withdrawal Limit?', a: 'Correct. 20XBet has no daily or monthly limits for BEP20 withdrawals.' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20 font-rajdhani">
      {/* Support Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <div className="w-full max-w-xl bg-[#020617] rounded-[3rem] border border-amber-500/20 p-10 shadow-inner-deep">
            <h3 className="text-3xl font-black text-white mb-8 italic uppercase tracking-widest">Open Support Node</h3>
            <form className="space-y-6">
              <div>
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Complaint Protocol</label>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-amber-500/40 uppercase font-black text-xs tracking-widest">
                  {complaintTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Subject Hash</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-amber-500/40" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Detailed Log</label>
                <textarea className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-amber-500/40 h-32"></textarea>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-500">Cancel</button>
                 <button className="flex-2 py-4 bg-amber-600 rounded-2xl font-black uppercase text-xs tracking-widest text-white shadow-xl">Transmit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase italic leading-none">NEURAL ASSIST</h2>
          <p className="text-[10px] text-amber-500 font-black tracking-[0.5em] mt-2 uppercase">24/7 Global Synchronization Active</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-12 py-5 bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl font-black uppercase tracking-[0.3em] text-white shadow-2xl active:scale-95 transition-all italic border border-amber-400/30">
          Open Support Node
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Live Chat', icon: 'fa-solid fa-headset', desc: 'Instant matrix response' },
          { label: 'E-Mail Node', icon: 'fa-solid fa-envelope-open-text', desc: 'Support@20xbet.tech' },
          { label: 'Admin Telegram', icon: 'fa-brands fa-telegram', desc: '@20XBet_Core_Node' }
        ].map((item, i) => (
          <div key={i} className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-white/5 text-center group hover:border-amber-500/30 transition-all shadow-inner-deep">
            <div className="text-4xl text-slate-700 group-hover:text-amber-500 transition-colors mb-6"><i className={item.icon}></i></div>
            <h4 className="text-lg font-black text-white uppercase tracking-widest mb-2 italic">{item.label}</h4>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#010409] border border-slate-800 rounded-[3.4rem] overflow-hidden shadow-2xl shadow-inner-deep">
        <div className="p-10 border-b border-slate-800/50 bg-slate-900/10">
           <h3 className="text-2xl font-black text-white tracking-widest uppercase italic">Quantum FAQ</h3>
        </div>
        <div className="p-8 md:p-10 space-y-4">
          {faqs.map(faq => (
            <div key={faq.id} className="border border-slate-800 rounded-3xl bg-slate-950/40 overflow-hidden">
               <button onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)} className="w-full p-6 text-left flex justify-between items-center group">
                  <span className={`font-black uppercase tracking-wide transition-colors ${activeFaq === faq.id ? 'text-amber-500' : 'text-slate-200'}`}>{faq.q}</span>
                  <i className={`fa-solid fa-chevron-down text-slate-700 transition-transform ${activeFaq === faq.id ? 'rotate-180 text-amber-500' : ''}`}></i>
               </button>
               {activeFaq === faq.id && <div className="p-6 pt-0 text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed italic border-t border-white/5">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportView;
