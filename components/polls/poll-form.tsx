'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
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
 * 
 * This component provides a comprehensive form interface for poll management with:
 * - React Hook Form integration for efficient form handling
 * - Zod schema validation for data integrity
 * - Dynamic option management with field arrays
 * - Optional expiration date setting
 * - Responsive design with Tailwind CSS styling
 * 
 * Features:
 * - Client-side validation with real-time feedback
 * - Dynamic add/remove options functionality
 * - Minimum 2 options enforcement
 * - Loading states during form submission
 * - Accessible form controls with proper labeling
 * - Gradient styling for enhanced visual appeal
 * 
 * @param {PollFormProps} props - Component props
 * @returns {JSX.Element} Validated poll form with dynamic options
 */
export function PollForm({ onSubmit, isSubmitting = false }: PollFormProps) {
  // Initialize form with validation schema and default values
  const form = useForm<PollFormData>({
    resolver: zodResolver(formSchema), // Zod validation integration
    defaultValues: {
      question: '',
      options: [{ value: '' }, { value: '' }], // Start with 2 empty options
      expiresAt: '',
    },
  })

  // Field array management for dynamic options
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  })

  // Use external isSubmitting prop for consistent loading state management

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label htmlFor="question" className="text-sm font-medium leading-none text-green-700">Poll Question</label>
        <input
          id="question"
          {...form.register('question')}
          className="flex h-10 w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="What's your favorite programming language?"
        />
        {form.formState.errors.question && (
          <p className="text-red-500 text-sm">{form.formState.errors.question.message}</p>
        )}
      </div>



      <div className="space-y-4 bg-green-50 p-5 rounded-lg border border-green-100">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium leading-none text-green-700">Poll Options</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '' })} className="border-green-500 text-green-600 hover:bg-green-100">Add Option</Button>
        </div>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 bg-white p-2 rounded-md border border-green-100">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-700 font-medium text-sm mr-1">{index + 1}</div>
              <Input
                {...form.register(`options.${index}.value`)}
                className="flex h-10 w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={`Option ${index + 1}`}
              />
              <Button type="button" variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => remove(index)} disabled={fields.length <= 2}>Remove</Button>
            </div>
          ))}
          {form.formState.errors.options && (
            <p className="text-red-500 text-sm">{form.formState.errors.options.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="expiresAt" className="text-sm font-medium leading-none text-green-700">Expires At (Optional)</label>
        <input
          id="expiresAt"
          type="datetime-local"
          {...form.register('expiresAt')}
          className="flex h-10 w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {form.formState.errors.expiresAt && (
          <p className="text-red-500 text-sm">{form.formState.errors.expiresAt.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-2" disabled={isSubmitting}>
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