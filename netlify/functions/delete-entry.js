import { getDb, schema } from '../../src/db/index.js'
import { eq } from 'drizzle-orm'

export const handler = async (event) => {
  // Only allow DELETE requests
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS'
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
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS'
      },
      body: ''
    }
  }

  try {
    // Get ID from query parameters
    const id = parseInt(event.queryStringParameters?.id)

    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Invalid or missing ID' })
      }
    }

    // Get database connection
    const db = getDb(process.env.DATABASE_URL)

    // Delete entry
    const [deletedEntry] = await db
      .delete(schema.textEntries)
      .where(eq(schema.textEntries.id, id))
      .returning()

    if (!deletedEntry) {
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
      body: JSON.stringify({
        success: true,
        id: deletedEntry.id
      })
    }
  } catch (error) {
    console.error('Error deleting entry:', error)

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
