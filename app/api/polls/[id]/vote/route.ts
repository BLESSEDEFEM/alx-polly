import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

/**
 * Zod schema for vote submission validation
 * Ensures optionIndex is a valid non-negative number
 */
const voteSchema = z.object({
  optionIndex: z.number().min(0, 'Invalid option index'),
});

/**
 * POST /api/polls/[id]/vote - Submit a vote for a specific poll
 * 
 * Handles vote submission with comprehensive validation and duplicate prevention.
 * Supports both authenticated and anonymous voting with different tracking mechanisms.
 * 
 * Security Features:
 * - Duplicate vote prevention for authenticated users
 * - IP-based tracking for anonymous users
 * - Poll expiration validation
 * - Option index validation
 * - Input sanitization with Zod schema
 * 
 * @param {Request} request - HTTP request containing vote data
 * @param {Object} params - Route parameters
 * @param {string} params.id - Poll ID from URL
 * @returns {NextResponse} JSON response with vote result or error
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { optionIndex } = voteSchema.parse(body);
    const pollId = params.id;

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

    // Get the current user (optional for voting - supports anonymous voting)
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || null; // null for anonymous users

    // Verify the poll exists and get its configuration
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('id, options, expires_at')
      .eq('id', pollId)
      .single();

    if (pollError || !poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    // Validate poll is still active (not expired)
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This poll has expired' }, { status: 400 });
    }

    // Validate the selected option exists in the poll
    if (optionIndex >= poll.options.length) {
      return NextResponse.json({ error: 'Invalid option selected' }, { status: 400 });
    }

    // Prevent duplicate voting for authenticated users
    if (userId) {
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', userId)
        .single();

      if (existingVote) {
        return NextResponse.json({ error: 'You have already voted on this poll' }, { status: 400 });
      }
    }

    // Extract client IP for anonymous voting duplicate prevention
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'; // Fallback for local development

    // Prevent duplicate voting for anonymous users using IP tracking
    if (!userId) {
      const { data: existingIpVote } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('ip_address', clientIp)
        .is('user_id', null) // Ensure we're checking anonymous votes only
        .single();

      if (existingIpVote) {
        return NextResponse.json({ error: 'This IP address has already voted on this poll' }, { status: 400 });
      }
    }

    // Prepare vote data with appropriate tracking method
    const voteData: any = {
      poll_id: pollId,
      option_index: optionIndex,
      created_at: new Date().toISOString(),
    };

    // Use user ID for authenticated votes, IP address for anonymous votes
    if (userId) {
      voteData.user_id = userId; // Authenticated vote tracking
    } else {
      voteData.ip_address = clientIp; // Anonymous vote tracking
    }

    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .insert([voteData])
      .select()
      .single();

    if (voteError) {
      console.error('Error creating vote:', voteError);
      return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 });
    }

    // Fetch all votes to calculate updated results
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('option_index')
      .eq('poll_id', pollId);

    if (votesError) {
      console.error('Error fetching vote counts:', votesError);
      return NextResponse.json({ error: 'Vote submitted but failed to get updated counts' }, { status: 500 });
    }

    // Calculate vote distribution across all options
    const voteCounts = new Array(poll.options.length).fill(0);
    votes.forEach(vote => {
      // Validate option index to prevent array bounds errors
      if (vote.option_index < voteCounts.length) {
        voteCounts[vote.option_index]++;
      }
    });

    const totalVotes = votes.length;

    return NextResponse.json({
      message: 'Vote submitted successfully',
      voteCounts,
      totalVotes,
      selectedOption: optionIndex
    }, { status: 201 });

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

/**
 * GET /api/polls/[id]/vote - Fetch vote results for a specific poll
 * 
 * Returns current vote counts and statistics for a poll without requiring authentication.
 * Provides real-time voting results for display in poll result components.
 * 
 * @param {Request} request - HTTP request
 * @param {Object} params - Route parameters
 * @param {string} params.id - Poll ID from URL
 * @returns {NextResponse} JSON response with vote counts and poll options
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const pollId = params.id;

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

    // Fetch poll configuration to validate existence and get options
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('id, options')
      .eq('id', pollId)
      .single();

    if (pollError || !poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    // Fetch all votes to calculate current results
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('option_index')
      .eq('poll_id', pollId);

    if (votesError) {
      console.error('Error fetching votes:', votesError);
      return NextResponse.json({ error: 'Failed to fetch vote results' }, { status: 500 });
    }

    // Calculate vote distribution across all poll options
    const voteCounts = new Array(poll.options.length).fill(0);
    votes?.forEach(vote => {
      // Validate option index to prevent array bounds errors
      if (vote.option_index < voteCounts.length) {
        voteCounts[vote.option_index]++;
      }
    });

    const totalVotes = votes?.length || 0; // Handle null/undefined votes array

    return NextResponse.json({
      voteCounts,
      totalVotes,
      options: poll.options
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}