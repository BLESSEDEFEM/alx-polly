'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PollCardProps {
  id: string
  title: string
  options: string[]
  votes: number[]
  createdBy: string
  createdAt: string
}

export function PollCard({
  id,
  title,
  options,
  votes,
  createdBy,
  createdAt,
}: PollCardProps) {
  const totalVotes = votes.reduce((sum, vote) => sum + vote, 0)

  return (
    <div className="border-2 border-green-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white">
      <h2 className="text-xl font-semibold mb-4 text-green-700">{title}</h2>
      <div className="space-y-3 mb-5">
        {options.map((option, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-700">{option}</span>
            <div className="flex items-center">
              <div className="w-40 bg-gray-100 rounded-full h-3 mr-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                  style={{
                    width: `${(votes[index] / Math.max(...votes)) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-500 min-w-[60px] text-right">
                {votes[index]} votes
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-4 mb-4">
        <span>Created by <span className="text-blue-500">{createdBy}</span></span>
        <span>Created on {createdAt}</span>
      </div>
      <div className="mt-4">
        <Link href={`/polls/${id}`}>
          <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  )
}