'use client'

import { useState } from 'react'

type Props = {
  onUpload: (file: File) => Promise<void>
  disabled?: boolean
}

export default function FileUpload({ onUpload, disabled }: Props) {
  const [file, setFile] = useState<File | null>(null)

  const handleUpload = async () => {
    if (!file) return
    await onUpload(file)
    setFile(null)
  }

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="text-sm"
        disabled={disabled}
      />
      <button
        onClick={handleUpload}
        disabled={!file || disabled}
        className="ml-2 text-sm bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        {disabled ? 'Caricamento...' : 'Carica PDF'}
      </button>
    </div>
  )
}