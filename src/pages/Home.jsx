import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import SiteFooter from '../components/SiteFooter'
import SiteHeader from '../components/SiteHeader'
import { course, getUnit, lectures, projects, units } from '../course/curriculum'
import { hasContent } from '../lectures/registry'

const pad = (n) => String(n).padStart(2, '0')

function LectureCard({ lecture, index }) {
  const ready = hasContent(lecture.slug)
  const body = (
    <>
      <div className="lcard-top">
        <span className="lcard-num">Lecture {pad(lecture.number)}</span>
        <span className={`status ${ready ? 'status-ready' : 'status-soon'}`}>{ready ? 'Ready' : 'Coming soon'}</span>
      </div>
      <h3>{lecture.title}</h3>
      <ul aria-label="Topics">
        {lecture.topics.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </>
  )
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (index % 3) * 0.06 }}>
      {ready ? (
        <Link className="lcard" to={`/lecture/${lecture.slug}`}>
          {body}
        </Link>
      ) : (
        <div className="lcard is-soon">{body}</div>
      )}
    </motion.div>
  )
}

function ProjectCard({ project, index }) {
  const unit = getUnit(project.unit)
  return (
    <motion.article
      className="pcard"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <div className="lcard-top">
        <span className="pcard-num">Project {pad(project.number)}</span>
        <span className="status status-soon">Coming soon</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <ul aria-label="Skills">
        {project.skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <p className="pcard-when">
        After Lecture {project.after} · {unit?.title}
      </p>
    </motion.article>
  )
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [unitFilter, setUnitFilter] = useState('all')

  useEffect(() => {
    document.title = `${course.name} · ${course.program} | ${course.school}`
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return lectures.filter(
      (l) =>
        (unitFilter === 'all' || l.unit === unitFilter) &&
        (!q || [l.title, ...l.topics, String(l.number)].join(' ').toLowerCase().includes(q)),
    )
  }, [query, unitFilter])

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="home-hero">
          <div className="container">
            <motion.p className="home-badge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              {course.program} · {course.semester}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              Learn how the web <span className="text-red">really works</span>.
            </motion.h1>
            <motion.p className="lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
              Interactive lessons for every lecture: try the ideas yourself, watch them animate, then check your understanding with a quick quiz.
            </motion.p>
            <div className="home-actions">
              <a className="btn btn-primary" href="#lectures">
                Browse lectures ↓
              </a>
              <a className="btn btn-ghost" href="#projects">
                See projects
              </a>
            </div>
          </div>
        </section>

        <section className="section home-lectures" id="lectures" aria-labelledby="lectures-title">
          <div className="container">
            <div className="home-tools">
              <h2 id="lectures-title">Lectures</h2>
              <input className="search" type="search" placeholder="Search lectures or topics…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search lectures" />
            </div>
            <div className="unit-filter" role="group" aria-label="Filter by unit">
              <button type="button" aria-pressed={unitFilter === 'all'} onClick={() => setUnitFilter('all')}>
                All units
              </button>
              {units.map((u) => (
                <button key={u.id} type="button" aria-pressed={unitFilter === u.id} onClick={() => setUnitFilter(u.id)} style={{ '--u': u.color, '--u-tint': u.tint }}>
                  <span className="dot" aria-hidden="true" />
                  {u.title.split(':')[0]}
                </button>
              ))}
            </div>

            {units.map((u, ui) => {
              const list = filtered.filter((l) => l.unit === u.id)
              if (!list.length) return null
              const first = list[0].number
              const last = list[list.length - 1].number
              return (
                <section className="unit" key={u.id} style={{ '--u': u.color, '--u-tint': u.tint }} aria-labelledby={`unit-${u.id}`}>
                  <div className="unit-head">
                    <span className="unit-badge">Unit {pad(ui + 1)}</span>
                    <h3 id={`unit-${u.id}`}>{u.title}</h3>
                    <span className="unit-range">{first === last ? `Lecture ${first}` : `Lectures ${first}–${last}`}</span>
                  </div>
                  <div className="lecture-grid">
                    {list.map((l, i) => (
                      <LectureCard key={l.slug} lecture={l} index={i} />
                    ))}
                  </div>
                </section>
              )
            })}
            {filtered.length === 0 && <p className="empty">No lectures match your search.</p>}
          </div>
        </section>

        <section className="section home-projects" id="projects" aria-labelledby="projects-title">
          <div className="container">
            <p className="eyebrow">Build something real</p>
            <h2 id="projects-title">Projects</h2>
            <p className="intro">Put the lectures into practice with complete, portfolio-ready builds.</p>
            <div className="project-grid">
              {projects.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
