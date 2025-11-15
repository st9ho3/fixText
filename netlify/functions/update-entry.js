import { getDb, schema } from '../../src/db/index.js'
import { updateTextEntrySchema } from '../../src/db/validations.js'
import { eq } from 'drizzle-orm'

export const handler = async (event) => {
  // Only allow PUT requests
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS'
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
        'Access-Control-Allow-Methods': 'PUT, OPTIONS'
      },
      body: ''
    }
  }

  try {
    // Parse and validate request body
    const body = JSON.parse(event.body)
    const validatedData = updateTextEntrySchema.parse(body)

    // Get database connection
    const db = getDb(process.env.DATABASE_URL)

    // Build update object
    const updateData = {
      updatedAt: new Date()
    }

    if (validatedData.outputText !== undefined) {
      updateData.outputText = validatedData.outputText
    }
    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status
    }
    if (validatedData.error !== undefined) {
      updateData.error = validatedData.error
    }

    // Update entry
    const [updatedEntry] = await db
      .update(schema.textEntries)
      .set(updateData)
      .where(eq(schema.textEntries.id, validatedData.id))
      .returning()

    if (!updatedEntry) {
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
      body: JSON.stringify(updatedEntry)
    }
  } catch (error) {
    console.error('Error updating entry:', error)

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
