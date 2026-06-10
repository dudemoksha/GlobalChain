/**
 * GlobalChain — Supabase API Service Layer
 * All DB reads/writes go through here. Components should never
 * call supabase directly — always use these functions.
 */

import { supabase } from './supabase';
import type { Supplier, Edge } from '@/store/useStore';

// ─── ORG ID HELPER ──────────────────────────────────────────────────────────
// For now we use a fixed demo org. When auth is fully wired, replace with
// the org_id from the authenticated user's JWT claim.
const DEMO_ORG_ID_KEY = 'gc_org_id';

export function getOrgId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(DEMO_ORG_ID_KEY);
}

export function setOrgId(id: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEMO_ORG_ID_KEY, id);
  }
}

export function clearOrgId() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DEMO_ORG_ID_KEY);
  }
}

// ─── SUPPLIERS ──────────────────────────────────────────────────────────────

/** Fetch all suppliers for the current org from Supabase */
export async function fetchSuppliers(customOrgId?: string): Promise<Supplier[]> {
  const orgId = customOrgId || getOrgId();
  if (!orgId) return [];

  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[fetchSuppliers]', error.message);
    return [];
  }

  return (data || []).map(dbRowToSupplier);
}

/** Insert a single supplier into Supabase */
export async function insertSupplier(supplier: Supplier): Promise<Supplier | null> {
  const orgId = getOrgId();
  if (!orgId) return null;

  const { data, error } = await supabase
    .from('suppliers')
    .insert([supplierToDbRow(supplier, orgId)])
    .select()
    .single();

  if (error) {
    console.error('[insertSupplier]', error.message);
    return null;
  }
  return dbRowToSupplier(data);
}

/** Bulk insert an array of suppliers (used after Excel upload) */
export async function bulkInsertSuppliers(
  suppliers: Supplier[],
  orgId: string
): Promise<Supplier[]> {
  // Delete old suppliers for this org before re-inserting
  await supabase.from('suppliers').delete().eq('org_id', orgId);
  await supabase.from('supply_edges').delete().eq('org_id', orgId);

  if (suppliers.length === 0) return [];

  const rows = suppliers.map((s) => supplierToDbRow(s, orgId));

  const { data, error } = await supabase
    .from('suppliers')
    .insert(rows)
    .select();

  if (error) {
    console.error('[bulkInsertSuppliers]', error.message);
    throw new Error(`Failed to insert suppliers: ${error.message}`);
  }

  return (data || []).map(dbRowToSupplier);
}

/** Update a supplier in Supabase */
export async function updateSupplierDb(
  id: string,
  updates: Partial<Supplier>
): Promise<void> {
  const { error } = await supabase
    .from('suppliers')
    .update({
      name: updates.name,
      tier: updates.tier,
      lat: updates.lat,
      lng: updates.lng,
      health: updates.health,
      risk: updates.risk,
      visibility: updates.visibility,
      category: updates.category,
      is_backup: updates.isBackup,
    })
    .eq('id', id);

  if (error) console.error('[updateSupplierDb]', error.message);
}

/** Delete a supplier from Supabase */
export async function deleteSupplierDb(id: string): Promise<void> {
  const { error } = await supabase.from('suppliers').delete().eq('id', id);
  if (error) console.error('[deleteSupplierDb]', error.message);
}

// ─── SUPPLY EDGES ────────────────────────────────────────────────────────────

/** Fetch all supply edges for the current org */
export async function fetchEdges(customOrgId?: string): Promise<Edge[]> {
  const orgId = customOrgId || getOrgId();
  if (!orgId) return [];

  const { data, error } = await supabase
    .from('supply_edges')
    .select('*')
    .eq('org_id', orgId);

  if (error) {
    console.error('[fetchEdges]', error.message);
    return [];
  }

  return (data || []).map((row: any) => ({
    source: row.source_supplier_id,
    target: row.target_supplier_id ?? 'Main',
    value: row.dependency_weight ?? 1.0,
  }));
}

