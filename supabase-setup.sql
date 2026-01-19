-- SUPABASE DATABASE SETUP
-- Run this SQL in the Supabase SQL Editor

-- Create the main levels table (top 25)
CREATE TABLE levels (
  id BIGSERIAL PRIMARY KEY,
  rank INTEGER NOT NULL,
  name TEXT NOT NULL,
  creator TEXT NOT NULL,
  gddl_rank DECIMAL(10, 2) NOT NULL,
  points INTEGER NOT NULL,
  judah INTEGER DEFAULT 0,
  whitman INTEGER DEFAULT 0,
  jack INTEGER DEFAULT 0,
  judah_locked INTEGER,
  whitman_locked INTEGER,
  jack_locked INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the extended levels table (rank 26+)
CREATE TABLE extended_levels (
  id BIGSERIAL PRIMARY KEY,
  rank INTEGER NOT NULL,
  name TEXT NOT NULL,
  creator TEXT NOT NULL,
  gddl_rank DECIMAL(10, 2) NOT NULL,
  points INTEGER NOT NULL,
  judah INTEGER DEFAULT 0,
  whitman INTEGER DEFAULT 0,
  jack INTEGER DEFAULT 0,
  judah_locked INTEGER,
  whitman_locked INTEGER,
  jack_locked INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the banked points table
CREATE TABLE banked_points (
  id INTEGER PRIMARY KEY DEFAULT 1,
  judah DECIMAL(10, 2) DEFAULT 0,
  whitman DECIMAL(10, 2) DEFAULT 0,
  jack DECIMAL(10, 2) DEFAULT 0,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert initial banked points row
INSERT INTO banked_points (id, judah, whitman, jack) 
VALUES (1, 0, 0, 0);

-- Enable Row Level Security (RLS)
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE extended_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE banked_points ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (public access)
-- For levels table
CREATE POLICY "Allow all operations on levels" 
ON levels FOR ALL 
USING (true) 
WITH CHECK (true);

-- For extended_levels table
CREATE POLICY "Allow all operations on extended_levels" 
ON extended_levels FOR ALL 
USING (true) 
WITH CHECK (true);

-- For banked_points table
CREATE POLICY "Allow all operations on banked_points" 
ON banked_points FOR ALL 
USING (true) 
WITH CHECK (true);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE levels;
ALTER PUBLICATION supabase_realtime ADD TABLE extended_levels;
ALTER PUBLICATION supabase_realtime ADD TABLE banked_points;



https://cvkfvxmrfucpjgjhnlpd.supabase.co
sb_publishable_DnLU1daX92up6Ejy8VCe5A_AKY9TC7V
