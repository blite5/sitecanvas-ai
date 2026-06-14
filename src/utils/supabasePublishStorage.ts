// Supabase storage adapter for published sites.
// Swap publishStorage.ts to use this when VITE_SUPABASE_URL/ANON_KEY are set.
import { supabase } from '../lib/supabase';
import type { PublishedSite, SiteElement, StorageAdapter } from '../types';

interface DBRow {
  id: string;
  name: string;
  elements: unknown;
  created_at: string;
  updated_at: string;
  version: number;
}

function rowToSite(row: DBRow): PublishedSite {
  return {
    id: row.id,
    name: row.name,
    elements: row.elements as SiteElement[],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    version: row.version,
  };
}

export const supabaseAdapter: StorageAdapter = {
  async publish(site) {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('published_sites').upsert(
      {
        id: site.id,
        name: site.name,
        elements: site.elements,
        created_at: site.createdAt,
        updated_at: new Date().toISOString(),
        version: site.version,
      },
      { onConflict: 'id' }
    );
    if (error) throw error;
  },

  async get(siteId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('published_sites')
      .select('*')
      .eq('id', siteId)
      .maybeSingle();
    if (error) {
      console.warn('[Paletto] Supabase get error:', error.message);
      return null;
    }
    return data ? rowToSite(data as DBRow) : null;
  },

  async getAll() {
    if (!supabase) return {};
    const { data, error } = await supabase
      .from('published_sites')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error || !data) return {};
    const result: Record<string, PublishedSite> = {};
    for (const row of data as DBRow[]) {
      result[row.id] = rowToSite(row);
    }
    return result;
  },
};
