import { Link } from 'react-router-dom'
import Logo from '@/components/Logo'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-mokogo-off-white">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center">
        <Logo />
        <Link to="/auth/phone" className="text-mokogo-blue font-medium hover:underline">
          Log in
        </Link>
      </header>

      {/* Hero Content */}
      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          List your room or flat without brokers.
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Find trustworthy flatmates and keep your number private.
        </p>
        
        <Link
          to="/auth/phone"
          className="btn-primary inline-block text-lg px-8 py-3"
        >
          List your place
        </Link>

        {/* Supporting bullets */}
        <div className="mt-12 space-y-4 text-left max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-mokogo-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-mokogo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-700">No broker fees or hidden charges</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-mokogo-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-mokogo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-gray-700">Your contact details stay private until you accept</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-mokogo-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-mokogo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-700">Verified seekers and secure messaging</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage
