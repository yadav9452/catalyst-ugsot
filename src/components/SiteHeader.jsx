import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

/**
 * Sticky top bar: co-branded logo (links home), optional lecture badge,
 * chapter links for the current lecture, and a reading-progress bar.
 */
export default function SiteHeader({ lectureNumber, chapters = [] }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [active, setActive] = useState('')

  useEffect(() => {
    if (!chapters.length) return
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [chapters])

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" aria-label="All lectures">
          <img src={`${import.meta.env.BASE_URL}catalyst-logo.png`} alt="upGrad School of Technology × Catalyst" />
          {lectureNumber && <span className="nav-lecture">Lecture {lectureNumber}</span>}
        </Link>
        {chapters.length > 0 && (
          <nav aria-label="Chapters">
            <ul className="nav-links">
              {chapters.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className={active === c.id ? 'is-active' : ''}>
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      {chapters.length > 0 && <motion.div className="nav-progress" style={{ scaleX }} aria-hidden="true" />}
    </header>
  )
}
