import Link from 'next/link'
import { Button } from '../components/ui/button'

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <div className="py-16 md:py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
          Welcome to Alx Polly
        </h1>
        <p className="text-xl mb-10 max-w-2xl text-muted-foreground">
          Create, share, and vote on polls with our easy-to-use platform
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signin">
            <Button size="lg" className="w-full sm:w-auto bg-green-500 hover:bg-green-600">
              Get Started
            </Button>
          </Link>
          <Link href="/polls">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-green-500 text-green-500 hover:bg-green-50">
              Browse Polls
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 mb-16">
        <div className="border-2 border-green-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-green-50">
          <div className="flex items-center justify-center mb-4 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </div>
          <h2 className="text-xl font-semibold mb-3 text-center">Create Polls</h2>
          <p className="text-muted-foreground mb-4 text-center">Easily create custom polls with multiple options and share them with others.</p>
          <Link href="/create-poll">
            <Button variant="outline" className="w-full border-green-500 text-green-500 hover:bg-green-100">
              Create a Poll
            </Button>
          </Link>
        </div>
        
        <div className="border-2 border-blue-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-blue-50">
          <div className="flex items-center justify-center mb-4 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <h2 className="text-xl font-semibold mb-3 text-center">Vote on Polls</h2>
          <p className="text-muted-foreground mb-4 text-center">Participate in polls created by the community and see real-time results.</p>
          <Link href="/polls">
            <Button variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-100">
              Vote Now
            </Button>
          </Link>
        </div>
        
        <div className="border-2 border-purple-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-purple-50">
          <div className="flex items-center justify-center mb-4 text-purple-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path></svg>
          </div>
          <h2 className="text-xl font-semibold mb-3 text-center">Track Results</h2>
          <p className="text-muted-foreground mb-4 text-center">Monitor poll results with beautiful visualizations and detailed analytics.</p>
          <Link href="/auth/signin">
            <Button variant="outline" className="w-full border-purple-500 text-purple-500 hover:bg-purple-100">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}