import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FileText, Users, Shield, Lock, AlertCircle, DollarSign, Eye, Key, Ban, Scale, Mail, CheckCircle, Globe, Heart } from 'lucide-react'

const TermsOfService = () => {
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
              <FileText className="w-5 h-5 text-orange-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Terms of Service
            </h1>
            <p className="text-sm text-gray-700 max-w-3xl mx-auto mb-1">
              Welcome to Mokogo. These Terms of Service ("Terms") govern your access to and use of the Mokogo website, app, and related services ("Platform").
            </p>
            <p className="text-sm text-gray-600">
              Last updated: 28th December, 2025
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 py-6">
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 mb-5 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
            <p className="text-gray-700 leading-relaxed mb-3">
              By accessing or using Mokogo, you agree to be bound by these Terms.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm font-medium">
                If you do not agree to these Terms, please do not use the Platform.
              </p>
            </div>
          </div>

          {/* Section 1: About Mokogo */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">1. About Mokogo</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-2">
                Mokogo is a platform that helps people list and discover rooms, shared spaces, and flatmates. Mokogo acts only as a discovery and connection platform.
              </p>
              <p className="text-sm text-gray-700 font-medium mb-2">Mokogo:</p>
              <ul className="space-y-1.5 text-sm text-gray-700 mb-2">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Is not a broker, agent, or property manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Does not own, manage, or inspect properties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Does not participate in payments or agreements</span>
                </li>
              </ul>
              <p className="text-sm text-gray-700 font-medium">
                All interactions, decisions, and arrangements are made directly between users.
              </p>
            </div>
          </div>

          {/* Section 2: Eligibility */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">2. Eligibility</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-2">To use Mokogo, you must:</p>
              <ul className="space-y-1.5 text-sm text-gray-700 mb-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Be at least 18 years old</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Be legally capable of entering into agreements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Provide accurate and truthful information</span>
                </li>
              </ul>
              <p className="text-sm text-gray-700">
                By using the Platform, you confirm that you meet these requirements.
              </p>
            </div>
          </div>

          {/* Section 3: Account Registration & Login Methods */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">3. Account Registration & Login Methods</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 mb-3 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-2">To access certain features, you must create an account. Mokogo supports multiple authentication methods, including:</p>
              <ul className="space-y-1.5 text-sm text-gray-700 mb-2">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Email and password</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Email-based login links (magic links)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Phone number verification via OTP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Third-party authentication services such as Google Sign-In</span>
                </li>
              </ul>
              <p className="text-gray-700 font-medium mb-2">You agree to:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Provide valid and accessible contact details (email and/or phone number)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Keep your login credentials secure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Be responsible for all activity that occurs under your account</span>
                </li>
              </ul>
              <p className="text-gray-700 mt-3 text-sm italic">
                Mokogo does not store third-party passwords (e.g., Google account passwords).
              </p>
            </div>
          </div>

          {/* Section 4: Third-Party Authentication Services */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Key className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">4. Third-Party Authentication Services</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-2">If you choose to sign in using third-party services (such as Google):</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Mokogo receives limited information (e.g., name, email address, profile image) as permitted by the provider</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Your use of such services is governed by their respective terms and privacy policies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Mokogo is not responsible for the availability, security, or practices of third-party authentication providers</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 5: User Responsibilities */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">5. User Responsibilities</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <p className="text-gray-700 font-medium mb-3">By using Mokogo, you agree to:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Provide accurate, complete, and up-to-date information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Use the Platform only for lawful purposes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Communicate respectfully with other users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Follow all applicable local, state, and national laws</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <p className="text-gray-700 font-medium mb-3">You must not:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Create fake or misleading accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Impersonate another person</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Post false, misleading, or fraudulent listings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Harass, threaten, or abuse other users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Request or share sensitive personal or financial information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Attempt to bypass security or authentication mechanisms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Use Mokogo for illegal or commercial solicitation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 6: Listings & User Interactions */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">6. Listings & User Interactions</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">a. For Listers</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>You are responsible for the accuracy and legitimacy of your listing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>You confirm that you have the right to list the space</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>You control who you engage with and on what terms</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">b. For Seekers</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>You are responsible for verifying listings independently</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>You should visit properties and meet listers before making any payments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Any agreements are solely between you and the lister</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">
                  Mokogo is not responsible for disputes, losses, or damages arising from user interactions.
                </p>
              </div>
            </div>
          </div>

          {/* Section 7: Payments & Transactions */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">7. Payments & Transactions</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-gray-700 font-medium mb-3">Mokogo does not:</p>
              <ul className="space-y-1.5 text-sm text-gray-700 mb-2">
                <li className="flex items-start gap-2">
                  <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Collect rent, deposits, or booking fees</span>
                </li>
                <li className="flex items-start gap-2">
                  <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Facilitate or guarantee payments</span>
                </li>
                <li className="flex items-start gap-2">
                  <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Act as an escrow or intermediary</span>
                </li>
              </ul>
              <p className="text-sm text-gray-700">
                All financial arrangements are made directly between users, at their own discretion and risk.
              </p>
            </div>
          </div>

          {/* Section 8: Safety & Verification Disclaimer */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">8. Safety & Verification Disclaimer</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-2">
                While Mokogo may implement basic verification measures (such as phone or email verification), we do not:
              </p>
              <ul className="space-y-1.5 text-sm text-gray-700 mb-2">
                <li className="flex items-start gap-2">
                  <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Conduct background checks</span>
                </li>
                <li className="flex items-start gap-2">
                  <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Verify property ownership</span>
                </li>
                <li className="flex items-start gap-2">
                  <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Guarantee the identity, intent, or behavior of any user</span>
                </li>
              </ul>
              <p className="text-sm text-gray-700">
                Users are expected to exercise independent judgment and follow the Safety Tips provided on the Platform.
              </p>
            </div>
          </div>

          {/* Section 9: Content & Intellectual Property */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">9. Content & Intellectual Property</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-2">
                All content on Mokogo, including text, logos, design, and software, is owned by Mokogo or its licensors.
              </p>
              <p className="text-gray-700 font-medium mb-3">You may not:</p>
              <ul className="space-y-1.5 text-sm text-gray-700 mb-2">
                <li className="flex items-start gap-2">
                  <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Copy, modify, or distribute Platform content without permission</span>
                </li>
                <li className="flex items-start gap-2">
                  <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Use Mokogo branding without authorization</span>
                </li>
              </ul>
              <p className="text-sm text-gray-700">
                By posting content (such as listings or photos), you grant Mokogo a non-exclusive, royalty-free right to use, display, and distribute such content solely for operating and promoting the Platform.
              </p>
            </div>
          </div>

          {/* Section 10: Account Suspension or Termination */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Ban className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">10. Account Suspension or Termination</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-2">Mokogo may suspend or terminate your account if:</p>
              <ul className="space-y-1.5 text-sm text-gray-700 mb-2">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>These Terms are violated</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Fraudulent, abusive, or harmful activity is suspected</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Required by law or regulatory authorities</span>
                </li>
              </ul>
              <p className="text-sm text-gray-700">
                You may stop using the Platform at any time.
              </p>
            </div>
          </div>

          {/* Section 11: Limitation of Liability */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">11. Limitation of Liability</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-gray-700 font-medium mb-3">To the maximum extent permitted by law:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Mokogo is not liable for losses, damages, or disputes between users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Mokogo does not guarantee availability, accuracy, or outcomes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Use of the Platform is at your own risk</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Any liability, if applicable, shall be limited as required under law</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 12: Indemnification */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">12. Indemnification</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-2">You agree to indemnify and hold Mokogo harmless from any claims, damages, or expenses arising from:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Your use of the Platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Your violation of these Terms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Your interactions with other users</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 13: Privacy */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Eye className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">13. Privacy</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700">
                Your use of Mokogo is governed by our Privacy Policy, which explains how we collect, process, and protect personal data, including data related to authentication and login methods.
              </p>
            </div>
          </div>

          {/* Section 14: Changes to These Terms */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">14. Changes to These Terms</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700">
                We may update these Terms periodically. Updated versions will be posted on this page with a revised "Last updated" date. Continued use of Mokogo constitutes acceptance of the updated Terms.
              </p>
            </div>
          </div>

          {/* Section 15: Governing Law & Jurisdiction */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Scale className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">15. Governing Law & Jurisdiction</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>These Terms are governed by the laws of India.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Any disputes shall be subject to the exclusive jurisdiction of courts located in India.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 16: Contact Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">16. Contact Information</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-gray-700 mb-4">
                For questions or concerns regarding these Terms, contact us at:
              </p>
              <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-lg p-4 border border-orange-400/20">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-400" />
                  <a 
                    href="mailto:hello@mokogo.in" 
                    className="text-lg font-semibold text-orange-400 hover:text-orange-500 transition-colors"
                  >
                    hello@mokogo.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Final Note */}
            <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-xl p-4 border border-orange-400/20 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-400/20 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1.5">Final Note</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                  Mokogo exists to help people connect transparently and responsibly. Please use the Platform thoughtfully and with respect for others.
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

export default TermsOfService

