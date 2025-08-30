'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface PollFormProps {
  onSubmit: (data: PollFormData) => void
  initialData?: PollFormData
}

export interface PollFormData {
  title: string
  description: string
  options: string[]
  endDate?: string
}

export function PollForm({ onSubmit, initialData }: PollFormProps) {
  const [formData, setFormData] = useState<PollFormData>(initialData || {
    title: '',
    description: '',
    options: ['', ''],
    endDate: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onSubmit(formData)
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }))
  }

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }))
  }

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) return // Minimum 2 options
    
    const newOptions = [...formData.options]
    newOptions.splice(index, 1)
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="text-sm font-medium leading-none text-green-700"
        >
          Poll Title
        </label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="What's your favorite programming language?"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium leading-none text-green-700"
        >
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="flex min-h-[80px] w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Provide additional context for your poll"
        />
      </div>

      <div className="space-y-4 bg-green-50 p-5 rounded-lg border border-green-100">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium leading-none text-green-700">
            Poll Options
          </label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addOption}
            className="border-green-500 text-green-600 hover:bg-green-100"
          >
            Add Option
          </Button>
        </div>

        <div className="space-y-3">
          {formData.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 bg-white p-2 rounded-md border border-green-100">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-700 font-medium text-sm mr-1">
                {index + 1}
              </div>
              <input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex h-10 w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={`Option ${index + 1}`}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => removeOption(index)}
                disabled={formData.options.length <= 2}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="endDate"
          className="text-sm font-medium leading-none text-green-700"
        >
          End Date (Optional)
        </label>
        <input
          id="endDate"
          name="endDate"
          type="datetime-local"
          value={formData.endDate}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-2" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Poll...
          </>
        ) : (
          "Create Poll"
        )}
      </Button>
    </form>
  )
}