import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Poll Details",
  description: "View and vote on a poll",
}

// Mock data for polls
const mockPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Please vote for your preferred programming language.",
    options: ["JavaScript", "Python", "Java", "C#", "Other"],
    votes: [120, 80, 60, 40, 20],
    createdBy: "John Doe",
    createdAt: "2023-08-15",
    totalVotes: 320,
  },
  {
    id: "2",
    title: "Which frontend framework do you prefer?",
    description: "Vote for your favorite frontend framework.",
    options: ["React", "Vue", "Angular", "Svelte", "Other"],
    votes: [150, 70, 50, 30, 10],
    createdBy: "Jane Smith",
    createdAt: "2023-08-10",
    totalVotes: 310,
  },
  {
    id: "3",
    title: "What's your preferred database?",
    description: "Choose your go-to database system.",
    options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Other"],
    votes: [90, 85, 75, 40, 25],
    createdBy: "Bob Johnson",
    createdAt: "2023-08-05",
    totalVotes: 315,
  },
]

export default function PollDetailsPage({ params }: { params: { id: string } }) {
  const poll = mockPolls.find((p) => p.id === params.id)

  if (!poll) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/polls">
            <Button variant="outline" size="sm">
              ← Back to Polls
            </Button>
          </Link>
        </div>

        <div className="border-2 border-green-100 rounded-lg p-8 shadow-sm bg-white">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">{poll.title}</h1>
          <p className="text-gray-500 mb-6">{poll.description}</p>

          <div className="mb-8 bg-green-50 p-6 rounded-lg border border-green-100">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Vote</h2>
            <form className="space-y-4">
              {poll.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-md hover:bg-green-100 transition-colors">
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name="poll-option"
                    className="h-5 w-5 border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label
                    htmlFor={`option-${index}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
              <Button type="submit" className="mt-6 bg-green-500 hover:bg-green-600">
                Submit Vote
              </Button>
            </form>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Results</h2>
            <div className="space-y-4">
              {poll.options.map((option, index) => (
                <div key={index} className="space-y-2 p-3 rounded-md hover:bg-blue-100 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{option}</span>
                    <span className="text-sm font-bold text-blue-600">
                      {Math.round((poll.votes[index] / poll.totalVotes) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 border border-gray-200">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                      style={{
                        width: `${(poll.votes[index] / poll.totalVotes) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {poll.votes[index]} votes
                  </p>
                </div>
              ))}
              <div className="mt-6 pt-4 border-t border-blue-200 flex justify-between items-center">
                <p className="text-sm font-medium text-blue-700">
                  Total votes: <span className="font-bold">{poll.totalVotes}</span>
                </p>
                <p className="text-xs text-gray-500">Results update in real-time</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm">
              <span>Created by <span className="text-blue-500 font-medium">{poll.createdBy}</span></span>
              <span className="text-gray-500">Created on {poll.createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}