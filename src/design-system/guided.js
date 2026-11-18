/*
 * Guided mode: instructor-controlled reveals
 * ------------------------------------------
 * When guided mode is ON (toolbar button or the G key), content wrapped in
 * <Step n={…}> stays hidden until the instructor advances. J / → shows the next
 * step in the current section; once every step is shown, it moves on to the
 * next section. K / ← goes back. Nothing advances on a timer, so you can take
 * as long as you need to explain each point.
 *
 * When guided mode is OFF (default for students), everything is visible and
 * simply animates in as you scroll.
 */
import { createContext, createElement, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'catalyst-guided'

export const GuidedContext = createContext({ guided: false, setGuided: () => {} })

export function GuidedProvider({ children }) {
  const [guided, setGuided] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, guided ? '1' : '0')
    } catch {
      /* storage unavailable: keep the in-memory value */
    }
  }, [guided])
  return createElement(GuidedContext.Provider, { value: { guided, setGuided } }, children)
}

export const useGuided = () => useContext(GuidedContext)

/** Step state of the enclosing <Section steps={n}>. */
export const StepContext = createContext({ step: Infinity, count: 0, setStep: () => {} })

/**
 * Returns { step, count, shown(n) } for the enclosing section.
 * shown(n) is true when step n should be visible (always true outside guided mode).
 */
export function useStep() {
  const { guided } = useGuided()
  const ctx = useContext(StepContext)
  const step = guided ? ctx.step : Infinity
  return { step, count: ctx.count, guided, shown: (n) => step >= n }
}

/** section id → { count, get(), set(n) }. Read by the recording controls. */
export const stepRegistry = new Map()
