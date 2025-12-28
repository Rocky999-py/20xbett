
import { createClient } from '@supabase/supabase-js';
import { User, UserCredentials } from './types';

/**
 * Nexus Production API - Hybrid Data Layer
 * 
 * This API automatically detects if Supabase is configured.
 * If not, it falls back to a high-performance local simulation for testing.
 */

const getEnv = (key: string) => {
  try {
    // Attempt to access process.env (Vercel/Node style)
    return (process.env as any)[key];
  } catch {
    return undefined;
  }
};

const SUPABASE_URL = getEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnv('SUPABASE_ANON_KEY');

// Initialize Supabase only if valid credentials exist
const isCloudEnabled = SUPABASE_URL && SUPABASE_URL !== 'https://your-project-id.supabase.co';
const supabase = isCloudEnabled ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY!) : null;

// Mock database for Local Fallback
const getLocalDB = () => {
  const db = localStorage.getItem('nexus_local_ledger');
  return db ? JSON.parse(db) : { profiles: [] };
};

const saveLocalDB = (db: any) => {
  localStorage.setItem('nexus_local_ledger', JSON.stringify(db));
};

export const NexusAPI = {
  /**
   * Register a new user node
   */
  register: async (credentials: UserCredentials & { password?: string }) => {
    const { name, email, password, phone, metamask, trustwallet } = credentials;

    const newUser: User = {
      id: `NEX-${Math.floor(1000 + Math.random() * 9000)}-${name.substring(0, 1).toUpperCase()}`,
      fullName: name,
      email,
      phone,
      profilePic: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      walletAddress: metamask || trustwallet || '0x0000...0000',
      uplineId: 'NEX-0001-A',
      joinDate: new Date().toLocaleDateString(),
      currentLevel: 1,
      balanceUSDT: 100.00, // Starting bonus for new nodes
      balanceBNB: 0.15,
      password: password || 'nopass'
    };

    if (supabase) {
      const { error } = await supabase.from('profiles').insert([newUser]);
      if (error) throw new Error(`CLOUD_DATABASE_ERROR: ${error.message}`);
      return { success: true, user: newUser };
    } else {
      // Local Fallback
      console.warn("NEXUS_SYSTEM: Cloud DB not detected. Initializing Local Matrix Node.");
      const db = getLocalDB();
      if (db.profiles.find((p: any) => p.email === email)) {
        throw new Error('LEDGER_ERROR: Email node already indexed locally.');
      }
      db.profiles.push(newUser);
      saveLocalDB(db);
      return { success: true, user: newUser };
    }
  },

  /**
   * Authenticate node
   */
  login: async (credentials: { email: string; password?: string }) => {
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', credentials.email)
        .eq('password', credentials.password)
        .single();

      if (error || !data) throw new Error('AUTH_FAILED: Invalid cloud signature.');
      return { success: true, user: data as User };
    } else {
      const db = getLocalDB();
      const user = db.profiles.find((p: any) => p.email === credentials.email && p.password === credentials.password);
      if (!user) throw new Error('AUTH_FAILED: Invalid local node signature.');
      return { success: true, user };
    }
  },

  /**
   * Sync Profile / Balance
   */
  updateProfile: async (userId: string, updates: Partial<User>) => {
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw new Error(`SYNC_FAILED: ${error.message}`);
      return { success: true, user: data as User };
    } else {
      const db = getLocalDB();
      const index = db.profiles.findIndex((p: any) => p.id === userId);
      if (index === -1) throw new Error('SYNC_FAILED: Local node not found.');
      db.profiles[index] = { ...db.profiles[index], ...updates };
      saveLocalDB(db);
      return { success: true, user: db.profiles[index] };
    }
  },

  getGlobalStats: async () => {
    if (supabase) {
      const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      return { totalWebsiteUsers: count || 12450 };
    }
    return { totalWebsiteUsers: 12450 + getLocalDB().profiles.length };
  }
};
