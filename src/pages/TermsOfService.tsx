import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import { FileText, Users, Shield, Lock, AlertCircle, DollarSign, Key, Ban, Scale, Mail, CheckCircle, Heart, ChevronDown, ChevronUp } from 'lucide-react'

const TermsOfService = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    about: true,
    eligibility: false,
    account: false,
    thirdParty: false,
    responsibilities: false,
    listings: false,
    payments: false,
    safety: false,
    content: false,
    termination: false,
    liability: false,
    indemnification: false,
    privacy: false,
    changes: false,
    governing: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const termSections = [
    {
      id: 'about',
      icon: Users,
      title: 'About Mokogo',
      number: 1,
      content: {
        description: 'Mokogo is a platform that helps people list and discover rooms, shared spaces, and flatmates. Mokogo acts only as a discovery and connection platform.',
        points: [
          'Is not a broker, agent, or property manager',
          'Does not own, manage, or inspect properties',
          'Does not participate in payments or agreements'
        ],
        note: 'All interactions, decisions, and arrangements are made directly between users.'
      }
    },
    {
      id: 'eligibility',
      icon: CheckCircle,
      title: 'Eligibility',
      number: 2,
      content: {
        description: 'To use Mokogo, you must:',
        list: [
          'Be at least 18 years old',
          'Be legally capable of entering into agreements',
          'Provide accurate and truthful information'
        ],
        note: 'By using the Platform, you confirm that you meet these requirements.'
      }
    },
    {
      id: 'account',
      icon: Lock,
      title: 'Account Registration & Login Methods',
      number: 3,
      content: {
        description: 'To access certain features, you must create an account. Mokogo supports multiple authentication methods, including:',
        methods: [
          'Email and password',
          'Email-based login links (magic links)',
          'Phone number verification via OTP',
          'Third-party authentication services such as Google Sign-In'
        ],
        agreements: [
          'Provide valid and accessible contact details (email and/or phone number)',
          'Keep your login credentials secure',
          'Be responsible for all activity that occurs under your account'
        ],
        note: 'Mokogo does not store third-party passwords (e.g., Google account passwords).'
      }
    },
    {
      id: 'thirdParty',
      icon: Key,
      title: 'Third-Party Authentication Services',
      number: 4,
      content: {
        description: 'If you choose to sign in using third-party services (such as Google):',
        list: [
          'Mokogo receives limited information (e.g., name, email address, profile image) as permitted by the provider',
          'Your use of such services is governed by their respective terms and privacy policies',
          'Mokogo is not responsible for the availability, security, or practices of third-party authentication providers'
        ]
      }
    },
    {
      id: 'responsibilities',
      icon: Shield,
      title: 'User Responsibilities',
      number: 5,
      content: {
        mustDo: [
          'Provide accurate, complete, and up-to-date information',
          'Use the Platform only for lawful purposes',
          'Communicate respectfully with other users',
          'Follow all applicable local, state, and national laws'
        ],
        mustNot: [
          'Create fake or misleading accounts',
          'Impersonate another person',
          'Post false, misleading, or fraudulent listings',
          'Harass, threaten, or abuse other users',
          'Request or share sensitive personal or financial information',
          'Attempt to bypass security or authentication mechanisms',
          'Use Mokogo for illegal or commercial solicitation'
        ]
      }
    },
    {
      id: 'listings',
      icon: Users,
      title: 'Listings & User Interactions',
      number: 6,
      content: {
        listers: [
          'You are responsible for the accuracy and legitimacy of your listing',
          'You confirm that you have the right to list the space',
          'You control who you engage with and on what terms'
        ],
        seekers: [
          'You are responsible for verifying listings independently',
          'You should visit properties and meet listers before making any payments',
          'Any agreements are solely between you and the lister'
        ],
        warning: 'Mokogo is not responsible for disputes, losses, or damages arising from user interactions.'
      }
    },
    {
      id: 'payments',
      icon: DollarSign,
      title: 'Payments & Transactions',
      number: 7,
      content: {
        description: 'Mokogo does not:',
        list: [
          'Collect rent, deposits, or booking fees',
          'Facilitate or guarantee payments',
          'Act as an escrow or intermediary'
        ],
        note: 'All financial arrangements are made directly between users, at their own discretion and risk.'
      }
    },
    {
      id: 'safety',
      icon: Shield,
      title: 'Safety & Verification Disclaimer',
      number: 8,
      content: {
        description: 'While Mokogo may implement basic verification measures (such as phone or email verification), we do not:',
        list: [
          'Conduct background checks',
          'Verify property ownership',
          'Guarantee the identity, intent, or behavior of any user'
        ],
        note: 'Users are expected to exercise independent judgment and follow the Safety Tips provided on the Platform.'
      }
    },
    {
      id: 'content',
      icon: FileText,
      title: 'Content & Intellectual Property',
      number: 9,
      content: {
        description: 'All content on Mokogo, including text, logos, design, and software, is owned by Mokogo or its licensors.',
        mustNot: [
          'Copy, modify, or distribute Platform content without permission',
          'Use Mokogo branding without authorization'
        ],
        note: 'By posting content (such as listings or photos), you grant Mokogo a non-exclusive, royalty-free right to use, display, and distribute such content solely for operating and promoting the Platform.'
      }
    },
    {
      id: 'termination',
      icon: Ban,
      title: 'Account Suspension or Termination',
      number: 10,
      content: {
        description: 'Mokogo may suspend or terminate your account if:',
        list: [
          'These Terms are violated',
          'Fraudulent, abusive, or harmful activity is suspected',
          'Required by law or regulatory authorities'
        ],
        note: 'You may stop using the Platform at any time.'
      }
    },
    {
      id: 'liability',
      icon: AlertCircle,
      title: 'Limitation of Liability',
      number: 11,
      content: {
        description: 'To the maximum extent permitted by law:',
        list: [
          'Mokogo is not liable for losses, damages, or disputes between users',
          'Mokogo does not guarantee availability, accuracy, or outcomes',
          'Use of the Platform is at your own risk',
          'Any liability, if applicable, shall be limited as required under law'
        ]
      }
    },
    {
      id: 'indemnification',
      icon: Shield,
      title: 'Indemnification',
      number: 12,
      content: {
        description: 'You agree to indemnify and hold Mokogo harmless from any claims, damages, or expenses arising from:',
        list: [
          'Your use of the Platform',
          'Your violation of these Terms',
          'Your interactions with other users'
        ]
      }
    },
    {
      id: 'privacy',
      icon: Lock,
      title: 'Privacy',
      number: 13,
      content: {
        description: 'Your use of Mokogo is governed by our Privacy Policy, which explains how we collect, process, and protect personal data, including data related to authentication and login methods.'
      }
    },
    {
      id: 'changes',
      icon: FileText,
      title: 'Changes to These Terms',
      number: 14,
      content: {
        description: 'We may update these Terms periodically. Updated versions will be posted on this page with a revised "Last updated" date. Continued use of Mokogo constitutes acceptance of the updated Terms.'
      }
    },
    {
      id: 'governing',
      icon: Scale,
      title: 'Governing Law & Jurisdiction',
      number: 15,
      content: {
        list: [
          'These Terms are governed by the laws of India.',
          'Any disputes shall be subject to the exclusive jurisdiction of courts located in India.'
        ]
      }
    }
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <SocialSidebar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50 px-4 sm:px-6 md:px-[10%] pt-10 sm:pt-14 pb-12 sm:pb-16 md:pt-16 md:pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.15),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.12),transparent_60%),radial-gradient(circle_at_center,rgba(254,215,170,0.10),transparent_65%),radial-gradient(circle_at_top_right,rgba(255,237,213,0.08),transparent_70%)]" />
          
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/50 bg-orange-200/30 px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.35em] text-orange-800/80">
              Terms of Service • Legal Agreement
            </span>
            <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-[2.9rem] font-bold leading-tight text-gray-900">
              Terms of Service
            </h1>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl leading-relaxed text-gray-800">
              Welcome to Mokogo. These Terms of Service govern your access to and use of the Mokogo website, app, and related services.
            </p>
            <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 rounded-full bg-orange-400/20 border border-orange-300/40 px-4 sm:px-6 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.35em] text-orange-800 shadow-lg shadow-orange-200/50 ring-1 ring-orange-300/30">
              Last updated: 28th December, 2025
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="relative px-4 sm:px-6 md:px-[10%] py-10 sm:py-16 md:py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fef4f1] via-transparent to-transparent" />
          
          <div className="relative mx-auto max-w-6xl">
            {/* Introduction */}
            <div className="mb-8 sm:mb-12 relative overflow-hidden rounded-xl md:rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-5 sm:p-8 md:p-10 shadow-xl shadow-orange-100/40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]" />
              <div className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-orange-500" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Agreement to Terms</h2>
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-4">
                  By accessing or using Mokogo, you agree to be bound by these Terms.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-yellow-800 font-medium">
                    If you do not agree to these Terms, please do not use the Platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms Sections - Interactive Expandable */}
            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              {termSections.map((section) => {
                const Icon = section.icon
                const isExpanded = expandedSections[section.id]
                
                return (
                  <div
                    key={section.id}
                    className={`relative overflow-hidden rounded-xl md:rounded-[2rem] border border-orange-200 ${
                      section.number % 2 === 0
                        ? 'bg-gradient-to-br from-[#fff4f1] via-white to-[#fffafa] shadow-xl shadow-[#f8d8cf]/45'
                        : 'bg-gradient-to-br from-orange-50 via-white to-orange-50/50 shadow-xl shadow-orange-100/40'
                    }`}
                  >
                    <div className={`absolute inset-0 ${
                      section.number % 2 === 0
                        ? 'bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.14),transparent_60%)]'
                        : 'bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]'
                    }`} />
                    <div className="relative">
                      {/* Section Header - Clickable */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-4 sm:p-6 md:p-8 hover:bg-orange-50/50 transition-colors text-left gap-3"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                              <span className="text-sm font-semibold text-orange-500 flex-shrink-0">{section.number}.</span>
                              <h3 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-900 truncate">{section.title}</h3>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                          )}
                        </div>
                      </button>

                      {/* Section Content - Expandable */}
                      {isExpanded && (
                        <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          {section.content.description && (
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                              {section.content.description}
                            </p>
                          )}

                          {section.content.points && (
                            <>
                              <p className="text-sm font-medium text-gray-800">Mokogo:</p>
                              <ul className="space-y-2 text-sm text-gray-700">
                                {section.content.points.map((point, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-orange-400 font-bold">•</span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}

                          {section.content.list && (
                            <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                              {section.content.list.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {section.content.methods && (
                            <>
                              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                                {section.content.methods.map((method, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-orange-400 font-bold">•</span>
                                    <span>{method}</span>
                                  </li>
                                ))}
                              </ul>
                              <p className="text-sm font-medium text-gray-800 mb-2">You agree to:</p>
                              <ul className="space-y-2 text-sm text-gray-700">
                                {section.content.agreements?.map((agreement, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                    <span>{agreement}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}

                          {section.content.mustDo && (
                            <>
                              <p className="text-sm font-medium text-gray-800 mb-3">By using Mokogo, you agree to:</p>
                              <ul className="space-y-2 text-sm text-gray-700 mb-6">
                                {section.content.mustDo.map((item, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                              <p className="text-sm font-medium text-gray-800 mb-3">You must not:</p>
                              <ul className="space-y-2 text-sm text-gray-700">
                                {section.content.mustNot?.map((item, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}

                          {section.content.listers && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                              <div className="bg-white rounded-xl p-4 border border-orange-200">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">For Listers</h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                  {section.content.listers.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-white rounded-xl p-4 border border-orange-200">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">For Seekers</h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                  {section.content.seekers?.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {section.content.warning && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                              <p className="text-red-800 text-sm">{section.content.warning}</p>
                            </div>
                          )}


                          {section.content.mustNot && !section.content.mustDo && (
                            <ul className="space-y-2 text-sm text-gray-700">
                              {section.content.mustNot.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {section.content.note && (
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mt-4">
                              <p className="text-sm text-orange-800">{section.content.note}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Contact & Final Note */}
            <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
              {/* Contact */}
              <div className="relative overflow-hidden rounded-xl md:rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-5 sm:p-8 md:p-10 shadow-xl shadow-orange-100/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]" />
                <div className="relative">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">16. Contact Information</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 mb-4">
                    For questions or concerns regarding these Terms, contact us at:
                  </p>
                  <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-xl p-4 border border-orange-400/20">
                    <a 
                      href="mailto:hello@mokogo.in" 
                      className="text-base sm:text-lg font-bold text-orange-400 hover:text-orange-500 transition-colors flex items-center gap-2 break-all"
                    >
                      <Mail className="w-5 h-5" />
                      hello@mokogo.in
                    </a>
                  </div>
                </div>
              </div>

              {/* Final Note */}
              <div className="relative overflow-hidden rounded-xl md:rounded-[2rem] border border-[#fde1da] bg-gradient-to-br from-[#fff4f1] via-white to-[#fff9f6] p-5 sm:p-8 md:p-10 shadow-xl shadow-[#f8d8cf]/45">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_60%)]" />
                <div className="relative flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-400/20 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Final Note</h3>
                    <p className="text-base leading-relaxed text-gray-700">
                      Mokogo exists to help people connect transparently and responsibly. Please use the Platform thoughtfully and with respect for others.
                    </p>
                  </div>
                </div>
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
