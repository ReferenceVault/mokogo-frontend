import { useRef } from 'react'
import {
  Image,
  Home,
  Users,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Cigarette,
  Wine,
  Utensils,
  X,
  Clock,
  Copy,
  Heart,
  Calendar,
  Briefcase,
} from 'lucide-react'
import { Listing } from '@/types'
import Step2Location from '@/pages/listing/steps/Step2Location'
import Step3Details from '@/pages/listing/steps/Step3Details'
import Step4Pricing from '@/pages/listing/steps/Step4Pricing'
import Step5Preferences from '@/pages/listing/steps/Step5Preferences'
import { sanitizeIndianMobileInput, INDIAN_MOBILE_HINT } from '@/utils/listerProfile'
import { generateListingTitle } from '@/utils/listingTitle'

const SECTIONS = [
  { id: 'photos', title: 'Photos', icon: Image },
  { id: 'property', title: 'Property Details', icon: Home },
  { id: 'lister', title: 'Lister Profile', icon: Users },
] as const

const ABOUT_TEMPLATES: { id: string; title: string; icon: typeof Briefcase; content: string }[] = [
  {
    id: 'professional',
    title: 'Professional Background',
    icon: Briefcase,
    content:
      "I'm a software engineer working at TCS with 5 years of experience in the tech industry. I'm a clean, responsible person with excellent references. I don't smoke, rarely have guests, and prefer a quiet environment for work. I maintain a regular work schedule and value cleanliness and organization in shared spaces.",
  },
  {
    id: 'lifestyle',
    title: 'Clean & Quiet Lifestyle',
    icon: Calendar,
    content:
      "I'm a marketing professional who values cleanliness and a peaceful environment. I have flexible work hours and am very respectful of shared spaces. I maintain a clean, quiet lifestyle and prefer organized living. I'm looking for a roommate who shares similar values of respect and cleanliness.",
  },
  {
    id: 'tech-worker',
    title: 'Tech Professional',
    icon: Briefcase,
    content:
      "I work in the tech industry and maintain a clean, quiet lifestyle. I'm organized, responsible, and prefer a peaceful living environment. I respect shared spaces and believe in open communication with roommates. I enjoy a balanced lifestyle with time for both work and personal interests.",
  },
  {
    id: 'creative',
    title: 'Creative Professional',
    icon: Heart,
    content:
      "I'm a UI/UX designer who loves creativity and tidy living spaces. I'm respectful, enjoy cooking, and maintain a clean environment. I value friendly interactions and mutual respect with roommates. I prefer a calm, organized home where I can focus on my work and hobbies.",
  },
  {
    id: 'working-professional',
    title: 'Working Professional',
    icon: Clock,
    content:
      "I'm a working professional with a steady income and reliable employment. I'm ready to move in and can provide all necessary documents. I maintain a professional lifestyle, respect house rules, and value cleanliness. I'm looking for a comfortable living space with a responsible roommate.",
  },
  {
    id: 'founder',
    title: 'Founder & Entrepreneur',
    icon: Briefcase,
    content:
      "I'm a founder building exciting projects and value focus, discipline, and a positive environment. My schedule can be busy, but I'm respectful of shared spaces and maintain a clean, organized lifestyle. I appreciate open communication and living with driven, like-minded individuals who value ambition and balance.",
  },
]

export type PreviewDraftFormData = Record<string, string | number | boolean | string[] | undefined>

export interface PreviewDraftEditFormProps {
  formData: PreviewDraftFormData
  listingFormData: Partial<Listing>
  expandedSections: Set<number>
  onToggleSection: (index: number) => void
  onFieldChange: (field: string, value: string | number | boolean | string[] | undefined) => void
  onListingFieldsChange: (updates: Partial<Listing>) => void
  photoUploading: boolean
  listerPhotoUploading: boolean
  onPhotoUpload: (files: FileList | null) => void
  onRemovePhoto: (index: number) => void
  onListerPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  listerPhoneInvalid: boolean
  showAboutTemplates: boolean
  onShowAboutTemplates: (open: boolean) => void
  onSectionContinue: (index: number) => void
  savingOrPublishing?: boolean
}

