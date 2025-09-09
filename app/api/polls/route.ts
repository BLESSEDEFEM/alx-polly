import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Validation schema for poll creation and updates
 */
const pollSchema = z.object({
  question: z
    .string()
    .min(5, 'Question must be at least 5 characters')
    .max(160, 'Question must not be longer than 160 characters')
    .transform(v => v.trim()),
  options: z
    .array(
      z
        .string()
        .min(1, 'Option cannot be empty')
        .max(50, 'Option must not be longer than 50 characters')
        .transform(v => v.trim())
    )
    .min(2, 'At least two options are required')
    .max(10, 'You can add at most 10 options')
    .refine(opts => new Set(opts).size === opts.length, {
      message: 'Options must be unique'
    }),
  expiresAt: z.preprocess(
    (val) => {
      if (!val || val === '') return null;
      const date = new Date(val as string);
      if (isNaN(date.getTime())) return undefined; // Will cause validation to fail
      return date.toISOString();
    },
    z.string().nullable().optional()
  ),
});

/**
 * Validation schema for poll updates (includes ID)
 */
const pollUpdateSchema = pollSchema.extend({
  id: z.string().uuid('Invalid poll ID format'),
});

/**
 * Type definition for poll data structure
 */
type PollData = {
  question: string;
  options: string[];
  created_by: string;
  created_at: string;
  expires_at?: string;
};

/**
 * Type definition for authentication result
 */
type AuthResult = {
  user: any | null;
  error: NextResponse | null;
};

/**
 * Creates a Supabase client configured for server-side rendering
 * with cookie-based session management
 * @returns {SupabaseClient} Configured Supabase client instance
 */
function createSupabaseClient(): SupabaseClient {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

/**
 * Authenticates the current user using the provided Supabase client
 * @param {SupabaseClient} supabase - The Supabase client instance
 * @returns {Promise<AuthResult>} Authentication result with user data or error response
 */
async function authenticateUser(supabase: SupabaseClient): Promise<AuthResult> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { 
      user: null, 
      error: NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      ) 
    };
  }
  
  return { user, error: null };
}

/**
 * Handles Zod validation errors and formats them for API response
 * @param {z.ZodError} error - The Zod validation error
 * @returns {NextResponse} Formatted error response with validation details
 */
function handleValidationError(error: z.ZodError): NextResponse {
  return NextResponse.json(
    { 
      error: 'Validation failed', 
      details: error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    }, 
    { status: 400 }
  );
}

/**
 * Handles unexpected errors and logs them for debugging
 * @param {unknown} error - The unexpected error
 * @param {string} context - Context where the error occurred (e.g., 'POST', 'GET')
 * @returns {NextResponse} Generic error response
 */
function handleUnexpectedError(error: unknown, context: string): NextResponse {
  console.error(`Unexpected error in ${context}:`, error);
  return NextResponse.json(
    { error: 'Internal Server Error' }, 
    { status: 500 }
  );
}

/**
 * Prepares poll data object for database insertion
 * @param {string} question - The poll question
 * @param {string[]} options - Array of poll options
 * @param {string | null | undefined} expiresAt - Optional expiration date string
 * @param {string} userId - ID of the user creating the poll
 * @returns {PollData} Formatted poll data object
 */
function preparePollData(
  question: string, 
  options: string[], 
  expiresAt: string | null | undefined, 
  userId: string
): PollData {
  const pollData: PollData = {
    question,
    options,
    created_by: userId,
    created_at: new Date().toISOString(),
  };

  if (expiresAt && expiresAt.trim() !== '') {
    pollData.expires_at = new Date(expiresAt).toISOString();
  }

  return pollData;
}

/**
 * Creates a new poll
 * @param {Request} request - The HTTP request containing poll data
 * @returns {Promise<NextResponse>} Response with created poll data or error
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { question, options, expiresAt } = pollSchema.parse(body);

    const supabase = createSupabaseClient();
    const { user, error: authError } = await authenticateUser(supabase);
    
    if (authError) {
      return authError;
    }

    const pollData = preparePollData(question, options, expiresAt, user!.id);

    const { data, error } = await supabase
      .from('polls')
      .insert([pollData])
      .select()
      .single();

    if (error) {
      console.error('Error creating poll:', error);
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }
    return handleUnexpectedError(error, 'POST');
  }
}

/**
 * Retrieves all polls ordered by creation date (newest first)
 * @returns {Promise<NextResponse>} Response with polls array or error
 */
export async function GET(): Promise<NextResponse> {
  try {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching polls:', error);
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return handleUnexpectedError(error, 'GET');
  }
}

/**
 * Updates an existing poll (only the owner can update)
 * @param {Request} request - The HTTP request containing poll ID and updated data
 * @returns {Promise<NextResponse>} Response with updated poll data or error
 */
export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { 
      id: pollId, 
      question: validatedQuestion, 
      options: validatedOptions, 
      expiresAt: validatedExpiresAt 
    } = pollUpdateSchema.parse(body);

    const supabase = createSupabaseClient();
    const { user, error: authError } = await authenticateUser(supabase);
    
    if (authError) {
      return authError;
    }

    // Prepare update data
    const updateData: Partial<PollData> = {
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
      .eq('id', pollId)
      .eq('created_by', user!.id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating poll:', error);
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Poll not found or you do not have permission to update it' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }
    return handleUnexpectedError(error, 'PUT');
  }
}

/**
 * Deletes an existing poll (only the owner can delete)
 * @param {Request} request - The HTTP request containing poll ID in query parameters
 * @returns {Promise<NextResponse>} Response with success message or error
 */
export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const pollIdParam = searchParams.get('id');
    
    // Validate poll ID as UUID
    const pollIdSchema = z.string().uuid('Invalid poll ID format');
    const pollId = pollIdSchema.parse(pollIdParam);

    const supabase = createSupabaseClient();
    const { user, error: authError } = await authenticateUser(supabase);
    
    if (authError) {
      return authError;
    }

    const { data, error } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)
      .eq('created_by', user!.id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error deleting poll:', error);
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Poll not found or you do not have permission to delete it' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Poll deleted successfully' }, 
      { status: 200 }
    );
  } catch (error) {
    return handleUnexpectedError(error, 'DELETE');
  }
}