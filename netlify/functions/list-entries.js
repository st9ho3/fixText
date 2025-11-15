import { getDb, schema } from '../../src/db/index.js'
import { listTextEntriesSchema } from '../../src/db/validations.js'
import { eq, desc } from 'drizzle-orm'

export const handler = async (event) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    }
  }

  try {
    // Get query parameters
    const limit = parseInt(event.queryStringParameters?.limit) || 10
    const offset = parseInt(event.queryStringParameters?.offset) || 0
    const promptType = event.queryStringParameters?.promptType

    // Validate query parameters
    const validatedData = listTextEntriesSchema.parse({
      limit,
      offset,
      promptType
    })

    // Get database connection
    const db = getDb(process.env.DATABASE_URL)

    // Build query
    let query = db
      .select()
      .from(schema.textEntries)
      .orderBy(desc(schema.textEntries.createdAt))
      .limit(validatedData.limit)
      .offset(validatedData.offset)

    // Add filter by prompt type if specified
    if (validatedData.promptType) {
      query = query.where(eq(schema.textEntries.promptType, validatedData.promptType))
    }

    // Execute query
    const entries = await query

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        entries,
        limit: validatedData.limit,
        offset: validatedData.offset
      })
    }
  } catch (error) {
    console.error('Error listing entries:', error)

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Validation error',
          details: error.errors
        })
      }
    }

    // Handle other errors
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    }
  }
}
