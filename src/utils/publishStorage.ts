import type { PublishedSite } from '../types';

const PUBLISHED_KEY = 'paletto_published';

type Store = Record<string, PublishedSite>;

// Storage adapter interface — swap `localAdapter` for a Supabase adapter in v0.8
export interface StorageAdapter {
  publish(site: PublishedSite): Promise<void>;
  get(siteId: string): Promise<PublishedSite | null>;
  getAll(): Promise<Store>;
}

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

// To switch to Supabase: replace this export with a supabaseAdapter
export const publishStorage: StorageAdapter = localAdapter;
