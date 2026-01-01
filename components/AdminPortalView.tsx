
import React, { useState, useEffect } from 'react';
import { NexusAPI } from '../api';
import { User, Transaction } from '../types';

const AdminPortalView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<'USERS' | 'TX'>('USERS');
  const [data, setData] = useState<{ users: User[], transactions: any[], stats: any } | null>(null);
  const [loading, setLoading] = useState(false);
  
  // CRUD States
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const verifyPin = () => {
    if (pin === '434343') {
      setIsUnlocked(true);
      fetchAdminData();
    } else {
      alert('ACCESS DENIED: INVALID SIGNATURE');
      setPin('');
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const result = await NexusAPI.getAdminData();
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm(`Are you sure you want to delete node ${id}? This cannot be undone.`)) return;
    await NexusAPI.adminDeleteProfile(id);
    fetchAdminData();
  };

  const handleDeleteTx = async (id: string) => {
    if (!confirm(`Delete transaction record ${id}?`)) return;
    await NexusAPI.adminDeleteTransaction(id);
    fetchAdminData();
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setLoading(true);
    try {
      await NexusAPI.adminUpsertProfile(editingUser);
      setEditingUser(null);
      setIsCreating(false);
      fetchAdminData();
    } catch (e) {
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl">
        <div className="w-full max-w-md bg-[#020617] border border-blue-500/30 rounded-[3rem] p-10 text-center shadow-[0_0_50px_rgba(59,130,246,0.2)]">
          <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
            <i className="fa-solid fa-lock text-3xl text-blue-500"></i>
          </div>
          <h2 className="text-3xl font-black text-white italic uppercase mb-2">Admin Terminal</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-8">Enter Authorization Pin</p>
          <input 
            type="password" 
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full bg-slate-950 border border-blue-500/20 rounded-2xl px-6 py-4 text-center text-2xl font-black tracking-[1em] text-white outline-none mb-6 focus:border-blue-500"
            placeholder="******"
          />
          <button 
            onClick={verifyPin}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
          >
            Authenticate
          </button>
          <button onClick={onClose} className="mt-6 text-[10px] text-slate-600 font-black uppercase hover:text-white transition-colors">Abort Terminal</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-[#020617] flex flex-col font-rajdhani text-white">
      {/* Edit User Modal */}
      {(editingUser || isCreating) && (
        <div className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black uppercase italic mb-8">{isCreating ? 'Create New Node' : 'Edit Node Parameters'}</h3>
            <form onSubmit={handleSaveUser} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-black">Full Name</label>
                  <input required value={editingUser?.fullName || ''} onChange={e => setEditingUser(prev => ({...prev!, fullName: e.target.value}))} className="w-full bg-black border border-white/5 rounded-xl p-3 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-black">Entity ID</label>
                  <input required disabled={!isCreating} value={editingUser?.id || ''} onChange={e => setEditingUser(prev => ({...prev!, id: e.target.value}))} className="w-full bg-black border border-white/5 rounded-xl p-3 text-sm font-mono" placeholder="USR-XXXX" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-black">Email Handle</label>
                <input required value={editingUser?.email || ''} onChange={e => setEditingUser(prev => ({...prev!, email: e.target.value}))} className="w-full bg-black border border-white/5 rounded-xl p-3 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-amber-500 uppercase font-black">USDT Balance</label>
                  <input type="number" step="0.01" required value={editingUser?.balanceUSDT || 0} onChange={e => setEditingUser(prev => ({...prev!, balanceUSDT: Number(e.target.value)}))} className="w-full bg-black border border-amber-500/20 rounded-xl p-3 text-sm text-amber-500 font-black" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-blue-500 uppercase font-black">Current Level</label>
                  <input type="number" max="8" required value={editingUser?.currentLevel || 1} onChange={e => setEditingUser(prev => ({...prev!, currentLevel: Number(e.target.value)}))} className="w-full bg-black border border-blue-500/20 rounded-xl p-3 text-sm" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => {setEditingUser(null); setIsCreating(false);}} className="flex-1 py-4 bg-slate-800 rounded-2xl font-black uppercase text-xs">Cancel</button>
                <button type="submit" className="flex-2 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase text-xs shadow-xl">Commit Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Header */}
      <div className="h-20 border-b border-white/10 flex items-center justify-between px-10 bg-black/40 shrink-0">
        <div className="flex items-center gap-10">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
              <h2 className="text-xl font-black italic uppercase">Terminal Control</h2>
           </div>
           <div className="flex bg-slate-900 p-1 rounded-xl">
              <button onClick={() => setActiveTab('USERS')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'USERS' ? 'bg-blue-600 shadow-lg' : 'text-slate-500 hover:text-white'}`}>Nodes</button>
              <button onClick={() => setActiveTab('TX')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'TX' ? 'bg-blue-600 shadow-lg' : 'text-slate-500 hover:text-white'}`}>Ledger</button>
           </div>
        </div>
        <div className="flex gap-4">
           {activeTab === 'USERS' && (
             <button onClick={() => { setIsCreating(true); setEditingUser({} as User); }} className="px-6 py-2 bg-emerald-600 rounded-xl text-xs font-black uppercase hover:bg-emerald-500 transition-all">+ New Node</button>
           )}
           <button onClick={fetchAdminData} className="px-6 py-2 bg-slate-800 rounded-xl text-xs font-black uppercase hover:bg-slate-700 transition-all">Sync</button>
           <button onClick={onClose} className="px-6 py-2 bg-red-600 rounded-xl text-xs font-black uppercase shadow-lg shadow-red-600/20 active:scale-95">Disconnect</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Entities', val: data?.stats.totalUsers || 0, icon: 'fa-users', color: 'text-blue-500' },
            { label: 'Total Volume', val: `$${data?.stats.totalVolume.toLocaleString()}`, icon: 'fa-chart-line', color: 'text-emerald-500' },
            { label: 'TX Count', val: data?.transactions.length || 0, icon: 'fa-receipt', color: 'text-amber-500' },
            { label: 'Latency', val: '9ms', icon: 'fa-server', color: 'text-purple-500' },
          ].map((s, i) => (
            <div key={i} className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl shadow-inner-deep">
              <div className={`text-2xl ${s.color} mb-2`}><i className={`fa-solid ${s.icon}`}></i></div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{s.label}</p>
              <h4 className="text-3xl font-black italic mt-1">{s.val}</h4>
            </div>
          ))}
        </div>

        {/* Dynamic Table Section */}
        <div className="bg-slate-900/30 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/10 flex justify-between items-center">
             <h3 className="text-xl font-black uppercase italic">{activeTab === 'USERS' ? 'Entity Ledger' : 'Global Transaction Vault'}</h3>
             <span className="text-[10px] text-slate-500 font-black uppercase">Database v4.1 • Live Tracking</span>
          </div>
          
          <div className="overflow-x-auto">
            {activeTab === 'USERS' ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/20 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                    <th className="px-8 py-5">UID</th>
                    <th className="px-8 py-5">Profile</th>
                    <th className="px-8 py-5">USDT Balance</th>
                    <th className="px-8 py-5">Lvl</th>
                    <th className="px-8 py-5">Type</th>
                    <th className="px-8 py-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan={6} className="p-20 text-center animate-pulse text-blue-500 font-black italic">Syncing Ledger...</td></tr>
                  ) : data?.users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6 font-mono text-xs text-blue-400">{u.id}</td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black uppercase italic">{u.fullName}</span>
                          <span className="text-[10px] text-slate-500">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-black text-emerald-400 italic text-lg">${u.balanceUSDT.toFixed(2)}</td>
                      <td className="px-8 py-6 text-sm font-black">{u.currentLevel}</td>
                      <td className="px-8 py-6">
                         <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase ${u.isMLM ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                           {u.isMLM ? 'MLM Node' : 'Player'}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex gap-3">
                            <button onClick={() => setEditingUser(u)} className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all"><i className="fa-solid fa-pen-to-square"></i></button>
                            <button onClick={() => handleDeleteUser(u.id)} className="w-8 h-8 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white transition-all"><i className="fa-solid fa-trash"></i></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/20 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                    <th className="px-8 py-5">TX ID</th>
                    <th className="px-8 py-5">Node ID</th>
                    <th className="px-8 py-5">Type</th>
                    <th className="px-8 py-5">Amount</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data?.transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6 font-mono text-xs text-slate-400">#{tx.id}</td>
                      <td className="px-8 py-6 font-black text-xs text-blue-500">{tx.user_id || 'SYSTEM'}</td>
                      <td className="px-8 py-6 text-[10px] font-black uppercase">{tx.type}</td>
                      <td className={`px-8 py-6 font-black italic ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-[8px] font-black px-2 py-1 bg-slate-800 rounded uppercase">{tx.status}</span>
                      </td>
                      <td className="px-8 py-6">
                         <button onClick={() => handleDeleteTx(tx.id)} className="w-8 h-8 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white transition-all"><i className="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortalView;
