'use client'

import { useRef } from 'react'

type FileUploadProps = {
  onUpload: (file: File) => void
  disabled?: boolean
}

export default function FileUpload({ onUpload, disabled }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('📄 File selezionato:', file.name)
      onUpload(file)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".pdf"
        onChange={handleChange}
        ref={fileInputRef}
        className="hidden"
        disabled={disabled}
      />
      <button
        onClick={handleClick}
        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md transition-colors disabled:opacity-50"
        disabled={disabled}
      >
        📤 Carica visura catastale (PDF)
      </button>
    </div>
  )
}
