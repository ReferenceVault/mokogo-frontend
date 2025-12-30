import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Shield, FileText, Lock, Eye, Share2, Database, Key, Cookie, Globe, Users, AlertCircle, Mail, CheckCircle } from 'lucide-react'

const PrivacyPolicy = () => {
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
              <Shield className="w-5 h-5 text-orange-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-700 max-w-3xl mx-auto mb-1">
              Mokogo ("we", "our", "us") respects your privacy and is committed to protecting your personal data.
            </p>
            <p className="text-xs text-gray-600">
              Last updated: 28th December, 2025
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 py-6">
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 mb-5 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              This Privacy Policy explains how we collect, use, store, share, and protect your information when you use the Mokogo website, app, and related services ("Platform").
            </p>
            <p className="text-sm text-gray-700 leading-relaxed font-medium mb-2">
              This policy is drafted in accordance with:
            </p>
            <ul className="space-y-1.5 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span>The Information Technology Act, 2000 and related IT Rules (India)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span>The Digital Personal Data Protection Act, 2023 (DPDP Act) principles</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span>The General Data Protection Regulation (GDPR) for users in the European Union</span>
              </li>
            </ul>
          </div>

          {/* Section 1: Definitions */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">1. Definitions</h2>
            </div>

            <div className="space-y-2.5">
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Personal Data</h3>
                <p className="text-sm text-gray-700">
                  Any information that can identify you directly or indirectly (e.g., name, email, phone number).
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Sensitive Personal Data</h3>
                <p className="text-sm text-gray-700 mb-1.5">
                  Financial data, passwords, government IDs, or similar information.
                </p>
                <p className="text-xs text-gray-600 italic">
                  Mokogo does not intentionally collect sensitive personal data.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Processing</h3>
                <p className="text-sm text-gray-700">
                  Any operation performed on personal data, such as collection, storage, use, or sharing.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Data Controller</h3>
                <p className="text-sm text-gray-700">Mokogo.</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Data Subject</h3>
                <p className="text-sm text-gray-700">You, the user.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Information We Collect */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Database className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">2. Information We Collect</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">a. Information you provide</h3>
                    <p className="text-gray-700 mb-3">When you create an account or use Mokogo, you may provide:</p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Name</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Email address (used for account creation, authentication, and communication)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Phone number (used for OTP verification)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>City and location preferences</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Listing details (rent, availability, description, photos)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Messages or communications exchanged with other users</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">b. Information collected automatically</h3>
                    <p className="text-gray-700 mb-3">We may collect limited technical information such as:</p>
                    <ul className="space-y-2 text-gray-700 mb-3">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>IP address</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Device type and browser</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Usage data (pages visited, interactions)</span>
                      </li>
                    </ul>
                    <p className="text-gray-700">
                      This information helps us improve performance, prevent misuse, and maintain platform security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Legal Basis for Processing */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Key className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">3. Legal Basis for Processing (GDPR)</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-3">
                We process your personal data based on one or more of the following lawful bases:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Consent</span> – when you sign up, verify your contact details, or choose to use certain features
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Contractual necessity</span> – to provide the services you request
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Legitimate interests</span> – to prevent fraud, ensure platform safety, and improve user experience
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Legal obligation</span> – where processing is required by law
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 4: Authentication & Login Methods */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">4. Authentication & Login Methods</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 mb-3 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-3">You may sign up or log in to Mokogo using:</p>
              <ul className="space-y-1.5 text-sm text-gray-700 mb-3">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Email and password</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Email-based verification links</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Phone number with OTP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Third-party authentication services such as Google Sign-In</span>
                </li>
              </ul>
            </div>

            <div className="bg-mokogo-info-bg border border-mokogo-info-border rounded-xl p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
              <h3 className="text-sm font-semibold text-mokogo-info-text mb-2">Google Sign-In</h3>
              <ul className="space-y-1.5 text-sm text-mokogo-info-text">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>We receive limited information such as your name, email address, and profile image, as permitted by your Google account settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>We do not receive or store your Google password</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>This information is used only to create and manage your Mokogo account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Your use of Google Sign-In is subject to Google's own terms and privacy policy.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 5: How We Use Your Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Eye className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">5. How We Use Your Information</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-3">We use your information to:</p>
              <ul className="space-y-1.5 text-sm text-gray-700 mb-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Create and manage user accounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Authenticate users and prevent unauthorized access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Display relevant listings and search results</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Enable communication between users</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Send transactional emails (login links, verification emails, important service updates)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Improve product performance and user experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Respond to support requests and feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Comply with legal and regulatory requirements</span>
                </li>
              </ul>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                <p className="text-green-800 font-medium">
                  We do not sell or rent your personal data.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6: Sharing of Personal Data */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Share2 className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">6. Sharing of Personal Data</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">a. With other users</h3>
                <p className="text-sm text-gray-700">
                  Information such as listings or contact details may be shared when you choose to engage with other users.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">b. With service providers</h3>
                <p className="text-sm text-gray-700 mb-2">We may use trusted third-party providers for:</p>
                <ul className="space-y-1.5 text-sm text-gray-700 mb-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Hosting and infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Messaging and email delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Authentication services (e.g., Google Sign-In)</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-700">
                  These providers process data only on our instructions and are required to maintain appropriate security standards.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">c. Legal disclosure</h3>
                <p className="text-sm text-gray-700">
                  We may disclose personal data if required by law, court order, or government authority.
                </p>
              </div>
            </div>
          </div>

          {/* Section 7: Data Storage & Retention */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Database className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">7. Data Storage & Retention</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Personal data is retained only for as long as necessary to provide services or comply with legal obligations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>We take reasonable steps to keep data accurate and up to date</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Data no longer required is securely deleted or anonymized</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 8: Data Security */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">8. Data Security</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-3">
                We use reasonable technical and organizational measures to protect your data from unauthorized access, loss, misuse, or alteration.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <p className="text-yellow-800 text-xs mb-1.5 font-medium">
                  However, no system is completely secure. Users are encouraged to:
                </p>
                <ul className="space-y-1.5 text-xs text-yellow-800">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Avoid sharing sensitive personal or financial information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Use strong passwords and secure email access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>Report suspicious activity</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 9: Your Rights */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Key className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">9. Your Rights</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Under Indian Law (IT Act / DPDP Act)</h3>
                <p className="text-sm text-gray-700 mb-2">You have the right to:</p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Access your personal data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Request correction or updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Withdraw consent where applicable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Request deletion of your data, subject to legal requirements</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Under GDPR (EU Users)</h3>
                <p className="text-sm text-gray-700 mb-2">You have the right to:</p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Access your data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Rectify inaccurate data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Request erasure ("right to be forgotten")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Restrict or object to processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Data portability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Withdraw consent at any time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Lodge a complaint with a data protection authority</span>
                  </li>
                </ul>
              </div>

              <div className="bg-mokogo-info-bg border border-mokogo-info-border rounded-lg p-4">
                <p className="text-sm text-mokogo-info-text">
                  To exercise your rights, contact us at the email below.
                </p>
              </div>
            </div>
          </div>

          {/* Section 10: Cookies & Tracking */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Cookie className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">10. Cookies & Tracking Technologies</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-2">Mokogo may use cookies or similar technologies to:</p>
              <ul className="space-y-1.5 text-sm text-gray-700 mb-2">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Improve site functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Analyze usage patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Enhance user experience</span>
                </li>
              </ul>
              <p className="text-sm text-gray-700">
                You can control cookie settings through your browser.
              </p>
            </div>
          </div>

          {/* Section 11: International Data Transfers */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Globe className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">11. International Data Transfers</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700">
                Your data may be stored or processed on servers located outside your country of residence. We ensure appropriate safeguards are in place in accordance with applicable data protection laws.
              </p>
            </div>
          </div>

          {/* Section 12: Children's Privacy */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">12. Children's Privacy</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Mokogo is intended for users 18 years and above.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>We do not knowingly collect personal data from minors.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 13: Third-Party Links */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Share2 className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">13. Third-Party Links</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700">
                Mokogo may contain links to third-party websites or services. We are not responsible for their privacy practices and encourage you to review their policies separately.
              </p>
            </div>
          </div>

          {/* Section 14: Changes to This Privacy Policy */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">14. Changes to This Privacy Policy</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. Continued use of Mokogo indicates acceptance of the updated policy.
              </p>
            </div>
          </div>

          {/* Section 15: Contact Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">15. Contact Information</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-3">
                If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, contact us at:
              </p>
              <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-lg p-3 border border-orange-400/20">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-400" />
                  <a 
                    href="mailto:hello@mokogo.in" 
                    className="text-base font-semibold text-orange-400 hover:text-orange-500 transition-colors"
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
                <Shield className="w-4 h-4 text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1.5">Final Note</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Mokogo aims to collect only what is necessary, use it responsibly, and give users transparency and control over their data.
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

export default PrivacyPolicy

