import { MapPin, Shield, Share2, Heart, Flag, CheckCircle2 } from 'lucide-react'
import { Listing } from '@/types'
import { formatDate } from '@/utils/formatters'

interface ListingHeadingProps {
  listing: Listing
  isSaved?: boolean
  isOwner?: boolean
  onSave?: () => void
  onShare?: () => void
  onReport?: () => void
  onMarkAsFulfilled?: () => void
  showVerified?: boolean
  showActions?: boolean
}

const ListingHeading = ({
  listing,
  isSaved = false,
  isOwner = false,
  onSave,
  onShare,
  onReport,
  onMarkAsFulfilled,
  showVerified = true,
  showActions = true,
}: ListingHeadingProps) => {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div className="flex-1">
            <div className="flex items-center mb-4 flex-wrap gap-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{listing.title}</h1>
              {showVerified && (
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Verified</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-orange-400 mr-2" />
                <span>{listing.locality}, {listing.city}</span>
              </div>
              {showVerified && (
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-green-500 mr-1" />
                  <span>ID Verified Host</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-x-4 gap-y-3 flex-wrap">
              {listing.preferredGender && (
                <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                  {listing.preferredGender === 'Male' ? 'Male Preferred' : listing.preferredGender === 'Female' ? 'Female Preferred' : 'Any Gender'}
                </span>
              )}
              {listing.foodPreference && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  🥗 {listing.foodPreference === 'Vegetarian only' ? 'Vegetarian only' : listing.foodPreference === 'Non-veg allowed' ? 'Non-veg allowed' : 'Open'}
                </span>
              )}
              {listing.petPolicy && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {listing.petPolicy === 'Pets allowed' ? '🐾 Pet friendly' : '🚫 No pets'}
                </span>
              )}
              {listing.smokingPolicy && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  {listing.smokingPolicy === 'Not allowed' ? '🚭 No smoking' : listing.smokingPolicy === 'Allowed' ? '💨 Smoking allowed' : '🚬 No issues'}
                </span>
              )}
              {listing.drinkingPolicy && (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  {listing.drinkingPolicy === 'Not allowed' ? '🚫 Alcohol restricted' : listing.drinkingPolicy === 'Allowed' ? '🍷 Drinking allowed' : '🥂 No issues'}
                </span>
              )}
              {listing.lgbtqFriendly && (
                <span className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm font-medium">
                  🏳️‍🌈 LGBTQ+ Friendly
                </span>
              )}
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Available {formatDate(listing.moveInDate)}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {listing.furnishingLevel}
              </span>
            </div>
          </div>
          {showActions && (
            <div className="flex items-center space-x-4 mt-6 lg:mt-0">
              {isOwner && listing.status === 'live' && onMarkAsFulfilled && (
                <button
                  onClick={onMarkAsFulfilled}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Fulfilled</span>
                </button>
              )}
              {listing.status === 'fulfilled' && (
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium text-sm flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Fulfilled - Off Market</span>
                </span>
              )}
              {!isOwner && (
                <>
                  {onShare && (
                    <button
                      onClick={onShare}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-gray-600" />
                      <span>Share</span>
                    </button>
                  )}
                  {onSave && (
                    <button
                      onClick={onSave}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                      <span>Save</span>
                    </button>
                  )}
                  {onReport && (
                    <button
                      onClick={onReport}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Flag className="w-4 h-4" />
                      <span>Report</span>
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ListingHeading
