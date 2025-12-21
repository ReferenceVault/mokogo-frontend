import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const AuthPhone = () => {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 5) return cleaned
    if (cleaned.length <= 10) {
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
    }
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 10)}`
  }

  const validatePhone = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, '')
    return cleaned.length === 10
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Store phone in sessionStorage for OTP screen
    const cleanedPhone = phone.replace(/\D/g, '')
    sessionStorage.setItem('auth-phone', cleanedPhone)
    navigate('/auth/otp')
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhone(value)
    setError('')
  }

  const displayPhone = formatPhoneNumber(phone)

  return (
    <div className="bg-mokogo-off-white min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section - Two Column Layout */}
      <main className="flex-1 flex items-center py-12 px-16" style={{ fontSize: '90%' }}>
        <div className="max-w-7xl mx-auto w-full px-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            
            {/* Left Section - Informational Panel */}
            <div className="space-y-8">
              {/* Secure Authentication Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-mokogo-info-bg border border-mokogo-info-border rounded-full">
                <svg className="w-4 h-4 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium text-mokogo-primary">Secure Authentication</span>
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Welcome to MOKOGO
                </h1>
                <p className="text-lg text-gray-600">
                  Create your account in seconds and start listing your property to thousands of verified flatmate seekers.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-mokogo-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Quick Setup</h3>
                    <p className="text-gray-600 text-sm">Get verified in under 2 minutes with phone OTP authentication</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-mokogo-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Bank-Level Security</h3>
                    <p className="text-gray-600 text-sm">Your phone number is encrypted and never shared publicly</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-mokogo-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Trusted Community</h3>
                    <p className="text-gray-600 text-sm">Join 50,000+ verified users on India's safest flatmate platform</p>
                  </div>
                </div>
              </div>

              {/* Testimonial Card */}
              <div className="bg-white border border-mokogo-gray rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-lg">PS</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">Priya Sharma</h4>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      "Found my perfect flatmate in 5 days! The verification process made me feel completely safe."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Phone Number Form Card */}
            <div>
              <div className="w-full">
                <div className="bg-white rounded-xl shadow-lg border border-mokogo-gray p-8">
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-mokogo-primary flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>

                  {/* Heading */}
                  <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Enter your phone number
                  </h2>
                  <p className="text-gray-600 text-center text-sm mb-6">
                    We'll send you a verification code to get started
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <select
                              className="input-field w-24 appearance-none pr-8 bg-gray-50 cursor-pointer"
                              defaultValue="+91"
                            >
                              <option value="+91">IN +91</option>
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <input
                            id="phone"
                            type="tel"
                            value={displayPhone}
                            onChange={handlePhoneChange}
                            className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mokogo-primary'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            placeholder="98XXXXXXXX"
                            maxLength={12}
                            disabled={isLoading}
                            autoFocus
                          />
                        </div>
                      </div>
                      
                      {error && (
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                      )}
                    </div>

                    {/* Privacy Note */}
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-mokogo-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>We use your phone to keep your account secure. No spam calls, ever.</span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={phone.length !== 10 || isLoading}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Sending OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Get OTP</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Login Link */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <Link to="/auth/phone" className="text-mokogo-primary hover:underline font-medium">
                        Log in
                      </Link>
                    </p>
                  </div>

                  {/* Security Badges */}
                  <div className="mt-6 flex justify-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-xs text-gray-600">Secure</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-xs text-gray-600">Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-xs text-gray-600">Private</span>
                    </div>
                  </div>

                  {/* SSL Encryption Note */}
                  <div className="mt-6 pt-6 border-t border-mokogo-gray flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs text-gray-600">Your information is protected with 256-bit SSL encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Statistics Section */}
      <section className="bg-white py-16 px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600 text-sm md:text-base">Verified Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">15K+</div>
              <div className="text-gray-600 text-sm md:text-base">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-1">
                4.8
                <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </div>
              <div className="text-gray-600 text-sm md:text-base">User Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">₹2Cr+</div>
              <div className="text-gray-600 text-sm md:text-base">Brokerage Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Verify Section */}
      <section className="bg-mokogo-off-white py-16 px-24">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why verify with MOKOGO?
            </h2>
            <p className="text-lg text-gray-600">
              Your safety and privacy come first
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Verified Community */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-mokogo-gray">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Community</h3>
              <p className="text-gray-600 text-sm">
                All users are verified with phone OTP and government ID for maximum safety
              </p>
            </div>

            {/* Card 2: Number Privacy */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-mokogo-gray">
              <div className="w-12 h-12 rounded-lg bg-mokogo-primary/10 flex items-center justify-center mb-4 relative">
                <svg className="w-6 h-6 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <svg className="w-5 h-5 text-mokogo-primary absolute top-1 right-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: 'rotate(45deg)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Number Privacy</h3>
              <p className="text-gray-600 text-sm">
                Your phone number stays private and is never shared with other users
              </p>
            </div>

            {/* Card 3: Data Protection */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-mokogo-gray">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Protection</h3>
              <p className="text-gray-600 text-sm">
                Bank-level encryption ensures your personal information stays secure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-mokogo-off-white py-16 px-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              What our users say
            </h2>
            <p className="text-lg text-gray-600">
              Trusted by thousands of property owners
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-mokogo-gray">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "The verification process was so quick and easy! I felt safe knowing everyone on the platform is verified. Found my flatmate in just 3 days."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">RV</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Rahul Verma</div>
                  <div className="text-sm text-gray-600">Bangalore</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-mokogo-gray">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Love that my phone number stays private! The OTP verification gave me confidence that I'm dealing with real, verified people."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">AD</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Anjali Desai</div>
                  <div className="text-sm text-gray-600">Pune</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 px-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Common questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything about phone verification
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <h3 className="font-semibold text-gray-900 mb-2">
                Why do I need to verify my phone number?
              </h3>
              <p className="text-gray-600 text-sm">
                Phone verification ensures all users are real people, creating a safe and trusted community. It also helps us prevent spam and protect your account.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <h3 className="font-semibold text-gray-900 mb-2">
                Will my phone number be shared publicly?
              </h3>
              <p className="text-gray-600 text-sm">
                Never! Your phone number is kept completely private and encrypted. Other users cannot see it. All communication happens through secure in-app messaging.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <h3 className="font-semibold text-gray-900 mb-2">
                What if I don't receive the OTP?
              </h3>
              <p className="text-gray-600 text-sm">
                You can request a new OTP after 90 seconds. If you still don't receive it, check your phone's SMS settings or try again after a few minutes. Contact support if the issue persists.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is my data secure?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes! We use bank-level 256-bit SSL encryption to protect your information. Your data is stored on secure servers and never shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AuthPhone