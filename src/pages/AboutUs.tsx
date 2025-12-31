import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import { Shield, Home, CheckCircle, HandHeart } from 'lucide-react'

const AboutUs = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const problemPoints = [
    "Brokers with high fees",
    "Noisy social media groups",
    "Endless messages with little clarity",
    "Time pressure when someone is moving out",
  ]

  const corePrinciples = [
    { title: "Transparency", desc: "Clear information, no hidden agendas" },
    { title: "Trust", desc: "Enough context to make informed decisions" },
    { title: "Respect", desc: "For people's time, space, and boundaries" },
    { title: "Simplicity", desc: "No unnecessary steps or dark patterns" },
    { title: "People over transactions", desc: "Homes are shared by humans, not listings" },
  ]

  const whatWeDo = [
    "List a room or shared space easily",
    "Discover places that match their needs",
    "Connect directly with each other",
  ]

  const whatWeDont = [
    "We don't act as brokers.",
    "We don't push payments or deals.",
    "We don't decide outcomes.",
  ]

  const experiences = [
    "The stress of finding a place quickly",
    "The awkward back-and-forth with strangers",
    "The lack of reliable information when it matters most",
  ]

  const promises = [
    "Be honest about what Mokogo can and can't do",
    "Avoid shortcuts that compromise trust",
    "Build with users, not just for them",
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
              Our Story • Why We Exist
            </span>
            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-[2.9rem] font-bold leading-tight text-gray-900">
              About Mokogo
            </h1>
            <p className="mt-5 text-lg sm:text-xl leading-relaxed text-gray-800">
              Finding a place to live shouldn't feel confusing, rushed, or uncomfortable.
            </p>
            <p className="mt-2 text-base sm:text-lg leading-relaxed text-gray-700">
              Yet for many people, it does.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="relative px-6 md:px-[10%] py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fef4f1] via-transparent to-transparent" />
          
          <div className="relative mx-auto max-w-6xl">
            {/* Why Mokogo Exists + What We Believe - Grid Layout */}
            <div className="grid gap-8 lg:grid-cols-2 mb-12">
              {/* Why Mokogo Exists - Light Card */}
              <div className="relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-8 md:p-10 shadow-xl shadow-orange-100/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/50 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-700">
                    Why Mokogo Exists
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold text-gray-900">The Problem We're Solving</h3>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-700 mb-6">
                    Mokogo was built for a simple reason: finding a room or a flatmate today is harder than it needs to be.
                  </p>
                  <p className="text-sm font-medium text-gray-800 mb-4">People often rely on:</p>
                  <ul className="space-y-3 text-sm sm:text-base leading-relaxed text-gray-700">
                    {problemPoints.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-xs font-semibold text-orange-500 shadow-inner shadow-orange-200/50">
                          <span className="text-orange-500 font-bold">•</span>
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-sm sm:text-base leading-relaxed text-gray-700">
                    In all of this, what's often missing is context, trust, and compatibility. We wanted to change that.
                  </p>
                </div>
              </div>

              {/* What We Believe - Gradient Card */}
              <div className="relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-[#fff4f1] via-white to-[#fffafa] p-8 md:p-10 shadow-xl shadow-[#f8d8cf]/45">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.14),transparent_60%)]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#f97316]">
                    What We Believe
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold text-[#0f172a]">Our Core Principles</h3>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-700 mb-6">
                    We believe that finding a place to live is not just a transaction — it's a personal decision.
                  </p>
                  <ul className="space-y-4 text-sm sm:text-base leading-relaxed text-[#3f4756]">
                    {corePrinciples.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#f97316]/10 text-xs font-semibold text-[#f97316] shadow-inner shadow-[#fcd8ce]/50">
                          <CheckCircle className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <span className="font-semibold text-gray-900">{item.title}</span>
                          <span className="text-gray-700"> – {item.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* What Mokogo Does - Full Width */}
            <div className="relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-8 md:p-10 shadow-xl shadow-orange-100/40 mb-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),transparent_60%)]" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center">
                    <Home className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/50 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-700">
                      What Mokogo Does
                    </span>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900">Our Mission</h2>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-2xl p-6 border border-orange-200 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Mokogo helps people:</h4>
                    <ul className="space-y-3 text-sm sm:text-base leading-relaxed text-gray-700">
                      {whatWeDo.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-xs font-semibold text-orange-500">
                            <CheckCircle className="h-3.5 w-3.5" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 rounded-2xl p-6 border border-orange-200 shadow-sm">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-orange-400/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-orange-500" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">What We Don't Do</h4>
                    </div>
                    <ul className="space-y-3 text-sm sm:text-base leading-relaxed text-gray-700">
                      {whatWeDont.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-xs font-semibold text-orange-500">
                            <span className="text-orange-500 font-bold">•</span>
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm font-medium text-gray-800">
                      Mokogo is a discovery and connection platform — decisions happen directly between people.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Built from Real Experience + Today & What's Ahead - Grid Layout */}
            <div className="grid gap-8 lg:grid-cols-2 mb-12">
              {/* Built from Real Experience - Light Card */}
              <div className="relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-8 md:p-10 shadow-xl shadow-orange-100/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/50 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-700">
                    Built from Real Experience
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold text-gray-900">Our Story</h3>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-700 mb-6">
                    Mokogo is built by people who've personally experienced:
                  </p>
                  <ul className="space-y-3 text-sm sm:text-base leading-relaxed text-gray-700 mb-6">
                    {experiences.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-xs font-semibold text-orange-500 shadow-inner shadow-orange-200/50">
                          <span className="text-orange-500 font-bold">•</span>
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                    This isn't an abstract problem for us. It's a very real one — and that's why we care deeply about getting it right.
                  </p>
                </div>
              </div>

              {/* Today & What's Ahead - Gradient Card */}
              <div className="relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-[#fff4f1] via-white to-[#fffafa] p-8 md:p-10 shadow-xl shadow-[#f8d8cf]/45">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.14),transparent_60%)]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#f97316]">
                    Today & What's Ahead
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold text-[#0f172a]">Our Journey</h3>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-700 mb-6">
                    We're starting in India, where this problem is especially common — but our thinking isn't limited by geography.
                  </p>
                  <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-2xl p-5 border border-orange-400/20 mb-6">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Our goal is simple:</p>
                    <p className="text-sm sm:text-base text-gray-700">
                      To make finding the right place — and the right people — feel easier, calmer, and more human.
                    </p>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                    We're building Mokogo step by step, listening closely to users, and improving as we go.
                  </p>
                </div>
              </div>
            </div>

            {/* A Small Promise - Final Card */}
            <div className="relative overflow-hidden rounded-[2rem] border border-[#fde1da] bg-gradient-to-br from-[#fff4f1] via-white to-[#fff9f6] p-8 md:p-10 shadow-xl shadow-[#f8d8cf]/45">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_60%)]" />
              <div className="relative flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#f97316]/20 flex items-center justify-center flex-shrink-0">
                  <HandHeart className="w-8 h-8 text-[#f97316]" />
                </div>
                <div className="flex-1">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#f97316]">
                    A Small Promise
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold text-[#0f172a]">Our Commitment to You</h3>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#3a4a61] mb-6">
                    We promise to:
                  </p>
                  <ul className="space-y-3 text-sm sm:text-base leading-relaxed text-[#3f4756] mb-6">
                    {promises.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#f97316]/10 text-xs font-semibold text-[#f97316] shadow-inner shadow-[#fcd8ce]/40">
                          <CheckCircle className="h-3.5 w-3.5" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-2xl p-5 border border-orange-400/20">
                    <p className="text-sm sm:text-base font-medium text-gray-900">
                      If you're here, thank you for being part of the journey.
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

export default AboutUs
