import { UserAuthForm } from "../../../components/auth/user-auth-form" 
// 👆 adjust path depending on your folder structure

import { Metadata } from "next"

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
          <a className="underline" href="/auth/signup">
            Sign up
          </a>
        </div>
      </div>
    </div>
  )
}
