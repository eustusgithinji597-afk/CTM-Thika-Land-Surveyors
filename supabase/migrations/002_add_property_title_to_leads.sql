-- Add property_title column to leads table for property booking context
ALTER TABLE leads ADD COLUMN IF NOT EXISTS property_title TEXT;

COMMENT ON COLUMN leads.property_title IS 'Stores the property name/title when a lead is created from a property booking intent';