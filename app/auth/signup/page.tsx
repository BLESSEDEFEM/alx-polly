import { Metadata } from "next"
import Link from "next/link"

import { UserAuthForm } from "../../components/auth"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
}

export default function SignUpPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Create a new account to start creating polls
          </p>
        </div>
        <UserAuthForm type="signup" />
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link className="underline" href="/auth/signin">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}