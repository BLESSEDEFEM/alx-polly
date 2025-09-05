'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { createPoll } from '@/lib/actions/poll-actions'

/**
 * Props interface for the SamplePollCreator component
 * 
 * Defines the expected properties that can be passed to the component,
 * extending standard HTML div attributes for maximum flexibility.
 */
interface SamplePollCreatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional initial question to pre-populate the form */
  initialQuestion?: string
  /** Callback function triggered when poll is successfully created */
  onPollCreated?: (pollId: string) => void
  /** Maximum number of options allowed (default: 10) */
  maxOptions?: number
}

/**
 * Sample Poll Creator Component - Demonstrates Comprehensive Documentation
 * 
 * This component serves as an example of well-documented React code following
 * the documentation standards established throughout the ALX Polly project.
 * It showcases proper JSDoc comments, inline explanations, and clear code structure.
 * 
 * Key Features:
 * - Dynamic option management with add/remove functionality
 * - Real-time form validation with user feedback
 * - Authentication-aware poll creation
 * - Responsive design with accessibility considerations
 * - Error handling with user-friendly messages
 * - Loading states for better UX
 * 
 * Security Considerations:
 * - Input sanitization handled by server actions
 * - Authentication required for poll creation
 * - Client-side validation prevents malformed submissions
 * 
 * Usage Example:
 * ```tsx
 * <SamplePollCreator 
 *   initialQuestion="What's your favorite color?"
 *   onPollCreated={(id) => router.push(`/polls/${id}`)}
 *   maxOptions={5}
 * />
 * ```
 * 
 * @param {SamplePollCreatorProps} props - Component props including optional configuration
 * @returns {JSX.Element} Rendered poll creation form with validation and submission handling
 */
