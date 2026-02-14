import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import { Shield, Eye, DollarSign, CheckCircle, MessageSquare, Home, Lock, AlertCircle, Heart, Users } from 'lucide-react'

const SafetyTips = () => {
  const [activeTab, setActiveTab] = useState<'seeking' | 'listing'>('seeking')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const seekingTips = [
    {
      icon: Eye,
      title: "Meet before you commit",
      description: "Photos and descriptions are useful, but nothing beats seeing the place in person. Always try to visit the property and meet the lister (and flatmates, if possible) before making any decisions.",
      highlights: [
        "Visit during the daytime",
        "Take a friend along",
        "Ask all the questions you have — there's no such thing as a silly one"
      ]
    },
    {
      icon: DollarSign,
      title: "Be careful with payments",
      description: "Avoid sending any advance payment, token amount, or deposit before you've seen the place and spoken to the person listing it.",
      warning: "If someone is pushing you to transfer money quickly or asking for payment before a visit, it's okay to pause or walk away."
    },
    {
      icon: CheckCircle,
      title: "Double-check the basics",
      description: "Make sure you're clear on things like:",
      list: [
        "Rent and deposit",
        "Move-in date",
        "Exact location",
        "House rules and shared expenses"
      ],
      note: "If something doesn't add up, ask again. Clarity now saves trouble later."
    },
    {
      icon: MessageSquare,
      title: "Share thoughtfully",
      description: "It's normal to exchange contact details to coordinate visits, but try not to share sensitive personal or financial information too early.",
      note: "Keep conversations respectful and comfortable — if something feels off, you don't have to continue."
    },
    {
      icon: Heart,
      title: "Trust your gut",
      description: "If a listing, conversation, or situation doesn't feel right, it's okay to say no. The right place should feel comfortable, not rushed or pressured."
    }
  ]

  const listingTips = [
    {
      icon: MessageSquare,
      title: "Take your time with conversations",
      description: "Before inviting someone over or sharing your exact address, have a quick chat to understand what they're looking for. This helps you decide if it's worth moving ahead."
    },
    {
      icon: Eye,
      title: "Show your place safely",
      description: "When scheduling visits:",
      list: [
        "Pick a time that works for you",
        "Let a flatmate or friend know someone is coming",
        "Don't feel obligated to entertain multiple visitors at once"
      ],
      note: "Your comfort always comes first."
    },
    {
      icon: CheckCircle,
      title: "Be clear upfront",
      description: "Clearly communicate rent, deposit, house rules, and expectations from the start. Being open and honest makes it easier to find someone who's a good fit."
    },
    {
      icon: Lock,
      title: "Protect your privacy",
      description: "Share photos and details carefully, and avoid giving out personal information unless you're comfortable. If someone asks for details that feel unnecessary, it's okay to say no."
    },
    {
      icon: AlertCircle,
      title: "Don't feel rushed",
      description: "If someone is pushing you to decide quickly or making you uncomfortable, you can always step back. It's better to wait a little longer than end up with the wrong flatmate."
    }
  ]


  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <SocialSidebar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50 px-4 sm:px-6 md:px-[10%] pt-10 sm:pt-16 pb-12 sm:pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.15),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.12),transparent_60%),radial-gradient(circle_at_center,rgba(254,215,170,0.10),transparent_65%),radial-gradient(circle_at_top_right,rgba(255,237,213,0.08),transparent_70%)]" />
          
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/50 bg-orange-200/30 px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.35em] text-orange-800/80 text-center">
              Safety First • Your Wellbeing Matters
            </span>
            <div className="mt-6 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="mt-4 sm:mt-6 text-2xl sm:text-4xl lg:text-[2.9rem] font-bold leading-tight text-gray-900">
              Safety Tips
            </h1>
            <p className="mt-4 sm:mt-5 text-base sm:text-xl leading-relaxed text-gray-800">
              Finding a room or a flatmate is a big decision
            </p>
            <p className="mt-2 text-sm sm:text-lg leading-relaxed text-gray-700">
              We want your experience on Mokogo to be smooth and stress-free. While we help people discover and connect, a little caution goes a long way.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="relative px-4 sm:px-6 md:px-[10%] py-10 sm:py-16 md:py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fef4f1] via-transparent to-transparent" />
          
          <div className="relative mx-auto max-w-6xl">
            {/* Introduction Card */}
            <div className="relative overflow-hidden rounded-xl md:rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-5 sm:p-8 md:p-10 shadow-xl shadow-orange-100/40 mb-8 sm:mb-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]" />
              <div className="relative text-center">
                <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                  Here are a few simple tips to help you stay safe and confident along the way.
                </p>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="mb-8 sm:mb-12">
              {/* Tab Buttons */}
              <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-orange-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('seeking')}
                  className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b-2 transition-all flex-shrink-0 ${
                    activeTab === 'seeking'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-orange-500'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                    activeTab === 'seeking'
                      ? 'bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg'
                      : 'bg-orange-100'
                  }`}>
                    <Home className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'seeking' ? 'text-white' : 'text-orange-500'}`} />
                  </div>
                  <span className="text-base sm:text-lg font-semibold whitespace-nowrap">For Seekers</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('listing')}
                  className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b-2 transition-all flex-shrink-0 ${
                    activeTab === 'listing'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-orange-500'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                    activeTab === 'listing'
                      ? 'bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg'
                      : 'bg-orange-100'
                  }`}>
                    <Users className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'listing' ? 'text-white' : 'text-orange-500'}`} />
                  </div>
                  <span className="text-base sm:text-lg font-semibold whitespace-nowrap">For Listers</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="relative overflow-hidden rounded-xl md:rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 shadow-xl shadow-orange-100/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]" />
                <div className="relative p-5 sm:p-8 md:p-10">
                  {activeTab === 'seeking' && (
                    <div className="space-y-6">
                      {seekingTips.map((tip, index) => (
                        <div key={index} className="bg-white/80 rounded-xl md:rounded-2xl p-4 sm:p-6 border border-orange-100 shadow-md hover:shadow-lg transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                              <tip.icon className="w-5 h-5 text-orange-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                              <p className="text-sm text-gray-700 leading-relaxed mb-3">{tip.description}</p>
                              
                              {tip.highlights && (
                                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mt-3">
                                  <p className="text-xs font-semibold text-orange-700 mb-2 uppercase tracking-wide">If you can:</p>
                                  <ul className="space-y-2">
                                    {tip.highlights.map((item, i) => (
                                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                        <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {tip.warning && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-3">
                                  <p className="text-sm text-red-800">{tip.warning}</p>
                                </div>
                              )}
                              
                              {tip.list && (
                                <ul className="space-y-2 mt-3">
                                  {tip.list.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                      <span className="text-orange-500 font-bold mt-0.5">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              
                              {tip.note && (
                                <p className="text-sm text-gray-700 mt-3 italic">{tip.note}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'listing' && (
                    <div className="space-y-6">
                      {listingTips.map((tip, index) => (
                        <div key={index} className="bg-white/80 rounded-xl md:rounded-2xl p-4 sm:p-6 border border-orange-100 shadow-md hover:shadow-lg transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                              <tip.icon className="w-5 h-5 text-orange-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                              <p className="text-sm text-gray-700 leading-relaxed mb-3">{tip.description}</p>
                              
                              {tip.list && (
                                <ul className="space-y-2 mt-3">
                                  {tip.list.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                      <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              
                              {tip.note && (
                                <p className="text-sm text-gray-700 mt-3 font-medium">{tip.note}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Note Card */}
            <div className="relative overflow-hidden rounded-xl md:rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-5 sm:p-8 md:p-10 shadow-xl shadow-orange-100/40 mb-8 sm:mb-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.10),transparent_60%)]" />
              <div className="relative">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">A Quick Note for Everyone</h3>
                    <p className="text-base leading-relaxed text-gray-700 mb-4">
                      Mokogo helps people find and connect with each other, but decisions around visits, payments, and move-ins are made directly between users. Take your time, communicate openly, and always do what feels right for you.
                    </p>
                    <p className="text-base leading-relaxed text-gray-700">
                      If you notice anything suspicious or misuse of the platform, feel free to reach out — your feedback helps keep Mokogo better for everyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Thought Card */}
            <div className="relative overflow-hidden rounded-xl md:rounded-[2rem] border border-orange-300 bg-gradient-to-br from-orange-400/10 via-orange-50 to-orange-400/5 p-5 sm:p-8 md:p-10 shadow-xl shadow-orange-200/40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.15),transparent_60%)]" />
              <div className="relative">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Final Thought</h3>
                    <p className="text-base leading-relaxed text-gray-700">
                      Finding the right place or person can take a bit of patience. Stay alert, trust your instincts, and don't rush the process. We're glad you're here, and we hope Mokogo helps you find a place that truly feels right.
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

export default SafetyTips
