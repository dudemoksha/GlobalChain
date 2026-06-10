import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('[Supabase Diagnostic]', {
  hasUrl: !!supabaseUrl,
  urlType: typeof supabaseUrl,
  urlLength: supabaseUrl.length,
  urlPrefix: supabaseUrl.substring(0, 15),
  hasKey: !!supabaseAnonKey,
  keyType: typeof supabaseAnonKey,
  keyLength: supabaseAnonKey.length,
});

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

let supabaseInstance: SupabaseClient | any = null;

if (!isValidUrl(supabaseUrl) || !supabaseAnonKey || supabaseUrl.includes('your_supabase_project_url_here')) {
  console.warn(
    '[GlobalChain] Supabase env vars not set correctly. ' +
    'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to enable database features.'
  );
  
  // A robust proxy-based fallback client that prevents method chains (like .select().eq().single()) from throwing exceptions.
  const createFallbackProxy = (): any => {
    const target = () => {};
    const proxy: any = new Proxy(target, {
      get(target, prop) {
        if (prop === 'then') {
          return (resolve: any) => resolve({ data: null, error: { message: 'Supabase not configured' } });
        }
        return proxy;
      },
      apply(target, thisArg, argumentsList) {
        return proxy;
      }
    });
    return proxy;
  };

  supabaseInstance = createFallbackProxy();
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
      params: { eventsPerSecond: 10 },
    },
  });
}

export const supabase = supabaseInstance;


export interface DbSupplier {
  id: string;
  company_id: string | null;
  name: string;
  tier_level: number;
  lat: number;
  lng: number;
  region: string | null;
  country: string | null;
  risk_score: number;
  health_score: number;
  quality_score: number;
  resilience_score: number;
  visibility_scope: string;
  category: string | null;
  is_backup: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbEdge {
  id: string;
  source_supplier_id: string;
  target_supplier_id: string | null; // null means "Main Company"
  dependency_weight: number;
}

export interface DbOrganization {
  id: string;
  name: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Suspended';
  created_at: string;
}
