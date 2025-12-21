import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Toast from '@/components/Toast'
import { useStore } from '@/store/useStore'
import { Listing } from '@/types'
import Step1Photos from './steps/Step1Photos'
import Step2Location from './steps/Step2Location'
import Step3Details from './steps/Step3Details'
import Step4Pricing from './steps/Step4Pricing'
import Step5Preferences from './steps/Step5Preferences'
import Step6Contact from './steps/Step6Contact'

const STEPS = [
  { 
    id: 'photos', 
    title: 'Photos', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    id: 'location', 
    title: 'Location', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  { 
    id: 'details', 
    title: 'Details', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    id: 'pricing', 
    title: 'Pricing', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    id: 'preferences', 
    title: 'Preferences', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  { 
    id: 'contact', 
    title: 'Contact', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    )
  },
]

const ListingWizard = () => {
  const navigate = useNavigate()
  const { currentListing, setCurrentListing, allListings, addListing, setAllListings, user } = useStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  const listingDataRef = useRef<Partial<Listing>>(
    currentListing && currentListing.status === 'draft'
      ? currentListing
      : {
          id: `listing-${Date.now()}`,
          title: '',
          city: '',
          locality: '',
          bhkType: '',
          roomType: '',
          rent: 0,
          deposit: 0,
          moveInDate: '',
          furnishingLevel: '',
          flatAmenities: [],
          societyAmenities: [],
          preferredGender: '',
          description: '',
          photos: [],
          contactPreference: '',
          contactNumber: '',
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
  )
  const [listingData, setListingData] = useState<Partial<Listing>>(listingDataRef.current)

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth/phone')
    }
  }, [user, navigate])

  // Determine starting step based on draft data
  useEffect(() => {
    if (currentListing && currentListing.status === 'draft') {
      let step = 0
      if (currentListing.photos && currentListing.photos.length >= 3) step = 1
      if (currentListing.city && currentListing.locality) step = 2
      if (currentListing.bhkType && currentListing.roomType && currentListing.furnishingLevel) step = 3
      if (currentListing.rent && currentListing.moveInDate) step = 4
      if (currentListing.preferredGender) step = 5
      setCurrentStep(step)
    }
  }, [])

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
      if (listingData.city || listingData.locality || listingData.rent || listingData.photos?.length) {
        saveDraft(true)
      }
    }, 1000) // Debounce autosave

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
      }
    }
  }, [listingData.city, listingData.locality, listingData.bhkType, listingData.roomType, listingData.rent, listingData.moveInDate, listingData.furnishingLevel, listingData.preferredGender, listingData.photos?.length])

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    switch (STEPS[currentStep].id) {
      case 'photos':
        if (!listingData.photos || listingData.photos.length < 3) {
          newErrors.photos = 'Please add at least 3 photos'
        }
        break
      case 'location':
        if (!listingData.city) newErrors.city = 'City is required'
        if (!listingData.locality) newErrors.locality = 'Locality is required'
        break
      case 'details':
        if (!listingData.bhkType) newErrors.bhkType = 'BHK type is required'
        if (!listingData.roomType) newErrors.roomType = 'Room type is required'
        if (!listingData.furnishingLevel) newErrors.furnishingLevel = 'Furnishing status is required'
        break
      case 'pricing':
        if (!listingData.rent) newErrors.rent = 'Rent is required'
        if (!listingData.deposit) newErrors.deposit = 'Deposit is required'
        if (!listingData.moveInDate) newErrors.moveInDate = 'Available date is required'
        break
      case 'preferences':
        if (!listingData.preferredGender) newErrors.preferredGender = 'Gender preference is required'
        break
      case 'contact':
        if (!listingData.contactPreference) newErrors.contactPreference = 'Contact preference is required'
        if (!listingData.contactNumber) newErrors.contactNumber = 'Contact number is required'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        handleCreateListing()
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const generateTitle = (): string => {
    const roomType = listingData.roomType === 'Private Room' ? 'Private Room' : listingData.roomType === 'Shared Room' ? 'Shared Room' : 'Room'
    const bhk = listingData.bhkType || ''
    const locality = listingData.locality || listingData.city || ''
    const rent = listingData.rent ? `₹${listingData.rent.toLocaleString()}` : ''
    const furnishing = listingData.furnishingLevel || ''
    
    return `${roomType} in ${bhk} · ${locality} · ${rent} · ${furnishing}`
  }

  const handleCreateListing = () => {
    // Generate title
    const title = generateTitle()
    
    const publishedListing: Listing = {
      ...listingData,
      title,
      status: 'live',
      updatedAt: new Date().toISOString(),
    } as Listing

    setCurrentListing(publishedListing)
    
    // Add to all listings if not already present
    const existingIndex = allListings.findIndex(l => l.id === publishedListing.id)
    if (existingIndex >= 0) {
      const updatedListings = [...allListings]
      updatedListings[existingIndex] = publishedListing
      setAllListings(updatedListings)
    } else {
      addListing(publishedListing)
    }
    
    navigate('/dashboard')
  }

  const handleDataChange = (updates: Partial<Listing>) => {
    setListingData((prev) => {
      const updated = { ...prev, ...updates }
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
    const stepError = errors[STEPS[currentStep].id] || Object.values(errors).find(e => e)
    
    switch (STEPS[currentStep].id) {
      case 'photos':
        return <Step1Photos data={listingData} onChange={handleDataChange} />
      case 'location':
        return <Step2Location data={listingData} onChange={handleDataChange} error={stepError} />
      case 'details':
        return <Step3Details data={listingData} onChange={handleDataChange} error={stepError} />
      case 'pricing':
        return <Step4Pricing data={listingData} onChange={handleDataChange} error={stepError} />
      case 'preferences':
        return <Step5Preferences data={listingData} onChange={handleDataChange} error={stepError} />
      case 'contact':
        return <Step6Contact data={listingData} onChange={handleDataChange} error={stepError} />
      default:
        return null
    }
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-mokogo-off-white flex flex-col">
      <Header />
      
      <main className="flex-1 w-full py-12" style={{ fontSize: '90%', background: 'linear-gradient(to right, rgba(255,255,255,0.05) 0%, rgba(249,250,251,0) 10%, rgba(247,168,107,0.1) 15%, rgba(247,168,107,0.15) 20%, rgba(247,168,107,0.2) 100%)' }}>
        <div className="max-w-4xl mx-auto px-24">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">List Your Room</h1>
            <p className="text-gray-600">Find your perfect flatmate in under 5 minutes</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between overflow-x-auto pb-4 mb-8">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      index < currentStep 
                        ? 'bg-orange-400 text-white' 
                        : index === currentStep 
                          ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' 
                          : 'bg-white text-gray-600 border-2 border-mokogo-gray'
                    }`}
                  >
                    {index < currentStep ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="text-current">
                        {step.icon}
                      </div>
                    )}
                  </div>
                  <span className={`text-xs mt-2 hidden md:block ${
                    index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div 
                    className={`w-12 h-0.5 mx-2 ${
                      index < currentStep ? 'bg-orange-400' : 'bg-mokogo-gray'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Resume Banner */}
          {currentListing && currentListing.status === 'draft' && currentStep > 0 && (
            <div className="bg-mokogo-info-bg border border-mokogo-info-border rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-mokogo-info-text mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-mokogo-info-text">
                  You're continuing a saved draft. Review your details and publish when ready.
                </p>
              </div>
            </div>
          )}

          {/* Content Card */}
          <div className="p-8">
            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between pt-8 mt-8 border-t border-mokogo-gray">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white/30 text-gray-700 border border-stone-200 hover:bg-white/50' 
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </div>
              </button>
              <button
                onClick={handleNext}
                className="btn-primary"
              >
                <div className="flex items-center gap-2">
                  {currentStep === STEPS.length - 1 ? 'Create Listing' : 'Continue'}
                  {currentStep < STEPS.length - 1 && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </button>
            </div>

            {/* Autosave indicator */}
            {lastSaved && (
              <div className="mt-4 text-xs text-gray-500 text-center">
                {formatLastSaved()}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      {showToast && <Toast message="Draft saved" onClose={() => setShowToast(false)} />}
    </div>
  )
}

export default ListingWizard
