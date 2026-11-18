/**
 * Finds lecture content automatically.
 *
 * Every folder in src/lectures/ named "<number>-<slug>" with an index.js is a
 * lecture. The slug must match one in src/course/curriculum.js. Folders that
 * start with "_" (like _template) are ignored.
 *
 * Each lecture is loaded only when someone opens it, so adding 20+ lectures
 * doesn't slow down the home page.
 */
const modules = import.meta.glob(['./*/index.js', '!./_*/index.js'])

const bySlug = Object.fromEntries(
  Object.entries(modules).map(([path, load]) => {
    const folder = path.split('/')[1] // e.g. "01-what-is-a-computer"
    return [folder.replace(/^\d+-/, ''), load]
  }),
)

export function hasContent(slug) {
  return slug in bySlug
}

export function loadLecture(slug) {
  return bySlug[slug]?.()
}
