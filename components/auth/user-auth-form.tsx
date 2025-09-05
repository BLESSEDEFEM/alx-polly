'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { useAuth } from '../../contexts/auth-context'

/**
 * Props interface for the UserAuthForm component
 * @interface UserAuthFormProps
 * @extends React.HTMLAttributes<HTMLDivElement>
 */
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Determines whether the form is for sign-in or sign-up functionality */
  type: 'signin' | 'signup'
}

/**
 * Universal authentication form component that handles both sign-in and sign-up flows
 * 
 * This component provides a unified interface for user authentication, dynamically
 * rendering form fields based on the authentication type. It includes comprehensive
 * form validation, error handling, and loading states to ensure a smooth user experience.
 * 
 * Key features:
 * - Dual-mode operation (sign-in/sign-up)
 * - Client-side form validation
 * - Password confirmation for sign-up
 * - Redirect handling after successful authentication
 * - Loading states and error messaging
 * - Accessibility-compliant form structure
 * 
 * @param {UserAuthFormProps} props - Component props including type and HTML attributes
 * @returns {JSX.Element} Rendered authentication form
 */
export function UserAuthForm({ type, className, ...props }: UserAuthFormProps) {
  // Component state management
  const [isLoading, setIsLoading] = useState<boolean>(false) // Tracks form submission state
  const [error, setError] = useState<string>('') // Stores validation and authentication errors
  
  // Authentication context and navigation hooks
  const { signIn, signUp } = useAuth() // Authentication methods from context
  const router = useRouter() // Next.js router for programmatic navigation
  
  // Handle redirect logic after successful authentication
  // Safely access window object to avoid SSR issues
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const redirectTo = searchParams?.get("redirectTo") || "/polls"; // Default redirect to polls page

  /**
   * Handles form submission for both sign-in and sign-up flows
   * 
   * This function manages the complete authentication process including:
   * - Form data extraction and validation
   * - Password confirmation for sign-up
   * - Authentication API calls
   * - Error handling and user feedback
   * - Post-authentication navigation
   * 
   * @param {React.SyntheticEvent} event - Form submission event
   */
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault() // Prevent default form submission behavior
    setIsLoading(true) // Show loading state to user
    setError('') // Clear any previous errors

    // Extract form data using FormData API for type safety
    const formData = new FormData(event.target as HTMLFormElement)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string // Only used for sign-up
    const confirmPassword = formData.get('confirm-password') as string // Only used for sign-up

    // Client-side validation before API calls
    // Check for required fields to provide immediate feedback
    if (!email || !password) {
      setError('Please fill in all required fields')
      setIsLoading(false)
      return
    }

    // Sign-up specific validation: ensure passwords match
    // This prevents unnecessary API calls for mismatched passwords
    if (type === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      let result
      // Route to appropriate authentication method based on form type
      if (type === 'signin') {
        result = await signIn(email, password)
      } else {
        // For sign-up, include the user's name in their profile
        result = await signUp(email, password, name)
      }

      // Handle authentication result
      if (result.error) {
        // Display server-side validation or authentication errors
        setError(result.error)
      } else {
        // Success: redirect to intended page or default dashboard
        // This maintains user's intended navigation flow
        router.push(redirectTo)
      }
    } catch (err) {
      // Handle unexpected errors (network issues, etc.)
      setError('An unexpected error occurred')
    } finally {
      // Always reset loading state regardless of outcome
      setIsLoading(false)
    }
  }

  return (
    <div className={className} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {type === 'signup' && (
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                placeholder="John Doe"
                type="text"
                autoCapitalize="none"
                autoComplete="name"
                autoCorrect="off"
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          )}
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              placeholder="********"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading}
              required
              minLength={6}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          {type === 'signup' && (
            <div className="grid gap-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                placeholder="********"
                type="password"
                autoCapitalize="none"
                disabled={isLoading}
                required
                minLength={6}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          )}
          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span className="ml-2">
                  {type === 'signin' ? 'Signing in...' : 'Signing up...'}
                </span>
              </div>
            ) : (
              <span>{type === 'signin' ? 'Sign in' : 'Sign up'}</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}