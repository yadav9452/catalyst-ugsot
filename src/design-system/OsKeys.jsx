import { useState } from 'react'

/** Turns "[Ctrl] + [C]" into <kbd>Ctrl</kbd> + <kbd>C</kbd>. Plain text stays as it is. */
export function Keys({ children }) {
  const parts = String(children).split(/(\[[^\]]+\])/g)
  return parts.map((p, i) => (p.startsWith('[') && p.endsWith(']') ? <kbd key={i}>{p.slice(1, -1)}</kbd> : <span key={i}>{p}</span>))
}

/**
 * Windows vs Mac shortcuts side by side. Most students use Windows, so it comes first.
 * rows: [action, windows, mac]. Wrap keys in [brackets] to draw them as keys: "[Ctrl] + [C]".
 * Students can pick their computer to highlight their column.
 */
export default function OsKeys({ rows, title, note, winLabel = 'Windows (Ubuntu / WSL)', macLabel = 'Mac (Terminal)' }) {
  const [os, setOs] = useState('both')
  return (
    <div className={`oskeys show-${os}`}>
      <div className="oskeys-head">
        {title && <h3>{title}</h3>}
        <div className="oskeys-pick" role="group" aria-label="Highlight my computer">
          {[
            ['both', 'Both'],
            ['win', '⊞ Windows'],
            ['mac', '⌘ Mac'],
          ].map(([k, t]) => (
            <button key={k} type="button" className={os === k ? 'is-on' : ''} onClick={() => setOs(k)} aria-pressed={os === k}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="oskeys-table" role="table">
        <div className="oskeys-row oskeys-th" role="row">
          <span role="columnheader">To do this</span>
          <span role="columnheader" className="c-win">
            {winLabel}
          </span>
          <span role="columnheader" className="c-mac">
            {macLabel}
          </span>
        </div>
        {rows.map(([what, win, mac]) => (
          <div key={what} className="oskeys-row" role="row">
            <span role="cell" className="c-what">
              {what}
            </span>
            <span role="cell" className="c-win" data-os="Windows">
              <Keys>{win}</Keys>
            </span>
            <span role="cell" className="c-mac" data-os="Mac">
              <Keys>{mac}</Keys>
            </span>
          </div>
        ))}
      </div>
      {note && <p className="oskeys-note">{note}</p>}
    </div>
  )
}
