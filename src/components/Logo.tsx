import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <img 
        src="/logo.jpeg" 
        alt="MOKOGO Logo" 
        className="h-10 w-10 object-contain"
      />
      <span className="text-2xl font-bold text-mokogo-primary">
        MOKOGO
      </span>
    </Link>
  )
}

export default Logo
