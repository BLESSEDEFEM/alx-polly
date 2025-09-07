'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Eye, Plus } from 'lucide-react'
import Link from 'next/link'

/**
 * Poll interface defining the structure of poll data
 * @interface Poll
 */

interface Poll {
  /** Unique identifier for the poll */
  id: string
  /** The poll question text */
  question: string
  /** Array of poll option strings */
  options: string[]
  /** ISO timestamp when poll was created */
  created_at: string
  /** Optional ISO timestamp when poll expires */
  expires_at?: string
  /** User ID of the poll creator */
  created_by: string
}

/**
 * User Dashboard Page Component
 * 
 * Displays a personalized dashboard where authenticated users can view and manage
 * their created polls. Provides quick access to poll creation and displays poll
 * performance metrics.
 * 
 * Features:
 * - Lists all polls created by the current user
 * - Shows poll statistics and performance data
 * - Quick access to create new polls
 * - Loading states and error handling
 * - Empty state guidance for new users
 * 
 * @returns {JSX.Element} The dashboard page with user's polls
 */
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  // State management for polls data and UI states
  const [polls, setPolls] = useState<Poll[]>([]) // User's polls collection
  const [loading, setLoading] = useState(true) // Loading state for data fetching
  const [error, setError] = useState<string | null>(null) // Error state for failed requests
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
      return
    }

    if (user) {
      fetchUserPolls()
    }
  }, [user, authLoading, router])

  const fetchUserPolls = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/polls')
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/signin')
          return
        }
        throw new Error('Failed to fetch polls')
      }
      
      const data = await response.json()
      setPolls(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (pollId: string) => {
    if (!confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      return
    }

    try {
      setDeletingId(pollId)
      const response = await fetch(`/api/polls?id=${pollId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete poll')
      }

      // Remove the poll from the local state
      setPolls(polls.filter(poll => poll.id !== pollId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete poll')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent mb-3">My Dashboard</h1>
              <p className="text-xl text-gray-600">Manage your polls and track their performance</p>
            </div>
            <Link href="/create-poll">
              <Button className="flex items-center gap-3 px-6 py-3 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                <Plus className="h-5 w-5" />
                Create New Poll
              </Button>
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 shadow-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {polls.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-lg mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Plus className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">No polls yet</h3>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">Create your first poll to start gathering opinions and insights from your audience.</p>
                <Link href="/create-poll">
                  <Button className="px-8 py-4 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    Create Your First Poll
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {polls.map((poll) => (
                <div key={poll.id} className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{poll.question}</h3>
                        <p className="text-sm text-gray-500">
                          Created {formatDate(poll.created_at)}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {isExpired(poll.expires_at) && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                            Expired
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-3">
                          {poll.options.length} Options
                        </p>
                        <div className="space-y-2">
                          {poll.options.slice(0, 2).map((option, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <div className="w-2 h-2 bg-red-400 rounded-full mr-3 flex-shrink-0"></div>
                              <span className="truncate">{option}</span>
                            </div>
                          ))}
                          {poll.options.length > 2 && (
                            <div className="text-sm text-gray-500 font-medium">
                              +{poll.options.length - 2} more options
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {poll.expires_at && (
                        <div className="text-xs text-gray-500 bg-yellow-50 px-3 py-2 rounded-lg">
                          <span className="font-semibold">Expires:</span> {formatDate(poll.expires_at)}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Link href={`/polls/${poll.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-lg">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 rounded-lg"
                          onClick={() => router.push(`/dashboard/edit/${poll.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg"
                          onClick={() => handleDelete(poll.id)}
                          disabled={deletingId === poll.id}
                        >
                          {deletingId === poll.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}