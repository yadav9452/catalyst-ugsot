import HeroHtml from './sections/HeroHtml'

export const hero = {
  title: 'HTML Basics: The Skeleton of the',
  accent: 'Web',
  subtitle:
    'Every website on earth is built on HTML. Learn how browsers turn raw text and tags into text, images, forms and buttons on your screen.',
  visual: HeroHtml,
}

export const goals = [
  ['What HTML is', 'Understand tags, elements, attributes and what HTML actually does'],
  ['Browser parsing', 'How browsers read raw markup and build the DOM tree'],
  ['Document anatomy', 'The standard structure: <!DOCTYPE>, <html>, <head>, and <body>'],
  ['Block vs Inline', 'How elements layout by default and how they behave on the page'],
]

// Top-bar links. Each id must match a <Section id="..."> in the lecture.
export const chapters = [
  { id: 'opener', label: 'Opener' },
  { id: 'what-is-html', label: 'What is HTML?' },
  { id: 'anatomy', label: 'Tag anatomy' },
  { id: 'dom-parsing', label: 'Browser & DOM' },
  { id: 'doc-structure', label: 'Doc structure' },
  { id: 'block-inline', label: 'Block vs Inline' },
  { id: 'sandbox', label: 'HTML Lab' },
  { id: 'dev-life', label: 'Developer life' },
]

export const why = [
  ['🏗️', 'HTML is the skeleton of every website and web application ever created'],
  ['📱', 'Correct HTML ensures your site works on phones, screen readers, and slow connections'],
  ['🔍', 'Search engines like Google read your HTML tags to understand and rank your content'],
  ['🎨', 'CSS and JavaScript both rely on a clean HTML structure to style and add interaction'],
]

export const recap = [
  'HTML stands for HyperText Markup Language: it describes structure and content, not design or styling.',
  'An HTML element consists of an opening tag (<p>), attributes (class="lead"), content, and a closing tag (</p>).',
  'Void tags (like <img>, <input>, <br>, <meta>) do not have closing tags or inner text.',
  'Browsers read raw HTML text and parse it into an internal tree structure called the Document Object Model (DOM).',
  'Every valid HTML document needs <!DOCTYPE html>, <html>, <head> (metadata, title), and <body> (visible content).',
  'Block elements (<div>, <p>, <h1>, <ul>) start on a new line and take 100% available width by default.',
  'Inline elements (<span>, <a>, <strong>, <em>) stay in the text flow and only take as much width as their content.',
  'Attributes provide extra information or configuration to tags (e.g. href on <a>, src and alt on <img>).',
]

export const quiz = [
  {
    q: 'What does HTML stand for?',
    options: [
      'HyperText Markup Language',
      'HighTech Modern Language',
      'Hyperlink Text Master Language',
      'Home Tool Markup Language',
    ],
    a: 0,
    why: 'HTML stands for HyperText Markup Language. It uses tags to mark up text and define page structure.',
  },
  {
    q: 'Which of the following is a void (self-closing / contentless) element?',
    options: ['<p>', '<div>', '<img>', '<span>'],
    a: 2,
    why: '<img> cannot contain text or other elements, so it has no closing </img> tag.',
  },
  {
    q: 'What is the DOM in browser terminology?',
    options: [
      'Domain Object Model: the web domain server',
      'Document Object Model: the tree representation of parsed HTML in memory',
      'Data Output Mode: how CSS renders text',
      'Direct Operating Module: the browser engine',
    ],
    a: 1,
    why: 'The DOM is the in-memory tree of nodes built by the browser when it parses HTML text.',
  },
  {
    q: 'Where does visible page content go in an HTML document?',
    options: ['Inside <head>', 'Inside <!DOCTYPE>', 'Inside <body>', 'Inside <title>'],
    a: 2,
    why: 'The <body> tag holds everything visitors see on screen (text, images, buttons). <head> holds invisible metadata.',
  },
  {
    q: 'What is the default layout behavior of a <div> element?',
    options: [
      'It sits inline inside text',
      'It starts on a new line and spans full width (Block)',
      'It automatically centers on screen',
      'It stays hidden until styled',
    ],
    a: 1,
    why: '<div> is a block-level element, so it takes up its own line and full width by default.',
  },
  {
    q: 'What happens if you nest a Block element inside a <span> (Inline element)?',
    options: [
      'It is perfectly valid HTML',
      'The browser crashes',
      'It is invalid HTML; inline elements should not wrap block elements',
      'The block element turns into an inline element automatically',
    ],
    a: 2,
    why: 'In standard HTML, inline elements (like <span> or <a>) should not wrap block elements (like <div> or <p>).',
  },
  {
    q: 'What is the purpose of the alt attribute on an <img> tag?',
    options: [
      'Sets the image alignment on screen',
      'Provides alternative text for screen readers and when the image fails to load',
      'Specifies an alternate URL for high-res screens',
      'Applies a CSS filter to the image',
    ],
    a: 1,
    why: 'alt describes the image for visually impaired users and displays text if the image link breaks.',
  },
  {
    q: 'Why does <!DOCTYPE html> go at the very top of the document?',
    options: [
      'It imports standard CSS styles',
      'It tells the browser to use modern HTML5 standard rendering mode',
      'It connects the site to the internet',
      'It sets up JavaScript execution',
    ],
    a: 1,
    why: '<!DOCTYPE html> ensures the browser renders the page in standard mode rather than legacy "quirks" mode.',
  },
]

export const nextTeaser = 'Structuring Content: Headings, Paragraphs, Lists, Links, and Images.'
