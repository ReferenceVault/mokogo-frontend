import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Toast from '@/components/Toast'
import { useStore } from '@/store/useStore'
import { Listing } from '@/types'
import Step1Basics from './steps/Step1Basics'
import Step2Pricing from './steps/Step2Pricing'
import Step3Amenities from './steps/Step3Amenities'
import Step4Rules from './steps/Step4Rules'
import Step5Photos from './steps/Step5Photos'
import Step6Preview from './steps/Step6Preview'

const ListingWizard = () => {
  const navigate = useNavigate()
  const { currentListing, setCurrentListing } = useStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showToast, setShowToast] = useState(false)
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const listingDataRef = useRef<Partial<Listing>>(
    currentListing && currentListing.status === 'draft'
      ? currentListing
      : {
          id: `listing-${Date.now()}`,
          title: '',
          city: '',
          locality: '',
          societyName: '',
          bhkType: '',
          roomType: '',
          rent: 0,
          deposit: 0,
          setupCost: 0,
          moveInDate: '',
          minimumStay: 0,
          furnishingLevel: '',
          flatAmenities: [],
          societyAmenities: [],
          preferredGender: 'Any',
          foodPreference: 'No preference',
          smokingAllowed: 'No',
          drinkingAllowed: 'No',
          guestsAllowed: 'No',
          notes: '',
          photos: [],
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
  )
  const [listingData, setListingData] = useState<Partial<Listing>>(listingDataRef.current)

  // Determine starting step based on draft data
  useEffect(() => {
    if (currentListing && currentListing.status === 'draft') {
      // Determine last completed step
      let step = 1
      if (currentListing.city && currentListing.locality && currentListing.bhkType && currentListing.roomType) step = 2
      if (currentListing.rent && currentListing.moveInDate) step = 3
      if (currentListing.furnishingLevel) step = 4
      if (currentListing.preferredGender) step = 5
      if (currentListing.photos && currentListing.photos.length > 0) step = 6
      setCurrentStep(step)
    }
  }, [])

  const steps = [
    { number: 1, label: 'Basics' },
    { number: 2, label: 'Pricing' },
    { number: 3, label: 'Amenities' },
    { number: 4, label: 'Rules' },
    { number: 5, label: 'Photos' },
    { number: 6, label: 'Preview' },
  ]

  // Autosave functionality
  const saveDraft = (showNotification = false) => {
    const dataToSave = listingDataRef.current
    const updatedListing: Partial<Listing> = {
      ...dataToSave,
      status: 'draft',
      updatedAt: new Date().toISOString(),
    }
    listingDataRef.current = updatedListing
    setListingData(updatedListing)
    setCurrentListing(updatedListing as Listing)
    setLastSaved(new Date())
    localStorage.setItem('mokogo-listing', JSON.stringify(updatedListing))
    if (showNotification) {
      setShowToast(true)
    }
  }

  // Autosave on data change (debounced)
  useEffect(() => {
    listingDataRef.current = listingData
    
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current)
    }

    autosaveTimerRef.current = setTimeout(() => {
      if (listingData.city || listingData.locality || listingData.rent) {
        saveDraft(true)
      }
    }, 1000) // Debounce autosave

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
      }
    }
  }, [listingData.city, listingData.locality, listingData.bhkType, listingData.roomType, listingData.rent, listingData.moveInDate, listingData.furnishingLevel, listingData.preferredGender, listingData.photos?.length])

  const handleNext = () => {
    saveDraft(true)
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    saveDraft(true)
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate('/dashboard')
    }
  }

  const handleExit = () => {
    saveDraft(true)
    navigate('/dashboard')
  }

  const handlePublish = () => {
    console.log('handlePublish called', listingData)
    
    // Validate required fields
    const missingFields: string[] = []
    if (!listingData.title) missingFields.push('title')
    if (!listingData.city) missingFields.push('city')
    if (!listingData.locality) missingFields.push('locality')
    if (!listingData.bhkType) missingFields.push('bhkType')
    if (!listingData.roomType) missingFields.push('roomType')
    if (!listingData.rent) missingFields.push('rent')
    if (!listingData.moveInDate) missingFields.push('moveInDate')
    if (!listingData.furnishingLevel) missingFields.push('furnishingLevel')
    if (!listingData.photos || listingData.photos.length < 3) {
      missingFields.push(`photos (have ${listingData.photos?.length || 0}, need 3)`)
    }

    if (missingFields.length > 0) {
      alert(`Please complete all required fields:\n${missingFields.join(', ')}`)
      console.log('Validation failed:', missingFields)
      return
    }

    console.log('Validation passed, publishing listing...')
    const publishedListing: Listing = {
      ...listingData,
      status: 'live',
      updatedAt: new Date().toISOString(),
    } as Listing

    console.log('Setting current listing:', publishedListing)
    setCurrentListing(publishedListing)
    
    // Try to save to localStorage separately (store already handles errors)
    try {
      localStorage.setItem('mokogo-listing', JSON.stringify(publishedListing))
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Listing saved in memory but not persisted.')
        // Try storing without photos
        try {
          const listingWithoutPhotos = { ...publishedListing, photos: [] }
          localStorage.setItem('mokogo-listing', JSON.stringify(listingWithoutPhotos))
          console.log('Stored listing without photos due to size limits.')
        } catch (e) {
          console.error('Could not store listing:', e)
        }
      }
    }
    
    console.log('Navigating to dashboard...')
    navigate('/dashboard')
  }

  const handleDataChange = (updates: Partial<Listing>) => {
    setListingData((prev) => {
      const updated = { ...prev, ...updates }
      if (updates.photos) {
        console.log('Photos updated in ListingWizard:', updates.photos.length)
      }
      return updated
    })
  }

  const formatLastSaved = () => {
    if (!lastSaved) return 'Not saved yet'
    const now = new Date()
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000)
    if (diff < 60) return 'Saved just now'
    if (diff < 3600) return `Saved ${Math.floor(diff / 60)} min ago`
    return `Saved at ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Basics data={listingData} onChange={handleDataChange} />
      case 2:
        return <Step2Pricing data={listingData} onChange={handleDataChange} />
      case 3:
        return <Step3Amenities data={listingData} onChange={handleDataChange} />
      case 4:
        return <Step4Rules data={listingData} onChange={handleDataChange} />
      case 5:
        return <Step5Photos data={listingData} onChange={handleDataChange} />
      case 6:
        return <Step6Preview data={listingData} onChange={handleDataChange} onPublish={handlePublish} />
      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!(listingData.city && listingData.locality && listingData.bhkType && listingData.roomType)
      case 2:
        return !!(listingData.rent && listingData.moveInDate)
      case 3:
        return !!listingData.furnishingLevel
      case 5:
        const photoCount = listingData.photos?.length || 0
        console.log('canProceed check for step 5:', photoCount, 'photos')
        return photoCount >= 3
      case 6:
        // For preview step, check if all required fields are present
        const hasRequiredFields = !!(
          listingData.title && 
          listingData.city && 
          listingData.locality && 
          listingData.bhkType && 
          listingData.roomType && 
          listingData.rent && 
          listingData.moveInDate && 
          listingData.furnishingLevel && 
          listingData.photos && 
          listingData.photos.length >= 3
        )
        console.log('canProceed check for step 6:', hasRequiredFields, listingData)
        return hasRequiredFields
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-mokogo-off-white flex flex-col">
      <Header />
      
      <main className="flex-1 py-12" style={{ fontSize: '90%' }}>
        <div className="max-w-4xl mx-auto px-24">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-semibold text-gray-700">
                Step {currentStep} of 6
              </span>
              <span className="text-sm text-gray-500">Complete all steps to publish</span>
            </div>
            
            {/* Progress Bar with Numbered Steps */}
            <div className="flex gap-2 mb-2">
              {steps.map((step) => (
                <div key={step.number} className="flex-1 flex flex-col items-center">
                  <div className="flex items-center gap-2 w-full mb-2">
                    <div
                      className={`flex-1 h-2 rounded-full transition-colors ${
                        step.number <= currentStep
                          ? 'bg-mokogo-blue'
                          : 'bg-mokogo-gray'
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-semibold ${
                        step.number === currentStep
                          ? 'text-mokogo-blue'
                          : step.number < currentStep
                          ? 'text-mokogo-blue'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.number}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        step.number === currentStep
                          ? 'text-mokogo-blue'
                          : step.number < currentStep
                          ? 'text-mokogo-blue'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Banner */}
          {currentListing && currentListing.status === 'draft' && currentStep > 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-800">
                  You're continuing a saved draft. Review your details and publish when ready.
                </p>
              </div>
            </div>
          )}

          {/* Content Card */}
          <div className="bg-white rounded-lg shadow-sm border border-mokogo-gray p-8">
            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-mokogo-gray">
              <button 
                onClick={handleBack} 
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
              
              {currentStep === 6 ? (
                <div className="flex flex-col items-end gap-2">
                  {!canProceed() && (
                    <span className="text-xs text-red-500">
                      Please complete all required fields to publish
                    </span>
                  )}
                  <button
                    onClick={() => {
                      console.log('Publish button clicked, canProceed:', canProceed(), 'listingData:', listingData)
                      if (!canProceed()) {
                        alert('Please complete all required fields before publishing. Check the console for details.')
                        return
                      }
                      handlePublish()
                    }}
                    disabled={!canProceed()}
                    className={`px-8 py-2.5 rounded-lg font-medium transition-colors ${
                      canProceed()
                        ? 'bg-mokogo-blue text-white hover:bg-blue-700'
                        : 'bg-mokogo-gray text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Publish listing
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  {currentStep === 5 && (!listingData.photos || listingData.photos.length < 3) && (
                    <span className="text-xs text-red-500">
                      Please upload at least 3 photos to continue ({listingData.photos?.length || 0}/3)
                    </span>
                  )}
                  <button
                    onClick={() => {
                      if (!canProceed()) {
                        if (currentStep === 5) {
                          alert(`Please upload at least 3 photos to continue. Currently you have ${listingData.photos?.length || 0} photo(s).`)
                        }
                        return
                      }
                      handleNext()
                    }}
                    disabled={!canProceed()}
                    className={`px-8 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      canProceed()
                        ? 'bg-mokogo-blue text-white hover:bg-blue-700'
                        : 'bg-mokogo-gray text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next: {steps[currentStep]?.label}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {showToast && (
        <Toast message="Draft saved" onClose={() => setShowToast(false)} />
      )}
    </div>
  )
}

export default ListingWizard