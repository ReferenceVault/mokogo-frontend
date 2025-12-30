import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, Home, Users, MessageSquare } from 'lucide-react'

const HowItWorks = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-mokogo-off-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-mokogo-primary/20 to-mokogo-primary/10 py-8 md:py-10">
          <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-400/20 mb-4">
              <Search className="w-6 h-6 text-orange-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              How Mokogo Works
            </h1>
            <p className="text-base text-gray-700 max-w-3xl mx-auto">
              Mokogo helps people connect to find the right place or flatmate, simply and transparently.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 py-8">
          {/* Section 1: For People Looking for a Place */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center">
                <Home className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Looking for a place?</h2>
            </div>

            <div className="space-y-4">
              {/* Step 1 - Circle Left, Content Right, Dark BG */}
              <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:bg-gray-700">
                <div className="grid md:grid-cols-2 gap-6 items-center p-6">
                  <div className="flex justify-center md:justify-start">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-xl">
                        <span className="text-3xl font-bold text-white">1</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-300 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-2">Share your preferences</h3>
                    <p className="text-gray-200 text-base leading-relaxed">
                      Tell us your city, budget, and move-in date. We'll help you find listings that match what you're looking for.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 - Content Left, Circle Right, White BG */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-orange-300">
                <div className="grid md:grid-cols-2 gap-6 items-center p-6">
                  <div className="order-2 md:order-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Browse matching listings</h3>
                    <p className="text-gray-700 text-base leading-relaxed">
                      Mokogo shows you listings that match or are close to your preferences. You can explore freely and see what's available.
                    </p>
                  </div>
                  <div className="flex justify-center md:justify-end order-1 md:order-2">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400/20 to-orange-400/10 border-4 border-orange-400 flex items-center justify-center shadow-lg">
                        <span className="text-3xl font-bold text-orange-400">2</span>
                      </div>
                      <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-orange-300 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 - Circle Left, Content Right, Dark BG */}
              <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:bg-gray-700">
                <div className="grid md:grid-cols-2 gap-6 items-center p-6">
                  <div className="flex justify-center md:justify-start">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-xl">
                        <span className="text-3xl font-bold text-white">3</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-300 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-2">Explore listings freely</h3>
                    <p className="text-gray-200 text-base leading-relaxed">
                      You can view listing details, photos, and information without creating an account. Take your time to find what feels right.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 - Content Left, Circle Right, White BG */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-orange-300">
                <div className="grid md:grid-cols-2 gap-6 items-center p-6">
                  <div className="order-2 md:order-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Contact when ready</h3>
                    <p className="text-gray-700 text-base leading-relaxed">
                      When you find a listing you're interested in, you'll need to sign up or log in to contact the lister. This helps keep the platform safe for everyone.
                    </p>
                  </div>
                  <div className="flex justify-center md:justify-end order-1 md:order-2">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400/20 to-orange-400/10 border-4 border-orange-400 flex items-center justify-center shadow-lg">
                        <span className="text-3xl font-bold text-orange-400">4</span>
                      </div>
                      <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-orange-300 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: For People Listing a Space */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Listing a space?</h2>
            </div>

            <div className="space-y-4">
              {/* Step 1 - Content Left, Circle Right, Dark BG */}
              <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:bg-gray-700">
                <div className="grid md:grid-cols-2 gap-6 items-center p-6">
                  <div className="text-white order-2 md:order-1">
                    <h3 className="text-xl font-bold mb-2">Sign up or log in</h3>
                    <p className="text-gray-200 text-base leading-relaxed">
                      Create an account or log in using email, phone, or Google Sign-In. The process is quick and straightforward.
                    </p>
                  </div>
                  <div className="flex justify-center md:justify-end order-1 md:order-2">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-xl">
                        <span className="text-3xl font-bold text-white">1</span>
                      </div>
                      <div className="absolute -top-1 -left-1 w-5 h-5 bg-orange-300 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 - Circle Left, Content Right, White BG */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-orange-300">
                <div className="grid md:grid-cols-2 gap-6 items-center p-6">
                  <div className="flex justify-center md:justify-start">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400/20 to-orange-400/10 border-4 border-orange-400 flex items-center justify-center shadow-lg">
                        <span className="text-3xl font-bold text-orange-400">2</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-300 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Create your listing</h3>
                    <p className="text-gray-700 text-base leading-relaxed mb-2">
                      Fill in details about your space: location, photos, rent, availability, and any preferences you have for potential flatmates.
                    </p>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                      <p className="text-sm text-orange-800">
                        Include clear photos and accurate information to help seekers find the right match.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 - Content Left, Circle Right, Dark BG */}
              <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:bg-gray-700">
                <div className="grid md:grid-cols-2 gap-6 items-center p-6">
                  <div className="text-white order-2 md:order-1">
                    <h3 className="text-xl font-bold mb-2">Your listing goes live</h3>
                    <p className="text-gray-200 text-base leading-relaxed">
                      Once you submit your listing, it becomes visible to people searching in your city. Your listing will appear in relevant searches based on the details you provided.
                    </p>
                  </div>
                  <div className="flex justify-center md:justify-end order-1 md:order-2">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-xl">
                        <span className="text-3xl font-bold text-white">3</span>
                      </div>
                      <div className="absolute -top-1 -left-1 w-5 h-5 bg-orange-300 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 - Circle Left, Content Right, White BG */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-orange-300">
                <div className="grid md:grid-cols-2 gap-6 items-center p-6">
                  <div className="flex justify-center md:justify-start">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400/20 to-orange-400/10 border-4 border-orange-400 flex items-center justify-center shadow-lg">
                        <span className="text-3xl font-bold text-orange-400">4</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-300 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Connect with interested seekers</h3>
                    <p className="text-gray-700 text-base leading-relaxed">
                      When someone is interested in your space, they'll reach out to you. You can then connect directly, share more details, and arrange visits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-3xl p-8 border-2 border-orange-400/20 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-400/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">A quick note</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Mokogo is a discovery and connection platform. We help people find each other, but final decisions, visits, and agreements happen directly between users. Take your time, meet in person when possible, and make choices that feel right for you.
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

export default HowItWorks
