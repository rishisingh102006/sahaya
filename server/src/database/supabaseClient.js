import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

let supabaseInstance = null;

export const isSupabaseConfigured = () => {
  return Boolean(
    env.SUPABASE_URL && 
    env.SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
    (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY)
  );
};

export const getSupabase = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseInstance) {
    const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;
    supabaseInstance = createClient(env.SUPABASE_URL, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseInstance;
};

export const testSupabaseConnection = async () => {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      reason: 'Supabase credentials not configured in environment (SUPABASE_URL or keys missing)',
    };
  }

  try {
    const client = getSupabase();
    // Test query against public schemes or health ping
    const { data, error } = await client.from('schemes').select('id').limit(1);
    if (error) {
      return {
        connected: false,
        error: error.message,
        code: error.code,
      };
    }
    return {
      connected: true,
      url: env.SUPABASE_URL ? env.SUPABASE_URL.replace(/^(https:\/\/[^.]+).*/, '$1.supabase.co') : 'configured',
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message,
    };
  }
};
