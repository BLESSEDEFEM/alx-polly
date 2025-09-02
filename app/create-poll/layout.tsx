import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Create Poll",
  description: "Create a new poll",
}

export default function CreatePollLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}