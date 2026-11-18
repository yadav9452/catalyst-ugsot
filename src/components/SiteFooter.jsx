import { Link } from 'react-router'
import { course } from '../course/curriculum'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <span className="logo-chip">
          <img src={`${import.meta.env.BASE_URL}catalyst-logo.png`} alt="upGrad School of Technology × Catalyst" />
        </span>
        <p>
          {course.program} · {course.semester} · <Link to="/">All lectures</Link>
        </p>
      </div>
    </footer>
  )
}
