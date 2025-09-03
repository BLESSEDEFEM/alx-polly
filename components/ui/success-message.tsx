'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export function SuccessMessage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShow(true)
      // Remove the success parameter from URL after showing the message
      const newUrl = window.location.pathname
      router.replace(newUrl, { scroll: false })
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShow(false)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  if (!show) return null

  return (
    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Poll created successfully!</span>
      </div>
      <button
        onClick={() => setShow(false)}
        className="text-green-500 hover:text-green-700 font-bold text-lg"
      >
        ×
      </button>
    </div>
  )
}