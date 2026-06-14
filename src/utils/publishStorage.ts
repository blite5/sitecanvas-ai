import type { PublishedSite, StorageAdapter } from '../types';
import { isSupabaseEnabled } from '../lib/supabase';
import { supabaseAdapter } from './supabasePublishStorage';

// ── localStorage adapter (fallback when Supabase is not configured) ───────────
const PUBLISHED_KEY = 'paletto_published';

type Store = Record<string, PublishedSite>;

function readStore(): Store {
  try {
    const raw = localStorage.getItem(PUBLISHED_KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

export const localAdapter: StorageAdapter = {
  async publish(site) {
    const store = readStore();
    store[site.id] = site;
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(store));
  },
  async get(siteId) {
    return readStore()[siteId] ?? null;
  },
  async getAll() {
    return readStore();
  },
};

// ── Active adapter: Supabase if env vars are present, otherwise localStorage ──
// To switch permanently to Supabase, set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
// in .env (local) and in Vercel project settings (production).
export const publishStorage: StorageAdapter = isSupabaseEnabled
  ? supabaseAdapter
  : localAdapter;
