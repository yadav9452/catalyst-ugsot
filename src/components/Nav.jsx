import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

const chapters = [
  { id: 'warmup', label: 'Why computers' },
  { id: 'definition', label: 'What is a computer' },
  { id: 'ipos', label: 'IPOS cycle' },
  { id: 'hwsw', label: 'Hardware & software' },
  { id: 'types', label: 'Types' },
  { id: 'recap', label: 'Wrap-up' },
]

export default function Nav() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [active, setActive] = useState('')

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#top" className="nav-brand" aria-label="Back to top">
          <img src="/upgrad-sot-logo.png" alt="upGrad School of Technology" />
          <span className="nav-lecture">Lecture 1</span>
        </a>
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
      </div>
      <motion.div className="nav-progress" style={{ scaleX }} aria-hidden="true" />
    </header>
  )
}
