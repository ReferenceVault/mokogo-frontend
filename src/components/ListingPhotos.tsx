import { useState, useEffect } from 'react'
import { Images, Home } from 'lucide-react'
import { Listing } from '@/types'

interface ListingPhotosProps {
  listing: Listing
  className?: string
  mainImageHeight?: string
  thumbnailHeight?: string
}

const ListingPhotos = ({
  listing,
  className = '',
  mainImageHeight = 'h-[400px] lg:h-[500px]',
  thumbnailHeight = 'h-[120px] lg:h-[160px]',
}: ListingPhotosProps) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [mainImageLoaded, setMainImageLoaded] = useState(false)
  const [mainImageError, setMainImageError] = useState(false)
  const [firstImageReady, setFirstImageReady] = useState(false)

  const photos = listing?.photos || []
  const photoCount = photos.length

  // Reset state when listing or its photos change (so first image loads when photos become available).
  // Defer mounting the first image by one tick so the URL and DOM are ready (fixes first image not loading on initial load).
  useEffect(() => {
    setActivePhotoIndex(0)
    setMainImageLoaded(false)
    setMainImageError(false)
    setFirstImageReady(false)
    if (photoCount > 0) {
      const id = setTimeout(() => setFirstImageReady(true), 0)
      return () => clearTimeout(id)
    } else {
      setFirstImageReady(true)
    }
  }, [listing?.id, listing?.photos?.length, listing?.photos?.[0], photoCount])

  // When switching photo, reset load/error state for the new image
  useEffect(() => {
    setMainImageLoaded(false)
    setMainImageError(false)
  }, [activePhotoIndex])

  // Preload adjacent images for smoother navigation
  useEffect(() => {
    if (photoCount <= 1) return
    const prevIdx = activePhotoIndex === 0 ? photoCount - 1 : activePhotoIndex - 1
    const nextIdx = activePhotoIndex === photoCount - 1 ? 0 : activePhotoIndex + 1
    ;[prevIdx, nextIdx].forEach((idx) => {
      const img = new window.Image()
      img.src = photos[idx]
    })
  }, [activePhotoIndex, photoCount, photos])

  const handleMainImageError = () => {
    setMainImageLoaded(true)
    setMainImageError(true)
    if (photoCount > 1 && activePhotoIndex < photoCount - 1) {
      setActivePhotoIndex((prev) => prev + 1)
    }
  }

  const handlePhotoNav = (direction: 'prev' | 'next') => {
    if (!listing?.photos || listing.photos.length === 0) return
    setMainImageLoaded(false)
    setMainImageError(false)
    setActivePhotoIndex((prev) => {
      const lastIndex = listing.photos.length - 1
      if (direction === 'prev') {
        return prev === 0 ? lastIndex : prev - 1
      }
      return prev === lastIndex ? 0 : prev + 1
    })
  }

  return (
    <section className={`py-6 sm:py-8 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 rounded-2xl overflow-hidden">
          <div className="relative">
            {photos.length > 0 ? (
              <>
                {/* Loading skeleton */}
                {!mainImageLoaded && (
                  <div className={`absolute inset-0 bg-stone-200 animate-pulse ${mainImageHeight}`} />
                )}
                <div className={`w-full ${mainImageHeight} bg-stone-100 flex items-center justify-center overflow-hidden`}>
                {mainImageError ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    <Images className="w-12 h-12" />
                    <span className="text-sm">Image unavailable</span>
                  </div>
                ) : firstImageReady && photos[activePhotoIndex] ? (
                  <img
                    key={`${listing?.id}-${activePhotoIndex}-${photos[activePhotoIndex]}`}
                    className={`max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300 ${mainImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    src={photos[activePhotoIndex]}
                    alt={`${listing.title} photo ${activePhotoIndex + 1}`}
                    loading="eager"
                    decoding="async"
                    onLoad={() => setMainImageLoaded(true)}
                    onError={handleMainImageError}
                  />
                ) : (
                  null
                )}
                </div>
                {/* Photo count badge - visible on mobile and desktop */}
                {photoCount > 0 && (
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium flex items-center gap-2">
                    <Images className="w-4 h-4 flex-shrink-0" />
                    <span>{activePhotoIndex + 1} of {photoCount}</span>
                  </div>
                )}
              </>
            ) : (
              <div className={`w-full ${mainImageHeight} bg-gray-200 flex items-center justify-center`}>
                <Home className="w-16 h-16 text-gray-400" />
              </div>
            )}
            {listing.photos && listing.photos.length > 1 && (
              <>
                <button
                  onClick={() => handlePhotoNav('prev')}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors min-h-[44px] min-w-[44px]"
                  type="button"
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <button
                  onClick={() => handlePhotoNav('next')}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors min-h-[44px] min-w-[44px]"
                  type="button"
                  aria-label="Next photo"
                >
                  ›
                </button>
              </>
            )}
          </div>
          <div className="hidden sm:grid grid-cols-2 gap-4">
            {listing.photos?.slice(1, 5).map((photo, idx) => (
              <div key={idx} className={`relative bg-stone-100 rounded-lg overflow-hidden ${thumbnailHeight}`}>
                <img
                  className="w-full h-full object-contain"
                  src={photo}
                  alt={`${listing.title} ${idx + 2}`}
                  loading="lazy"
                  decoding="async"
                />
                {idx === 3 && listing.photos && listing.photos.length > 5 && (
                  <button className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold rounded-lg hover:bg-black/50 transition-colors">
                    <Images className="w-4 h-4 mr-2" />
                    View All {listing.photos.length} Photos
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ListingPhotos
