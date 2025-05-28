'use client'

import React, { useState } from 'react'
import FileUpload from './FileUpload'

export default function ChatFeed() {
  const [visuraUrl, setVisuraUrl] = useState<string | null>(null)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUploadComplete = async (url: string) => {
    setVisuraUrl(url)
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visuraUrl: url }),
      })

      const data = await res.json()

      if (res.ok && data.result) {
        console.log('🤖 Risposta AI:', data.result)
        setAiResponse(data.result)
      } else {
        console.error('❌ Errore AI:', data.error || 'Errore sconosciuto')
        setAiResponse('Non sono riuscito a calcolare l’IMU.')
      }
    } catch (err) {
      console.error('❌ Errore di rete:', err)
      setAiResponse('Errore di rete durante la chiamata all’AI.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <FileUpload onUploadComplete={handleUploadComplete} />

      {visuraUrl && <p>📄 Visura caricata: {visuraUrl}</p>}

      {loading && <p>⏳ Sto analizzando la visura...</p>}

      {aiResponse && (
        <div className="p-4 border rounded bg-gray-50">
          <p><strong>🤖 Risposta AI:</strong></p>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  )
}
