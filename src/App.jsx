import { useEffect, useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildPrompt } from './prompt'

function App() {
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [myText, setMyText] = useState('')
  const [storageTexts, setStorageTexts] = useState([])

  useEffect(() => {
    const texts = localStorage.getItem('myText')
    if (texts) {
      setStorageTexts(texts)
    }
  }, [])
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      const prompt = buildPrompt(storageTexts)
      const result = await model.generateContent(prompt)
      const text = await result.response.text()
      setResponse(text)
    } catch (err) {
      setError('Error: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }
  const handleSubmitText = async (e) => {
    e.preventDefault()
    setStorageTexts(myText)
    setResponse('')
    setMyText('')
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
    <div className="app">
      <h1>Create your Text</h1>
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Fix your text'}
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
  )
}

export default App