import { useState } from 'react'
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

  const handlePhotoNav = (direction: 'prev' | 'next') => {
    if (!listing?.photos || listing.photos.length === 0) return
    setActivePhotoIndex((prev) => {
      const lastIndex = listing.photos.length - 1
      if (direction === 'prev') {
        return prev === 0 ? lastIndex : prev - 1
      }
      return prev === lastIndex ? 0 : prev + 1
    })
  }

  return (
    <section className={`py-8 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 rounded-2xl overflow-hidden">
          <div className="relative">
            {listing.photos && listing.photos.length > 0 ? (
              <img
                className={`w-full ${mainImageHeight} object-cover`}
                src={listing.photos[activePhotoIndex]}
                alt={`${listing.title} photo ${activePhotoIndex + 1}`}
              />
            ) : (
              <div className={`w-full ${mainImageHeight} bg-gray-200 flex items-center justify-center`}>
                <Home className="w-16 h-16 text-gray-400" />
              </div>
            )}
            {listing.photos && listing.photos.length > 1 && (
              <>
                <button
                  onClick={() => handlePhotoNav('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                  type="button"
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <button
                  onClick={() => handlePhotoNav('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                  type="button"
                  aria-label="Next photo"
                >
                  ›
                </button>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {listing.photos?.slice(1, 5).map((photo, idx) => (
              <div key={idx} className="relative">
                <img
                  className={`w-full ${thumbnailHeight} object-cover rounded-lg`}
                  src={photo}
                  alt={`${listing.title} ${idx + 2}`}
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
