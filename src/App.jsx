import { useEffect, useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildPrompt } from './prompt'
import ProgressiveRenderer from './ProgressiveRenderer'
import Sidebar from './Sidebar'
import './App.css'

function App() {
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
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

      // Generate AI response with streaming
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      const prompt = buildPrompt(storageTexts, promptType)
      const result = await model.generateContentStream(prompt)

      let streamedText = ''
      let buffer = ''
      setResponse('') // Clear previous response
      setIsStreaming(true)

      // Stream the response with smoother updates
      let lastUpdateTime = Date.now()
      const UPDATE_INTERVAL = 50 // Update every 50ms for smoother rendering

      for await (const chunk of result.stream) {
        const chunkText = chunk.text()
        streamedText += chunkText
        buffer += chunkText

        // Update UI only after interval has passed or if buffer is significant
        const now = Date.now()
        if (now - lastUpdateTime >= UPDATE_INTERVAL || buffer.length > 10) {
          setResponse(streamedText)
          buffer = ''
          lastUpdateTime = now
        }
      }

      // Final update to ensure all text is displayed
      if (buffer.length > 0) {
        setResponse(streamedText)
      }

      setIsStreaming(false)
      const text = streamedText

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

  const handleDeleteEntry = async (entryId) => {
    try {
      const response = await fetch(`/api/delete-entry?id=${entryId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // If the deleted entry was the current one, clear it
        if (currentEntryId === entryId) {
          setCurrentEntryId(null)
          setStorageTexts('')
          setResponse('')
        }

        // Reload history entries
        loadHistoryEntries()
      } else {
        const error = await response.json()
        alert('Failed to delete entry: ' + (error.error || 'Unknown error'))
      }
    } catch (err) {
      console.error('Error deleting entry:', err)
      alert('Failed to delete entry')
    }
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
        onDeleteEntry={handleDeleteEntry}
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
        <div className='response'>
          {!response ? storageTexts : response}
          {isStreaming && <span className="streaming-cursor">▊</span>}
        </div>

      </div>
    </>
  )
}

export default App