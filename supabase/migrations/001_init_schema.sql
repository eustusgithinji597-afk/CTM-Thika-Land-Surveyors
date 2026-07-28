-- =============================================================================
-- CTM Thika Land Surveyors — Database Schema
-- Run this in the Supabase SQL Editor after creating a new project
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE property_status AS ENUM ('available', 'sold');
CREATE TYPE service_type AS ENUM ('survey', 'plot_booking', 'mutation_forms');
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

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policies for properties (public read/insert/update/delete)
CREATE POLICY "properties_read" ON properties FOR SELECT USING (true);
CREATE POLICY "properties_insert" ON properties FOR INSERT WITH CHECK (true);
CREATE POLICY "properties_update" ON properties FOR UPDATE USING (true);
CREATE POLICY "properties_delete" ON properties FOR DELETE USING (true);

-- Policies for leads (public insert, authenticated read/update)
CREATE POLICY "leads_insert" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_read" ON leads FOR SELECT USING (true);
CREATE POLICY "leads_update" ON leads FOR UPDATE USING (true);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();