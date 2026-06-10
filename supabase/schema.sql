-- ============================================================
-- GlobalChain Enterprise Platform — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ORGANIZATIONS TABLE ─────────────────────────────────────
-- Tracks company accounts. New signups start as "Pending" until
-- an Admin approves them.
CREATE TABLE IF NOT EXISTS organizations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  status      TEXT NOT NULL DEFAULT 'Pending'
                CHECK (status IN ('Pending','Approved','Rejected','Suspended')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SUPPLIERS TABLE ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS suppliers (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id               UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name                 TEXT NOT NULL,
  tier                 INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 3),
  lat                  DOUBLE PRECISION NOT NULL,
  lng                  DOUBLE PRECISION NOT NULL,
  health               INTEGER NOT NULL DEFAULT 80 CHECK (health BETWEEN 0 AND 100),
  risk                 INTEGER NOT NULL DEFAULT 20 CHECK (risk BETWEEN 0 AND 100),
  category             TEXT DEFAULT 'General',
  visibility           TEXT NOT NULL DEFAULT 'Public'
                         CHECK (visibility IN ('Public','Private')),
  is_backup            BOOLEAN DEFAULT FALSE,
  region               TEXT,
  country              TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SUPPLY EDGES TABLE ─────────────────────────────────────
-- Represents directed dependency: source_id depends on target_id.
-- target_id NULL means "Main Company" (the root node).
CREATE TABLE IF NOT EXISTS supply_edges (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id              UUID REFERENCES organizations(id) ON DELETE CASCADE,
  source_supplier_id  UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  target_supplier_id  UUID REFERENCES suppliers(id) ON DELETE CASCADE, -- NULL = Main
  dependency_weight   FLOAT DEFAULT 1.0,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BACKUP SUPPLIER MAPPINGS ────────────────────────────────
CREATE TABLE IF NOT EXISTS backup_supplier_mappings (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id               UUID REFERENCES organizations(id) ON DELETE CASCADE,
  primary_supplier_id  UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  backup_supplier_id   UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  activation_priority  INTEGER DEFAULT 1,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RISK EVENTS TABLE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS risk_events (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id       UUID REFERENCES organizations(id) ON DELETE CASCADE,
  event_type   TEXT NOT NULL,
  severity     TEXT NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  lat          DOUBLE PRECISION,
  lng          DOUBLE PRECISION,
  radius_km    FLOAT,
  description  TEXT,
  is_active    BOOLEAN DEFAULT TRUE,
  started_at   TIMESTAMPTZ DEFAULT NOW(),
  ended_at     TIMESTAMPTZ
);

-- ─── SIMULATIONS TABLE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS simulations (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id         UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  type           TEXT NOT NULL,
  scenario_data  JSONB NOT NULL DEFAULT '{}',
  results_data   JSONB,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ALERTS TABLE ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id       UUID REFERENCES organizations(id) ON DELETE CASCADE,
  supplier_id  UUID REFERENCES suppliers(id),
  title        TEXT NOT NULL,
  message      TEXT NOT NULL,
  severity     TEXT NOT NULL,
  is_read      BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── UPLOADED DATASETS TABLE ────────────────────────────────
-- Tracks metadata about every CSV/Excel upload
CREATE TABLE IF NOT EXISTS uploaded_datasets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id        UUID REFERENCES organizations(id) ON DELETE CASCADE,
  file_name     TEXT NOT NULL,
  row_count     INTEGER DEFAULT 0,
  status        TEXT DEFAULT 'processing' CHECK (status IN ('processing','completed','failed')),
  uploaded_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AUTO-UPDATE TRIGGER ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── ENABLE REALTIME ────────────────────────────────────────
-- Go to: Supabase → Database → Replication → Tables
-- and enable these tables, OR run:
ALTER PUBLICATION supabase_realtime ADD TABLE suppliers;
ALTER PUBLICATION supabase_realtime ADD TABLE supply_edges;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE risk_events;
ALTER PUBLICATION supabase_realtime ADD TABLE organizations;

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────
-- Disable RLS for now (enable after adding auth.users integration)
-- You can re-enable with: ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- ─── INDEXES FOR PERFORMANCE ────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_suppliers_org_id ON suppliers(org_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_tier ON suppliers(tier);
CREATE INDEX IF NOT EXISTS idx_supply_edges_org_id ON supply_edges(org_id);
CREATE INDEX IF NOT EXISTS idx_supply_edges_source ON supply_edges(source_supplier_id);
CREATE INDEX IF NOT EXISTS idx_alerts_org_id ON alerts(org_id);

-- ─── SAMPLE ADMIN ORGANIZATION ──────────────────────────────
-- Insert a default approved admin org for testing
INSERT INTO organizations (name, email, status)
VALUES ('GlobalChain Admin', 'admin@globalchain.intel', 'Approved')
ON CONFLICT (email) DO NOTHING;
