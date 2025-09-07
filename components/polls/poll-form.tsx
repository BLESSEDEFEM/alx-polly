'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Plus, X } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

/**
 * Zod schema for poll form validation
 * Ensures data integrity and provides client-side validation
 */
const formSchema = z.object({
  question: z.string().min(5, { message: 'Question must be at least 5 characters.' }).max(160, { message: 'Question must not be longer than 160 characters.' }),
  options: z.array(z.object({
    value: z.string().min(1, { message: 'Option cannot be empty.' }).max(50, { message: 'Option must not be longer than 50 characters.' }),
  })).min(2, { message: 'Please add at least 2 options.' }).max(10, { message: 'You can add at most 10 options.' }),
  expiresAt: z.string().optional(),
})

/** Type definition for poll form data based on validation schema */
export type PollFormData = z.infer<typeof formSchema>

/**
 * Props interface for PollForm component
 */
interface PollFormProps {
  /** Callback function called when form is submitted with valid data */
  onSubmit: (data: PollFormData) => void
  /** Loading state to disable form during submission */
  isSubmitting?: boolean
}

/**
 * PollForm - Reusable form component for poll creation and editing
 */
export function PollForm({ onSubmit, isSubmitting = false }: PollFormProps) {
  // Initialize form with validation schema and default values
  const form = useForm<PollFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      options: [{ value: '' }, { value: '' }],
      expiresAt: '',
    },
  })

  // Field array management for dynamic options
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  })

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-3">
          <Label htmlFor="question" className="text-lg font-semibold text-gray-900">
            Poll Question
          </Label>
          <textarea
            id="question"
            {...form.register('question')}
            className="flex min-h-[120px] w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:border-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="What would you like to ask?"
          />
          {form.formState.errors.question && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {form.formState.errors.question.message}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold text-gray-900">Poll Options</Label>
            <Button
              type="button"
              onClick={() => append({ value: '' })}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl"
            >
              Add Option
            </Button>
          </div>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold shadow-lg">
                  {index + 1}
                </div>
                <Input
                  {...form.register(`options.${index}.value`)}
                  className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:border-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={`Option ${index + 1}`}
                />
                {fields.length > 2 && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="outline"
                    size="sm"
                    className="h-12 w-12 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl"
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
          </div>
          {form.formState.errors.options && (
            <p className="text-sm text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {form.formState.errors.options.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="expiresAt" className="text-lg font-semibold text-gray-900">Expires At (Optional)</Label>
          <input
            id="expiresAt"
            type="datetime-local"
            {...form.register('expiresAt')}
            className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:border-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {form.formState.errors.expiresAt && (
            <p className="text-sm text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {form.formState.errors.expiresAt.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Creating Poll...
            </>
          ) : (
            'Create Poll'
          )}
        </Button>
      </form>
    </div>
  )
}