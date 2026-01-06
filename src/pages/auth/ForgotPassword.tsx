import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Logo from '@/components/Logo'
import { authApi } from '@/services/api'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      await authApi.forgotPassword({ email: email.trim() })
      setSuccess(true)
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError('Too many requests. Please wait a minute and try again.')
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to send reset email. Please try again.'
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-mokogo-off-white min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg border border-mokogo-gray p-8">
            <div className="text-center mb-6">
              <Logo />
              <h2 className="text-2xl font-bold text-gray-900 mt-4">
                Forgot Password
              </h2>
              <p className="text-gray-600 mt-2">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {success ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Reset link sent!
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        If an account exists with this email, you'll receive a password reset link shortly.
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  to="/auth"
                  className="block text-center text-sm text-mokogo-primary hover:underline"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mokogo-primary'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={!email || isLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>

                <div className="text-center">
                  <Link
                    to="/auth"
                    className="text-sm text-mokogo-primary hover:underline"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ForgotPassword

