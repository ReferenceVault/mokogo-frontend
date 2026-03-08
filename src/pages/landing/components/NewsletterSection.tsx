interface NewsletterSectionProps {
  subscribeEmail: string
  onSubscribeEmailChange: (value: string) => void
  subscribeError: string | null
  subscribeSuccess: string | null
  isSubscribing: boolean
  onSubscribe: () => void
  whatsappCommunityUrl: string
}

const NewsletterSection = ({
  subscribeEmail,
  onSubscribeEmailChange,
  subscribeError,
  subscribeSuccess,
  isSubscribing,
  onSubscribe,
  whatsappCommunityUrl,
}: NewsletterSectionProps) => {
  return (
    <section className="w-full bg-gradient-to-br from-orange-100/80 to-orange-50 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-white/70 p-4 shadow-2xl backdrop-blur-xl sm:rounded-3xl sm:p-6 md:p-12">
          <div className="relative mx-auto max-w-[1177px]">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Stay Updated!</h2>
              <p className="text-gray-700">
                Subscribe to get updates on new listings in your area and exclusive deals
              </p>
              <p className="text-sm font-medium text-orange-600">
                Join 3,000+ people getting early alerts on new listings
              </p>
              {subscribeSuccess && (
                <div className="mx-auto max-w-lg whitespace-pre-line rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                  {subscribeSuccess}
                </div>
              )}
              {subscribeError && (
                <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                  {subscribeError}
                </div>
              )}
              <div className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={subscribeEmail}
                  onChange={(e) => onSubscribeEmailChange(e.target.value)}
                  className="flex-1 rounded-xl border border-orange-100 bg-white/90 px-6 py-3.5 text-gray-900 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={onSubscribe}
                  disabled={isSubscribing}
                  className="rounded-xl bg-orange-500 px-6 py-3.5 font-medium text-white shadow-md transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              <a
                href={whatsappCommunityUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-white px-6 py-3 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50"
              >
                💬 Join our WhatsApp Community →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsletterSection
