'use client';

import { useState, useEffect } from 'react';
import { PollOption } from '@/lib/data';

interface LivePollCardProps {
  pollId: string;
  initialResults: PollOption[];
}

export default function LivePollCard({ pollId, initialResults }: LivePollCardProps) {
  const [results, setResults] = useState<PollOption[]>(initialResults);

  useEffect(() => {
    // Start fetching new results after the initial render
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/polls/${pollId}/results`);
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        const newResults: PollOption[] = await response.json();
        setResults(newResults);
      } catch (error) {
        console.error(error);
      }
    }, 3000); // Poll for new results every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [pollId]);

  const totalVotes = results.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Results</h2>
      <div className="space-y-4">
        {results.map((option) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          return (
            <div key={option.id}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-700">{option.text}</span>
                <span className="text-sm font-bold text-gray-600">
                  {option.votes} vote{option.votes !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-right text-sm text-gray-500 mt-4">
        Total Votes: {totalVotes}
      </p>
    </div>
  );
}