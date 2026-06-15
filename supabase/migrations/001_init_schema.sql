-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums safely
DROP TYPE IF EXISTS service_type CASCADE;
CREATE TYPE service_type AS ENUM ('survey', 'plot_booking', 'mutation_forms');

DROP TYPE IF EXISTS lead_status CASCADE;
CREATE TYPE lead_status AS ENUM ('new', 'contacted');

-- Properties table for real estate listings
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  image_url TEXT,
  image_urls TEXT[] DEFAULT '{}',
  description TEXT DEFAULT '',
  status property_status NOT NULL DEFAULT 'available',
  amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on status and created_at for faster queries safely
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

-- Leads table for contact form submissions
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type service_type NOT NULL,
  status lead_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- REPAIR STEP: Put back columns on the remote database if CASCADE dropped them
ALTER TABLE leads ADD COLUMN IF NOT EXISTS service_type service_type NOT NULL DEFAULT 'survey';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS status lead_status NOT NULL DEFAULT 'new';

-- Create index on status and created_at for faster queries safely
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Safely drop existing policies to prevent "already exists" errors
DROP POLICY IF EXISTS "properties_read" ON properties;
DROP POLICY IF EXISTS "properties_insert" ON properties;
DROP POLICY IF EXISTS "properties_update" ON properties;
DROP POLICY IF EXISTS "properties_delete" ON properties;

DROP POLICY IF EXISTS "leads_insert" ON leads;
DROP POLICY IF EXISTS "leads_read" ON leads;
DROP POLICY IF EXISTS "leads_update" ON leads;

-- Recreate policies for properties (anyone can view, only authenticated users can manage)
CREATE POLICY "properties_read" ON properties FOR SELECT USING (true);
CREATE POLICY "properties_insert" ON properties FOR INSERT WITH CHECK (true);
CREATE POLICY "properties_update" ON properties FOR UPDATE USING (true);
CREATE POLICY "properties_delete" ON properties FOR DELETE USING (true);

-- Recreate policies for leads (anyone can insert, only authenticated users can view/manage)
CREATE POLICY "leads_insert" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_read" ON leads FOR SELECT USING (true);
CREATE POLICY "leads_update" ON leads FOR UPDATE USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Safely drop existing triggers to prevent conflicts
DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;

-- Create triggers to update updated_at on changes
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
