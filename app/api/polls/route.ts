import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

const pollSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters').max(160, 'Question must not be longer than 160 characters'),
  options: z.array(z.string().min(1, 'Option cannot be empty').max(50, 'Option must not be longer than 50 characters')).min(2, 'At least two options are required').max(10, 'You can add at most 10 options'),
  expiresAt: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, options, expiresAt } = pollSchema.parse(body);

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    );

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Prepare poll data with created_by
    const pollData: any = {
      question,
      options,
      created_by: user.id,
      created_at: new Date().toISOString(),
    };

    // Add expiration date if provided
    if (expiresAt && expiresAt.trim() !== '') {
      pollData.expires_at = new Date(expiresAt).toISOString();
    }

    const { data, error } = await supabase
      .from('polls')
      .insert([pollData])
      .select()
      .single();

    if (error) {
      console.error('Error creating poll:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      }, { status: 400 });
    }
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    );

    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching polls:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, question, options, expiresAt } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Poll ID is required' }, { status: 400 });
    }
    
    const { question: validatedQuestion, options: validatedOptions, expiresAt: validatedExpiresAt } = pollSchema.parse({ question, options, expiresAt });

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    );

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Prepare update data
    const updateData: any = {
      question: validatedQuestion,
      options: validatedOptions,
    };

    // Add expiration date if provided
    if (validatedExpiresAt && validatedExpiresAt.trim() !== '') {
      updateData.expires_at = new Date(validatedExpiresAt).toISOString();
    }

    const { data, error } = await supabase
      .from('polls')
      .update(updateData)
      .eq('id', id)
      .eq('created_by', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating poll:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Poll not found or you do not have permission to update it' }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      }, { status: 400 });
    }
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Poll ID is required' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    );

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('polls')
      .delete()
      .eq('id', id)
      .eq('created_by', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error deleting poll:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Poll not found or you do not have permission to delete it' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Poll deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}