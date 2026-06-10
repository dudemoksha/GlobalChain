"use client";

/**
 * SupabaseProvider
 * ─────────────────
 * Mounted once in the root layout. Responsibilities:
 *  1. Test Supabase connection on load
 *  2. If an orgId exists in localStorage, load suppliers + edges from DB
 *  3. Subscribe to realtime changes and sync them to the Zustand store
 *  4. Expose DB status to the rest of the app via the store
 */

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import {
  fetchSuppliers,
  fetchEdges,
  fetchOrganizations,
  subscribeToSuppliers,
  subscribeToOrganizations,
  getOrgId,
} from '@/lib/api';
import { supabase } from '@/lib/supabase';

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    setSuppliers,
    setEdges,
    setOrganizations,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    setDbConnected,
    setDbSyncing,
    setDbError,
    setSyncedAt,
    setOrgId,
    userRole,
    db,
  } = useStore();

  // ── 1. Test connection ──────────────────────────────────────────────────
  useEffect(() => {
    async function testConnection() {
      try {
        const { error } = await supabase
          .from('organizations')
          .select('id')
          .limit(1);

        if (error) {
          setDbConnected(false);
          setDbError(error.message);
        } else {
          setDbConnected(true);
          setDbError(null);
        }
      } catch (e: any) {
        setDbConnected(false);
        setDbError(e.message || 'Could not reach Supabase');
      }
    }
    testConnection();
  }, []);

  // ── 2. Load suppliers + edges when orgId is available ──────────────────
  useEffect(() => {
    const activeOrgId = (db.orgId || getOrgId()) as string | undefined;
    if (!activeOrgId) {
      setSuppliers([]);
      setEdges([]);
      return;
    }

    if (db.orgId !== activeOrgId) {
      setOrgId(activeOrgId);
    }

    // If an upload or sync is actively in progress, do not overwrite local state
    if (db.isSyncing) return;

    setDbSyncing(true);

    async function loadData() {
      try {
        const [suppliers, edges] = await Promise.all([
          fetchSuppliers(activeOrgId),
          fetchEdges(activeOrgId),
        ]);
        setSuppliers(suppliers);
        setEdges(edges);
      } catch (err) {
        console.error('[SupabaseProvider loadData]', err);
      } finally {
        setSyncedAt();
      }
    }

    loadData();
  }, [db.orgId]);

  // ── 3. Load organizations if Admin ──────────────────────────────────────
  useEffect(() => {
    if (userRole !== 'Admin') return;

    async function loadOrgs() {
      const orgs = await fetchOrganizations();
      if (orgs.length > 0) {
        setOrganizations(
          orgs.map((o: any) => ({
            id: o.id,
            name: o.name,
            email: o.email,
            status: o.status,
            createdAt: o.created_at?.split('T')[0] ?? '',
          }))
        );
      }
    }

    loadOrgs();

    // Subscribe to realtime org changes
    const unsubOrgs = subscribeToOrganizations(loadOrgs);
    return () => unsubOrgs();
  }, [userRole]);

  // ── 4. Realtime supplier subscription ──────────────────────────────────
  useEffect(() => {
    const activeOrgId = db.orgId || getOrgId();
    if (!activeOrgId) return;

    const unsubSuppliers = subscribeToSuppliers(
      activeOrgId,
      (newSupplier) => addSupplier(newSupplier),
      (updatedSupplier) => updateSupplier(updatedSupplier.id, updatedSupplier),
      (deletedId) => deleteSupplier(deletedId)
    );

    return () => unsubSuppliers();
  }, [db.orgId]);

  return <>{children}</>;
}
