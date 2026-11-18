/* Lecture details used by the shared LectureLayout (hero, chapters, wrap-up, quiz). */
export const hero = {
  title: 'Main title of the lecture,',
  accent: 'highlighted part', // shown in red; optional
  subtitle: 'One sentence that tells students why this matters.',
  // visual: MyHeroAnimation, // optional component; defaults to a big lecture number
}

export const goals = [
  ['First goal', 'What students will be able to do'],
  ['Second goal', 'Keep it to 3–4 goals'],
]

// Top-bar links. Each id must match a <Section id="..."> in the lecture.
export const chapters = [
  { id: 'intro', label: 'Intro' },
  { id: 'concept', label: 'Core concept' },
]

export const why = [
  ['</>', 'How this connects to the code they will write'],
  ['⚡', 'A second reason it matters'],
]

export const recap = ['Key takeaway one.', 'Key takeaway two.', 'Key takeaway three.']

export const quiz = [
  {
    q: 'Question text?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    a: 1, // index of the correct option
    why: 'Short explanation shown after answering.',
  },
]

export const nextTeaser = 'One line about the next lecture (optional).'
