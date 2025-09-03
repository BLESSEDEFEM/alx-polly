'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  question: z.string().min(5, { message: 'Question must be at least 5 characters.' }).max(160, { message: 'Question must not be longer than 160 characters.' }),
  options: z.array(z.object({
    value: z.string().min(1, { message: 'Option cannot be empty.' }).max(50, { message: 'Option must not be longer than 50 characters.' }),
  })).min(2, { message: 'Please add at least 2 options.' }).max(10, { message: 'You can add at most 10 options.' }),
  expiresAt: z.string().optional(),
})

export type PollFormData = z.infer<typeof formSchema>

interface PollFormProps {
  onSubmit: (data: PollFormData) => void
  isSubmitting?: boolean
}

export function PollForm({ onSubmit, isSubmitting = false }: PollFormProps) {
  const form = useForm<PollFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      options: [{ value: '' }, { value: '' }],
      expiresAt: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  })

  // Use external isSubmitting prop instead of form's internal state

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