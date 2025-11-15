# CLAUDE.md - AI Assistant Guide for fixText

## Project Overview

**fixText** is a React-based web application that leverages Google's Generative AI (Gemini 2.0 Flash) to help users edit and reformat Greek text. The application provides two main features:
- **Create Paragraph**: Transforms input text into a well-structured, academically-toned paragraph in Greek
- **Outline Main Points**: Analyzes Greek text and extracts main points as a numbered list

**Live Deployment**: https://txet.netlify.app

## Tech Stack

### Core Technologies
- **React 19.0.0**: UI library with hooks-based architecture
- **Vite 6.1.0**: Build tool and development server
- **Google Generative AI SDK 0.22.0**: Integration with Gemini 2.0 Flash model

### Development Tools
- **ESLint 9.19.0**: Linting with React-specific plugins
- **Node.js**: Runtime environment (ESModules)

### Key Dependencies
- `@google/generative-ai`: Google's Generative AI SDK
- `@vitejs/plugin-react`: Vite plugin for React support

## Project Structure

```
fixText/
├── public/                 # Static assets
│   ├── 1.png              # Favicon
│   ├── 2.png              # Additional icon
│   └── vite.svg           # Vite logo
├── src/                   # Source code
│   ├── assets/
│   │   └── react.svg      # React logo
│   ├── App.jsx            # Main application component
│   ├── App.css            # Application styles
│   ├── main.jsx           # React entry point
│   ├── index.css          # Global styles (minimal)
│   ├── ProgressiveRenderer.jsx  # Progressive text display component
│   ├── prompt.js          # AI prompt builders
│   └── prompt.json        # (Empty file - unused)
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
├── eslint.config.js       # ESLint configuration
├── package.json           # Project dependencies and scripts
└── .gitignore             # Git ignore rules
```

## Key Components & Files

### `src/App.jsx` (Main Component)
**Location**: `src/App.jsx:1-87`

**State Management**:
- `response`: AI-generated response text
- `isLoading`: Loading state (stores prompt type being processed)
- `error`: Error messages
- `myText`: Current text input
- `storageTexts`: Stored text from localStorage

**Key Functions**:
- `handleSubmit(e)`: Processes AI requests (createParagraph or outlineMainPoints)
  - Location: `src/App.jsx:21-37`
  - Uses `e.nativeEvent.submitter.name` to determine prompt type
  - Calls Google Generative AI with built prompts

- `handleSubmitText(e)`: Saves text to state (simulates localStorage)
  - Location: `src/App.jsx:38-43`

- `handleCopyText()`: Copies response to clipboard
  - Location: `src/App.jsx:44-52`

**Important Notes**:
- API key loaded from environment variable: `import.meta.env.VITE_API_KEY`
- Model used: `gemini-2.0-flash`
- Progressive renderer component is imported but not currently used in the render

### `src/prompt.js` (AI Prompt Builders)
**Location**: `src/prompt.js:1-52`

Contains two prompt builder functions:

1. **`createParagraph(text)`** - `src/prompt.js:1-22`
   - Creates detailed academic writing prompt
   - Focuses on: analysis, refinement, academic tone, logical structure, clarity
   - Output: Formal academic Greek paragraph

2. **`outlineMainPoints(text)`** - `src/prompt.js:24-47`
   - Creates text analysis/summarization prompt
   - Focuses on: extracting main ideas, concise summarization, numbered list
   - Output: Numbered list in formal Greek (plain text, no markdown)

3. **`buildPrompt(text, promptType)`** - `src/prompt.js:48-52`
   - Router function that selects appropriate prompt based on type

### `src/ProgressiveRenderer.jsx` (Progressive Display)
**Location**: `src/ProgressiveRenderer.jsx:1-31`

A component that displays text character-by-character with a typing effect:
- Uses `useState` and `useEffect` for progressive rendering
- Default delay: 50ms per character
- Includes fade-in animation
- **Note**: Currently imported in App.jsx but not used in the render

### `src/App.css` (Styling)
**Location**: `src/App.css:1-257`

**Styling Approach**:
- Centered layout (max-width: 600px)
- Black/blue color scheme
- Button hover and active states with blue glow effect
- Responsive form layouts with flexbox
- Includes unused legacy styles (lines 99-257) from previous iterations

**Key Classes**:
- `.app`: Main container
- `button`: Unified button styles with hover/active/disabled states
- `.response`: Display area for AI responses
- `.error`: Error message styling

