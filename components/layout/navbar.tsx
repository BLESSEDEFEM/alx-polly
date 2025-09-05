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
    <header className="border-b bg-gradient-to-r from-green-500 to-blue-500 text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Application branding */}
          <Link href="/" className="text-2xl font-bold">Alx Polly</Link>
          
          {/* Main navigation menu - hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Public navigation links */}
            <Link 
              href="/polls" 
              className={`text-sm hover:text-green-100 transition-colors ${pathname.startsWith('/polls') ? 'font-medium text-white' : 'text-white/80'}`}
            >
              Browse Polls
            </Link>
            <Link 
              href="/create-poll" 
              className={`text-sm hover:text-green-100 transition-colors ${pathname.startsWith('/create-poll') ? 'font-medium text-white' : 'text-white/80'}`}
            >
              Create Poll
            </Link>
            {/* Authenticated user navigation */}
            {user && (
              <Link 
                href="/dashboard" 
                className={`text-sm hover:text-green-100 transition-colors ${pathname.startsWith('/dashboard') ? 'font-medium text-white' : 'text-white/80'}`}
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
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : user ? (
            // Authenticated user controls
            <>
              <span className="text-sm mr-2">
                Welcome, {user.user_metadata?.name || user.email}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </>
          ) : (
            // Guest user authentication options
            <>
              <Link href="/auth/signin">
                <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-white hover:bg-white/90 text-green-600">
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