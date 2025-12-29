
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
    confirmPassword: '',
    isMLM: false,
    referralId: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
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
        if (formData.isMLM && !formData.referralId) {
          throw new Error('VALIDATION: MLM registration requires a Referral ID.');
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
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-[#010409] font-rajdhani">
      {/* Syncing Overlay */}
      {isSyncing && (
        <div className="fixed inset-0 z-[100] bg-[#020617]/90 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-24 h-24 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-8"></div>
          <h2 className="text-2xl font-black text-white tracking-[0.3em] uppercase italic animate-pulse">Syncing...</h2>
        </div>
      )}

      <div className="absolute inset-0 z-0">
        <div className="cyber-grid opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-[500px] group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-[2.5rem] blur-2xl opacity-75"></div>
        
        <div className="relative bg-[#0b1223]/80 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="flex justify-center mb-10">
            <Logo size="md" />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black p-4 rounded-2xl mb-6 text-center uppercase tracking-widest">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleAction} className="space-y-4">
            {!isLogin && (
              <div className="flex items-center space-x-4 mb-6 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                 <input 
                   type="checkbox" 
                   name="isMLM" 
                   id="isMLM" 
                   checked={formData.isMLM} 
                   onChange={handleInputChange}
                   className="w-6 h-6 rounded accent-blue-500"
                 />
                 <label htmlFor="isMLM" className="text-sm font-black text-white uppercase italic cursor-pointer">Register as MLM User</label>
              </div>
            )}

            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Full Name</label>
                    <input name="name" required value={formData.name} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50" placeholder="Name" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Phone</label>
                    <input name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50" placeholder="Phone" />
                 </div>
              </div>
            )}

            {!isLogin && formData.isMLM && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-2 italic">Referral ID (Required for MLM)</label>
                <input name="referralId" required={formData.isMLM} value={formData.referralId} onChange={handleInputChange} className="w-full bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500/50" placeholder="NEX-XXXX-A" />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Node</label>
              <input name="email" type="email" required value={formData.email} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50" placeholder="Email" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Password</label>
                <input name="password" type="password" required value={formData.password} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50" placeholder="••••••••" />
              </div>
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Confirm</label>
                  <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50" placeholder="••••••••" />
                </div>
              )}
            </div>

            <button
              disabled={isSyncing}
              type="submit"
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 mt-6 italic"
            >
              {isLogin ? 'Establish Link' : 'Initialize Node'}
            </button>
          </form>

          <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-10 text-[10px] font-black text-slate-500 hover:text-blue-400 uppercase tracking-widest text-center transition-colors">
            {isLogin ? "DON'T HAVE AN ACCOUNT? REGISTER" : "ALREADY SYNCED? SIGN IN"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
