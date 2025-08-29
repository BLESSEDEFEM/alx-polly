import { Metadata } from "next"
import Link from "next/link"

import { Button } from "../../components/ui"
import { UserAuthForm } from "../../components/auth"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
}

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your credentials to sign in to your account
          </p>
        </div>
        <UserAuthForm type="signin" />
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link className="underline" href="/auth/signup">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}