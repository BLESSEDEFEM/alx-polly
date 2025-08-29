'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'

export function Navbar() {
  const pathname = usePathname()
  const isLoggedIn = false // This would be replaced with actual auth state

  return (
    <header className="border-b bg-gradient-to-r from-green-500 to-blue-500 text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-2xl font-bold">Alx Polly</Link>
          
          <nav className="hidden md:flex items-center space-x-6">
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
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              <span className="text-sm mr-2">Welcome, User</span>
              <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                Sign Out
              </Button>
            </>
          ) : (
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