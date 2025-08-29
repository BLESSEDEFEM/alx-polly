'use client'

import { Metadata } from "next"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { PollForm, PollFormData } from "@/components/polls/poll-form"

export const metadata: Metadata = {
  title: "Create Poll",
  description: "Create a new poll",
}

export default function CreatePollPage() {
  const router = useRouter()

  const handleCreatePoll = (data: PollFormData) => {
    // In a real app, this would send data to an API
    console.log('Creating poll with data:', data)
    
    // Mock successful creation and redirect
    setTimeout(() => {
      router.push('/polls')
    }, 500)
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
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">Create a New Poll</h1>
          <p className="text-gray-500 mb-6">Fill out the form below to create your poll</p>
          <PollForm onSubmit={handleCreatePoll} />
        </div>
      </div>
    </div>
  )
}