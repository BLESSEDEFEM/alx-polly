import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }
  const cookieStore = cookies()

  const supabase = createRouteHandlerClient({
    cookies
  })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { question, options, expiresAt } = await req.json();
  const createdBy = user.id;
  const { data, error } = await supabase.from('polls').insert([
    { question, options, createdBy, expiresAt }
  ]);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify({ poll: data?.[0] }), { status: 200 });
}