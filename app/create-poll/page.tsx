'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PollForm, PollFormData } from '@/components/polls/poll-form'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function CreatePollPage() {
  const router = useRouter()

  const supabase = createClientComponentClient()

  const handleCreatePoll = async (data: PollFormData) => {
    const { question, options, expiresAt } = data

    const pollPayload = {
      question,
      options: options.map((option) => option.value),
      expiresAt,
    };

    const response = await fetch('/api/polls/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pollPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to create poll:', errorData.error);
      return;
    }

    const poll = await response.json();

    router.push(`/polls/${poll.id}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-4xl font-bold mb-6">Create New Poll</h1>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <PollForm onSubmit={handleCreatePoll} />
        </div>
      </main>
    </div>
  )
}