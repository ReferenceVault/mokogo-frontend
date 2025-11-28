import { Link } from 'react-router-dom'
import Logo from './Logo'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-mokogo-gray">
      <div className="max-w-7xl mx-auto px-16 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo />
            <p className="text-sm text-gray-600 mt-4">
              India's safest flatmate platform. Find your perfect match without brokers.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="#" className="hover:text-mokogo-blue">About Us</Link></li>
              <li><Link to="#" className="hover:text-mokogo-blue">How it Works</Link></li>
              <li><Link to="#" className="hover:text-mokogo-blue">Safety</Link></li>
              <li><Link to="#" className="hover:text-mokogo-blue">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="#" className="hover:text-mokogo-blue">Help Center</Link></li>
              <li><Link to="#" className="hover:text-mokogo-blue">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-mokogo-blue">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="#" className="hover:text-mokogo-blue">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-mokogo-blue">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-mokogo-blue">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-mokogo-gray mt-8 pt-6 text-center text-sm text-gray-600">
          <p>© 2024 MOKOGO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
