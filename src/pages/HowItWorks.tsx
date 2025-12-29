import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, Home, MessageSquare, CheckCircle, Shield, Users, FileText, MapPin, Camera, DollarSign, Calendar, Heart } from 'lucide-react'

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-mokogo-off-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-mokogo-primary/20 to-mokogo-primary/10 py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-400/20 mb-6">
              <Search className="w-8 h-8 text-orange-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              MokoGo makes finding your perfect room or flatmate simple, safe, and broker-free. Here's how our platform works for both seekers and listers.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 py-12">
          {/* For Room Seekers */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                <Home className="w-6 h-6 text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">For Room Seekers</h2>
            </div>

            <div className="space-y-6">
              {/* Step 1: Search */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-orange-400">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Search & Filter</h3>
                    <p className="text-gray-700 mb-4">
                      Browse through thousands of verified listings across India. Use our smart filters to find rooms by city, area, rent range, move-in date, and more.
                    </p>
                    <div className="bg-mokogo-info-bg border border-mokogo-info-border rounded-lg p-4">
                      <p className="text-sm font-medium text-mokogo-info-text mb-2">You can filter by:</p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span>City and locality</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span>Budget (max rent)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span>Move-in date</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span>Room type, amenities, and preferences</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: View Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-orange-400">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">View Property Details</h3>
                    <p className="text-gray-700">
                      Click on any listing to see comprehensive details including photos, location, amenities, house rules, and contact information. All listings are verified for authenticity.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Connect */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-orange-400">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Directly</h3>
                    <p className="text-gray-700 mb-4">
                      Reach out directly to the lister through our secure messaging system. No brokers, no middlemen—just direct communication with property owners.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        <strong>Zero Brokerage:</strong> All connections are free. You only pay rent and deposit directly to the owner.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Visit & Decide */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-orange-400">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit & Make Your Decision</h3>
                    <p className="text-gray-700">
                      Schedule a visit, meet the flatmates, and make an informed decision. Take your time—there's no pressure to commit immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* For Listers */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">For Listers</h2>
            </div>

            <div className="space-y-6">
              {/* Step 1: Create Account */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-orange-400">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Your Account</h3>
                    <p className="text-gray-700 mb-4">
                      Sign up with your phone number and email. Our verification process ensures a safe community for everyone.
                    </p>
                    <div className="bg-mokogo-info-bg border border-mokogo-info-border rounded-lg p-4">
                      <p className="text-sm font-medium text-mokogo-info-text mb-2">Quick & Easy:</p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span>Phone OTP verification</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span>Email confirmation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span>Get started in under 2 minutes</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: List Your Space */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-orange-400">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">List Your Space</h3>
                    <p className="text-gray-700 mb-4">
                      Use our simple listing wizard to create your listing. Add photos, location details, pricing, amenities, and preferences.
                    </p>
                    <div className="bg-mokogo-info-bg border border-mokogo-info-border rounded-lg p-4">
                      <p className="text-sm font-medium text-mokogo-info-text mb-2">What you'll add:</p>
                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-orange-400 flex-shrink-0" />
                          <span>Photos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                          <span>Location</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-orange-400 flex-shrink-0" />
                          <span>Pricing</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                          <span>Amenities</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-400 flex-shrink-0" />
                          <span>Availability</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-orange-400 flex-shrink-0" />
                          <span>Preferences</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Get Verified */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-orange-400">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Verified & Go Live</h3>
                    <p className="text-gray-700 mb-4">
                      Once you submit your listing, our team reviews it for authenticity. Verified listings get a badge and appear in search results.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        <strong>Free Listing:</strong> Create and publish your listing at no cost. Only pay when you want premium features.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Manage Requests */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-orange-400">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Requests & Connect</h3>
                    <p className="text-gray-700">
                      Receive requests from interested seekers, review their profiles, and connect directly. You control who sees your contact information and when.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Why Choose MokoGo?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Listings</h3>
                <p className="text-gray-700">
                  All properties go through our verification process to ensure authenticity and safety.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Communication</h3>
                <p className="text-gray-700">
                  Connect directly with owners or seekers—no brokers, no middlemen, no hidden fees.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center mb-4">
                  <DollarSign className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Zero Brokerage</h3>
                <p className="text-gray-700">
                  Free for seekers. Free listing for owners. Only pay for premium features if you choose.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Community</h3>
                <p className="text-gray-700">
                  Join thousands of verified users across India finding their perfect room or flatmate.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-2xl p-8 text-center border border-orange-400/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-700 mb-6">
              Join MokoGo today and experience the easiest way to find or list a space in India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/explore"
                className="bg-orange-400 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-500 transition-colors shadow-md"
              >
                Find a Room
              </a>
              <a
                href="/auth"
                className="bg-white text-orange-400 px-6 py-3 rounded-full font-medium hover:bg-orange-50 transition-colors border-2 border-orange-400 shadow-md"
              >
                List Your Space
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HowItWorks

