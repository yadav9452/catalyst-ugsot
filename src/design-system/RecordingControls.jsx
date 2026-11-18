import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { stepRegistry, useGuided } from './guided'

/**
 * Floating controls for recording lectures.
 * Keyboard: J / → next step or section · K / ← back · G guided mode · P presenter mode · ? help
 * Arrow keys only act when no input or button is focused.
 */
const OFFSET = 90

function sectionList() {
  return [...document.querySelectorAll('main section.section, main > section')]
}

/** The section crossing the line 40% down the viewport. */
function currentSection() {
  const line = window.innerHeight * 0.4
  return sectionList().find((s) => {
    const r = s.getBoundingClientRect()
    return r.top <= line && r.bottom > line
  })
}

function scrollToSection(direction) {
  const list = sectionList()
  const y = window.scrollY + OFFSET + 2
  const tops = list.map((s) => s.getBoundingClientRect().top + window.scrollY)
  const target = direction > 0 ? tops.find((t) => t > y + 4) : [...tops].reverse().find((t) => t < y - 8)
  if (target !== undefined) window.scrollTo({ top: target - OFFSET + 1, behavior: 'smooth' })
}

function advance(direction, guided) {
  if (guided) {
    const sec = currentSection()
    const entry = sec && stepRegistry.get(sec.id)
    if (entry) {
      const s = entry.get()
      if (direction > 0 && s < entry.count) return entry.set(s + 1)
      if (direction < 0 && s > 0) return entry.set(s - 1)
    }
  }
  scrollToSection(direction)
}

export default function RecordingControls() {
  const { guided, setGuided } = useGuided()
  const [presenter, setPresenter] = useState(() => document.documentElement.hasAttribute('data-presenter'))
  const [help, setHelp] = useState(false)

  const togglePresenter = useCallback(() => setPresenter((p) => !p), [])
  const toggleGuided = useCallback(() => setGuided((g) => !g), [setGuided])

  useEffect(() => {
    if (presenter) document.documentElement.setAttribute('data-presenter', '')
    else document.documentElement.removeAttribute('data-presenter')
  }, [presenter])

  useEffect(() => {
    function onKey(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = document.activeElement?.tagName
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || document.activeElement?.isContentEditable
      if (typing) return
      const k = e.key.toLowerCase()
      const onControl = tag === 'BUTTON'
      if (k === 'j' || (k === 'arrowright' && !onControl)) {
        e.preventDefault()
        advance(1, guided)
      } else if (k === 'k' || (k === 'arrowleft' && !onControl)) {
        e.preventDefault()
        advance(-1, guided)
      } else if (k === 'g') toggleGuided()
      else if (k === 'p') togglePresenter()
      else if (k === '?') setHelp((h) => !h)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [guided, toggleGuided, togglePresenter])

  return (
    <>
      <AnimatePresence>
        {help && (
          <motion.div className="rec-help" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            <strong>Recording shortcuts</strong>
            <ul>
              <li><kbd>J</kbd> or <kbd>→</kbd> next step, then next section</li>
              <li><kbd>K</kbd> or <kbd>←</kbd> back</li>
              <li><kbd>G</kbd> guided mode: you reveal each point</li>
              <li><kbd>P</kbd> presenter mode (bigger text)</li>
              <li><kbd>?</kbd> show or hide this help</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="rec" role="toolbar" aria-label="Recording controls">
        <button type="button" className="rec-guided" onClick={toggleGuided} aria-pressed={guided} title="Guided mode (G)">
          {guided ? 'Guided: on' : 'Guided: off'}
        </button>
        <button type="button" onClick={() => advance(-1, guided)} aria-label="Back" title="Back (K)">
          ←
        </button>
        <button type="button" onClick={() => advance(1, guided)} aria-label="Next" title="Next (J)">
          →
        </button>
        <button type="button" onClick={togglePresenter} aria-pressed={presenter} aria-label="Presenter mode" title="Presenter mode (P)">
          ⛶
        </button>
        <button type="button" onClick={() => setHelp((h) => !h)} aria-pressed={help} aria-label="Keyboard shortcuts" title="Shortcuts (?)">
          ?
        </button>
      </div>
    </>
  )
}
