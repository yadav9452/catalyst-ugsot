/**
 * The course outline: one place that lists every unit and lecture.
 *
 * To publish a lecture's interactive page, create a folder in src/lectures/
 * named "<two-digit number>-<slug>" (for example "02-computer-internals").
 * The registry picks it up automatically and the lecture shows as "Ready".
 * Lectures without a folder show as "Coming soon".
 *
 * Projects are listed separately (see `projects` below) so lecture numbers
 * stay continuous.
 */

export const course = {
  name: 'Catalyst',
  program: 'Full Stack Development',
  semester: 'Semester 1',
  school: 'upGrad School of Technology',
}

// `color` is the unit's accent (badges, stripes); `tint` is its soft background.
export const units = [
  { id: 'computers', title: 'Basics of Computers', color: '#E00C16', tint: '#FDECED' },
  { id: 'linux', title: 'Linux Foundations', color: '#5B3FD1', tint: '#EFECFC' },
  { id: 'git', title: 'Git, GitHub & Version Control', color: '#D9480F', tint: '#FDEFE6' },
  { id: 'html', title: 'Complete HTML: Building the Structure of the Web', color: '#0B7A75', tint: '#E5F4F3' },
  { id: 'css', title: 'CSS Styling, Layout and Responsive Thinking', color: '#1F5FD1', tint: '#E9F0FC' },
  { id: 'tailwind', title: 'Tailwind CSS', color: '#0E7490', tint: '#E4F3F7' },
]

export const lectures = [
  { number: 1, slug: 'what-is-a-computer', unit: 'computers', title: 'What Is a Computer and How It Works',
    topics: ['Definition and real-life examples', 'Hardware vs software', 'Input, process, output', 'Types of computers'] },
  { number: 2, slug: 'computer-internals', unit: 'computers', title: 'Computer Internals: Hardware, Software & Instructions',
    topics: ['CPU, RAM and storage', 'Input and output devices', 'System vs application software', 'Programs as step-by-step instructions'] },
  { number: 3, slug: 'introduction-to-linux', unit: 'linux', title: 'Introduction to Linux',
    topics: ['What an operating system does', 'Linux vs Windows vs macOS', 'Where Linux is used'] },
  { number: 4, slug: 'linux-architecture', unit: 'linux', title: 'Linux Architecture',
    topics: ['Kernel, shell, file system', 'CLI vs GUI', 'The terminal in development'] },
  { number: 5, slug: 'linux-file-system', unit: 'linux', title: 'Linux File System Structure',
    topics: ['Root directory and key folders', 'Absolute vs relative paths', 'Working with files and folders'] },
  { number: 6, slug: 'permissions-and-ownership', unit: 'linux', title: 'Understanding Permissions and Ownership',
    topics: ['Read, write, execute', 'User, group, others', 'Why permissions matter'] },
  { number: 7, slug: 'package-management', unit: 'linux', title: 'Package Management and Software Installation',
    topics: ['What package managers do', 'apt basics', 'Linux as a web server OS', 'Local vs production'] },
  { number: 8, slug: 'why-version-control', unit: 'git', title: 'Why Version Control Exists and What Git Solves',
    topics: ['Problems with manual copies', 'Git vs GitHub', 'First commits and history'] },
  { number: 9, slug: 'how-git-tracks-changes', unit: 'git', title: 'How Git Internally Tracks Changes',
    topics: ['Working directory, staging, repository', 'Commits as snapshots', 'Branching, merging, rebase'] },
  { number: 10, slug: 'collaboration-with-github', unit: 'git', title: 'Collaboration Using GitHub',
    topics: ['Remotes and SSH keys', 'Push, pull, clone, fetch', 'Merge conflicts and forking'] },
  { number: 11, slug: 'html-basics', unit: 'html', title: 'HTML Basics',
    topics: ['What HTML is', 'How browsers parse HTML', 'Document anatomy', 'Block vs inline'] },
  { number: 12, slug: 'structuring-content', unit: 'html', title: 'Structuring Content the Way the Web Expects',
    topics: ['Headings and hierarchy', 'Lists', 'Links and images'] },
  { number: 13, slug: 'semantic-html', unit: 'html', title: 'Grouping, Semantics, and Modern HTML Layout',
    topics: ['div vs semantic elements', 'Accessibility basics', 'SEO and semantics'] },
  { number: 14, slug: 'forms-tables-metadata', unit: 'html', title: 'Data Collection, Metadata, and HTML Best Practices',
    topics: ['Tables', 'Forms and input types', 'Metadata', 'Common mistakes'] },
  { number: 15, slug: 'how-css-works', unit: 'css', title: 'How CSS Works Inside the Browser',
    topics: ['Selectors, properties, values', 'Cascade and inheritance', 'Specificity'] },
  { number: 16, slug: 'css-box-model', unit: 'css', title: 'The CSS Box Model and Visual Formatting',
    topics: ['Content, padding, border, margin', 'box-sizing', 'Display types'] },
  { number: 17, slug: 'css-layout-systems', unit: 'css', title: 'Modern CSS Layout Systems',
    topics: ['Normal flow', 'Flexbox', 'Grid', 'Flex vs grid'] },
  { number: 18, slug: 'responsive-design', unit: 'css', title: 'Responsive Design, Typography, and Real-World CSS',
    topics: ['CSS units', 'Media queries', 'Animations and transitions', 'Typography'] },
  { number: 19, slug: 'mastering-css', unit: 'css', title: 'Mastering CSS',
    topics: ['Responsive layouts with Flexbox and Grid', 'Production-ready CSS'] },
  { number: 20, slug: 'tailwind-basics', unit: 'tailwind', title: 'Tailwind CSS as a Different Way to Write CSS',
    topics: ['Utility-first', 'Tailwind vs core CSS', 'Setup: CDN vs build'] },
  { number: 21, slug: 'tailwind-layout-and-customization', unit: 'tailwind', title: 'Layout, Responsiveness, and Customization in Tailwind',
    topics: ['Layout utilities', 'Responsive modifiers', 'States', 'Configuration'] },
]

// Hands-on projects, kept separate from lectures. `after` = the lecture they follow.
export const projects = [
  { number: 1, slug: 'css-multipage-website', unit: 'css', after: 19, title: 'CSS Multi-page Website',
    summary: 'Build a complete multi-page site with semantic HTML and responsive CSS.',
    skills: ['Semantic HTML', 'Flexbox and Grid', 'Responsive design'] },
  { number: 2, slug: 'redbus-clone', unit: 'css', after: 19, title: 'Redbus Clone',
    summary: 'Recreate a real-world booking site’s layout from scratch.',
    skills: ['Layout', 'Forms', 'Responsive design'] },
]

export function getLecture(slug) {
  return lectures.find((l) => l.slug === slug)
}

export function getUnit(id) {
  return units.find((u) => u.id === id)
}

export function getNeighbours(slug) {
  const i = lectures.findIndex((l) => l.slug === slug)
  return { prev: lectures[i - 1], next: lectures[i + 1] }
}
