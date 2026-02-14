import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import { AlertCircle, Heart, CheckCircle, Clock } from 'lucide-react'

const Contact = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const helpReasons = [
    "Have questions about using Mokogo",
    "Need help with your account or a listing",
    "Want to report something that doesn't feel right",
    "Have suggestions or feedback to improve the product",
    "Just want to say hello 🙂",
  ]

  const supportTips = [
    "The email or phone number linked to your account",
    "A brief description of the issue",
    "Screenshots (if applicable)",
  ]

  const reportIssues = [
    "A misleading listing",
    "Spam or suspicious behaviour",
    "Technical issues on the site",
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
              Get in Touch • We're Here to Help
            </span>
            <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-[2.9rem] font-bold leading-tight text-gray-900">
              Contact Us
            </h1>
            <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 rounded-full bg-orange-400/20 border border-orange-300/40 px-4 sm:px-6 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.35em] text-orange-800 shadow-lg shadow-orange-200/50 ring-1 ring-orange-300/30">
              <Clock className="w-4 h-4" />
              Response Time: 24–48 Hours
            </div>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl leading-relaxed text-gray-800">
              We'd love to hear from you 👋
            </p>
            <p className="mt-2 text-base sm:text-lg leading-relaxed text-gray-700">
              Whether you have a question, feedback, or need a little help, we're here.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="relative px-4 sm:px-6 md:px-[10%] py-10 sm:py-16 md:py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fef4f1] via-transparent to-transparent" />
          
          <div className="relative mx-auto max-w-6xl">
            {/* How can we help + Get in touch - Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {/* How can we help - Light Card */}
              <div className="relative overflow-hidden rounded-xl md:rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-5 sm:p-8 md:p-10 shadow-xl shadow-orange-100/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/50 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-700">
                    How We Can Help
                  </span>
                  <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-900">Reach out if you:</h3>
                  <ul className="mt-6 sm:mt-8 space-y-4 text-sm sm:text-base leading-relaxed text-gray-700">
                    {helpReasons.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-xs font-semibold text-orange-500 shadow-inner shadow-orange-200/50">
                          <CheckCircle className="h-3.5 w-3.5" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Get in touch - White Card */}
              <div className="relative overflow-hidden rounded-xl md:rounded-[2rem] border border-orange-200 bg-white p-5 sm:p-8 md:p-10 shadow-xl shadow-orange-100/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.08),transparent_60%)]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-700">
                    Get in Touch
                  </span>
                  <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-[#0f172a]">📧 Email</h3>
                  <div className="mt-6 bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-2xl p-5 border border-orange-400/20 shadow-lg">
                    <a 
                      href="mailto:hello@mokogo.in" 
                      className="text-base sm:text-xl font-bold text-orange-400 hover:text-orange-500 transition-colors block break-all"
                    >
                      hello@mokogo.in
                    </a>
                  </div>
                  <p className="mt-6 text-sm sm:text-base leading-relaxed text-[#3f4756]">
                    We usually respond within 24–48 hours on business days.
                  </p>
                </div>
              </div>

              {/* Support tips - Gradient Card */}
              <div className="relative overflow-hidden rounded-xl md:rounded-[2rem] border border-[#fde2db] bg-gradient-to-br from-[#fff4f1] via-white to-[#fffafa] p-5 sm:p-8 md:p-10 shadow-xl shadow-[#f8d8cf]/45 md:col-span-2 lg:col-span-1">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.14),transparent_60%)]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#f97316]">
                    Support Tips
                  </span>
                  <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-[#0f172a]">Help us help you faster</h3>
                  <p className="mt-3 text-sm text-[#3f4756]">
                    Please include:
                  </p>
                  <ul className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-[#3f4756]">
                    {supportTips.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#f97316]/10 text-xs font-semibold text-[#f97316] shadow-inner shadow-[#fcd8ce]/50">
                          <CheckCircle className="h-3.5 w-3.5" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Reporting an issue - Full Width */}
            <div className="relative overflow-hidden rounded-xl md:rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-5 sm:p-8 md:p-10 shadow-xl shadow-orange-100/40 mb-8 sm:mb-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),transparent_60%)]" />
              <div className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/50 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-700">
                      Reporting an Issue
                    </span>
                    <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">Keep Mokogo Safe</h2>
                  </div>
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-6">
                  If you come across any of the following, please contact us right away. Your feedback helps keep Mokogo safe and useful for everyone.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {reportIssues.map((item, index) => (
                    <div key={index} className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white p-4 sm:p-5 border border-orange-200 shadow-sm">
                      <div className="flex items-start gap-3">
                        <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-xs font-semibold text-orange-500">
                          <span className="text-orange-500 font-bold">•</span>
                        </span>
                        <span className="text-sm sm:text-base text-gray-700">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* A small note - Final Card */}
            <div className="relative overflow-hidden rounded-xl md:rounded-[2rem] border border-[#fde1da] bg-gradient-to-br from-[#fff4f1] via-white to-[#fff9f6] p-5 sm:p-8 md:p-10 shadow-xl shadow-[#f8d8cf]/45">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_60%)]" />
              <div className="relative flex flex-col md:flex-row items-start gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl md:rounded-2xl bg-[#f97316]/20 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-[#f97316]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 sm:px-4 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#f97316]">
                    A Small Note
                  </span>
                  <h3 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-semibold text-[#0f172a]">Thanks for being part of the journey 💛</h3>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#3a4a61]">
                    Mokogo is still growing. We're constantly learning and improving, and your feedback plays a big role in shaping the platform.
                  </p>
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

export default Contact
