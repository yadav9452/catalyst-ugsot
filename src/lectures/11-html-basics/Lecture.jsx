// import './lecture.css' // optional: styles only this lecture needs
import HeroHtml from './sections/HeroHtml'
import Opener from './sections/Opener'
import WhatIsHtml from './sections/WhatIsHtml'
import TagAnatomy from './sections/TagAnatomy'
import DomParsing from './sections/DomParsing'
import DocumentStructure from './sections/DocumentStructure'
import BlockInline from './sections/BlockInline'
import Sandbox from './sections/Sandbox'
import DevLife from './sections/DevLife'

const _hero = {
  title: 'HTML Basics: The Skeleton of the',
  accent: 'Web',
  subtitle: "Learn what HTML is, how browsers turn tags into pages, and why block vs inline elements matters for layout.",
  visual: HeroHtml,
}

const _goals = [
  ['What HTML is', 'Understand tags, elements, attributes and what HTML actually does'],
  ['Browser parsing', 'How browsers read raw markup and build the DOM tree'],
  ['Document anatomy', 'The standard structure: <!DOCTYPE>, <html>, <head>, and <body>'],
  ['Block vs Inline', 'How elements layout by default and how they behave on the page'],
]

// Top-bar links. Each id must match a <Section id="..."> in the lecture.
const _chapters = [
  { id: 'opener', label: 'Opener' },
  { id: 'what-is-html', label: 'What is HTML?' },
  { id: 'anatomy', label: 'Tag anatomy' },
  { id: 'dom-parsing', label: 'Browser & DOM' },
  { id: 'doc-structure', label: 'Doc structure' },
  { id: 'block-inline', label: 'Block vs Inline' },
  { id: 'sandbox', label: 'HTML Lab' },
  { id: 'dev-life', label: 'Developer life' },
]

const _why = [
  ['🏗️', 'HTML is the foundation of every website and web app you\'ll ever build'],
  ['📱', 'Correct HTML ensures your code works on phones, screen readers, and slow connections'],
  ['🔍', 'Search engines and accessibility tools read your HTML structure to rank and support your content'],
  ['🎨', 'CSS and JavaScript both depend on a clean HTML structure to style and add interaction'],
]

const _recap = [
  "HTML stands for HyperText Markup Language - it describes structure, not design or behavior.",
  "An HTML element has opening tags, content, and closing tags (except void elements like img, input, br).",
  "Browsers read HTML text and build an internal tree called the Document Object Model (DOM).",
  "Every valid HTML document needs <!DOCTYPE html>, <html>, <head>, and <body>.",
  "Block elements (<div>, <p>, <h1>) start on new lines and take full width; inline elements (<span>, <a>) flow with text.",
  "Attributes provide extra information or configuration (e.g., href on <a>, src and alt on <img>).",
  "Understanding these fundamentals helps you debug React components, write emails, and build accessible sites.",
]

const _quiz = [
  {
    q: 'What does HTML stand for?',
    options: [
      'HyperText Markup Language',
      'HighTech Modern Language',
      'Hyperlink Text Master Language',
      'Home Tool Markup Language',
    ],
    a: 0,
    why: 'HTML stands for HyperText Markup Language. It uses tags to mark up content and define page structure.',
  },
  {
    q: 'Which of the following is a void (self-closing) element?',
    options: ['<p>', '<div>', '<img>', '<span>'],
    a: 2,
    why: '<img> cannot contain text or other elements, so it has no closing </img> tag. Void elements are defined by attributes.',
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
    q: 'What happens if you nest a <span> (Inline) inside a <p> (Block)?',
    options: [
      'It is perfectly valid HTML',
      'The browser crashes',
      'It is invalid HTML',
      'The p element turns into an inline element',
    ],
    a: 0,
    why: 'Inline elements can be nested inside block elements like <p>. This is valid HTML and common practice.',
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

const _nextTeaser = 'Structuring Content: Headings, Paragraphs, Lists, Links, and Images.'

export default function Lecture() {
  return (
    <>
      <Opener />
      <WhatIsHtml />
      <TagAnatomy />
      <DomParsing />
      <DocumentStructure />
      <BlockInline />
      <Sandbox />
      <DevLife />
    </>
  )
}