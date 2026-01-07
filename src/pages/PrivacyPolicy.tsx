import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import { Shield, FileText, Lock, Eye, Share2, Database, Key, Cookie, Globe, Users, AlertCircle, Mail, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

const PrivacyPolicy = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    definitions: true,
    information: false,
    legalBasis: false,
    authentication: false,
    usage: false,
    sharing: false,
    storage: false,
    security: false,
    rights: false,
    cookies: false,
    international: false,
    children: false,
    thirdParty: false,
    changes: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const privacySections = [
    {
      id: 'definitions',
      icon: FileText,
      title: 'Definitions',
      number: 1,
      content: {
        items: [
          { term: 'Personal Data', definition: 'Any information that can identify you directly or indirectly (e.g., name, email, phone number).' },
          { term: 'Sensitive Personal Data', definition: 'Financial data, passwords, government IDs, or similar information.', note: 'Mokogo does not intentionally collect sensitive personal data.' },
          { term: 'Processing', definition: 'Any operation performed on personal data, such as collection, storage, use, or sharing.' },
          { term: 'Data Controller', definition: 'Mokogo.' },
          { term: 'Data Subject', definition: 'You, the user.' }
        ]
      }
    },
    {
      id: 'information',
      icon: Database,
      title: 'Information We Collect',
      number: 2,
      content: {
        provided: [
          'Name',
          'Email address (used for account creation, authentication, and communication)',
          'Phone number (used for OTP verification)',
          'City and location preferences',
          'Listing details (rent, availability, description, photos)',
          'Messages or communications exchanged with other users'
        ],
        automatic: [
          'IP address',
          'Device type and browser',
          'Usage data (pages visited, interactions)'
        ],
        note: 'This information helps us improve performance, prevent misuse, and maintain platform security.'
      }
    },
    {
      id: 'legalBasis',
      icon: Key,
      title: 'Legal Basis for Processing (GDPR)',
      number: 3,
      content: {
        description: 'We process your personal data based on one or more of the following lawful bases:',
        bases: [
          { name: 'Consent', desc: 'when you sign up, verify your contact details, or choose to use certain features' },
          { name: 'Contractual necessity', desc: 'to provide the services you request' },
          { name: 'Legitimate interests', desc: 'to prevent fraud, ensure platform safety, and improve user experience' },
          { name: 'Legal obligation', desc: 'where processing is required by law' }
        ]
      }
    },
    {
      id: 'authentication',
      icon: Lock,
      title: 'Authentication & Login Methods',
      number: 4,
      content: {
        methods: [
          'Email and password',
          'Email-based verification links',
          'Phone number with OTP',
          'Third-party authentication services such as Google Sign-In'
        ],
        googleInfo: [
          'We receive limited information such as your name, email address, and profile image, as permitted by your Google account settings',
          'We do not receive or store your Google password',
          'This information is used only to create and manage your Mokogo account',
          'Your use of Google Sign-In is subject to Google\'s own terms and privacy policy.'
        ]
      }
    },
    {
      id: 'usage',
      icon: Eye,
      title: 'How We Use Your Information',
      number: 5,
      content: {
        uses: [
          'Create and manage user accounts',
          'Authenticate users and prevent unauthorized access',
          'Display relevant listings and search results',
          'Enable communication between users',
          'Send transactional emails (login links, verification emails, important service updates)',
          'Improve product performance and user experience',
          'Respond to support requests and feedback',
          'Comply with legal and regulatory requirements'
        ],
        note: 'We do not sell or rent your personal data.'
      }
    },
    {
      id: 'sharing',
      icon: Share2,
      title: 'Sharing of Personal Data',
      number: 6,
      content: {
        withUsers: 'Information such as listings or contact details may be shared when you choose to engage with other users.',
        withProviders: {
          description: 'We may use trusted third-party providers for:',
          providers: [
            'Hosting and infrastructure',
            'Analytics',
            'Messaging and email delivery',
            'Authentication services (e.g., Google Sign-In)'
          ],
          note: 'These providers process data only on our instructions and are required to maintain appropriate security standards.'
        },
        legal: 'We may disclose personal data if required by law, court order, or government authority.'
      }
    },
    {
      id: 'storage',
      icon: Database,
      title: 'Data Storage & Retention',
      number: 7,
      content: {
        points: [
          'Personal data is retained only for as long as necessary to provide services or comply with legal obligations',
          'We take reasonable steps to keep data accurate and up to date',
          'Data no longer required is securely deleted or anonymized'
        ]
      }
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Data Security',
      number: 8,
      content: {
        description: 'We use reasonable technical and organizational measures to protect your data from unauthorized access, loss, misuse, or alteration. However, no system is completely secure.',
        userTips: [
          'Avoid sharing sensitive personal or financial information',
          'Use strong passwords and secure email access',
          'Report suspicious activity'
        ]
      }
    },
    {
      id: 'rights',
      icon: Key,
      title: 'Your Rights',
      number: 9,
      content: {
        indianLaw: [
          'Access your personal data',
          'Request correction or updates',
          'Withdraw consent where applicable',
          'Request deletion of your data, subject to legal requirements'
        ],
        gdpr: [
          'Access your data',
          'Rectify inaccurate data',
          'Request erasure ("right to be forgotten")',
          'Restrict or object to processing',
          'Data portability',
          'Withdraw consent at any time',
          'Lodge a complaint with a data protection authority'
        ],
        note: 'To exercise your rights, contact us at the email below.'
      }
    },
    {
      id: 'cookies',
      icon: Cookie,
      title: 'Cookies & Tracking Technologies',
      number: 10,
      content: {
        description: 'Mokogo may use cookies or similar technologies to:',
        uses: [
          'Improve site functionality',
          'Analyze usage patterns',
          'Enhance user experience'
        ],
        note: 'You can control cookie settings through your browser.'
      }
    },
    {
      id: 'international',
      icon: Globe,
      title: 'International Data Transfers',
      number: 11,
      content: {
        description: 'Your data may be stored or processed on servers located outside your country of residence. We ensure appropriate safeguards are in place in accordance with applicable data protection laws.'
      }
    },
    {
      id: 'children',
      icon: Users,
      title: 'Children\'s Privacy',
      number: 12,
      content: {
        points: [
          'Mokogo is intended for users 18 years and above.',
          'We do not knowingly collect personal data from minors.'
        ]
      }
    },
    {
      id: 'thirdParty',
      icon: Share2,
      title: 'Third-Party Links',
      number: 13,
      content: {
        description: 'Mokogo may contain links to third-party websites or services. We are not responsible for their privacy practices and encourage you to review their policies separately.'
      }
    },
    {
      id: 'changes',
      icon: AlertCircle,
      title: 'Changes to This Privacy Policy',
      number: 14,
      content: {
        description: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. Continued use of Mokogo indicates acceptance of the updated policy.'
      }
    }
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <SocialSidebar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50 px-6 md:px-[10%] pt-14 pb-16 sm:pt-16 sm:pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.15),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.12),transparent_60%),radial-gradient(circle_at_center,rgba(254,215,170,0.10),transparent_65%),radial-gradient(circle_at_top_right,rgba(255,237,213,0.08),transparent_70%)]" />
          
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/50 bg-orange-200/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-orange-800/80">
              Privacy Policy • Your Data Protection
            </span>
            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-[2.9rem] font-bold leading-tight text-gray-900">
              Privacy Policy
            </h1>
            <p className="mt-5 text-lg sm:text-xl leading-relaxed text-gray-800">
              Mokogo ("we", "our", "us") respects your privacy and is committed to protecting your personal data.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-400/20 border border-orange-300/40 px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-orange-800 shadow-lg shadow-orange-200/50 ring-1 ring-orange-300/30">
              Last updated: 28th December, 2025
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="relative px-6 md:px-[10%] py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fef4f1] via-transparent to-transparent" />
          
          <div className="relative mx-auto max-w-6xl">
            {/* Introduction */}
            <div className="mb-12 relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-8 md:p-10 shadow-xl shadow-orange-100/40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-500" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Understanding Our Privacy Policy</h2>
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-4">
                  This Privacy Policy explains how we collect, use, store, share, and protect your information when you use the Mokogo website, app, and related services ("Platform").
                </p>
                <p className="text-sm font-medium text-gray-800 mb-3">This policy is drafted in accordance with:</p>
                <ul className="space-y-2 text-sm sm:text-base text-gray-700">
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
            </div>

            {/* Privacy Sections - Interactive Expandable */}
            <div className="space-y-6 mb-12">
              {privacySections.map((section) => {
                const Icon = section.icon
                const isExpanded = expandedSections[section.id]
                
                return (
                  <div
                    key={section.id}
                    className={`relative overflow-hidden rounded-[2rem] border border-orange-200 ${
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
                        className="w-full flex items-center justify-between p-6 md:p-8 hover:bg-orange-50/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-orange-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-orange-500">{section.number}.</span>
                              <h3 className="text-xl md:text-2xl font-semibold text-gray-900">{section.title}</h3>
                            </div>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-6 h-6 text-orange-500" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-orange-500" />
                        )}
                      </button>

                      {/* Section Content - Expandable */}
                      {isExpanded && (
                        <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          {/* Definitions */}
                          {section.content.items && (
                            <div className="grid md:grid-cols-2 gap-4">
                              {section.content.items.map((item, index) => (
                                <div key={index} className="bg-white rounded-xl p-4 border border-orange-200">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{item.term}</h4>
                                  <p className="text-sm text-gray-700">{item.definition}</p>
                                  {item.note && (
                                    <p className="text-xs text-gray-600 italic mt-2">{item.note}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Information We Collect */}
                          {section.content.provided && (
                            <>
                              <div className="bg-white rounded-xl p-5 border border-orange-200 mb-4">
                                <h4 className="text-base font-semibold text-gray-900 mb-3">a. Information you provide</h4>
                                <p className="text-sm text-gray-700 mb-3">When you create an account or use Mokogo, you may provide:</p>
                                <ul className="space-y-2 text-sm text-gray-700">
                                  {section.content.provided.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-orange-400 font-bold">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-white rounded-xl p-5 border border-orange-200">
                                <h4 className="text-base font-semibold text-gray-900 mb-3">b. Information collected automatically</h4>
                                <p className="text-sm text-gray-700 mb-3">We may collect limited technical information such as:</p>
                                <ul className="space-y-2 text-sm text-gray-700 mb-3">
                                  {section.content.automatic?.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-orange-400 font-bold">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                                <p className="text-sm text-gray-700">{section.content.note}</p>
                              </div>
                            </>
                          )}

                          {/* Legal Basis */}
                          {section.content.bases && (
                            <>
                              <p className="text-sm sm:text-base text-gray-700 mb-4">{section.content.description}</p>
                              <div className="grid md:grid-cols-2 gap-4">
                                {section.content.bases.map((base, index) => (
                                  <div key={index} className="bg-white rounded-xl p-4 border border-orange-200">
                                    <p className="text-sm font-semibold text-gray-900 mb-1">{base.name}</p>
                                    <p className="text-sm text-gray-700">– {base.desc}</p>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          {/* Authentication */}
                          {section.content.methods && (
                            <>
                              <p className="text-sm sm:text-base text-gray-700 mb-4">You may sign up or log in to Mokogo using:</p>
                              <ul className="space-y-2 text-sm text-gray-700 mb-6">
                                {section.content.methods.map((method, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-orange-400 font-bold">•</span>
                                    <span>{method}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Google Sign-In</h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                  {section.content.googleInfo?.map((info, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-orange-400 font-bold">•</span>
                                      <span>{info}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          )}

                          {/* Usage */}
                          {section.content.uses && (
                            <>
                              <p className="text-sm sm:text-base text-gray-700 mb-4">We use your information to:</p>
                              <ul className="space-y-2 text-sm sm:text-base text-gray-700 mb-4">
                                {section.content.uses.map((use, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                    <span>{use}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                <p className="text-green-800 font-medium">{section.content.note}</p>
                              </div>
                            </>
                          )}

                          {/* Sharing */}
                          {section.content.withUsers && (
                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="bg-white rounded-xl p-4 border border-orange-200">
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">a. With other users</h4>
                                <p className="text-sm text-gray-700">{section.content.withUsers}</p>
                              </div>
                              <div className="bg-white rounded-xl p-4 border border-orange-200">
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">b. With service providers</h4>
                                <p className="text-sm text-gray-700 mb-2">{section.content.withProviders?.description}</p>
                                <ul className="space-y-1 text-sm text-gray-700 mb-2">
                                  {section.content.withProviders?.providers.map((provider, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-orange-400 font-bold">•</span>
                                      <span>{provider}</span>
                                    </li>
                                  ))}
                                </ul>
                                <p className="text-xs text-gray-600">{section.content.withProviders?.note}</p>
                              </div>
                              <div className="bg-white rounded-xl p-4 border border-orange-200">
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">c. Legal disclosure</h4>
                                <p className="text-sm text-gray-700">{section.content.legal}</p>
                              </div>
                            </div>
                          )}

                          {/* Storage, Security, Rights, etc. */}
                          {section.content.points && (
                            <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                              {section.content.points.map((point, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Security */}
                          {section.content.userTips && (
                            <>
                              <p className="text-sm sm:text-base text-gray-700 mb-4">{section.content.description}</p>
                              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                                <p className="text-yellow-800 text-xs mb-2 font-medium">Users are encouraged to:</p>
                                <ul className="space-y-1.5 text-xs text-yellow-800">
                                  {section.content.userTips.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-orange-400 font-bold">•</span>
                                      <span>{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          )}

                          {/* Rights */}
                          {section.content.indianLaw && (
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="bg-white rounded-xl p-5 border border-orange-200">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Under Indian Law (IT Act / DPDP Act)</h4>
                                <p className="text-sm text-gray-700 mb-2">You have the right to:</p>
                                <ul className="space-y-2 text-sm text-gray-700">
                                  {section.content.indianLaw.map((right, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                      <span>{right}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-white rounded-xl p-5 border border-orange-200">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Under GDPR (EU Users)</h4>
                                <p className="text-sm text-gray-700 mb-2">You have the right to:</p>
                                <ul className="space-y-2 text-sm text-gray-700">
                                  {section.content.gdpr?.map((right, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                      <span>{right}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {section.content.note && section.id !== 'usage' && (
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mt-4">
                              <p className="text-sm text-orange-800">{section.content.note}</p>
                            </div>
                          )}

                          {/* Cookies */}
                          {section.content.uses && section.id === 'cookies' && (
                            <>
                              <p className="text-sm sm:text-base text-gray-700 mb-4">{section.content.description}</p>
                              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                                {section.content.uses.map((use, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-orange-400 font-bold">•</span>
                                    <span>{use}</span>
                                  </li>
                                ))}
                              </ul>
                              <p className="text-sm text-gray-700">{section.content.note}</p>
                            </>
                          )}

                          {/* Simple description */}
                          {section.content.description && !section.content.uses && !section.content.points && !section.content.bases && (
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{section.content.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Contact & Final Note */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Contact */}
              <div className="relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-8 md:p-10 shadow-xl shadow-orange-100/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">15. Contact Information</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 mb-4">
                    If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, contact us at:
                  </p>
                  <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-xl p-4 border border-orange-400/20">
                    <a 
                      href="mailto:hello@mokogo.in" 
                      className="text-lg font-bold text-orange-400 hover:text-orange-500 transition-colors flex items-center gap-2"
                    >
                      <Mail className="w-5 h-5" />
                      hello@mokogo.in
                    </a>
                  </div>
                </div>
              </div>

              {/* Final Note */}
              <div className="relative overflow-hidden rounded-[2rem] border border-[#fde1da] bg-gradient-to-br from-[#fff4f1] via-white to-[#fff9f6] p-8 md:p-10 shadow-xl shadow-[#f8d8cf]/45">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_60%)]" />
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-400/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Final Note</h3>
                    <p className="text-base leading-relaxed text-gray-700">
                      Mokogo aims to collect only what is necessary, use it responsibly, and give users transparency and control over their data.
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

export default PrivacyPolicy
