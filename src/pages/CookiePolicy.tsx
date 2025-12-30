import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Cookie, FileText, Shield, Eye, Database, AlertCircle, Mail, CheckCircle, Settings } from 'lucide-react'

const CookiePolicy = () => {
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
              <Cookie className="w-4 h-4 text-orange-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Cookie Policy
            </h1>
            <p className="text-sm text-gray-700 max-w-3xl mx-auto mb-1">
              This Cookie Policy explains how Mokogo ("we", "our", "us") uses cookies and similar technologies when you visit or use our website and services ("Platform").
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
            <p className="text-gray-700 leading-relaxed">
              By continuing to use Mokogo, you agree to the use of cookies as described in this policy, unless you choose to disable them through your browser settings.
            </p>
          </div>

          {/* What are cookies? */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">What are cookies?</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-2">
                Cookies are small text files placed on your device (computer, phone, tablet) when you visit a website. They help the site remember information about your visit, which can improve your experience and make the website work properly.
              </p>
              <p className="text-sm text-gray-700">
                Cookies do not typically identify you personally, but they may be linked to personal data when combined with other information.
              </p>
            </div>
          </div>

          {/* How we use cookies */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Eye className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">How we use cookies</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 mb-3 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-2">Mokogo uses cookies to:</p>
              <ul className="space-y-1.5 text-sm text-gray-700 mb-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Ensure the website functions correctly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Keep you logged in and authenticated</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Improve performance and user experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Understand how users interact with the platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Protect against misuse, fraud, and security threats</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 font-medium">
                We do not use cookies to sell your personal data or track you across unrelated websites.
              </p>
            </div>
          </div>

          {/* Types of cookies we use */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Database className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Types of cookies we use</h2>
            </div>

            <div className="space-y-4">
              {/* 1. Strictly Necessary Cookies */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1.5">1. Strictly Necessary Cookies</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      These cookies are essential for the platform to function and cannot be switched off.
                    </p>
                    <p className="text-gray-700 font-medium mb-2">They help with:</p>
                    <ul className="space-y-1 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Account login and authentication</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Session management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Security and fraud prevention</span>
                      </li>
                    </ul>
                    <p className="text-gray-700 mt-3 text-sm italic">
                      Without these cookies, some parts of Mokogo may not work properly.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Performance & Analytics Cookies */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1.5">2. Performance & Analytics Cookies</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      These cookies help us understand how users use Mokogo, so we can improve it.
                    </p>
                    <p className="text-gray-700 font-medium mb-2">They may collect information such as:</p>
                    <ul className="space-y-1 text-gray-700 mb-3">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Pages visited</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Time spent on pages</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Error reports</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>General usage patterns</span>
                      </li>
                    </ul>
                    <p className="text-gray-700 text-sm italic">
                      All analytics data is collected in an aggregated and anonymized manner wherever possible.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Functional Cookies */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <Settings className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1.5">3. Functional Cookies</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      These cookies allow Mokogo to remember your preferences, such as:
                    </p>
                    <ul className="space-y-1 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Selected city or search preferences</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Language or display settings</span>
                      </li>
                    </ul>
                    <p className="text-gray-700 mt-3">
                      They help provide a more personalized experience.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Third-Party Cookies */}
              <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <Database className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1.5">4. Third-Party Cookies</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Some cookies may be placed by trusted third-party services we use, such as:
                    </p>
                    <ul className="space-y-1 text-gray-700 mb-3">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Analytics providers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Authentication services (e.g., Google Sign-In)</span>
                      </li>
                    </ul>
                    <p className="text-gray-700 text-sm italic">
                      These third parties process information according to their own privacy policies. Mokogo does not control how third-party cookies are used.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cookies we do not use */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Cookies we do not use</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-gray-700 font-medium mb-3">To be clear, Mokogo does not use cookies for:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Targeted advertising</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Cross-site tracking for ads</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>Selling user data to third parties</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Your choices and controls */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Settings className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Your choices and controls</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700 mb-2">You have control over how cookies are used:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>You can choose to block or delete cookies through your browser settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Most browsers allow you to manage cookies on a per-site basis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Blocking certain cookies may affect site functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>For more information, check your browser's help section</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Updates to this Cookie Policy */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Updates to this Cookie Policy</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-sm text-gray-700">
                We may update this Cookie Policy from time to time to reflect changes in technology, law, or how Mokogo operates. Any updates will be posted on this page with a revised "Last updated" date.
              </p>
            </div>
          </div>

          {/* Contact us */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Contact us</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-mokogo-gray p-4 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-orange-200">
              <p className="text-gray-700 mb-4">
                If you have questions about this Cookie Policy or how we use cookies, you can contact us at:
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

          {/* Final note */}
            <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-xl p-4 border border-orange-400/20 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-400/20 flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1.5">Final note</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                  We use cookies thoughtfully and only where they genuinely help make Mokogo work better for you.
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

export default CookiePolicy

