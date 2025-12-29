
import React, { useState, useRef } from 'react';
import { User, Language } from '../types';
import { translations } from '../translations';

interface ProfileViewProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  lang: Language;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, setUser, lang }) => {
  const t = (key: string) => translations[lang][key] || key;
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
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-rajdhani">
      <div className="relative group p-1 rounded-[3.5rem] bg-gradient-to-br from-slate-800/40 to-transparent hover:from-blue-500/20 transition-all duration-700 shadow-2xl">
        <div className="relative bg-[#0b1223] rounded-[3.4rem] border border-white/5 overflow-hidden shadow-inner-deep">
          
          <div className="h-48 bg-gradient-to-r from-blue-900/40 to-purple-900/40 relative">
            <div className="absolute -bottom-16 left-8 flex items-end space-x-6 z-20">
              <div className="relative group/avatar cursor-pointer" onClick={triggerFileInput}>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[2.5rem] blur opacity-50"></div>
                <img 
                  src={isEditing ? formData.profilePic : user.profilePic} 
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.4rem] border-4 border-[#0b1223] shadow-2xl object-cover bg-slate-800"
                />
                {isEditing && <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-[2.4rem] text-white text-[10px] font-bold uppercase"><span className="text-2xl mb-1">📸</span>Update</div>}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <div className="pb-4">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">{isEditing ? formData.fullName : user.fullName}</h2>
                <div className="flex items-center space-x-2">
                   <span className={`w-2 h-2 rounded-full ${user.isMLM ? 'bg-amber-500' : 'bg-blue-500'} animate-pulse`}></span>
                   <span className="text-slate-400 font-mono text-xs font-bold tracking-[0.2em]">{user.isMLM ? 'ELITE NETWORKER' : 'PRO PLAYER'} • {user.id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-24 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="relative p-8 bg-slate-950/50 rounded-[2.5rem] border border-white/5 shadow-inner-deep">
                <h3 className="text-xl font-black text-white mb-8 tracking-widest uppercase italic">Basic Information</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Display Name</label>
                    {isEditing ? (
                      <input type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500/50 transition-all font-bold" />
                    ) : (
                      <p className="text-lg font-bold text-slate-100 italic uppercase">{user.fullName}</p>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">{t('join_date')}</label>
                      <p className="text-sm font-black text-slate-100 uppercase">{user.joinDate}</p>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Account Type</label>
                      <p className={`text-sm font-black uppercase ${user.isMLM ? 'text-amber-500' : 'text-blue-500'}`}>{user.isMLM ? 'MLM Affiliate' : 'Player Account'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative p-8 bg-slate-950/50 rounded-[2.5rem] border border-white/5 shadow-inner-deep">
                <h3 className="text-xl font-black text-white mb-8 tracking-widest uppercase italic">Network Ledger</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Wallet Address (BNB Smart Chain)</label>
                    <p className="text-xs font-mono text-blue-400 truncate bg-black/40 p-4 rounded-xl border border-white/5">{user.walletAddress}</p>
                  </div>
                  {user.isMLM ? (
                    <div className="flex justify-between">
                      <div>
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Upline Leader</label>
                        <p className="text-sm font-black text-amber-500">{user.uplineId}</p>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Current Level</label>
                        <p className="text-sm font-black text-white">L-0{user.currentLevel}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Registration Status</label>
                      <p className="text-sm font-black text-blue-500 uppercase">Independent Player Node</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-end gap-4">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="px-8 py-4 text-slate-500 font-black uppercase tracking-widest">Cancel</button>
                  <button onClick={handleSave} className="px-10 py-4 bg-blue-600 rounded-2xl font-black uppercase tracking-widest text-white shadow-2xl">Update Profile</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-10 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-black uppercase tracking-widest text-slate-300">Edit Profile</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
