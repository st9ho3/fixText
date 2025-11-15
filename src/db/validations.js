import { z } from 'zod'

// Validation schema for creating a new text entry
export const createTextEntrySchema = z.object({
  inputText: z.string().min(1, 'Input text is required').max(10000, 'Input text is too long'),
  promptType: z.enum(['createParagraph', 'outlineMainPoints'], {
    errorMap: () => ({ message: 'Prompt type must be either createParagraph or outlineMainPoints' })
  })
})

// Validation schema for updating a text entry (with AI response)
export const updateTextEntrySchema = z.object({
  id: z.number().int().positive(),
  outputText: z.string().optional(),
  status: z.enum(['pending', 'completed', 'error']).optional(),
  error: z.string().optional()
})

// Validation schema for getting a text entry by ID
export const getTextEntrySchema = z.object({
  id: z.number().int().positive()
})

// Validation schema for listing text entries with pagination
export const listTextEntriesSchema = z.object({
  limit: z.number().int().positive().max(100).default(10),
  offset: z.number().int().nonnegative().default(0),
  promptType: z.enum(['createParagraph', 'outlineMainPoints']).optional()
})
