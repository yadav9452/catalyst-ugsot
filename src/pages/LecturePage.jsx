import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import SiteFooter from '../components/SiteFooter'
import SiteHeader from '../components/SiteHeader'
import { getLecture } from '../course/curriculum'
import { LectureLayout } from '../design-system'
import { hasContent, loadLecture } from '../lectures/registry'
import NotFound from './NotFound'

function ComingSoon({ lecture }) {
  return (
    <>
      <SiteHeader lectureNumber={lecture.number} />
      <main id="main" className="placeholder">
        <div className="container">
          <p className="eyebrow">Lecture {lecture.number} · Coming soon</p>
          <h1>{lecture.title}</h1>
          <p className="lead">This interactive lesson is being prepared. Here’s what it will cover:</p>
          <ul>
            {lecture.topics.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <Link className="btn btn-primary" to="/">
            ← All lectures
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

export default function LecturePage() {
  const { slug } = useParams()
  const lecture = getLecture(slug)
  const [loaded, setLoaded] = useState(null) // { slug, mod }
  const mod = loaded?.slug === slug ? loaded.mod : null

  useEffect(() => {
    let alive = true
    window.scrollTo(0, 0)
    loadLecture(slug)?.then((m) => alive && setLoaded({ slug, mod: m }))
    return () => {
      alive = false
    }
  }, [slug])

  if (!lecture) return <NotFound />
  if (!hasContent(slug)) return <ComingSoon lecture={lecture} />
  if (!mod) return <p className="loading">Loading lecture…</p>

  const { default: Content, ...meta } = mod
  return (
    <LectureLayout key={slug} lecture={lecture} meta={meta}>
      <Content />
    </LectureLayout>
  )
}
