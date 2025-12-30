// This will be used to render content in the modal
// For now, we'll use a simpler approach with the full pages

export const PrivacyPolicyContent = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-4">
      <p className="text-sm text-gray-600 mb-4">Last updated: 28th December, 2025</p>
      <p className="text-gray-700 mb-4">
        Mokogo ("we", "our", "us") respects your privacy and is committed to protecting your personal data. 
        This Privacy Policy explains how we collect, use, store, share, and protect your information when you use the Mokogo website, app, and related services ("Platform").
      </p>
      <p className="text-gray-700 font-medium mb-2">This policy is drafted in accordance with:</p>
      <ul className="space-y-1 text-gray-700 mb-6 text-sm">
        <li>• The Information Technology Act, 2000 and related IT Rules (India)</li>
        <li>• The Digital Personal Data Protection Act, 2023 (DPDP Act) principles</li>
        <li>• The General Data Protection Regulation (GDPR) for users in the European Union</li>
      </ul>
      <p className="text-gray-700 text-sm">
        For the complete Privacy Policy with all sections, please{' '}
        <a href="/privacy-policy" target="_blank" className="text-orange-400 hover:underline font-medium">
          view the full page
        </a>.
      </p>
    </div>
  )
}

export const TermsOfServiceContent = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-4">
      <p className="text-sm text-gray-600 mb-4">Last updated: 28th December, 2025</p>
      <p className="text-gray-700 mb-4">
        Welcome to Mokogo. These Terms of Service ("Terms") govern your access to and use of the Mokogo website, app, and related services ("Platform"). 
        By accessing or using Mokogo, you agree to be bound by these Terms.
      </p>
      <p className="text-gray-700 font-medium mb-2">Key points:</p>
      <ul className="space-y-1 text-gray-700 mb-6 text-sm">
        <li>• Mokogo is a platform that helps people list and discover rooms, shared spaces, and flatmates</li>
        <li>• Mokogo acts only as a discovery and connection platform</li>
        <li>• All interactions, decisions, and arrangements are made directly between users</li>
        <li>• You must be at least 18 years old to use the Platform</li>
        <li>• Mokogo does not collect rent, deposits, or booking fees</li>
      </ul>
      <p className="text-gray-700 text-sm">
        For the complete Terms of Service with all sections, please{' '}
        <a href="/terms-of-service" target="_blank" className="text-orange-400 hover:underline font-medium">
          view the full page
        </a>.
      </p>
    </div>
  )
}

