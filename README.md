# Catalyst · Lecture  — What Is a Computer and How It Works

An interactive, animated lesson page for the Catalyst Web Essentials course (upGrad School of Technology).
Built with React, Vite and Framer Motion.

## Run it

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Then open the link it prints (usually http://localhost:5173).

To build a static site you can host anywhere (Netlify, Vercel, GitHub Pages):

```bash
npm run build      # output goes to dist/
npm run preview    # check the built site locally
```

## What's inside

| Section | Interactive part |
| --- | --- |
| Hero | Animated IPOS orbit, lecture goals |
| Warm-up | Tap the devices you used today, then reveal that they're all computers |
| Challenge | Live race: you vs this browser counting to 100 million, plus the Console code to copy |
| Definition | Keyword-by-keyword reveal of the definition |
| Instructions | Runs a 3-line program step by step and shows the output |
| IPOS cycle | Pick an example (chat, photo, add numbers) and play the cycle; a dot moves between steps |
| Step by step | Tabs for input, processing, output and storage |
| RAM vs storage | Power-cut simulator: type, save, cut the power, see what survives |
| Walkthrough | Enter two numbers; each IPOS step lights up beside the matching line of JavaScript |
| Hardware vs software | Comparison table and a sorting game with a score |
| Layers | Software stack animates in from the hardware up |
| Press Play | Steps light up in order, ending with an equaliser |
| Types | Desktop, laptop and mobile tabs with animated meters |
| Embedded | Smartwatch, car, washing machine and traffic signal, each with its own IPOS |
| Servers | Animated request and response between a browser and a server, with a simulated Network tab |
| Try-it activities | Task Manager / Activity Monitor and the real Network tab |
| Wrap-up | Why it matters, recap and a 5-question self-check quiz |

## Editing content

Each section is one file in `src/components/`. The text lives in plain arrays at the top of each file
(for example `devices` in `WarmUp.jsx`, `quiz` in `WrapUp.jsx`), so you can change wording without touching the logic.

Colours and fonts are CSS variables at the top of `src/index.css` (`--red`, `--ink`, and so on).

## Recording tips

- Record at 1920×1080 with the browser zoomed to 125% for readability.
- Animations respect the operating system's "Reduce motion" setting.
- Use the chapter links in the top bar to jump between sections while recording.
