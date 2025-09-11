import { Suspense } from 'react';
import { getPoll, getPollResults } from '@/lib/data';
import LivePollCard from '@/components/polls/live-poll-card';
import { notFound } from 'next/navigation';

// This is an async Server Component to fetch the initial, static data
async function PollResults({ pollId }: { pollId: string }) {
  const initialResults = await getPollResults(pollId);
  if (!initialResults) {
    notFound();
  }
  return <LivePollCard pollId={pollId} initialResults={initialResults} />;
}

export default async function PollPage({ params }: { params: { id: string } }) {
  const poll = await getPoll(params.id);

  if (!poll) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{poll.question}</h1>
          <p className="text-lg text-gray-600 mt-2">
            The results below will update in real-time.
          </p>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          {/* This component fetches the initial results on the server */}
          <PollResults pollId={poll.id} />
        </Suspense>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Loading Results...</h2>
      <div className="space-y-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-1">
              <div className="h-5 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/6"></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-gray-300 h-4 rounded-full" style={{width: `${Math.random() * 60 + 20}%`}}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}