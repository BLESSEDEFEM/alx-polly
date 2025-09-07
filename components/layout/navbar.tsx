'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '../ui/button'
import { useAuth } from '../../contexts/auth-context'

/**
 * Navigation Bar Component
 * 
 * Provides the main navigation header for the application with responsive design
 * and authentication-aware navigation links. Features a gradient background and
 * dynamic navigation based on user authentication status.
 * 
 * Features:
 * - Responsive navigation with mobile considerations
 * - Authentication-aware menu items
 * - Active route highlighting
 * - Gradient background design
 * - User authentication controls
 * - Loading states during auth checks
 * 
 * @returns {JSX.Element} Navigation header with branding and menu items
 */

export function Navbar() {
  const pathname = usePathname() // Current route for active link highlighting
  const { user, signOut, loading } = useAuth() // Authentication state and controls

  return (
    <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-gray-700 shadow-2xl text-white">
      <div className="container mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Application branding */}
          <Link href="/" className="group">
            <span className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent group-hover:from-red-300 group-hover:to-red-500 transition-all duration-300">ALX Polly</span>
          </Link>
          
          {/* Main navigation menu - hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-2">
            {/* Public navigation links */}
            <Link 
              href="/polls" 
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                pathname.startsWith('/polls') 
                  ? 'text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg transform scale-105' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:shadow-md'
              }`}
            >
              Browse Polls
            </Link>
            <Link 
              href="/create-poll" 
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                pathname.startsWith('/create-poll') 
                  ? 'text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg transform scale-105' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:shadow-md'
              }`}
            >
              Create Poll
            </Link>
            {/* Authenticated user navigation */}
            {user && (
              <Link 
                href="/dashboard" 
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  pathname.startsWith('/dashboard') 
                    ? 'text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg transform scale-105' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:shadow-md'
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Authentication controls */}
        <div className="flex items-center space-x-3">
          {loading ? (
            // Loading state during authentication check
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          ) : user ? (
            // Authenticated user controls
            <>
              <span className="text-sm mr-2 text-white font-medium">
                Welcome, {user.user_metadata?.name || user.email}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-400 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-xl transition-all duration-300 font-semibold"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </>
          ) : (
            // Guest user authentication options
            <>
              <Link href="/auth/signin">
                <Button variant="outline" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl font-semibold transition-all duration-300 border-gray-600 hover:border-gray-500">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}