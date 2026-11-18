# Catalyst · Interactive Lectures

Interactive, animated lesson pages for the **Catalyst Full Stack Development** course by
**upGrad School of Technology**. One site holds every lecture: a home page lists the whole
course (lectures grouped by colour-coded unit, plus a separate Projects section), and each
lecture has its own page with animations, hands-on demos and a self-check quiz.

Built with React, Vite, React Router and Framer Motion.

## Run it

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the link it prints (usually http://localhost:5173).

| Page | URL |
| --- | --- |
| All lectures | `/` |
| A lecture | `/lecture/<slug>`, e.g. `/lecture/what-is-a-computer` |

## Project structure

```
src/
├── course/curriculum.js        ← the course outline: units (with colours), lectures and projects
├── design-system/              ← shared building blocks every lecture uses
│   ├── primitives.jsx          ← Section, Step, Reveal, Callout, Code, Figure, PauseBadge
│   ├── illustrations.jsx       ← 40 SVG drawings (devices, CPU, RAM, server, browser…)
│   ├── guided.js               ← guided mode: instructor-controlled reveals
│   ├── LectureLayout.jsx       ← page frame: header, hero, wrap-up, quiz, "up next"
│   ├── LectureHero.jsx
│   ├── WrapUp.jsx              ← WhyItMatters, Recap, Quiz
│   ├── RecordingControls.jsx   ← keyboard shortcuts and presenter mode
│   └── index.js                ← import everything from here
├── components/                 ← SiteHeader, SiteFooter
├── pages/                      ← Home, LecturePage, NotFound
├── lectures/
│   ├── registry.js             ← finds lecture folders automatically
│   ├── _template/              ← copy this to start a new lecture
│   └── 01-what-is-a-computer/
│       ├── index.js            ← entry point (don't need to edit)
│       ├── meta.js             ← hero text, goals, chapters, why, recap, quiz
│       ├── Lecture.jsx         ← the lecture's sections, in order
│       ├── lecture.css         ← styles only this lecture uses
│       └── sections/           ← one file per interactive section
└── index.css                   ← design tokens (colours, fonts) and shared styles
```

## Adding a new lecture

1. Make sure the lecture is listed in `src/course/curriculum.js` (all 21 Semester 1 lectures already are;
   the two projects are listed separately under `projects`).
2. Create its folder from the template:

   ```bash
   npm run new-lecture -- 2
   ```

   This creates `src/lectures/02-computer-internals/`.
3. Fill in `meta.js` (title, goals, chapters, why it matters, recap, quiz).
4. Build the sections in `Lecture.jsx`, using the shared pieces:

   ```jsx
   import { Section, Step, Callout, Code, Figure, PauseBadge } from '../../design-system'
   import { Laptop, Cpu } from '../../design-system/illustrations'
   ```

   Put bigger interactive pieces in a `sections/` folder, like Lecture 1 does.
5. Run `npm run dev`. The lecture now shows as **Ready** on the home page; lectures without a folder show as **Coming soon**.

Every lecture automatically gets the same header, hero, chapter links, progress bar, wrap-up,
quiz and "up next" block, so all 20+ lectures look and behave the same.

### Pictures

`src/design-system/illustrations.jsx` has flat drawings in the Catalyst style: devices (Laptop, Phone,
Desktop, Server, DataCenter, Smartwatch, Car…), input and output (Keyboard, Mouse, Microphone, Monitor,
Speaker, Printer…), parts (Cpu, Ram, Ssd, Gear), software (BrowserWindow, CodeEditor, OsWindows) and
ideas (Desk, Cupboard, Clock, Instructions…). Use them directly (`<Cpu size={80} />`) or by name
(`<Illo name="Cpu" size={80} />`). Add new drawings to the same file.

### Instructor steps (guided mode)

Give a section `steps={n}` and wrap each point in `<Step n={…}>`:

```jsx
<Section id="layers" title="Software comes in layers" steps={3}>
  <Step n={1}>Hardware</Step>
  <Step n={2}>Operating system</Step>
  <Step n={3}>Applications</Step>
</Section>
```

- **Guided mode off** (default, for students): everything is visible and animates in on scroll.
- **Guided mode on** (`G`, or the "Guided" button): each step stays hidden until you press `→`,
  so you can explain at your own pace. After the last step, `→` moves to the next section.

For custom animations, `useStep()` gives `{ guided, step, shown(n) }`. Lecture 1 uses it to build
the "computer machine" diagram, drive the IPOS cycle, and step through the client–server animation.

### Section tones

`<Section tone="...">` sets the background, so pages keep a steady rhythm:

| Tone | Use it for |
| --- | --- |
| `light` (default) | Main explanations |
| `alt` | Alternating sections |
| `red` | Challenges and "Try it" activities |
| `rose` | Statements and the self-check |

## Recording a lecture

A floating toolbar sits in the bottom-right corner of every lecture page.

| Key | Action |
| --- | --- |
| `J` or `→` | Next step (in guided mode), then next section |
| `K` or `←` | Back |
| `G` | Guided mode: you reveal each point yourself |
| `P` | Presenter mode (bigger text, hides chapter links) |
| `?` | Show the shortcuts |

Tips: record at 1920×1080, turn on guided mode so nothing appears before you explain it, and use
presenter mode for readability. The step counter on each section shows where you are. Animations respect the
operating system's "Reduce motion" setting.

## Deploying

```bash
npm run build      # output goes to dist/
npm run preview    # check the built site locally
```

- **Vercel or Netlify:** import the GitHub repo; build command `npm run build`, output folder `dist`.
- **GitHub Pages:** build with the repo name as the base path, then publish `dist/`:

  ```bash
  VITE_BASE=/catalyst-ugsot/ npm run build
  ```

  The build also writes `dist/404.html`, so lecture links keep working on GitHub Pages.

## Branding

Colours and fonts are CSS variables at the top of `src/index.css` (`--red`, `--ink`, …).
The co-branded logo is `public/catalyst-logo.png`.
