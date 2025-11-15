import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema.js'

// Create a connection to the database
export function getDb(connectionString) {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined')
  }

  const sql = neon(connectionString)
  return drizzle(sql, { schema })
}

// Export schema for use in other files
export { schema }
