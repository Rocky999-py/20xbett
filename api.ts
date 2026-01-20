
import { createClient } from '@supabase/supabase-js';
import { User, UserCredentials, Transaction, Match } from './types.ts';
import { GoogleGenAI } from "@google/genai";

// PRODUCTION ENDPOINT
const SUPABASE_URL = 'https://epodytzfgvsedplebtju.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwb2R5dHpmZ3ZzZWRwbGVidGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzEzODcsImV4cCI6MjA4Mjg0NzM4N30.iuqSa0vUcvEBsXJhi7MvORneFAtPOOZ2OpwH7SOESJw'; 

// CRICKET API CONFIGURATION (CricData.org / CricAPI v1)
const CRICKET_API_URL = 'https://api.cricapi.com/v1/currentMatches'; 
const CRICKET_API_KEY = '6093a752-a5b2-4495-9bd0-985f0dae9b07'; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// LOCAL FALLBACK STORE (Simulated Blockchain Storage)
const getLocalUsers = (): User[] => {
  try {
    return JSON.parse(localStorage.getItem('nexus_simulated_users') || '[]');
  } catch (e) {
    return [];
  }
};

const saveLocalUser = (user: User) => {
  const users = getLocalUsers();
  // Avoid duplicates
  const filtered = users.filter(u => u.email !== user.email);
  filtered.push(user);
  localStorage.setItem('nexus_simulated_users', JSON.stringify(filtered));
};

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

    try {
      // We wrap the entire call to ensure NO uncaught fetch errors leak
      const request = supabase.from('profiles').insert([newUser]);
      const { error } = await request;
      if (error) throw error;
      return { success: true, user: newUser };
    } catch (err) {
      console.warn("NexusAPI: Cloud Sync Failed during registration. Falling back to Local Node Store.", err);
      saveLocalUser(newUser);
      return { success: true, user: newUser, mode: 'LOCAL' };
    }
  },

  login: async (credentials: { email: string; password?: string }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', credentials.email)
        .eq('password', credentials.password)
        .single();

      if (error || !data) throw new Error('AUTH_FAILED');
      return { success: true, user: data as User };
    } catch (err) {
      console.warn("NexusAPI: Cloud Login Failed. Searching Local Node Store.");
      const localUsers = getLocalUsers();
      const user = localUsers.find(u => u.email === credentials.email && u.password === credentials.password);
      
      if (!user) throw new Error('AUTH_FAILED: Invalid node signature or user not found.');
      return { success: true, user, mode: 'LOCAL' };
    }
  },

  updateProfile: async (userId: string, updates: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, user: data as User };
    } catch (err) {
      const users = getLocalUsers().map(u => u.id === userId ? { ...u, ...updates } : u);
      localStorage.setItem('nexus_simulated_users', JSON.stringify(users));
      return { success: true };
    }
  },

  getAdminData: async () => {
    try {
      const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      const { data: txs } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
      
      return {
        users: profiles || getLocalUsers(),
        transactions: txs || [],
        stats: {
          totalUsers: (profiles?.length || getLocalUsers().length),
          totalVolume: (txs?.reduce((acc: number, curr: any) => acc + Math.abs(curr.amount), 0) || 0)
        }
      };
    } catch (err) {
      return {
        users: getLocalUsers(),
        transactions: [],
        stats: { totalUsers: getLocalUsers().length, totalVolume: 0 }
      };
    }
  },

  adminDeleteProfile: async (userId: string) => {
    try { await supabase.from('profiles').delete().eq('id', userId); } catch (e) {}
    const users = getLocalUsers().filter(u => u.id !== userId);
    localStorage.setItem('nexus_simulated_users', JSON.stringify(users));
    return { success: true };
  },

  adminDeleteTransaction: async (txId: string) => {
    try { await supabase.from('transactions').delete().eq('id', txId); } catch (e) {}
    return { success: true };
  },

  adminUpsertProfile: async (user: User) => {
    try { await supabase.from('profiles').upsert([user]); } catch (e) {}
    const users = getLocalUsers().filter(u => u.id !== user.id);
    users.push(user);
    localStorage.setItem('nexus_simulated_users', JSON.stringify(users));
    return { success: true };
  }
};

export const SportsAPI = {
  fetchLiveCricket: async (): Promise<{ matches: Match[], sources: any[] } | null> => {
    // 1. Try Direct API (likely to fail in browser due to CORS if not proxied)
    try {
      const response = await fetch(`${CRICKET_API_URL}?apikey=${CRICKET_API_KEY}&offset=0`);
      const json = await response.json();

      if (json.status === 'success' && json.data) {
        const matches = json.data.map((m: any) => ({
          id: m.id || Math.random().toString(36).substr(2, 9),
          sport: 'Cricket',
          teamA: (m.teams && m.teams[0]) || 'TBA',
          teamB: (m.teams && m.teams[1]) || 'TBA',
          startTime: (m.status || 'Live').substring(0, 47),
          isLive: m.ms === 'live',
          odds: { 
            over: Number((1.50 + Math.random() * 1.2).toFixed(2)), 
            under: Number((1.50 + Math.random() * 1.2).toFixed(2)), 
            line: 1 
          },
          marketLocked: m.ms === 'result'
        }));
        return { matches, sources: [] };
      }
    } catch (error) {
      console.warn("SportsAPI: Direct fetch failed (CORS/Network). Invoking Gemini AI Fallback.");
    }

    // 2. AI Fallback (Gemini with Google Search bypasses local CORS issues)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `
        Search for today's live or upcoming international cricket matches. 
        Provide a list of at least 6 matches including:
        - Team A and Team B names
        - Current Status (e.g. LIVE 124/2 or Time in IST/GMT)
        - Whether it is currently live (true/false)
        Return the data as a JSON array with these keys: id, teamA, teamB, startTime, isLive.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        },
      });

      const text = response.text || "[]";
      const cleanJson = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      const matches = parsed.map((m: any) => ({
        ...m,
        id: m.id || Math.random().toString(36).substr(2, 5),
        sport: 'Cricket',
        odds: { 
          over: Number((1.4 + Math.random()).toFixed(2)), 
          under: Number((1.4 + Math.random()).toFixed(2)), 
          line: 1 
        }
      }));
      
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return { matches, sources };
    } catch (e) {
      console.error("Critical Failure: Both Direct API and AI Fallback failed.", e);
      return null;
    }
  }
};
