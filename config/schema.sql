-- Supabase Database Schema for Editor Monitor
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Brands table
CREATE TABLE brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert brands
INSERT INTO brands (id, name, website, description) VALUES
  ('aurapets', 'Aurapets', 'shopaurapets.com', 'Dog eye health nano drops supplement'),
  ('lumineye', 'LuminEye', 'lumindrops.co', 'Human eye health nano drops supplement');

-- Editors table
CREATE TABLE editors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  api_key TEXT UNIQUE NOT NULL,
  brand_id TEXT REFERENCES brands(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert editors with API keys
-- IMPORTANT: After running this, query the keys with: SELECT name, api_key, brand_id FROM editors;
INSERT INTO editors (name, email, api_key, brand_id) VALUES
  -- Aurapets editors
  ('James', 'james@w16media.co', 'ap_james_7f3k9m2x5v8b4n1q6w0z', 'aurapets'),
  ('John', 'john@w16media.co', 'ap_john_8h4l0n3y6w9c5p2r7x1a', 'aurapets'),
  ('Antoni', 'antoni@w16media.co', 'ap_antoni_9j5m1p4z7x0d6q3s8y2b', 'aurapets'),
  ('Daniel', 'daniel@w16media.co', 'ap_daniel_0k6n2q5a8y1e7r4t9z3c', 'aurapets'),
  ('Eyasu', 'eyasu@w16media.co', 'ap_eyasu_1l7o3r6b9z2f8s5u0a4d', 'aurapets'),
  ('Eugene', 'eugene@w16media.co', 'ap_eugene_2m8p4s7c0a3g9t6v1b5e', 'aurapets'),
  -- LuminEye editors
  ('Santanu', 'santanu@w16media.co', 'le_santanu_3n9q5t8d1b4h0u7w2c6f', 'lumineye'),
  ('Daniel 2', 'daniel2@w16media.co', 'le_daniel2_4o0r6u9e2c5i1v8x3d7g', 'lumineye'),
  -- Test accounts for admin
  ('Test Aurapets', 'narjes@w16media.co', 'test_aurapets_admin_x9k2m5n8p3q7', 'aurapets'),
  ('Test LuminEye', 'narjes@w16media.co', 'test_lumineye_admin_y4l7o0r3s6t9', 'lumineye'),
  -- Narjes personal test accounts
  ('Narjes', 'narjes@w16media.co', 'narjes_aurapets_k8m3n7p2q9w4x1y6z0', 'aurapets'),
  ('Narjes LuminEye', 'narjes@w16media.co', 'narjes_lumineye_j5h9l2o6r3t8v1a4b7', 'lumineye');

-- Requests/Activity log table
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  editor_id UUID REFERENCES editors(id),
  tool TEXT NOT NULL,
  prompt TEXT NOT NULL,
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  detected_topic TEXT,
  confidence INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES requests(id),
  email_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_requests_editor_id ON requests(editor_id);
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);
CREATE INDEX idx_requests_is_flagged ON requests(is_flagged);
CREATE INDEX idx_editors_api_key ON editors(api_key);
CREATE INDEX idx_editors_brand_id ON editors(brand_id);

-- View for easy dashboard queries
CREATE VIEW request_details AS
SELECT
  r.id,
  r.tool,
  r.prompt,
  r.is_flagged,
  r.flag_reason,
  r.detected_topic,
  r.confidence,
  r.created_at,
  e.name as editor_name,
  e.email as editor_email,
  b.name as brand_name,
  b.website as brand_website
FROM requests r
JOIN editors e ON r.editor_id = e.id
JOIN brands b ON e.brand_id = b.id
ORDER BY r.created_at DESC;

-- Function to get editor API keys (for admin use)
CREATE OR REPLACE FUNCTION get_editor_keys()
RETURNS TABLE (
  editor_name TEXT,
  brand_name TEXT,
  api_key TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT e.name, b.name, e.api_key
  FROM editors e
  JOIN brands b ON e.brand_id = b.id
  ORDER BY b.name, e.name;
END;
$$ LANGUAGE plpgsql;
