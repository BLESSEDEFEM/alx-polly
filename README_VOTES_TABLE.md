# Votes Table Setup

The voting functionality requires a `votes` table in your Supabase database. Since the migration file has been created but not applied, you need to manually create the table.

## Option 1: Manual Creation via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/20240101000000_create_votes_table.sql`
4. Execute the SQL script

## Option 2: Quick SQL Script

Run this SQL in your Supabase SQL Editor:

```sql
-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  option_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure either user_id or ip_address is provided
  CONSTRAINT votes_user_or_ip_check CHECK (
    (user_id IS NOT NULL AND ip_address IS NULL) OR 
    (user_id IS NULL AND ip_address IS NOT NULL)
  ),
  
  -- Prevent duplicate votes from same user
  CONSTRAINT votes_user_unique UNIQUE (poll_id, user_id),
  
  -- Prevent duplicate votes from same IP (for anonymous users)
  CONSTRAINT votes_ip_unique UNIQUE (poll_id, ip_address)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_ip_address ON votes(ip_address);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at);

-- Enable Row Level Security
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies for votes table
CREATE POLICY "Anyone can insert votes" ON votes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read votes" ON votes
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own votes" ON votes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON votes
  FOR DELETE
  USING (auth.uid() = user_id);
```

## Verification

After creating the table, you can verify it exists by running:

```sql
SELECT * FROM votes LIMIT 1;
```

Once the table is created, the voting functionality will work properly.