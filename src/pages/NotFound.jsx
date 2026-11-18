import { Link } from 'react-router'
import SiteFooter from '../components/SiteFooter'
import SiteHeader from '../components/SiteHeader'

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="placeholder">
        <div className="container">
          <p className="eyebrow">404</p>
          <h1>We couldn’t find that page.</h1>
          <Link className="btn btn-primary" to="/">
            ← All lectures
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
