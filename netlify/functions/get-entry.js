import { getDb, schema } from '../../src/db/index.js'
import { getTextEntrySchema } from '../../src/db/validations.js'
import { eq } from 'drizzle-orm'

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
    // Get ID from query parameters
    const id = parseInt(event.queryStringParameters?.id)

    // Validate ID
    const validatedData = getTextEntrySchema.parse({ id })

    // Get database connection
    const db = getDb(process.env.DATABASE_URL)

    // Get entry by ID
    const [entry] = await db
      .select()
      .from(schema.textEntries)
      .where(eq(schema.textEntries.id, validatedData.id))
      .limit(1)

    if (!entry) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Entry not found' })
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(entry)
    }
  } catch (error) {
    console.error('Error getting entry:', error)

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
