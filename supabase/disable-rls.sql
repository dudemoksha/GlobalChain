-- Disable RLS on all tables so the frontend can read/write data using the anon key
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;
ALTER TABLE supply_edges DISABLE ROW LEVEL SECURITY;
ALTER TABLE alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE risk_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE simulations DISABLE ROW LEVEL SECURITY;
ALTER TABLE backup_supplier_mappings DISABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_datasets DISABLE ROW LEVEL SECURITY;

-- Ensure the admin account exists just in case
INSERT INTO organizations (name, email, status)
VALUES ('GlobalChain Admin', 'admin@globalchain.intel', 'Approved')
ON CONFLICT (email) DO NOTHING;
