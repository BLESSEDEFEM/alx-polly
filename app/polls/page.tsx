import { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PollCard } from "@/components/polls/poll-card"

export const metadata: Metadata = {
  title: "Polls",
  description: "View and participate in polls",
}

// Mock data for polls
const mockPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    options: ["JavaScript", "Python", "Java", "C#", "Other"],
    votes: [120, 80, 60, 40, 20],
    createdBy: "John Doe",
    createdAt: "2023-08-15",
  },
  {
    id: "2",
    title: "Which frontend framework do you prefer?",
    options: ["React", "Vue", "Angular", "Svelte", "Other"],
    votes: [150, 70, 50, 30, 10],
    createdBy: "Jane Smith",
    createdAt: "2023-08-10",
  },
  {
    id: "3",
    title: "What's your preferred database?",
    options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Other"],
    votes: [90, 85, 75, 40, 25],
    createdBy: "Bob Johnson",
    createdAt: "2023-08-05",
  },
]

export default function PollsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">Polls</h1>
          <p className="text-gray-500 mt-2">View and participate in community polls</p>
        </div>
        <Link href="/create-poll">
          <Button className="bg-green-500 hover:bg-green-600">Create Poll</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {mockPolls.map((poll) => (
          <PollCard key={poll.id} {...poll} />
        ))}
      </div>
    </div>
  )
}