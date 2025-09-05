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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your polls and view their performance</p>
        </div>
        <Link href="/create-poll">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Poll
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {polls.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No polls yet</h3>
            <p className="text-gray-600 mb-6">Create your first poll to get started with gathering opinions and feedback.</p>
            <Link href="/create-poll">
              <Button>
                Create Your First Poll
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Card key={poll.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{poll.question}</CardTitle>
                    <CardDescription className="mt-2">
                      Created {formatDate(poll.created_at)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1 ml-2">
                    {isExpired(poll.expires_at) && (
                      <Badge variant="secondary" className="text-xs">
                        Expired
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {poll.options.length} options
                    </p>
                    <div className="space-y-1">
                      {poll.options.slice(0, 2).map((option, index) => (
                        <div key={index} className="text-sm text-gray-700 truncate">
                          • {option}
                        </div>
                      ))}
                      {poll.options.length > 2 && (
                        <div className="text-sm text-gray-500">
                          +{poll.options.length - 2} more options
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {poll.expires_at && (
                    <div className="text-xs text-gray-500">
                      Expires: {formatDate(poll.expires_at)}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Link href={`/polls/${poll.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => router.push(`/dashboard/edit/${poll.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}