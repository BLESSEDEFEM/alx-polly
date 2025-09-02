import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

const pollSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).min(2, 'At least two options are required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, options } = pollSchema.parse(body);

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data, error } = await supabase.from('polls').insert([
      { question, options, created_by: (await supabase.auth.getUser()).data.user?.id }
    ]).select();

    if (error) {
      console.error('Error creating poll:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}