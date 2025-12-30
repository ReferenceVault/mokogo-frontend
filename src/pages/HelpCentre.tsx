import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { HelpCircle, Users, Home, Shield, Lock, DollarSign, Mail, CheckCircle, FileText, MessageSquare } from 'lucide-react'

const HelpCentre = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-mokogo-off-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-mokogo-primary/20 to-mokogo-primary/10 py-6 md:py-8">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-400/20 mb-3">
              <HelpCircle className="w-4 h-4 text-orange-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Welcome to Mokogo's Help Centre 👋
            </h1>
            <p className="text-sm text-gray-700 max-w-3xl mx-auto">
              We're here to make finding or listing a place as smooth as possible.
            </p>
            <p className="text-xs text-gray-600 mt-1.5">
              Below you'll find answers to common questions, along with guidance on how to get help if you're stuck.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 py-6">
          {/* Getting Started */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Getting Started</h2>
            </div>

            <div className="space-y-3">
              {/* What is Mokogo? */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">What is Mokogo?</h3>
                <p className="text-sm text-gray-700">
                  Mokogo is a platform that helps people list rooms and find flatmates or shared spaces. We help users discover and connect — decisions and agreements happen directly between users.
                </p>
              </div>

              {/* Who can use Mokogo? */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Who can use Mokogo?</h3>
                <p className="text-sm text-gray-700 mb-2">Anyone aged 18 or above can use Mokogo to:</p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Look for a room or shared space</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>List a room they want to rent out</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Connect directly with potential flatmates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* For People Looking for a Room */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Home className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">For People Looking for a Room</h2>
            </div>

            <div className="space-y-4">
              {/* How do I search for a room? */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">How do I search for a room?</h3>
                <p className="text-sm text-gray-700">
                  Click "Find Your Place", tell us a few basics like your city, budget, and move-in date, and we'll show you the most relevant listings available.
                </p>
              </div>

              {/* Why am I not seeing any listings? */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Why am I not seeing any listings?</h3>
                <p className="text-sm text-gray-700 mb-2">
                  Sometimes we don't have listings that match all your preferences exactly.
                </p>
                <p className="text-gray-700 font-medium mb-2">You can:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Adjust your budget or move-in date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Try nearby locations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Check back later — new listings are added regularly</span>
                  </li>
                </ul>
              </div>

              {/* Do I need an account to browse listings? */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Do I need an account to browse listings?</h3>
                <p className="text-gray-700 mb-2">
                  You can explore listings without signing up.
                </p>
                <p className="text-sm text-gray-700">
                  You'll be asked to create an account only when you want to contact a lister.
                </p>
              </div>

              {/* Is it safe to contact listers? */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Is it safe to contact listers?</h3>
                <p className="text-sm text-gray-700 mb-2">We encourage users to:</p>
                <ul className="space-y-2 text-gray-700 mb-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Meet in person before committing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Avoid paying anything before visiting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Trust their instincts</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-700">
                  You can read more on our{' '}
                  <a href="/safety-tips" className="text-orange-400 hover:text-orange-500 underline font-medium">
                    Safety Tips page
                  </a>.
                </p>
              </div>
            </div>
          </div>

          {/* For People Listing a Room */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">For People Listing a Room</h2>
            </div>

            <div className="space-y-4">
              {/* How do I list my space? */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">How do I list my space?</h3>
                <p className="text-sm text-gray-700">
                  Click "List Your Space", sign up or log in, and fill in the listing details. The process is simple and should take just a few minutes.
                </p>
              </div>

              {/* Can I edit or remove my listing? */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Can I edit or remove my listing?</h3>
                <p className="text-sm text-gray-700">
                  Yes. You can edit or remove your listing anytime after logging in.
                </p>
              </div>

              {/* Who will be able to see my listing? */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Who will be able to see my listing?</h3>
                <p className="text-sm text-gray-700">
                  Your listing will be visible to users searching in the relevant city and criteria. Only share personal contact details when you're comfortable.
                </p>
              </div>
            </div>
          </div>

          {/* Accounts & Login */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Accounts & Login</h2>
            </div>

            <div className="space-y-4">
              {/* How can I sign up or log in? */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">How can I sign up or log in?</h3>
                <p className="text-sm text-gray-700 mb-2">You can sign up or log in using:</p>
                <ul className="space-y-2 text-gray-700 mb-3">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Email and password</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Email login link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Phone number (OTP)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Google Sign-In</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-700">
                  Choose whatever feels easiest for you.
                </p>
              </div>

              {/* I'm not receiving OTP or login emails */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">I'm not receiving OTP or login emails</h3>
                <p className="text-sm text-gray-700 mb-2">Please check:</p>
                <ul className="space-y-2 text-gray-700 mb-3">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Your spam or promotions folder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>That your email address or phone number is correct</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-700">
                  If the issue continues, reach out to us.
                </p>
              </div>
            </div>
          </div>

          {/* Safety & Verification */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Safety & Verification</h2>
            </div>

            <div className="space-y-4">
              {/* Are users verified? */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Are users verified?</h3>
                <p className="text-sm text-gray-700 mb-2">
                  We use basic verification methods like phone or email verification to reduce misuse. However, we don't conduct background checks or property verification.
                </p>
                <p className="text-gray-700 font-medium">
                  Always meet, verify, and decide independently.
                </p>
              </div>

              {/* I came across something suspicious. What should I do? */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">I came across something suspicious. What should I do?</h3>
                <p className="text-sm text-gray-700 mb-2">If you notice:</p>
                <ul className="space-y-2 text-gray-700 mb-3">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>A misleading listing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Spam or suspicious behaviour</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Someone making you uncomfortable</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-700">
                  Please contact us so we can review it.
                </p>
              </div>
            </div>
          </div>

          {/* Payments & Agreements */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Payments & Agreements</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Does Mokogo handle payments?</h3>
              <p className="text-gray-700 mb-3">
                No. Mokogo does not collect rent, deposits, or booking fees.
              </p>
              <p className="text-gray-700">
                All payments and agreements are handled directly between users. Please be cautious and avoid paying before visiting a property.
              </p>
            </div>
          </div>

          {/* Need More Help? */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Need More Help?</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-5">
              <p className="text-gray-700 mb-4">
                If you didn't find what you were looking for, we're happy to help.
              </p>
              <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-lg p-4 border border-orange-400/20 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-orange-400" />
                  <span className="text-lg font-semibold text-gray-900">Email us at:</span>
                </div>
                <a 
                  href="mailto:hello@mokogo.in" 
                  className="text-lg font-semibold text-orange-400 hover:text-orange-500 transition-colors ml-8"
                >
                  hello@mokogo.in
                </a>
              </div>
              <p className="text-gray-700 font-medium mb-2">Tell us:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>What you were trying to do</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>What went wrong</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Any screenshots (if applicable)</span>
                </li>
              </ul>
              <p className="text-gray-700 mt-3">
                We'll get back to you as soon as possible.
              </p>
            </div>
          </div>

          {/* One last thing */}
          <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-2xl p-6 border border-orange-400/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-400/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">One last thing</h3>
                <p className="text-gray-700 leading-relaxed">
                  Mokogo is still growing, and your feedback really helps. If something feels confusing or broken, let us know — we're listening.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HelpCentre

