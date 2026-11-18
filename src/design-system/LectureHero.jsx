import { motion } from 'framer-motion'
import { Link } from 'react-router'

/**
 * Opening block of every lecture.
 * - `title` and optional `accent` (the part of the title shown in red)
 * - `visual`: optional component for the right-hand side; defaults to a big lecture number
 * - `goals`: [[title, description], ...]
 */
export default function LectureHero({ lecture, unitTitle, title, accent, subtitle, visual: Visual, goals = [], firstChapter, hasQuiz }) {
  return (
    <section className="lhero" id="top">
      <div className="container lhero-grid">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="lhero-crumbs">
            <Link to="/">All lectures</Link> <span aria-hidden="true">›</span> <span>{unitTitle}</span>
          </p>
          <p className="eyebrow">Catalyst · Lecture {lecture.number}</p>
          <h1>
            {title}
            {accent && (
              <>
                {' '}
                <span className="text-red">{accent}</span>
              </>
            )}
          </h1>
          {subtitle && <p className="lhero-sub">{subtitle}</p>}
          <div className="lhero-actions">
            {firstChapter && (
              <a className="btn btn-primary" href={`#${firstChapter}`}>
                Start the lecture ↓
              </a>
            )}
            {hasQuiz && (
              <a className="btn btn-ghost" href="#quiz">
                Jump to the self-check
              </a>
            )}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
          {Visual ? (
            <Visual />
          ) : (
            <div className="lhero-number" aria-hidden="true">
              <small>Lecture</small>
              <span>{String(lecture.number).padStart(2, '0')}</span>
            </div>
          )}
        </motion.div>
      </div>

      {goals.length > 0 && (
        <div className="container">
          <p className="eyebrow goals-title">What you’ll learn today</p>
          <ol className="goals">
            {goals.map(([t, d], i) => (
              <motion.li key={t} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
                <span className="goal-num">{String(i + 1).padStart(2, '0')}</span>
                <strong>{t}</strong>
                <span>{d}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}