export function PreviewDraftEditForm({
  formData,
  listingFormData,
  expandedSections,
  onToggleSection,
  onFieldChange,
  onListingFieldsChange,
  photoUploading,
  listerPhotoUploading,
  onPhotoUpload,
  onRemovePhoto,
  onListerPhotoUpload,
  listerPhoneInvalid,
  showAboutTemplates,
  onShowAboutTemplates,
  onSectionContinue,
  savingOrPublishing = false,
}: PreviewDraftEditFormProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  const rentNum = formData.rent ? Number(formData.rent) : undefined
  const autoTitle = generateListingTitle({
    roomType: (formData.roomType as string) || '',
    bhkType: (formData.bhkType as string) || '',
    locality: (formData.locality as string) || '',
    city: (formData.city as string) || '',
    rent: rentNum,
    furnishingLevel: (formData.furnishingLevel as string) || '',
  })

  return (
    <>
      <div className="space-y-2">
        {SECTIONS.map((section, index) => {
          const isExpanded = expandedSections.has(index)
          const Icon = section.icon
          return (
            <div
              key={section.id}
              id={`section-${index}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => onToggleSection(index)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{section.title}</h3>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-4">
                  {section.id === 'photos' && (
                    <>
                      <p className="text-sm text-gray-600 mb-2">Add photos of the property. Optional but recommended.</p>
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 hover:bg-orange-50/30 transition-colors cursor-pointer"
                        onClick={() => document.getElementById('preview-draft-photos')?.click()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            document.getElementById('preview-draft-photos')?.click()
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <input
                          id="preview-draft-photos"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            onPhotoUpload(e.target.files)
                            e.target.value = ''
                          }}
                        />
                        <div className="space-y-2">
                          <div className="w-10 h-10 mx-auto rounded-full bg-orange-100 flex items-center justify-center">
                            <Image className="w-5 h-5 text-orange-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-700">Click to upload photos</p>
                          <p className="text-xs text-gray-500">JPEG, PNG, WebP. Max 5MB each.</p>
                          <button
                            type="button"
                            disabled={photoUploading}
                            className="text-sm px-3 py-1.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
                          >
                            {photoUploading ? 'Uploading...' : 'Choose Photos'}
                          </button>
                        </div>
                      </div>
                      {((formData.photos as string[]) || []).length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Uploaded Photos ({(formData.photos as string[]).length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(formData.photos as string[]).map((url, i) => (
                              <div key={i} className="relative group">
                                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                  <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onRemovePhoto(i)
                                  }}
                                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {section.id === 'property' && (
                    <>
                      <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 space-y-1">
                        <p>
                          <span className="font-medium text-stone-800">Listing title</span> (below) is generated automatically — same
                          as List Your Place.
                        </p>
                        <p className="text-stone-600">Location → Details → Pricing → Preferences.</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Listing title</label>
                        <input
                          type="text"
                          value={autoTitle}
                          disabled
                          readOnly
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                        />
                      </div>
                      <p className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Location</p>
                      <div className="border border-gray-200 rounded-lg p-3 bg-white">
                        <Step2Location
                          data={listingFormData}
                          onChange={onListingFieldsChange}
                          hideTitle
                          showSocietyField={false}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Society / Building Name</label>
                        <input
                          type="text"
                          value={(formData.societyName as string) || ''}
                          onChange={(e) => onFieldChange('societyName', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          placeholder="Optional"
                        />
                      </div>
                      <p className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Details</p>
                      <div className="border border-gray-200 rounded-lg p-3 bg-white overflow-x-hidden">
                        <Step3Details data={listingFormData} onChange={onListingFieldsChange} hideHeader />
                      </div>
                      <p className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Pricing</p>
                      <div className="border border-gray-200 rounded-lg p-3 bg-white overflow-x-hidden">
                        <Step4Pricing data={listingFormData} onChange={onListingFieldsChange} hideHeader />
                      </div>
                      <p className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Preferences</p>
                      <div className="border border-gray-200 rounded-lg p-3 bg-white overflow-x-hidden">
                        <Step5Preferences data={listingFormData} onChange={onListingFieldsChange} hideHeader />
                      </div>
                    </>
                  )}

                  {section.id === 'lister' && (
                    <>
                      <p className="text-xs text-gray-500 -mt-1 mb-3">
                        Same fields as your MOKOGO profile. Name is stored as first + last. Photo and &quot;About you&quot; show on
                        your listing preview.
                      </p>
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <input
                              id="preview-lister-photo"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={onListerPhotoUpload}
                              disabled={listerPhotoUploading}
                            />
                            <label
                              htmlFor="preview-lister-photo"
                              className={`w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-lg font-semibold cursor-pointer hover:opacity-90 transition-opacity overflow-hidden ${
                                listerPhotoUploading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {(formData.conciergeListerProfileImageUrl as string) ? (
                                <img
                                  src={formData.conciergeListerProfileImageUrl as string}
                                  alt="You"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                ((formData.conciergeListerFirstName as string) || 'Y').charAt(0).toUpperCase()
                              )}
                            </label>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Click to upload</p>
                            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or GIF. Max 2MB</p>
                            {listerPhotoUploading && <p className="text-xs text-orange-500 mt-1">Uploading…</p>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-orange-500" />
                        <p className="text-sm font-semibold text-gray-900">Basic Information</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 space-y-4 mb-6 bg-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                              type="text"
                              value={(formData.conciergeListerFirstName as string) || ''}
                              onChange={(e) => onFieldChange('conciergeListerFirstName', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              autoComplete="given-name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                              type="text"
                              value={(formData.conciergeListerLastName as string) || ''}
                              onChange={(e) => onFieldChange('conciergeListerLastName', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              autoComplete="family-name"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            Email
                          </label>
                          <input
                            type="email"
                            value={(formData.conciergeListerEmail as string) || ''}
                            onChange={(e) => onFieldChange('conciergeListerEmail', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            placeholder="you@example.com"
                          />
                          <p className="text-xs text-gray-500 mt-1">Required to publish — we&apos;ll use it for your account.</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            inputMode="numeric"
                            value={(formData.conciergeListerPhone as string) || ''}
                            onChange={(e) =>
                              onFieldChange('conciergeListerPhone', sanitizeIndianMobileInput(e.target.value))
                            }
                            className={`w-full border rounded-lg px-3 py-2 text-sm ${
                              listerPhoneInvalid ? 'border-red-500' : 'border-gray-300'
                            }`}
                            maxLength={10}
                          />
                          {listerPhoneInvalid && <p className="mt-1 text-xs text-red-600">{INDIAN_MOBILE_HINT}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            Gender
                          </label>
                          <select
                            value={(formData.conciergeListerGender as string) || ''}
                            onChange={(e) => onFieldChange('conciergeListerGender', e.target.value)}
                            className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-4 h-4 text-orange-500" />
                        <p className="text-sm font-semibold text-gray-900">Professional Information</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 space-y-4 mb-6 bg-white">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Occupation / Role</label>
                          <input
                            type="text"
                            value={(formData.conciergeListerOccupation as string) || ''}
                            onChange={(e) => onFieldChange('conciergeListerOccupation', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Building className="w-3.5 h-3.5 text-gray-400" />
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={(formData.conciergeListerCompanyName as string) || ''}
                            onChange={(e) => onFieldChange('conciergeListerCompanyName', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-orange-500" />
                        <p className="text-sm font-semibold text-gray-900">About You</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-white">
                        <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1.5">
                          <span>About You</span>
                          <button
                            type="button"
                            onClick={() => onShowAboutTemplates(true)}
                            className="text-xs text-orange-500 hover:text-orange-600 hover:underline font-normal"
                          >
                            Choose from pre-written templates
                          </button>
                        </label>
                        <textarea
                          value={(formData.conciergeListerAbout as string) || ''}
                          onChange={(e) => onFieldChange('conciergeListerAbout', e.target.value)}
                          rows={5}
                          maxLength={500}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1 text-right">
                          {String((formData.conciergeListerAbout as string) || '').length}/500
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-orange-500" />
                        <p className="text-sm font-semibold text-gray-900">Lifestyle Preferences</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-white">
                        <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg">
                          <p className="text-xs text-blue-800">
                            Private — used to recommend compatible homes and flatmates.
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Cigarette className="w-3.5 h-3.5 text-gray-400" />
                            Smoking
                          </label>
                          <select
                            value={(formData.conciergeListerSmoking as string) || ''}
                            onChange={(e) => onFieldChange('conciergeListerSmoking', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          >
                            <option value="">Select preference</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="Occasionally">Occasionally</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Wine className="w-3.5 h-3.5 text-gray-400" />
                            Drinking
                          </label>
                          <select
                            value={(formData.conciergeListerDrinking as string) || ''}
                            onChange={(e) => onFieldChange('conciergeListerDrinking', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          >
                            <option value="">Select preference</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="Occasionally">Occasionally</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Utensils className="w-3.5 h-3.5 text-gray-400" />
                            Food Preference
                          </label>
                          <select
                            value={(formData.conciergeListerFoodPreference as string) || ''}
                            onChange={(e) => onFieldChange('conciergeListerFoodPreference', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          >
                            <option value="">Select preference</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Non-vegetarian">Non-vegetarian</option>
                            <option value="Eggetarian">Eggetarian</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {index < SECTIONS.length - 1 && (
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => onSectionContinue(index)}
                        disabled={savingOrPublishing}
                        className="w-full sm:w-auto text-sm px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        Continue
                        {!savingOrPublishing && (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {showAboutTemplates && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
          onClick={() => onShowAboutTemplates(false)}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">About You Templates</h3>
                <p className="text-sm text-gray-600 mt-1">Tap a template to insert — same as your profile</p>
              </div>
              <button
                type="button"
                onClick={() => onShowAboutTemplates(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ABOUT_TEMPLATES.map((template) => {
                  const IconComponent = template.icon
                  return (
                    <div
                      key={template.id}
                      className="bg-white border border-gray-200 rounded-lg p-5 hover:border-orange-400 hover:shadow-md transition-all relative group"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{template.title}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(template.content)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-orange-600"
                          title="Copy"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3">{template.content}</p>
                      <button
                        type="button"
                        onClick={() => {
                          onFieldChange('conciergeListerAbout', template.content)
                          onShowAboutTemplates(false)
                        }}
                        className="text-sm font-medium text-orange-600 hover:text-orange-700"
                      >
                        Use This Template →
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
