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
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-gray-100 hover:file:bg-gray-200 file:cursor-pointer"
        disabled={disabled}
      />
      <button
        onClick={handleUpload}
        disabled={!file || disabled}
        className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-gray-100"
      >
        {disabled ? 'Caricamento...' : 'Carica PDF'}
      </button>
    </div>
  )
}