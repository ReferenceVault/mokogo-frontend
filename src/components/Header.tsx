import { Link } from 'react-router-dom'
import Logo from './Logo'

const Header = () => {
  return (
    <header className="bg-white border-b border-mokogo-gray">
      <div className="max-w-7xl mx-auto px-16 py-4 flex justify-between items-center">
        <Logo />
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            Home
          </Link>
          <Link to="/auth/phone" className="text-mokogo-blue hover:text-blue-700 text-sm font-medium">
            Log in
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
