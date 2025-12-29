
import React, { useState } from 'react';
import { User, Transaction, Language } from '../types';
import { translations } from '../translations';

interface WalletViewProps {
  user: User;
  transactions: Transaction[];
  lang: Language;
}

const WalletView: React.FC<WalletViewProps> = ({ user, transactions, lang }) => {
  const t = (key: string) => translations[lang][key] || key;
  const [modalType, setModalType] = useState<'DEPOSIT' | 'WITHDRAW' | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const gateways = [
    { 
      id: 'web3',
      name: 'Crypto Wallet', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg', 
      desc: 'MetaMask / Trust Wallet',
      icon: 'fa-solid fa-shield-halved',
      color: 'from-orange-500/20'
    },
    { 
      id: 'binance',
      name: 'Binance Pay', 
      logo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.svg', 
      desc: 'Instant Transfer',
      icon: 'fa-solid fa-bolt-lightning',
      color: 'from-yellow-500/20'
    },
    { 
      id: 'local',
      name: 'Local Payment', 
      logo: 'https://raw.githubusercontent.com/TarekMonjur/BD-Payment-Gateway-Icons/master/bkash.svg', 
      desc: 'bKash / Nagad',
      icon: 'fa-solid fa-mobile-screen-button',
      color: 'from-pink-500/20'
    },
    { 
      id: 'global',
      name: 'Debit/Credit Cards', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg', 
      desc: 'Visa / Mastercard',
      icon: 'fa-solid fa-credit-card',
      color: 'from-blue-500/20'
    }
  ];

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    setIsWaiting(true);
    // Simulated connection delay
    setTimeout(() => setIsWaiting(false), 3000);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedMethod(null);
    setIsWaiting(false);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto animate-in fade-in duration-700 pb-20">
      
      {/* 🛸 Transaction Modal */}
      {modalType && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-2xl">
          <div className="relative w-full max-w-4xl bg-[#020617] rounded-[3.5rem] border border-amber-500/20 shadow-inner-deep flex flex-col max-h-[90vh]">
            
            <div className="p-8 md:p-10 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/10 shrink-0">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl text-amber-500">
                  <i className={modalType === 'DEPOSIT' ? 'fa-solid fa-arrow-down-to-bracket' : 'fa-solid fa-arrow-up-from-bracket'}></i>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-rajdhani font-black text-white tracking-widest uppercase italic leading-none">
                    {modalType === 'DEPOSIT' ? t('deposit') : t('withdraw')}
                  </h2>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2">
                    {isWaiting ? 'PLEASE WAIT...' : 'PICK YOUR METHOD'}
                  </p>
                </div>
              </div>
              <button onClick={closeModal} className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-red-500 transition-all flex items-center justify-center">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
              {!isWaiting ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gateways.map((gate) => (
                    <div 
                      key={gate.id}
                      onClick={() => handleMethodSelect(gate.name)}
                      className={`group relative p-px rounded-[2rem] bg-gradient-to-br from-slate-800 to-transparent hover-gold-gradient cursor-pointer transition-all duration-500 border border-transparent hover:border-amber-500/30`}
                    >
                      <div className="relative bg-[#010409] p-8 rounded-[1.9rem] flex flex-col h-full shadow-inner-deep overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shadow-2xl transition-all">
                            <img src={gate.logo} alt={gate.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="text-3xl text-slate-800 group-hover:text-amber-500/40 transition-colors">
                            <i className={gate.icon}></i>
                          </div>
                        </div>
                        <h4 className="text-xl font-rajdhani font-black text-white uppercase tracking-tight mb-2">{gate.name}</h4>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">{gate.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-10 py-20 animate-in zoom-in-95 duration-500">
                  <div className="w-32 h-32 md:w-48 md:h-48 border-[6px] border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
                  <h3 className="text-3xl md:text-5xl font-rajdhani font-black text-white tracking-widest uppercase italic leading-none animate-pulse">CONNECTING...</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        
        {/* Main Money Card */}
        <div className="xl:col-span-3 group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/30 via-slate-800/30 to-transparent rounded-[3.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative h-full bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#1e1b4b] border border-white/5 p-10 rounded-[3.4rem] shadow-inner-deep overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.4em] mb-4">{t('total_balance')}</p>
              <div className="flex items-baseline space-x-4 mb-12">
                 <h2 className="text-6xl md:text-8xl font-rajdhani font-black text-white tracking-tighter group-hover:text-amber-400 transition-colors">${user.balanceUSDT.toLocaleString()}</h2>
                 <span className="text-xl font-rajdhani font-bold text-slate-500 italic">USDT</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                <div className="p-6 bg-slate-950/60 rounded-3xl border border-white/5 backdrop-blur-md">
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Network</p>
                  <p className="text-sm font-black text-slate-100 uppercase italic">BNB Chain (BEP20)</p>
                </div>
                <div className="p-6 bg-slate-950/60 rounded-3xl border border-white/5 backdrop-blur-md">
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">{t('status')}</p>
                  <div className="flex items-center space-x-2">
                    <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="text-sm font-black text-green-400 uppercase tracking-widest">{t('active')}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setModalType('DEPOSIT')}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-white transition-all shadow-2xl active:scale-95 border border-amber-400/30 font-rajdhani"
                >
                  {t('deposit')}
                </button>
                <button 
                  onClick={() => setModalType('WITHDRAW')}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-slate-300 transition-all border border-slate-800 font-rajdhani"
                >
                  {t('withdraw')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Methods Card */}
        <div className="xl:col-span-2 group relative">
          <div className="relative bg-[#020617] border border-slate-800 p-10 rounded-[3.4rem] h-full shadow-2xl overflow-hidden shadow-inner-deep">
            <h3 className="text-xl font-rajdhani font-black text-white mb-8 tracking-widest uppercase italic flex items-center">
              Payment Methods
            </h3>
            <div className="space-y-4 relative z-10">
              {gateways.map((gate, i) => (
                <div key={i} className="group/gate flex items-center space-x-5 p-5 bg-slate-900/40 rounded-3xl border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2.5 shadow-xl group-hover/gate:scale-110 transition-transform">
                    <img src={gate.logo} alt={gate.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-sm text-slate-100 uppercase tracking-tighter font-rajdhani">{gate.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{gate.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* History Card */}
      <div className="group relative">
        <div className="relative bg-[#020617] border border-slate-800 rounded-[3.4rem] overflow-hidden shadow-2xl shadow-inner-deep">
          <div className="p-8 md:p-10 border-b border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-950/30">
            <div>
              <h3 className="text-2xl font-rajdhani font-black text-white tracking-widest uppercase italic">{t('history')}</h3>
              <p className="text-[10px] text-slate-500 font-black tracking-[0.3em] mt-1">ALL BANK ACTIONS</p>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] font-rajdhani">
                  <th className="px-10 py-6">ID</th>
                  <th className="px-10 py-6">Type</th>
                  <th className="px-10 py-6">Money</th>
                  <th className="px-10 py-6">{t('date')}</th>
                  <th className="px-10 py-6">{t('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="group/row hover:bg-slate-900/40 transition-all">
                    <td className="px-10 py-6 text-xs font-mono font-bold text-slate-400">#{tx.id}</td>
                    <td className="px-10 py-6 font-black text-xs uppercase text-slate-100 font-rajdhani">{tx.type}</td>
                    <td className="px-10 py-6">
                      <div className={`font-rajdhani font-black text-xl ${tx.amount > 0 ? 'text-green-400' : 'text-rose-400'}`}>
                        {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-[10px] text-slate-500 font-black uppercase tracking-widest font-rajdhani">{tx.date}</td>
                    <td className="px-10 py-6">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border bg-green-500/10 text-green-400 border-green-500/20">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletView;