/** Bulk insert supply edges */
export async function bulkInsertEdges(
  edges: Edge[],
  orgId: string,
  supplierIdMap: Record<string, string> // localId → supabase UUID
): Promise<void> {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const rows = edges
    .map((e) => {
      const sourceId = supplierIdMap[e.source] ?? e.source;
      const targetId = e.target === 'Main' ? null : (supplierIdMap[e.target] ?? e.target);

      // Only include rows where sourceId is a valid UUID
      if (!uuidRegex.test(sourceId)) return null;
      // If targetId is not 'Main' (null), it must also be a valid UUID
      if (targetId !== null && !uuidRegex.test(targetId)) return null;

      return {
        org_id: orgId,
        source_supplier_id: sourceId,
        target_supplier_id: targetId,
        dependency_weight: e.value,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  if (rows.length === 0) return;

  const { error } = await supabase.from('supply_edges').insert(rows);
  if (error) {
    console.error('[bulkInsertEdges]', error.message);
    throw new Error(`Failed to insert supply edges: ${error.message}`);
  }
}

// ─── ORGANIZATIONS ───────────────────────────────────────────────────────────

/** Fetch all organizations (admin only) */
export async function fetchOrganizations() {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[fetchOrganizations]', error.message);
    return [];
  }
  return data || [];
}

/** Create a new organization (status: Pending) */
export async function createOrganization(name: string, email: string) {
  const { data, error } = await supabase
    .from('organizations')
    .insert([{ name, email, status: 'Pending' }])
    .select()
    .single();

  if (error) {
    console.error('[createOrganization]', error.message);
    return null;
  }
  return data;
}

/** Update organization status (approve/reject/suspend) */
export async function updateOrgStatusDb(
  id: string,
  status: 'Pending' | 'Approved' | 'Rejected' | 'Suspended'
): Promise<void> {
  const { error } = await supabase
    .from('organizations')
    .update({ status })
    .eq('id', id);

  if (error) console.error('[updateOrgStatusDb]', error.message);
}

/** Delete an organization */
export async function deleteOrganizationDb(id: string): Promise<void> {
  const { error } = await supabase.from('organizations').delete().eq('id', id);
  if (error) console.error('[deleteOrganizationDb]', error.message);
}

// ─── DATASET UPLOAD TRACKING ─────────────────────────────────────────────────

/** Log a dataset upload record */
export async function logDatasetUpload(
  orgId: string,
  fileName: string,
  rowCount: number,
  status: 'completed' | 'failed'
): Promise<void> {
  await supabase.from('uploaded_datasets').insert([
    { org_id: orgId, file_name: fileName, row_count: rowCount, status },
  ]);
}

// ─── REALTIME SUBSCRIPTIONS ─────────────────────────────────────────────────

/**
 * Subscribe to realtime supplier changes.
 * Returns an unsubscribe function.
 */
export function subscribeToSuppliers(
  orgId: string,
  onInsert: (s: Supplier) => void,
  onUpdate: (s: Supplier) => void,
  onDelete: (id: string) => void
): () => void {
  const channel = supabase
    .channel(`suppliers:${orgId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'suppliers',
        filter: `org_id=eq.${orgId}`,
      },
      (payload: any) => onInsert(dbRowToSupplier(payload.new))
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'suppliers',
        filter: `org_id=eq.${orgId}`,
      },
      (payload: any) => onUpdate(dbRowToSupplier(payload.new))
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'suppliers',
        filter: `org_id=eq.${orgId}`,
      },
      (payload: any) => onDelete(payload.old?.id)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/** Subscribe to organization status changes (admin panel) */
export function subscribeToOrganizations(
  onChange: () => void
): () => void {
  const channel = supabase
    .channel('organizations')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'organizations' },
      onChange
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

// ─── PRIVATE HELPERS ─────────────────────────────────────────────────────────

function dbRowToSupplier(row: any): Supplier {
  return {
    id: row.id,
    name: row.name,
    tier: (row.tier ?? row.tier_level ?? 1) as 1 | 2 | 3,
    lat: row.lat,
    lng: row.lng,
    health: row.health ?? Math.round((row.health_score ?? 0.8) * 100),
    risk: row.risk ?? Math.round((row.risk_score ?? 0.2) * 100),
    visibility: (row.visibility ?? (row.visibility_scope === 'private' ? 'Private' : 'Public')) as 'Public' | 'Private',
    category: row.category ?? 'General',
    isBackup: row.is_backup ?? false,
  };
}

function supplierToDbRow(s: Supplier, orgId: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isValidUuid = uuidRegex.test(s.id);

  const row: any = {
    org_id: orgId,
    name: s.name,
    tier: s.tier,
    lat: s.lat,
    lng: s.lng,
    health: s.health,
    risk: s.risk,
    visibility: s.visibility,
    category: s.category,
    is_backup: s.isBackup ?? false,
  };

  // ONLY include id if it's a valid UUID. 
  // If we pass { id: undefined } or { id: null }, Postgres might complain about not-null 
  // instead of using the DEFAULT value. By not including the key at all, DEFAULT triggers correctly.
  if (isValidUuid) {
    row.id = s.id;
  }

  return row;
}
