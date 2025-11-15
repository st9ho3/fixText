# Database Setup Guide

This guide explains how to set up and use the Neon Postgres database with Drizzle ORM for the fixText application.

## Prerequisites

- Node.js and npm installed
- A Neon account (sign up at https://neon.tech)
- Netlify account (for deployment)

## Database Setup

### 1. Create a Neon Database

1. Go to https://neon.tech and sign in
2. Create a new project
3. Copy your database connection string (it will look like: `postgresql://user:password@host/database?sslmode=require`)

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Google AI API Key (existing)
VITE_API_KEY=your_google_ai_api_key_here

# Neon Database Connection String
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

**Important Notes:**
- The `.env` file is gitignored and should never be committed
- `VITE_API_KEY` is prefixed with `VITE_` because it's used in the client-side code
- `DATABASE_URL` is used in Netlify Functions (server-side) only

### 3. Set Up Netlify Environment Variables

For deployment, you need to set environment variables in Netlify:

1. Go to your Netlify dashboard
2. Navigate to Site settings > Environment variables
3. Add the following variables:
   - `VITE_API_KEY`: Your Google AI API key
   - `DATABASE_URL`: Your Neon database connection string

### 4. Push Database Schema

To create the database tables, run:

```bash
npm run db:push
```

This command will:
- Connect to your Neon database
- Create the `text_entries` table with all required columns
- Set up indexes and constraints

## Database Schema

The application uses a single table called `text_entries`:

```sql
CREATE TABLE text_entries (
  id SERIAL PRIMARY KEY,
  input_text TEXT NOT NULL,
  output_text TEXT,
  prompt_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Column Descriptions

- `id`: Auto-incrementing primary key
- `input_text`: The original Greek text entered by the user
- `output_text`: The AI-generated response (paragraph or outline)
- `prompt_type`: Either 'createParagraph' or 'outlineMainPoints'
- `status`: Entry status ('pending', 'completed', or 'error')
- `error`: Error message if the AI generation failed
- `created_at`: Timestamp when the entry was created
- `updated_at`: Timestamp when the entry was last updated

## Database Scripts

The following npm scripts are available for database management:

```bash
# Generate migration files from schema changes
npm run db:generate

# Apply migrations to the database
npm run db:migrate

# Push schema changes directly to database (development)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### When to Use Each Command

- **`db:push`**: Use during development to quickly sync schema changes. This is the fastest way to update your database structure.
- **`db:generate`**: Creates migration files when you change the schema. Use this before deploying to production.
- **`db:migrate`**: Applies migration files to the database. Use in production deployments.
- **`db:studio`**: Opens a web-based database viewer at http://localhost:4983

## API Endpoints

The application uses Netlify Functions to interact with the database:

### Create Entry
- **Endpoint**: `POST /api/create-entry`
- **Body**:
  ```json
  {
    "inputText": "Greek text here",
    "promptType": "createParagraph"
  }
  ```
- **Response**: Created entry object with ID

### Update Entry
- **Endpoint**: `PUT /api/update-entry`
- **Body**:
  ```json
  {
    "id": 1,
    "outputText": "AI-generated response",
    "status": "completed"
  }
  ```
- **Response**: Updated entry object

### Get Entry
- **Endpoint**: `GET /api/get-entry?id=1`
- **Response**: Entry object

### List Entries
- **Endpoint**: `GET /api/list-entries?limit=20&offset=0&promptType=createParagraph`
- **Query Parameters**:
  - `limit`: Number of entries to return (default: 10, max: 100)
  - `offset`: Number of entries to skip (default: 0)
  - `promptType`: Filter by prompt type (optional)
- **Response**: Object with entries array and pagination info

## Validation

The application uses Zod for runtime validation of all API requests. The validation schemas are defined in `src/db/validations.js`:

- **createTextEntrySchema**: Validates new entry creation
  - `inputText`: Required, 1-10000 characters
  - `promptType`: Must be 'createParagraph' or 'outlineMainPoints'

- **updateTextEntrySchema**: Validates entry updates
  - `id`: Required positive integer
  - `outputText`: Optional string
  - `status`: Optional, must be 'pending', 'completed', or 'error'
  - `error`: Optional error message

## Development Workflow

1. **Make schema changes** in `src/db/schema.js`
2. **Push changes** with `npm run db:push`
3. **Test locally** using the development server
4. **Generate migration** with `npm run db:generate` (for production)
5. **Commit** the migration files
6. **Deploy** to Netlify (migrations run automatically if configured)

## Troubleshooting

### Connection Issues

If you see database connection errors:

1. Verify your `DATABASE_URL` is correct in `.env`
2. Check that your IP is allowed in Neon's IP allowlist (if configured)
3. Ensure the database is active in Neon (it may auto-suspend)

### CORS Issues

If API calls fail with CORS errors:

1. Check that the Netlify Functions are deployed
2. Verify the `/api/*` redirect is working (configured in `netlify.toml`)
3. Ensure all functions include proper CORS headers

### Migration Failures

If migrations fail:

1. Check the database connection
2. Verify the schema syntax in `src/db/schema.js`
3. Try using `db:push` instead for development
4. Check Neon's query logs for detailed error messages

## Security Best Practices

1. **Never commit** the `.env` file or expose your `DATABASE_URL`
2. **Use environment variables** for all sensitive configuration
3. **Validate all inputs** using Zod schemas before database operations
4. **Limit query results** to prevent large data transfers
5. **Use parameterized queries** (Drizzle handles this automatically)
6. **Monitor database usage** in Neon's dashboard to stay within limits

## Production Considerations

1. **Database Backups**: Neon provides automatic backups. Configure retention in your project settings.
2. **Connection Pooling**: Neon automatically handles connection pooling for serverless functions.
3. **Query Performance**: Monitor slow queries in Neon's dashboard and add indexes as needed.
4. **Rate Limiting**: Consider adding rate limiting to your Netlify Functions to prevent abuse.
5. **Error Monitoring**: Use Netlify's function logs to track and debug errors.

## Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Zod Documentation](https://zod.dev/)
