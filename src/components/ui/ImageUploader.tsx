import { useState, useRef } from 'react'

interface ImageUploaderProps {
  currentImage?: string
  onUpload: (url: string) => void
  folder?: string
}

export function ImageUploader({ currentImage, onUpload, folder = 'products' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('vkrama_admin_token')}` },
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setPreview(data.url)
      onUpload(data.url)
    } catch (err) {
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="label">Image</label>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-brand-500 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded" />
            <button
              type="button"
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                setPreview(undefined)
                onUpload('')
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="py-4 text-gray-500">
            {uploading ? (
              <span>Uploading...</span>
            ) : (
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm">Click to upload image</p>
              </div>
            )}
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}
