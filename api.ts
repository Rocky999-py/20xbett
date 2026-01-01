
import { createClient } from '@supabase/supabase-js';
import { User, UserCredentials, Transaction } from './types.ts';

// PRODUCTION ENDPOINT
const SUPABASE_URL = 'https://epodytzfgvsedplebtju.supabase.co';

/** 
 * SECURITY NOTE: 
 * Use the 'anon' / 'public' key from your Supabase Dashboard Settings -> API.
 * DO NOT use the 'service_role' key in the frontend code.
 * Our SQL setup already allows the Public key to perform CRUD via RLS Policies.
 */
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwb2R5dHpmZ3ZzZWRwbGVidGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzEzODcsImV4cCI6MjA4Mjg0NzM4N30.iuqSa0vUcvEBsXJhi7MvORneFAtPOOZ2OpwH7SOESJw'; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const NexusAPI = {
  register: async (credentials: UserCredentials & { password?: string }) => {
    const { name, email, password, phone, metamask, trustwallet, isMLM, referralId } = credentials;

    const newUser: User = {
      id: isMLM ? `MLM-${Math.floor(1000 + Math.random() * 9000)}` : `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: name,
      email,
      phone,
      profilePic: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      walletAddress: metamask || trustwallet || '0x3E...8A12',
      uplineId: isMLM ? (referralId || 'NEX-0001-A') : 'GENERAL',
      joinDate: new Date().toLocaleDateString(),
      currentLevel: 1,
      balanceUSDT: isMLM ? 10.00 : 100.00,
      balanceBNB: 0.15,
      isMLM: isMLM,
      password: password || 'nopass'
    };

    const { error } = await supabase.from('profiles').insert([newUser]);
    if (error) throw error;
    return { success: true, user: newUser };
  },

  login: async (credentials: { email: string; password?: string }) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', credentials.email)
      .eq('password', credentials.password)
      .single();

    if (error || !data) throw new Error('AUTH_FAILED: Invalid node signature.');
    return { success: true, user: data as User };
  },

  updateProfile: async (userId: string, updates: Partial<User>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, user: data as User };
  },

  // --- ADMIN CRUD METHODS ---

  getAdminData: async () => {
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    const { data: txs } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
    
    return {
      users: profiles || [],
      transactions: txs || [],
      stats: {
        totalUsers: (profiles?.length || 0),
        totalVolume: (txs?.reduce((acc: number, curr: any) => acc + Math.abs(curr.amount), 0) || 0)
      }
    };
  },

  adminDeleteProfile: async (userId: string) => {
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) throw error;
    return { success: true };
  },

  adminDeleteTransaction: async (txId: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', txId);
    if (error) throw error;
    return { success: true };
  },

  adminUpsertProfile: async (user: User) => {
    const { error } = await supabase.from('profiles').upsert([user]);
    if (error) throw error;
    return { success: true };
  }
};
