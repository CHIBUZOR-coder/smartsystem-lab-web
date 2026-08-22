import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <h1 className="text-6xl font-bold text-brand-navy">404</h1>
      <p className="text-brand-text-body text-lg">Page not found.</p>
      <Link to="/" className="text-brand-accent underline underline-offset-4">
        Go back home
      </Link>
    </div>
  )
}

export default NotFound
