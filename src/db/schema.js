import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const textEntries = pgTable('text_entries', {
  id: serial('id').primaryKey(),
  inputText: text('input_text').notNull(),
  outputText: text('output_text'),
  promptType: varchar('prompt_type', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).default('pending'),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
