'use client'

import { useState } from 'react'

type Props = {
  addMessage: (msg: { role: 'user' | 'ai'; content: string }) => void
}

export default function FileUpload({ addMessage }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const uploadFile = async () => {
    if (!file) return
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()
      if (res.ok && json.risposta) {
        if (json.testoEstratto) {
          addMessage({ role: 'user', content: json.testoEstratto })
        }
        addMessage({ role: 'ai', content: json.risposta })
      } else {
        addMessage({ role: 'ai', content: json.error || 'Errore sconosciuto nella risposta AI.' })
      }
    } catch (err) {
      console.error(err)
      addMessage({ role: 'ai', content: 'Errore di rete durante il caricamento.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="text-sm"
      />
      <button
        onClick={uploadFile}
        disabled={!file || uploading}
        className="ml-2 text-sm bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        {uploading ? 'Caricamento...' : 'Carica PDF'}
      </button>
    </div>
  )
}
