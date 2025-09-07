import Link from 'next/link'
import { Button } from '../components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 bg-clip-text text-transparent">
              ALX Polly
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create beautiful polls, gather insights, and make data-driven decisions with our modern polling platform
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link href="/auth/signin">
              <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Get Started
              </Button>
            </Link>
            <Link href="/polls">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg border-2 border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 transition-all duration-300">
                Browse Polls
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">Create Polls</h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">Design beautiful polls with multiple options and share them instantly with your audience.</p>
              <Link href="/create-poll">
                <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Creating
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">Vote & Engage</h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">Participate in community polls and see real-time results as votes come in.</p>
              <Link href="/polls">
                <Button variant="outline" className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-xl transition-all duration-300">
                  Browse Polls
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path></svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">Track Results</h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">Monitor your poll performance with detailed analytics and beautiful visualizations.</p>
              <Link href="/auth/signin">
                <Button variant="outline" className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold py-3 rounded-xl transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}