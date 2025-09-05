'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

/**
 * Type definition for the authentication context
 * 
 * Defines the shape of the authentication state and methods available
 * throughout the application via React Context.
 */
interface AuthContextType {
  /** Current authenticated user object or null if not authenticated */
  user: User | null
  /** Loading state indicator for authentication operations */
  loading: boolean
  /** Sign in method that returns success/error status */
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  /** Sign up method that returns success/error status */
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: string }>
  /** Sign out method that clears user session */
  signOut: () => Promise<void>
}

/**
 * React Context for managing authentication state across the application
 * 
 * This context provides a centralized way to manage user authentication,
 * eliminating the need to pass authentication state through component props.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Authentication Provider component that wraps the application
 * 
 * This component manages the global authentication state using Supabase Auth.
 * It provides authentication methods and user state to all child components
 * through React Context, enabling seamless authentication flow management.
 * 
 * Key responsibilities:
 * - Initialize and maintain user session state
 * - Provide sign-in, sign-up, and sign-out functionality
 * - Handle authentication state changes
 * - Manage loading states during auth operations
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Provider component with authentication context
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Authentication state management
  const [user, setUser] = useState<User | null>(null) // Current authenticated user
  const [loading, setLoading] = useState(true) // Loading state for initial auth check

  useEffect(() => {
    /**
     * Initialize authentication state on component mount
     * 
     * This function retrieves the current session from Supabase and sets
     * the initial user state. It's crucial for maintaining authentication
     * state across page refreshes and app restarts.
     */
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null) // Set user from session or null
      setLoading(false) // Authentication check complete
    }

    getInitialSession()

    /**
     * Set up authentication state change listener
     * 
     * This listener responds to all authentication events including:
     * - SIGNED_IN: User successfully authenticated
     * - SIGNED_OUT: User logged out
     * - TOKEN_REFRESHED: Session token renewed
     * - USER_UPDATED: User profile changes
     * 
     * The listener ensures the app's auth state stays synchronized
     * with Supabase's authentication state.
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: string, session: any) => {
        setUser(session?.user ?? null) // Update user state based on session
        setLoading(false) // Ensure loading state is cleared
      }
    )

    // Cleanup: unsubscribe from auth changes when component unmounts
    return () => subscription.unsubscribe()
  }, [])

  /**
   * Authenticate user with email and password
   * 
   * This method handles user sign-in using Supabase Auth. It validates
   * credentials and establishes a user session. The auth state change
   * listener will automatically update the user state upon successful login.
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<{error?: string}>} Success object or error message
   */
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        return { error: error.message }
      }
      
      return {} // Success - no error
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  /**
   * Register a new user account
   * 
   * This method creates a new user account with Supabase Auth. It handles
   * user registration and can include additional user metadata like name.
   * Note: Depending on Supabase configuration, email confirmation may be required.
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's chosen password
   * @param {string} [name] - Optional user display name
   * @returns {Promise<{error?: string}>} Success object or error message
   */
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || '', // Store name in user metadata
          },
        },
      })
      
      if (error) {
        return { error: error.message }
      }
      
      return {} // Success - no error
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  /**
   * Sign out the current user
   * 
   * This method terminates the user's session and clears authentication state.
   * The auth state change listener will automatically update the user state
   * to null when sign-out is complete.
   * 
   * @returns {Promise<void>} Promise that resolves when sign-out is complete
   */
  const signOut = async () => {
    await supabase.auth.signOut() // Clear session and trigger auth state change
  }

  // Construct context value with all authentication state and methods
  const value = {
    user, // Current authenticated user
    loading, // Authentication loading state
    signIn, // Sign-in method
    signUp, // Sign-up method
    signOut, // Sign-out method
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook for accessing authentication context
 * 
 * This hook provides a convenient way to access authentication state and methods
 * from any component within the AuthProvider tree. It includes built-in error
 * handling to ensure the hook is used correctly.
 * 
 * Usage example:
 * ```tsx
 * const { user, loading, signIn, signOut } = useAuth()
 * 
 * if (loading) return <div>Loading...</div>
 * if (!user) return <LoginForm onSignIn={signIn} />
 * return <Dashboard user={user} onSignOut={signOut} />
 * ```
 * 
 * @throws {Error} Throws error if used outside of AuthProvider
 * @returns {AuthContextType} Authentication context with user state and methods
 */
export function useAuth() {
  const context = useContext(AuthContext)
  
  // Ensure hook is used within AuthProvider - prevents runtime errors
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}