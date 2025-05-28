'use client'

import { useState, useRef, useEffect } from 'react'
import Message from './Message'
import FileUpload from './FileUpload'

type MessageType = {
  role: 'user' | 'ai'
  content: string
}

export default function ChatFeed() {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (msg: MessageType) => {
    setMessages((prev) => [...prev, msg])
  }

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)
    addMessage({ role: 'ai', content: 'Analisi in corso...' })

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      
      // Remove loading message
      setMessages(prev => prev.slice(0, -1))

      if (data.testoEstratto) {
        addMessage({ role: 'user', content: data.testoEstratto })
      }
      if (data.risposta) {
        addMessage({ role: 'ai', content: data.risposta })
      }
    } catch (error) {
      // Remove loading message
      setMessages(prev => prev.slice(0, -1))
      addMessage({ role: 'ai', content: 'Si è verificato un errore durante l\'analisi del file.' })
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessages: MessageType[] = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')

    const res = await fetch('/api/calculate', {
      method: 'POST',
      body: JSON.stringify({ visura: input }),
    })

    const data = await res.json()
    setMessages([...newMessages, { role: 'ai', content: data.risposta || 'Errore nel calcolo.' }])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && input.trim()) {
        sendMessage()
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-white p-4 space-y-4">
        <FileUpload onUpload={handleFileUpload} disabled={isLoading} />
        
        <div className="flex gap-2">
          <input
            className="flex-1 border p-3 rounded-lg font-sans focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Scrivi qui la tua situazione..."
            disabled={isLoading}
          />
          <button 
            onClick={sendMessage} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
            disabled={isLoading || !input.trim()}
          >
            Invia
          </button>
        </div>
      </div>
    </div>
  )
}