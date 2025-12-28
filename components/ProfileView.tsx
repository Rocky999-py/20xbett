
import React, { useState, useRef } from 'react';
import { User } from '../types';

interface ProfileViewProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: user.fullName, profilePic: user.profilePic });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setUser(prev => ({ ...prev, ...formData }));
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePic: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative group p-1 rounded-[3.5rem] bg-gradient-to-br from-slate-800/40 to-transparent hover:from-cyan-500/20 transition-all duration-700 shadow-2xl">
        <div className="relative bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#1e1b4b] rounded-[3.4rem] border border-white/5 overflow-hidden shadow-inner-deep">
          
          {/* Header Banner */}
          <div className="h-48 bg-gradient-to-r from-cyan-900/40 via-blue-900/40 to-purple-900/40 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),transparent_70%)]"></div>
            <div className="absolute -bottom-16 left-8 flex items-end space-x-6 z-20">
              <div className="relative group/avatar cursor-pointer" onClick={triggerFileInput}>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-[2.5rem] blur opacity-50 group-hover/avatar:opacity-100 transition-opacity"></div>
                <img 
                  src={isEditing ? formData.profilePic : user.profilePic} 
                  alt="Profile" 
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.4rem] border-4 border-[#020617] shadow-2xl object-cover bg-slate-800 transition-all group-hover/avatar:scale-[1.02]"
                />
                {isEditing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-[2.4rem] opacity-0 group-hover/avatar:opacity-100 transition-opacity text-white text-[10px] font-bold uppercase">
                    <span className="text-2xl mb-1">📸</span>
                    Update
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <div className="pb-4">
                <h2 className="text-3xl md:text-5xl font-rajdhani font-black text-white tracking-tighter uppercase italic">{isEditing ? formData.fullName : user.fullName}</h2>
                <div className="flex items-center space-x-2">
                   <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                   <span className="text-cyan-400 font-mono text-xs font-bold tracking-[0.2em]">{user.id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-24 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Personal Section */}
              <div className="relative p-8 bg-slate-950/50 rounded-[2.5rem] border border-white/5 overflow-hidden group/card hover:border-cyan-500/30 transition-all">
                <div className="absolute top-0 right-0 p-6 text-6xl opacity-5 grayscale group-hover/card:grayscale-0 transition-all">👤</div>
                <h3 className="text-xl font-rajdhani font-black text-white mb-8 tracking-widest uppercase flex items-center">
                  <span className="w-1.5 h-6 bg-cyan-500 rounded-full mr-3 shadow-[0_0_10px_#22d3ee]"></span>
                  Identity Node
                </h3>
                <div className="space-y-6">
                  <div className="group/field">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2 group-focus-within/field:text-cyan-400 transition-colors">Legal Full Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.fullName} 
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-500/50 transition-all font-bold"
                      />
                    ) : (
                      <p className="text-lg font-bold text-slate-100">{user.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Sync Date</label>
                    <p className="text-lg font-bold text-slate-100 font-rajdhani">{user.joinDate}</p>
                  </div>
                </div>
              </div>

              {/* Blockchain Section */}
              <div className="relative p-8 bg-slate-950/50 rounded-[2.5rem] border border-white/5 overflow-hidden group/card hover:border-purple-500/30 transition-all">
                <div className="absolute top-0 right-0 p-6 text-6xl opacity-5 grayscale group-hover/card:grayscale-0 transition-all">⛓️</div>
                <h3 className="text-xl font-rajdhani font-black text-white mb-8 tracking-widest uppercase flex items-center">
                  <span className="w-1.5 h-6 bg-purple-500 rounded-full mr-3 shadow-[0_0_10px_#a855f7]"></span>
                  Ledger Sync
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Public Key Address</label>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center space-x-3 group/wallet cursor-copy">
                      <span className="text-2xl group-hover/wallet:scale-110 transition-transform">🦊</span>
                      <span className="text-xs font-mono text-cyan-400 truncate flex-1">{user.walletAddress}</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Upline Reference</label>
                      <p className="text-sm font-black text-slate-200 font-mono">{user.uplineId}</p>
                    </div>
                    <div className="flex-1 text-right">
                      <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Node Status</label>
                      <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row justify-end gap-4 relative z-10">
              {isEditing ? (
                <>
                  <button onClick={() => { setIsEditing(false); setFormData({ fullName: user.fullName, profilePic: user.profilePic }); }} className="px-8 py-4 rounded-2xl text-slate-500 font-black uppercase tracking-widest hover:text-white transition-all">Cancel</button>
                  <button onClick={handleSave} className="px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-2xl font-black uppercase tracking-widest text-white shadow-2xl transition-all shadow-cyan-900/40">Apply Synapse</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-10 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl font-black uppercase tracking-widest text-slate-300 transition-all">Modify Matrix</button>
              )}
            </div>
          </div>
          
          {/* Internal shading */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(30,58,138,0.05),transparent_50%)] pointer-events-none"></div>
        </div>
      </div>

      <div className="relative p-8 rounded-[2rem] bg-slate-900/30 border border-slate-800/50 border-dashed text-center">
        <p className="text-[11px] text-slate-600 font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto">
          Notice: Biometric and ledger data are immutable. Synchronization with the BNB Smart Chain ensures 100% security. Only vanity fields are editable.
        </p>
      </div>
    </div>
  );
};

export default ProfileView;
