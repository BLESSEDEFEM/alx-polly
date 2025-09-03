'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const pollSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters').max(160, 'Question must not be longer than 160 characters'),
  options: z.array(z.string().min(1, 'Option cannot be empty').max(50, 'Option must not be longer than 50 characters')).min(2, 'At least two options are required').max(10, 'You can add at most 10 options'),
  expiresAt: z.string().optional(),
})

type PollFormData = z.infer<typeof pollSchema>

interface Poll {
  id: string
  question: string
  options: string[]
  created_at: string
  expires_at?: string
  created_by: string
}

export default function EditPollPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const pollId = params.id as string
  
  const [poll, setPoll] = useState<Poll | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<PollFormData>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      question: '',
      options: ['', ''],
      expiresAt: '',
    },
  })

  const watchedOptions = watch('options')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
      return
    }

    if (user && pollId) {
      fetchPoll()
    }
  }, [user, authLoading, router, pollId])

  const fetchPoll = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/polls/${pollId}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/signin')
          return
        }
        if (response.status === 404) {
          setError('Poll not found')
          return
        }
        throw new Error('Failed to fetch poll')
      }
      
      const data = await response.json()
      
      // Check if the current user owns this poll
      if (data.created_by !== user?.id) {
        setError('You do not have permission to edit this poll')
        return
      }
      
      setPoll(data)
      
      // Populate the form with existing data
      reset({
        question: data.question,
        options: data.options,
        expiresAt: data.expires_at ? new Date(data.expires_at).toISOString().slice(0, 16) : '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: PollFormData) => {
    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch('/api/polls', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: pollId,
          question: data.question,
          options: data.options.filter(option => option.trim() !== ''),
          expiresAt: data.expiresAt || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update poll')
      }

      router.push('/dashboard?updated=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const addOption = () => {
    const currentOptions = watchedOptions || []
    if (currentOptions.length < 10) {
      setValue('options', [...currentOptions, ''])
    }
  }

  const removeOption = (index: number) => {
    const currentOptions = watchedOptions || []
    if (currentOptions.length > 2) {
      const newOptions = currentOptions.filter((_, i) => i !== index)
      setValue('options', newOptions)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading poll...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Poll</h1>
            <p className="text-gray-600 mt-1">Update your poll question and options</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Poll Details</CardTitle>
            <CardDescription>
              Make changes to your poll. All fields are required except the expiration date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  placeholder="What would you like to ask?"
                  {...register('question')}
                  className={errors.question ? 'border-red-500' : ''}
                />
                {errors.question && (
                  <p className="text-sm text-red-600">{errors.question.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label>Options</Label>
                {watchedOptions?.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      {...register(`options.${index}`)}
                      className={errors.options?.[index] ? 'border-red-500' : ''}
                    />
                    {watchedOptions.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="px-3"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {errors.options && (
                  <p className="text-sm text-red-600">
                    {Array.isArray(errors.options) 
                      ? errors.options.find(error => error?.message)?.message
                      : errors.options.message
                    }
                  </p>
                )}
                {watchedOptions && watchedOptions.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOption}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Option
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  {...register('expiresAt')}
                  className={errors.expiresAt ? 'border-red-500' : ''}
                />
                {errors.expiresAt && (
                  <p className="text-sm text-red-600">{errors.expiresAt.message}</p>
                )}
                <p className="text-sm text-gray-600">
                  Leave empty if you don't want the poll to expire
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating Poll...
                    </>
                  ) : (
                    'Update Poll'
                  )}
                </Button>
                <Link href="/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}