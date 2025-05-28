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

  const addMessage = (msg: MessageType) => {
    setMessages((prev) => [...prev, msg])
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

      <FileUpload addMessage={addMessage} />

      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 border p-2 rounded font-sans"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi qui la tua situazione..."
        />
        <button onClick={sendMessage} className="bg-black text-white px-4 py-2 rounded">
          Invia
        </button>
      </div>
    </div>
  )
}
