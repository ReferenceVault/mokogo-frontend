import { useState, useRef } from 'react'
import { Listing } from '@/types'

interface Step5PhotosProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
}

const Step5Photos = ({ data, onChange }: Step5PhotosProps) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photos = data.photos || []

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const maxSize = 5 * 1024 * 1024 // 5MB
    const validFiles: File[] = []
    const errors: string[] = []

    // Validate all files first
    Array.from(files).forEach((file) => {
      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds 5MB limit`)
        return
      }

      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not an image`)
        return
      }

      validFiles.push(file)
    })

    if (errors.length > 0) {
      setError(errors.join(', '))
    }

    if (validFiles.length === 0) return

    // Compress and read all valid files
    const compressImage = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const MAX_WIDTH = 1200
            const MAX_HEIGHT = 1200
            let width = img.width
            let height = img.height

            // Calculate new dimensions
            if (width > height) {
              if (width > MAX_WIDTH) {
                height = (height * MAX_WIDTH) / width
                width = MAX_WIDTH
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = (width * MAX_HEIGHT) / height
                height = MAX_HEIGHT
              }
            }

            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            if (!ctx) {
              reject(new Error('Could not get canvas context'))
              return
            }

            ctx.drawImage(img, 0, 0, width, height)
            
            // Convert to JPEG with 0.8 quality to reduce size
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8)
            resolve(compressedDataUrl)
          }
          img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`))
          img.src = e.target?.result as string
        }
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`))
        reader.readAsDataURL(file)
      })
    }

    const readers = validFiles.map((file) => compressImage(file))

    // Wait for all files to be read, then update state once
    Promise.all(readers)
      .then((newPhotoUrls) => {
        const currentPhotos = data.photos || []
        const updatedPhotos = [...currentPhotos, ...newPhotoUrls]
        console.log('Adding photos:', newPhotoUrls.length, 'Total photos:', updatedPhotos.length)
        onChange({ photos: updatedPhotos })
        setError('')
      })
      .catch((error) => {
        setError(error.message || 'Failed to load some images')
      })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const removePhoto = (index: number) => {
    const currentPhotos = data.photos || []
    const updated = currentPhotos.filter((_, i) => i !== index)
    onChange({ photos: updated })
  }

  const reorderPhoto = (fromIndex: number, toIndex: number) => {
    const currentPhotos = data.photos || []
    const updated = [...currentPhotos]
    const [removed] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, removed)
    onChange({ photos: updated })
  }

  const tips = ['Room', 'Hall', 'Bathroom', 'Kitchen', 'Society gate']

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Add photos of the place
      </h1>
      <p className="text-gray-600 mb-8">
        Upload at least 3 photos to help seekers visualize your property
      </p>

      <div className="space-y-6">
        {/* Upload Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
            dragActive
              ? 'border-mokogo-primary bg-mokogo-info-bg'
              : 'border-mokogo-gray bg-gray-50 hover:border-mokogo-primary hover:bg-mokogo-info-bg/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-700 mb-2 font-medium">
            Drag photos here or click to upload
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Maximum 5 MB per image
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Tips */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Photo tips:</p>
          <ul className="flex flex-wrap gap-2">
            {tips.map((tip) => (
              <li
                key={tip}
                className="px-3 py-1 bg-mokogo-gray rounded-full text-xs text-gray-700"
              >
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-4">
              {photos.length} photo{photos.length !== 1 ? 's' : ''} uploaded
              {photos.length < 3 && (
                <span className="text-red-500 ml-2 font-normal">
                  (Minimum 3 required)
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group flex-shrink-0">
                  <div className="w-48 h-32 rounded-lg overflow-hidden border border-mokogo-gray">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Failed to load image:', photo)
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150"%3E%3Crect fill="%23e5e7eb" width="200" height="150"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="14"%3EImage%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => reorderPhoto(index, index - 1)}
                        className="text-white p-2 hover:bg-white/20 rounded"
                        title="Move left"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="text-white p-2 hover:bg-white/20 rounded"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    {index < photos.length - 1 && (
                      <button
                        type="button"
                        onClick={() => reorderPhoto(index, index + 1)}
                        className="text-white p-2 hover:bg-white/20 rounded"
                        title="Move right"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-mokogo-primary text-white text-xs font-semibold px-2.5 py-1 rounded">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Step5Photos
