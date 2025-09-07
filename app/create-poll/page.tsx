'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PollForm, PollFormData } from '@/components/polls/poll-form'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function CreatePollPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const supabase = createClientComponentClient()

  const handleCreatePoll = async (data: PollFormData) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const { question, options, expiresAt } = data

      const pollPayload = {
        question,
        options: options.map((option) => option.value),
        expiresAt: expiresAt || null,
      };

      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pollPayload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError('Please sign in to create polls.');
          router.push('/auth/signin');
          return;
        }
        
        if (responseData.details) {
          const errorMessages = responseData.details.map((detail: any) => detail.message).join(', ');
          setError(errorMessages);
        } else {
          setError(responseData.error || 'Failed to create poll');
        }
        return;
      }

      // Success - redirect to polls page
      router.push('/polls?success=true');
    } catch (err) {
      console.error('Error creating poll:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-4xl font-bold mb-6 text-black">Create New Poll</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-md w-full">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
          <PollForm onSubmit={handleCreatePoll} isSubmitting={isSubmitting} />
        </div>
      </main>
    </div>
  )
}