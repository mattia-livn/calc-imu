'use client'

import React, { useState } from 'react'

interface FileUploadProps {
  onUploadComplete: (fileUrl: string) => void
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFileName(file.name)
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.url) {
        console.log('✅ File caricato con successo:', data.url)
        onUploadComplete(data.url)
      } else {
        console.error('❌ Errore caricamento:', data.error || 'Errore sconosciuto')
      }
    } catch (err) {
      console.error('❌ Errore di rete:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        disabled={uploading}
      />
      {uploading && <p>⏳ Caricamento in corso...</p>}
      {selectedFileName && !uploading && <p>📄 File selezionato: {selectedFileName}</p>}
    </div>
  )
}
