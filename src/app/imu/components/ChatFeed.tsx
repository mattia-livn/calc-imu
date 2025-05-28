'use client'

import { useState } from 'react'
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

  return (
    <div className="space-y-4">
      {messages.map((msg, i) => (
        <Message key={i} role={msg.role} content={msg.content} />
      ))}

      <FileUpload onUpload={handleFileUpload} disabled={isLoading} />

      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 border p-2 rounded font-sans"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi qui la tua situazione..."
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage} 
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={isLoading}
        >
          Invia
        </button>
      </div>
    </div>
  )
}