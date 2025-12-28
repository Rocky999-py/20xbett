
import React, { useState } from 'react';
import Logo from './Logo';
import { NexusAPI } from '../api';

interface AuthViewProps {
  onLoginSuccess: (userData: any) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    metamask: '',
    trustwallet: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setError('');

    try {
      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('VALIDATION: Security codes do not match.');
        }
        const response = await NexusAPI.register(formData);
        setIsLogin(true);
        alert('ACCOUNT INITIALIZED: Please sign in to verify node.');
      } else {
        const response = await NexusAPI.login({
          email: formData.email,
          password: formData.password
        });
        onLoginSuccess(response.user);
      }
    } catch (err: any) {
      setError(err.message || 'CRITICAL_SYSTEM_ERROR: Connection timed out.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-[#010409]">
      {/* Syncing Overlay */}
      {isSyncing && (
        <div className="fixed inset-0 z-[100] bg-[#020617]/90 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="mt-8 text-2xl font-rajdhani font-black text-white tracking-[0.3em] uppercase italic animate-pulse">
            Synchronizing Node...
          </h2>
          <p className="mt-2 text-[10px] text-cyan-500 font-bold uppercase tracking-[0.5em] opacity-60">
            Connecting to Nexus Mainnet Database
          </p>
          <div className="mt-12 w-48 h-1 bg-slate-900 rounded-full overflow-hidden">
             <div className="h-full bg-cyan-500 animate-[marquee_2s_linear_infinite] w-[200%]"></div>
          </div>
        </div>
      )}

      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="cyber-grid opacity-20"></div>
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-cyan-600/20 blur-[150px] rounded-full animate-[pulse_8s_infinite]"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-600/20 blur-[150px] rounded-full animate-[pulse_12s_infinite]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[480px] group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-rose-500/30 rounded-[2.5rem] blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>
        
        <div className="relative glass-card p-8 md:p-10 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          <div className="flex justify-center mb-10">
            <Logo size="md" />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black p-4 rounded-2xl mb-6 text-center uppercase tracking-widest animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleAction} className="space-y-5">
            {!isLogin && (
              <div className="group/input">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block group-focus-within/input:text-cyan-400 transition-colors">Full Name</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-cyan-400">👤</div>
                   <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all placeholder:text-slate-700"
                    placeholder="User Identity"
                  />
                </div>
              </div>
            )}

            <div className="group/input">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block group-focus-within/input:text-cyan-400 transition-colors">Backend Index (Email)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-cyan-400">✉️</div>
                <input
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all placeholder:text-slate-700"
                  placeholder="synapse@node.com"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="group/input">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block group-focus-within/input:text-cyan-400 transition-colors">Communication Node (Phone)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-cyan-400">📱</div>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="tel"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all placeholder:text-slate-700"
                    placeholder="+Node Address"
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="group/input">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">MetaMask</label>
                  <input
                    name="metamask"
                    value={formData.metamask}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-500/50 text-[10px] font-mono"
                    placeholder="0x..."
                  />
                </div>
                <div className="group/input">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block">Trust Wallet</label>
                  <input
                    name="trustwallet"
                    value={formData.trustwallet}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-500/50 text-[10px] font-mono"
                    placeholder="0x..."
                  />
                </div>
              </div>
            )}

            <div className="group/input">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block group-focus-within/input:text-cyan-400 transition-colors">Security Hash (Password)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-cyan-400">🔒</div>
                <input
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  type="password"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all placeholder:text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="group/input">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1 block group-focus-within/input:text-cyan-400 transition-colors">Confirm Hash</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-cyan-400">🛡️</div>
                  <input
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    type="password"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all placeholder:text-slate-700"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              disabled={isSyncing}
              type="submit"
              className="w-full relative group/btn overflow-hidden py-5 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 transform mt-6 disabled:opacity-50"
            >
              <span className="relative z-10">{isLogin ? 'Establish Link' : 'Initialize Node'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-800/50 text-center">
            <button
              disabled={isSyncing}
              onClick={() => setIsLogin(!isLogin)}
              className="group/toggle text-[10px] font-black text-slate-400 hover:text-cyan-400 transition-all uppercase tracking-[0.3em] flex items-center justify-center mx-auto"
            >
              <span className="w-8 h-px bg-slate-800 group-hover/toggle:bg-cyan-500/50 transition-all mr-4"></span>
              {isLogin ? "NEW NODE? REGISTER" : "SYNCED? SIGN IN"}
              <span className="w-8 h-px bg-slate-800 group-hover/toggle:bg-cyan-500/50 transition-all ml-4"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
