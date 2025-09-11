import { NextResponse } from 'next/server';
import { getPollResults } from '@/lib/data';

export const dynamic = 'force-dynamic'; // Ensures the route is not cached

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Poll ID is required' }, { status: 400 });
  }

  try {
    const results = await getPollResults(id);
    if (!results) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}