export function SamplePollCreator({ 
  initialQuestion = '', 
  onPollCreated, 
  maxOptions = 10,
  className,
  ...props 
}: SamplePollCreatorProps) {
  // ==================== STATE MANAGEMENT ====================
  
  /** Current poll question text */
  const [question, setQuestion] = useState<string>(initialQuestion)
  
  /** Array of poll option strings */
  const [options, setOptions] = useState<string[]>(['', ''])
  
  /** Form submission loading state */
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  
  /** Error message for display to user */
  const [error, setError] = useState<string | null>(null)
  
  /** Success message after poll creation */
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // ==================== HOOKS ====================
  
  /** Authentication context for user verification */
  const { user, loading: authLoading } = useAuth()
  
  /** Next.js router for navigation after successful creation */
  const router = useRouter()
  
  // ==================== FORM VALIDATION ====================
  
  /**
   * Validates the current form state
   * 
   * Performs comprehensive validation including:
   * - Question length and content validation
   * - Option count and content validation
   * - Duplicate option detection
   * 
   * @returns {string | null} Error message if validation fails, null if valid
   */
  const validateForm = useCallback((): string | null => {
    // Question validation
    if (!question.trim()) {
      return 'Poll question is required'
    }
    
    if (question.trim().length < 5) {
      return 'Question must be at least 5 characters long'
    }
    
    if (question.trim().length > 200) {
      return 'Question must be less than 200 characters'
    }
    
    // Filter out empty options for validation
    const validOptions = options.filter(option => option.trim())
    
    // Minimum options validation
    if (validOptions.length < 2) {
      return 'At least 2 options are required'
    }
    
    // Individual option validation
    for (const option of validOptions) {
      if (option.trim().length < 1) {
        return 'All options must have content'
      }
      if (option.trim().length > 100) {
        return 'Options must be less than 100 characters'
      }
    }
    
    // Duplicate option detection
    const optionTexts = validOptions.map(opt => opt.trim().toLowerCase())
    const uniqueOptions = new Set(optionTexts)
    if (uniqueOptions.size !== optionTexts.length) {
      return 'Duplicate options are not allowed'
    }
    
    return null // Form is valid
  }, [question, options])
  
  // ==================== EVENT HANDLERS ====================
  
  /**
   * Handles adding a new option to the poll
   * 
   * Adds an empty option slot if under the maximum limit.
   * Provides user feedback if limit is reached.
   */
  const handleAddOption = useCallback(() => {
    if (options.length >= maxOptions) {
      setError(`Maximum ${maxOptions} options allowed`)
      return
    }
    
    setOptions(prev => [...prev, ''])
    setError(null) // Clear any existing errors
  }, [options.length, maxOptions])
  
  /**
   * Handles removing an option from the poll
   * 
   * Maintains minimum of 2 options for valid poll structure.
   * 
   * @param {number} index - Index of option to remove
   */
  const handleRemoveOption = useCallback((index: number) => {
    if (options.length <= 2) {
      setError('At least 2 options are required')
      return
    }
    
    setOptions(prev => prev.filter((_, i) => i !== index))
    setError(null) // Clear any existing errors
  }, [options.length])
  
  /**
   * Handles updating an option's text content
   * 
   * @param {number} index - Index of option to update
   * @param {string} value - New option text
   */
  const handleOptionChange = useCallback((index: number, value: string) => {
    setOptions(prev => prev.map((option, i) => i === index ? value : option))
    
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }, [error])
  
  /**
   * Handles form submission with comprehensive error handling
   * 
   * Process:
   * 1. Validates form data
   * 2. Checks user authentication
   * 3. Submits to server action
   * 4. Handles success/error responses
   * 5. Provides user feedback
   * 
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous messages
    setError(null)
    setSuccessMessage(null)
    
    // Validate form before submission
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }
    
    // Check authentication status
    if (!user) {
      setError('You must be signed in to create a poll')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Prepare form data for server action
      const formData = new FormData()
      formData.append('question', question.trim())
      
      // Add only non-empty options
      const validOptions = options.filter(option => option.trim())
      validOptions.forEach(option => {
        formData.append('options', option.trim())
      })
      
      // Submit to server action
      const result = await createPoll(formData)
      
      if (result.error) {
        // Handle server-side errors
        setError(result.error)
      } else {
        // Success handling
        setSuccessMessage('Poll created successfully!')
        
        // Reset form state
        setQuestion('')
        setOptions(['', ''])
        
        // Trigger callback if provided
        if (onPollCreated && result.pollId) {
          onPollCreated(result.pollId)
        }
        
        // Auto-redirect after short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (err) {
      // Handle unexpected errors
      console.error('Poll creation error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      // Always reset loading state
      setIsSubmitting(false)
    }
  }
  
  // ==================== EFFECTS ====================
  
  /**
   * Effect to handle authentication state changes
   * 
   * Redirects unauthenticated users to sign-in page
   * with return URL for seamless flow after authentication.
   */
  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to sign-in with return URL
      const returnUrl = encodeURIComponent(window.location.pathname)
      router.push(`/auth/signin?redirect=${returnUrl}`)
    }
  }, [user, authLoading, router])
  
  /**
   * Effect to clear success message after delay
   * 
   * Automatically removes success message to keep UI clean.
   */
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 5000) // Clear after 5 seconds
      
      return () => clearTimeout(timer) // Cleanup on unmount
    }
  }, [successMessage])
  
  // ==================== LOADING STATES ====================
  
  // Show loading spinner during authentication check
  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    )
  }
  
  // Don't render if user is not authenticated (will redirect)
  if (!user) {
    return null
  }
  
  // ==================== RENDER ====================
  
  return (
    <div className={`max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md ${className}`} {...props}>
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create New Poll
        </h2>
        <p className="text-gray-600">
          Create engaging polls and share them with your audience
        </p>
      </div>
      
      {/* Success Message Display */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}
      
      {/* Error Message Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}
      
      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Input Section */}
        <div className="space-y-2">
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">
            Poll Question *
          </label>
          <Input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to ask?"
            className="w-full"
            maxLength={200}
            required
            disabled={isSubmitting}
          />
          {/* Character count indicator */}
          <p className="text-xs text-gray-500 text-right">
            {question.length}/200 characters
          </p>
        </div>
        
        {/* Options Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Poll Options *
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              disabled={isSubmitting || options.length >= maxOptions}
            >
              Add Option
            </Button>
          </div>
          
          {/* Dynamic Options List */}
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                {/* Option number indicator */}
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                  {index + 1}
                </div>
                
                {/* Option input field */}
                <Input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1"
                  maxLength={100}
                  disabled={isSubmitting}
                />
                
                {/* Remove option button (only show if more than 2 options) */}
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                    disabled={isSubmitting}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {/* Options count indicator */}
          <p className="text-xs text-gray-500">
            {options.filter(opt => opt.trim()).length} of {maxOptions} options used
          </p>
        </div>
        
        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting || !question.trim() || options.filter(opt => opt.trim()).length < 2}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              'Create Poll'
            )}
          </Button>
        </div>
      </form>
      
      {/* Help Text */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Tips for Great Polls:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Keep your question clear and specific</li>
          <li>• Provide distinct, non-overlapping options</li>
          <li>• Consider your audience when writing options</li>
          <li>• Test your poll before sharing widely</li>
        </ul>
      </div>
    </div>
  )
}

// ==================== EXPORT ====================

export default SamplePollCreator

/**
 * Additional Notes:
 * 
 * This component demonstrates comprehensive documentation practices including:
 * - Detailed JSDoc comments for interfaces, components, and functions
 * - Inline comments explaining complex logic and business rules
 * - Clear section organization with comment headers
 * - Proper TypeScript typing for all variables and functions
 * - Accessibility considerations in the UI implementation
 * - Error handling with user-friendly messages
 * - Loading states for better user experience
 * - Security considerations and validation
 * 
 * The documentation style shown here should be applied consistently
 * across all components in the ALX Polly application.
 */