import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
      <img 
        src="/logo.jpeg" 
        alt="MOKOGO Logo" 
        className="h-9 w-9 sm:h-10 sm:w-10 object-contain flex-shrink-0"
      />
      <span className="text-xl sm:text-2xl font-bold text-mokogo-primary">
        MOKOGO
      </span>
    </Link>
  )
}

export default Logo
