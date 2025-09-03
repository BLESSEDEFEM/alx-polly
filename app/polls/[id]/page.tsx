'use client'

import { Metadata } from "next"
import Link from "next/link"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"

// Note: metadata export removed as this is now a client component

interface Poll {
  id: string
  question: string
  options: string[]
  created_by: string
  created_at: string
  expires_at?: string
}

interface VoteResults {
  voteCounts: number[]
  totalVotes: number
  options: string[]
}

export default function PollDetailsPage({ params }: { params: { id: string } }) {
  const [poll, setPoll] = useState<Poll | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [voteResults, setVoteResults] = useState<VoteResults | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const fetchVoteResults = async () => {
    try {
      const response = await fetch(`/api/polls/${params.id}/vote`)
      if (response.ok) {
        const data = await response.json()
        setVoteResults(data)
      }
    } catch (err) {
      console.error('Error fetching vote results:', err)
    }
  }

  useEffect(() => {
    async function fetchPoll() {
      try {
        const response = await fetch(`/api/polls/${params.id}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Poll not found')
          } else {
            throw new Error('Failed to fetch poll')
          }
          return
        }
        const data = await response.json()
        setPoll(data)
        
        // Fetch initial vote results
        await fetchVoteResults()
      } catch (err) {
        console.error('Error:', err)
        setError('Failed to load poll')
      } finally {
        setLoading(false)
      }
    }

    fetchPoll()
  }, [params.id])

  const handleVoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedOption === null) {
      setError('Please select an option before voting')
      return
    }

    if (hasVoted) {
      setError('You have already voted on this poll')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/polls/${params.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          optionIndex: selectedOption,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to submit vote')
        return
      }

      // Update vote results with the response data
      setVoteResults({
        voteCounts: data.voteCounts,
        totalVotes: data.totalVotes,
        options: poll?.options || []
      })
      
      setHasVoted(true)
      setSuccessMessage('Thank you for voting! Your vote has been recorded.')
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)

    } catch (err) {
      console.error('Error submitting vote:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPercentage = (votes: number, total: number) => {
    if (total === 0) return 0
    return Math.round((votes / total) * 100)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-500">Loading poll...</p>
        </div>
      </div>
    )
  }

  if (error || !poll) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Poll not found'}</p>
          <Link href="/polls">
            <Button variant="outline">← Back to Polls</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/polls">
            <Button variant="outline" size="sm">
              ← Back to Polls
            </Button>
          </Link>
        </div>

        <div className="border-2 border-green-100 rounded-lg p-8 shadow-sm bg-white">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">{poll.question}</h1>
          <p className="text-gray-500 mb-6">Vote for your preferred option below.</p>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {!hasVoted ? (
            <div className="mb-8 bg-green-50 p-6 rounded-lg border border-green-100">
              <h2 className="text-xl font-semibold mb-4 text-green-700">Vote</h2>
              <form onSubmit={handleVoteSubmit} className="space-y-4">
                {poll.options.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-md hover:bg-green-100 transition-colors">
                    <input
                      type="radio"
                      id={`option-${index}`}
                      name="poll-option"
                      value={index}
                      checked={selectedOption === index}
                      onChange={() => setSelectedOption(index)}
                      className="h-5 w-5 border-gray-300 text-green-600 focus:ring-green-500"
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor={`option-${index}`}
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
                <Button 
                  type="submit" 
                  className="mt-6 bg-green-500 hover:bg-green-600"
                  disabled={isSubmitting || selectedOption === null}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Vote'}
                </Button>
              </form>
            </div>
          ) : (
            <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Vote Submitted</h2>
              <p className="text-gray-600">Thank you for participating! You can view the results below.</p>
            </div>
          )}

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Results</h2>
            <div className="space-y-4">
              {poll.options.map((option: string, index: number) => {
                const votes = voteResults?.voteCounts[index] || 0
                const totalVotes = voteResults?.totalVotes || 0
                const percentage = getPercentage(votes, totalVotes)
                const isSelected = hasVoted && selectedOption === index
                
                return (
                  <div key={index} className={`space-y-2 p-3 rounded-md transition-colors ${
                    isSelected ? 'bg-blue-200 border-2 border-blue-400' : 'hover:bg-blue-100'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${
                        isSelected ? 'text-blue-800 font-bold' : 'text-gray-700'
                      }`}>
                        {option} {isSelected && '✓'}
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-white rounded-full h-3 border border-gray-200">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {votes} vote{votes !== 1 ? 's' : ''}
                    </p>
                  </div>
                )
              })}
              <div className="mt-6 pt-4 border-t border-blue-200 flex justify-between items-center">
                <p className="text-sm font-medium text-blue-700">
                  Total votes: <span className="font-bold">{voteResults?.totalVotes || 0}</span>
                </p>
                <p className="text-xs text-gray-500">Results update in real-time</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm">
              <span>Created by <span className="text-blue-500 font-medium">{poll.created_by}</span></span>
              <span className="text-gray-500">Created on {new Date(poll.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}