## Development Workflow

### Environment Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```
   VITE_API_KEY=your_google_ai_api_key_here
   ```
   - This file is gitignored (`.gitignore:25`)
   - Required for Google Generative AI integration

### Available Scripts

```bash
npm run dev      # Start development server (default: http://localhost:5173)
npm run build    # Build for production (output: dist/)
npm run lint     # Run ESLint on the codebase
npm run preview  # Preview production build locally
```

### Development Server
- **Command**: `npm run dev`
- **Port**: Default Vite port (usually 5173)
- **Hot Module Replacement**: Enabled via Vite

### Building for Production
- **Command**: `npm run build`
- **Output**: `dist/` directory
- **Deployment**: Configured for Netlify (live at https://txet.netlify.app)

## Coding Conventions

### React Patterns

1. **Functional Components**: Use function declarations, not arrow functions
   ```javascript
   function App() { ... }  // ✓ Preferred
   const App = () => { ... }  // ✗ Avoid
   ```

2. **Hooks Usage**:
   - `useState` for component state
   - `useEffect` for side effects (e.g., localStorage)
   - No custom hooks currently in use

3. **Event Handling**:
   - Async/await for API calls
   - Form submissions use `e.preventDefault()`
   - Button actions identified via `e.nativeEvent.submitter.name`

### Naming Conventions

- **Components**: PascalCase (e.g., `ProgressiveRenderer`)
- **Files**: Match component names (e.g., `ProgressiveRenderer.jsx`)
- **Functions**: camelCase with handle prefix for event handlers (e.g., `handleSubmit`)
- **State**: Descriptive camelCase (e.g., `isLoading`, `storageTexts`)

### Code Organization

1. **Import Order** (established pattern):
   - React imports first
   - Third-party libraries
   - Local components
   - CSS files last

2. **Component Structure**:
   - State declarations
   - Side effects (useEffect)
   - Utility instances (e.g., genAI)
   - Event handlers
   - Return/render

### Error Handling

- Try-catch blocks for async operations
- Error state managed via `useState`
- User-friendly error messages displayed in UI
- Console errors for clipboard failures

### API Integration

**Google Generative AI Usage**:
```javascript
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
const result = await model.generateContent(prompt)
const text = result.response.text()
```

**Important**:
- Model: Always use `gemini-2.0-flash`
- Prompts: Build using functions from `prompt.js`
- Environment: API key from `VITE_API_KEY` env variable

## AI-Generated Content Guidelines

### When Working with Prompts

1. **Prompt Location**: All AI prompts are in `src/prompt.js`

2. **Prompt Structure**:
   - Clear role definition ("You are an expert in the Greek language...")
   - Explicit instructions numbered list
   - Input/output format specifications
   - Language requirements (formal academic Greek)

3. **Modifying Prompts**:
   - Maintain the template structure with input text interpolation
   - Keep instructions numbered and detailed
   - Specify output format explicitly
   - Test with Greek text samples

### UI/UX Patterns

1. **Loading States**:
   - Button text changes to "Thinking..." during processing
   - Buttons disabled when `isLoading` is truthy
   - Loading state stores the prompt type being processed

2. **User Feedback**:
   - Success: Display AI response in `.response` div
   - Error: Show error message in `.error` div
   - Copy: Alert on successful clipboard copy

3. **Data Persistence**:
   - Currently uses component state (localStorage hook exists but doesn't persist)
   - Text saved to `storageTexts` state on "Enter Text" button click

## Common Tasks

### Adding a New AI Prompt Type

1. **Create prompt builder in `src/prompt.js`**:
   ```javascript
   const newPromptType = (text) => {
     return `Prompt template with ${text}`
   }
   ```

2. **Update `buildPrompt` function**:
   ```javascript
   export const buildPrompt = (text, promptType) => {
     if (promptType === 'newPromptType') return newPromptType(text)
     return promptType === 'outlineMainPoints'
       ? outlineMainPoints(text)
       : createParagraph(text)
   }
   ```

3. **Add button in `App.jsx`**:
   ```javascript
   <button name='newPromptType' type="submit" disabled={isLoading}>
     {isLoading === 'newPromptType' ? 'Thinking...' : 'New Action'}
   </button>
   ```

### Styling Changes

1. **Component-specific**: Modify `src/App.css`
2. **Global styles**: Modify `src/index.css` (currently minimal)
3. **Button styles**: Update unified button styles in `App.css:24-51`

### Adding New Components

1. Create `.jsx` file in `src/`
2. Import in `App.jsx` or parent component
3. Create corresponding `.css` if needed
4. Follow established naming conventions

## Configuration Files

### `vite.config.js`
- Minimal configuration with React plugin
- Default Vite settings for development and build

### `eslint.config.js`
- ESLint 9.x flat config format
- Plugins: react, react-hooks, react-refresh
- Ignores: `dist` folder
- Target: ES2020, browser globals
- Note: React version set to 18.3 (actual version is 19.0.0 - potential update needed)

### `.gitignore`
Key ignored items:
- `node_modules/`
- `dist/` and `dist-ssr/`
- `.env` (environment variables)
- `*.log` (log files)
- Editor-specific files (.vscode, .idea, etc.)
- `*.local` files

## Known Issues & Technical Debt

1. **ProgressiveRenderer Component**:
   - Imported in `App.jsx:4` but not used in render
   - Consider removing import or implementing progressive display

2. **localStorage Implementation**:
   - `useEffect` reads from localStorage (`App.jsx:13-18`)
   - But `handleSubmitText` doesn't actually save to localStorage
   - Only saves to component state

3. **Unused CSS**:
   - `App.css` lines 99-257 contain legacy form styling
   - Not used by current implementation
   - Consider removing for cleaner codebase

4. **ESLint Configuration**:
   - React version set to 18.3 in `eslint.config.js:20`
   - Actual installed version is 19.0.0
   - Update to match package.json

5. **Empty File**:
   - `src/prompt.json` exists but is empty/unused
   - Consider removing

6. **Input Type**:
   - Currently uses single-line `<input type="text">`
   - Greek academic text might benefit from `<textarea>` for multi-line input

## Security Considerations

### API Key Management
- **Critical**: Never commit `.env` file
- API key stored in environment variable
- Exposed to client-side code (note: Gemini API keys are client-safe)

### Input Validation
- Currently no input sanitization
- Relies on Google's AI API for safe handling
- Consider adding length limits for very long texts

### Dependencies
- Regularly update dependencies for security patches
- Run `npm audit` periodically

## Testing Guidelines

### Manual Testing Checklist
1. Enter Greek text in input field
2. Click "Enter Text" - verify text is stored
3. Click "Create paragraph" - verify:
   - Button shows "Thinking..."
   - Response appears in gray box
   - Response is formatted academic paragraph
4. Click "Outline main points" - verify:
   - Loading state shows correctly
   - Response is numbered list
   - Plain text format (no markdown)
5. Click "Copy Text" - verify clipboard and alert

### Common Test Cases
- **Empty input**: Should handle gracefully
- **Very long text**: Test performance and response time
- **Non-Greek text**: Observe AI behavior
- **API errors**: Test error display (disconnect network)

## Deployment

### Netlify Configuration
- **Live URL**: https://txet.netlify.app
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Environment variables**: Set `VITE_API_KEY` in Netlify dashboard

### Build Process
1. Vite bundles all source files
2. Output to `dist/` directory
3. Index.html references bundled JS/CSS
4. Static assets copied from `public/`

## Git Workflow

### Branch Strategy
- Main branch for production-ready code
- Feature branches for development (e.g., `claude/claude-md-...`)
- Commit messages should be descriptive

### Commit Guidelines
- Reference file locations when relevant
- Describe "why" not just "what"
- Keep commits focused and atomic

## Additional Notes for AI Assistants

### When Modifying Code

1. **Preserve Greek Language Focus**: This app is specifically for Greek text processing
2. **Maintain Prompt Quality**: Prompts are carefully crafted for academic Greek
3. **API Costs**: Each AI call costs money - be mindful when testing
4. **Existing Patterns**: Follow established patterns (state management, error handling)
5. **User Experience**: Maintain simple, clear UI - avoid over-complication

### Before Making Changes

1. Check if similar functionality exists
2. Review existing state management
3. Consider impact on AI prompt effectiveness
4. Test with Greek text samples
5. Verify API key is not exposed in commits

### Quick Reference

**Model in Use**: `gemini-2.0-flash`
**Primary Language**: Greek (for AI processing)
**UI Framework**: React 19 with hooks
**Build Tool**: Vite
**Styling**: CSS (no preprocessor)
**State Management**: React useState (no external library)
**API Integration**: Google Generative AI SDK

---

**Last Updated**: 2025-11-15
**Project Version**: 0.0.0
**Maintained by**: AI-assisted development team
