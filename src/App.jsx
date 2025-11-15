import { useEffect, useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildPrompt } from './prompt'
import ProgressiveRenderer from './ProgressiveRenderer'
import Sidebar from './Sidebar'
import './App.css'

function App() {
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState('')
  const [error, setError] = useState('')
  const [myText, setMyText] = useState('')
  const [storageTexts, setStorageTexts] = useState('')
  const [currentEntryId, setCurrentEntryId] = useState(null)
  const [historyEntries, setHistoryEntries] = useState([])
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Load history entries on mount
  useEffect(() => {
    loadHistoryEntries()
  }, [])

  const loadHistoryEntries = async () => {
    try {
      const response = await fetch('/api/list-entries?limit=20&offset=0')
      if (response.ok) {
        const data = await response.json()
        setHistoryEntries(data.entries)
      }
    } catch (err) {
      console.error('Error loading history:', err)
    }
  }
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const promptType = e.nativeEvent.submitter.name
    setIsLoading(promptType)

    let entryId = currentEntryId

    try {
      // If no current entry exists, create one first
      if (!entryId) {
        const createResponse = await fetch('/api/create-entry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputText: storageTexts,
            promptType
          })
        })

        if (!createResponse.ok) {
          throw new Error('Failed to create database entry')
        }

        const createdEntry = await createResponse.json()
        entryId = createdEntry.id
        setCurrentEntryId(entryId)
      }

      // Generate AI response
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      const prompt = buildPrompt(storageTexts, promptType)
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      setResponse(text)

      // Update database entry with AI response
      await fetch('/api/update-entry', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: entryId,
          outputText: text,
          status: 'completed'
        })
      })

      // Reload history entries
      loadHistoryEntries()
    } catch (err) {
      setError('Error: ' + err.message)

      // Update database entry with error status if entry exists
      if (entryId) {
        await fetch('/api/update-entry', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: entryId,
            status: 'error',
            error: err.message
          })
        })
      }
    } finally {
      setIsLoading(false)
    }
  }
  const handleSubmitText = async (e) => {
    e.preventDefault()
    setStorageTexts(myText)
    setResponse('')
    setMyText('')
    setCurrentEntryId(null) // Reset entry ID for new text
  }

  const loadHistoryEntry = (entry) => {
    setStorageTexts(entry.inputText)
    setResponse(entry.outputText || '')
    setCurrentEntryId(entry.id)
  }
  const handleCopyText = () => {
    navigator.clipboard.writeText(response)
      .then(() => {
        alert('Text copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };
  

  return (
    <>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        historyEntries={historyEntries}
        onLoadEntry={loadHistoryEntry}
      />
      <div className={`app ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <h1>Edit your text</h1>
        <form onSubmit={handleSubmit}>
          <button name='createParagraph' type="submit" disabled={isLoading}>
            {isLoading === 'createParagraph' ? 'Thinking...' : 'Create paragraph'}
          </button>
          <button name='outlineMainPoints'  type="submit" disabled={isLoading}>
            {isLoading === 'outlineMainPoints' ? 'Thinking...' : 'Outline main points'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmitText}>
          <input
            type="text"
            value={myText}
            onChange={(e) => setMyText(e.target.value)}
            placeholder="Write your text..."
          />
          <button type="submit" disabled={isLoading}>
            Enter Text
          </button>
          <button style={{backgroundColor:'blue'}} onClick={handleCopyText}>Copy Text</button>
        </form>
        <div className='response'>{!response ? storageTexts : response}</div>

      </div>
    </>
  )
}

export default App