import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

const voteSchema = z.object({
  optionIndex: z.number().min(0, 'Invalid option index'),
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
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

    // Get the current user (optional for voting)
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || null;

    // First, verify the poll exists and get its options
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('id, options, expires_at')
      .eq('id', pollId)
      .single();

    if (pollError || !poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    // Check if poll has expired
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This poll has expired' }, { status: 400 });
    }

    // Validate option index
    if (optionIndex >= poll.options.length) {
      return NextResponse.json({ error: 'Invalid option selected' }, { status: 400 });
    }

    // Check if user has already voted (if authenticated)
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

    // Get client IP for anonymous voting tracking
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Check if IP has already voted (for anonymous users)
    if (!userId) {
      const { data: existingIpVote } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('ip_address', clientIp)
        .is('user_id', null)
        .single();

      if (existingIpVote) {
        return NextResponse.json({ error: 'This IP address has already voted on this poll' }, { status: 400 });
      }
    }

    // Create the vote
    const voteData: any = {
      poll_id: pollId,
      option_index: optionIndex,
      created_at: new Date().toISOString(),
    };

    if (userId) {
      voteData.user_id = userId;
    } else {
      voteData.ip_address = clientIp;
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

    // Get updated vote counts for this poll
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('option_index')
      .eq('poll_id', pollId);

    if (votesError) {
      console.error('Error fetching vote counts:', votesError);
      return NextResponse.json({ error: 'Vote submitted but failed to get updated counts' }, { status: 500 });
    }

    // Calculate vote counts for each option
    const voteCounts = new Array(poll.options.length).fill(0);
    votes.forEach(vote => {
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

// GET endpoint to fetch vote results for a poll
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

    // Get poll details
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('id, options')
      .eq('id', pollId)
      .single();

    if (pollError || !poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    // Get all votes for this poll
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('option_index')
      .eq('poll_id', pollId);

    if (votesError) {
      console.error('Error fetching votes:', votesError);
      return NextResponse.json({ error: 'Failed to fetch vote results' }, { status: 500 });
    }

    // Calculate vote counts for each option
    const voteCounts = new Array(poll.options.length).fill(0);
    votes?.forEach(vote => {
      if (vote.option_index < voteCounts.length) {
        voteCounts[vote.option_index]++;
      }
    });

    const totalVotes = votes?.length || 0;

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