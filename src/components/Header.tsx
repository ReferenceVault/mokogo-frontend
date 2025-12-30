import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

const Header = () => {
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/'
    }
    return currentPath.startsWith(path)
  }

  return (
    <header className="bg-white border-b border-mokogo-gray">
      <div className="max-w-7xl mx-auto px-16 py-4 flex justify-between items-center">
        {/* Left: Logo */}
        <Logo />
        
        {/* Middle section with Menu items */}
        <nav className="flex items-center gap-8">
          <Link 
            to="/explore" 
            className={`text-sm font-medium transition-colors ${
              isActive('/explore') || isActive('/city')
                ? 'text-mokogo-primary font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Find Your Place
          </Link>
          <Link 
            to="/how-it-works" 
            className={`text-sm font-medium transition-colors ${
              isActive('/how-it-works')
                ? 'text-mokogo-primary font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            How It Works
          </Link>
          <Link 
            to="/auth" 
            className={`text-sm font-medium transition-colors ${
              isActive('/auth') || isActive('/listing') || isActive('/dashboard')
                ? 'text-mokogo-primary font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            List Your Space
          </Link>
        </nav>

        {/* Right section with Log in button */}
        <div className="flex items-center">
          <Link 
            to="/auth" 
            className="bg-orange-400 text-white px-4 py-2 rounded-full font-medium hover:bg-orange-500 transition-colors shadow-md"
          >
            Log in
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
