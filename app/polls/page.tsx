'use client'

import { Metadata } from "next"
import Link from "next/link"
import { useEffect, useState } from 'react'

import { Button } from "@/components/ui/button"
import { PollCard } from "@/components/polls/poll-card"
import { SuccessMessage } from "@/components/ui/success-message"

interface Poll {
  id: string
  question: string
  options: string[]
  created_by: string
  created_at: string
  expires_at?: string
}

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchPolls() {
      try {
        const response = await fetch('/api/polls')
        if (!response.ok) {
          throw new Error('Failed to fetch polls')
        }
        const data = await response.json()
        setPolls(data || [])
      } catch (err) {
        console.error('Error:', err)
        setError('Failed to load polls')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPolls()
  }, [])
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-500">Loading polls...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <SuccessMessage />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">Polls</h1>
          <p className="text-gray-500 mt-2">View and participate in community polls</p>
        </div>
        <Link href="/create-poll">
          <Button className="bg-green-500 hover:bg-green-600">Create Poll</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {polls && polls.length > 0 ? (
          polls.map((poll) => (
            <PollCard 
              key={poll.id} 
              id={poll.id}
              title={poll.question}
              options={poll.options}
              votes={new Array(poll.options.length).fill(0)} // TODO: Implement voting system
              createdBy={poll.created_by}
              createdAt={new Date(poll.created_at).toLocaleDateString()}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              {error ? 'Failed to load polls. Please try again later.' : 'No polls found. Be the first to create one!'}
            </p>
            <Link href="/create-poll">
              <Button className="bg-green-500 hover:bg-green-600">Create Your First Poll</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}