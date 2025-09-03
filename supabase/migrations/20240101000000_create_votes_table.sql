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
-- Allow anyone to insert votes (both authenticated and anonymous users)
CREATE POLICY "Anyone can insert votes" ON votes
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read votes (for displaying results)
CREATE POLICY "Anyone can read votes" ON votes
  FOR SELECT
  USING (true);

-- Only allow users to update/delete their own votes (if needed)
CREATE POLICY "Users can update their own votes" ON votes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON votes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add comment to table
COMMENT ON TABLE votes IS 'Stores votes for polls, supporting both authenticated users and anonymous voting via IP address';
COMMENT ON COLUMN votes.poll_id IS 'Reference to the poll being voted on';
COMMENT ON COLUMN votes.user_id IS 'Reference to authenticated user (null for anonymous votes)';
COMMENT ON COLUMN votes.ip_address IS 'IP address for anonymous votes (null for authenticated votes)';
COMMENT ON COLUMN votes.option_index IS 'Index of the selected option in the poll options array';
COMMENT ON COLUMN votes.created_at IS 'Timestamp when the vote was cast';