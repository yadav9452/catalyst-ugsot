import { useEffect } from 'react'
import { GuidedProvider } from './guided'
import { Link } from 'react-router'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { getNeighbours, getUnit } from '../course/curriculum'
import { hasContent } from '../lectures/registry'
import LectureHero from './LectureHero'
import RecordingControls from './RecordingControls'
import { Quiz, Recap, WhyItMatters } from './WrapUp'

/**
 * The page frame every lecture shares: header with chapters, hero, the lecture's
 * own sections, then the standard wrap-up (why it matters, recap, quiz) and "up next".
 *
 * `meta` comes from the lecture module's named exports:
 *   hero: { title, accent, subtitle, visual }, goals, chapters, why, recap, quiz
 */
export default function LectureLayout({ lecture, meta, children }) {
  const unit = getUnit(lecture.unit)
  const { prev, next } = getNeighbours(lecture.slug)
  const chapters = [...(meta.chapters ?? []), ...(meta.why || meta.recap ? [{ id: meta.why ? 'wrap-up' : 'recap', label: 'Wrap-up' }] : [])]

  useEffect(() => {
    document.title = `Lecture ${lecture.number} · ${lecture.title} | Catalyst`
  }, [lecture])

  return (
    <GuidedProvider>
      <a className="skip-link" href={`#${chapters[0]?.id ?? 'main'}`}>Skip to the lecture</a>
      <SiteHeader lectureNumber={lecture.number} chapters={chapters} />
      <main id="main">
        <LectureHero
          lecture={lecture}
          unitTitle={unit?.title}
          title={meta.hero?.title ?? lecture.title}
          accent={meta.hero?.accent}
          subtitle={meta.hero?.subtitle}
          visual={meta.hero?.visual}
          goals={meta.goals}
          firstChapter={chapters[0]?.id}
          hasQuiz={Boolean(meta.quiz?.length)}
        />
        {children}
        {meta.why && <WhyItMatters items={meta.why} />}
        {meta.recap && <Recap items={meta.recap} />}
        {meta.quiz && <Quiz questions={meta.quiz} />}
        <section className="nextup">
          <div className="container nextup-inner">
            <div>
              {next ? (
                <>
                  <p className="eyebrow">Up next · Lecture {next.number}</p>
                  <h2>{next.title}</h2>
                  <p>{meta.nextTeaser ?? next.topics.join(' · ')}</p>
                </>
              ) : (
                <>
                  <p className="eyebrow">That’s the last lecture</p>
                  <h2>Well done!</h2>
                </>
              )}
            </div>
            <div className="nextup-actions">
              {prev && (
                <Link className="btn btn-ghost" to={`/lecture/${prev.slug}`}>
                  ← Lecture {prev.number}
                </Link>
              )}
              {next && hasContent(next.slug) ? (
                <Link className="btn btn-white" to={`/lecture/${next.slug}`}>
                  Lecture {next.number} →
                </Link>
              ) : (
                <Link className="btn btn-white" to="/">
                  All lectures
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <RecordingControls />
    </GuidedProvider>
  )
}
