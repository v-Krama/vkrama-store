import { useState } from 'react'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)
  const displayImages = images.length > 0 ? images : ['']

  return (
    <div className="grid gap-4">
      <div className="aspect-square bg-surface-100 rounded-2xl overflow-hidden">
        {displayImages[selected] ? (
          <img
            src={displayImages[selected]}
            alt={`${name} - Image ${selected + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-surface-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                i === selected ? 'border-brand-600 ring-1 ring-brand-600' : 'border-transparent hover:border-surface-300'
              }`}
            >
              {img ? (
                <img src={img} alt={`${name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-surface-100" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
