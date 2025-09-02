import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/lib/supabase-browser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const supabase = createClient();
  const { question, options, createdBy, expiresAt } = req.body;
  const { data, error } = await supabase.from('polls').insert([
    { question, options, createdBy, expiresAt }
  ]);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(200).json({ poll: data[0] });
}