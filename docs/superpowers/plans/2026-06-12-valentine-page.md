# Valentine's Webpage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page Valentine's webpage for Irene — landing → 3 puzzles → cinematic photo reel + polaroid wall — and deploy it to GitHub Pages at `https://bolgheroni.github.io/lp_irene/`.

**Architecture:** Vanilla static site, no build step. Single `index.html` mounts a state machine in `app.js` that swaps full-screen "screens" by toggling CSS classes on a single root container. All copy, data, and config lives in `js/copy.js` so the recipient-facing strings can be tweaked without touching logic. GSAP (CDN) drives all animations.

**Tech Stack:** HTML5, CSS3, vanilla ES modules, GSAP 3 via CDN, macOS `sips` for photo optimization (built-in, zero deps), Python's `http.server` for local dev, GitHub Actions for Pages deploy.

**Testing approach:** This is a personal one-shot static site with no automated test framework — verification is **manual browser-based**. Every task ends with a "play through this in the browser and confirm X" step instead of pytest. The user is a frontend dev and will run `python3 -m http.server 8000` from the repo root and click through changes after each task.

**Source spec:** `docs/superpowers/specs/2026-06-12-valentine-page-design.md`

---

## Tasks

### Task 1: Scaffold project, organize assets, base index + styles

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `assets/photos/` (directory)
- Create: `assets/food/` (directory)
- Create: `assets/audio/` (directory)
- Move: 27 couple `*.jpg` → `assets/photos/originals/` (kept as originals, optimized in Task 2)
- Move: 8 food images (`cacio_pepe.webp`, `spaghetti_bolognese.jpeg`, `fettucine_alfredo.webp`, `lasanha_berinjela.webp`, `pao_de_queijo.jpg`, `brigadeiro.jpg`, `feijoada.jpg`, `lasanha_berinjela.webp`) → `assets/food/`
- Move: `our_song.mp3`, `fun_song.mp3` → `assets/audio/`

- [ ] **Step 1: Move all assets into `assets/` subdirectories**

```bash
mkdir -p assets/photos/originals assets/food assets/audio
# Couple photos → originals (will be optimized into assets/photos/ in Task 2)
mv couple_*.jpg her_*.jpg ire_*.jpg first_date.jpg assets/photos/originals/
# Food photos
mv cacio_pepe.webp spaghetti_bolognese.jpeg fettucine_alfredo.webp \
   lasanha_berinjela.webp pao_de_queijo.jpg brigadeiro.jpg feijoada.jpg \
   assets/food/
# Audio
mv our_song.mp3 fun_song.mp3 assets/audio/
# Tidy: the original song-link txt no longer needed in repo
git rm --cached our_song_link.txt 2>/dev/null || true
rm -f our_song_link.txt
```

- [ ] **Step 2: Add `.gitignore` entry for originals so they don't bloat the repo**

Append to `.gitignore`:

```
assets/photos/originals/
```

- [ ] **Step 3: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="theme-color" content="#000000" />
  <title>For Irene</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main id="root" data-screen="landing"></main>

  <audio id="fun-audio" src="assets/audio/fun_song.mp3" loop preload="auto"></audio>
  <audio id="our-audio" src="assets/audio/our_song.mp3" preload="auto"></audio>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 4: Write `styles.css` with the theme tokens and base reset**

```css
:root {
  --bg: #000;
  --bg-soft: #0a0a0a;
  --text: #f5ecd9;
  --text-dim: #b8ad95;
  --accent: #e8788a;
  --serif: 'Playfair Display', Georgia, serif;
  --sans: 'Inter', system-ui, sans-serif;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
  overscroll-behavior: none;
}

#root {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
}

button {
  font-family: inherit;
  color: inherit;
  background: transparent;
  border: 1px solid var(--text);
  border-radius: 999px;
  padding: 0.85em 2em;
  font-size: 1rem;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: background 0.3s var(--ease), color 0.3s var(--ease), transform 0.2s var(--ease);
}
button:hover { background: var(--text); color: var(--bg); }
button:active { transform: scale(0.97); }

.screen { position: absolute; inset: 0; display: none; }
#root[data-screen="landing"] .screen.landing,
#root[data-screen="puzzle1"] .screen.puzzle1,
#root[data-screen="puzzle2"] .screen.puzzle2,
#root[data-screen="puzzle3"] .screen.puzzle3,
#root[data-screen="gate"]    .screen.gate,
#root[data-screen="reel"]    .screen.reel,
#root[data-screen="wall"]    .screen.wall { display: block; }
```

- [ ] **Step 5: Manually verify**

Run: `python3 -m http.server 8000`
Open: `http://localhost:8000`
Expected: blank black page (no errors in console — verify fonts and GSAP loaded by checking DevTools Network tab).

- [ ] **Step 6: Commit**

```bash
git add .gitignore index.html styles.css assets/food assets/audio
git commit -m "scaffold: organize assets and bootstrap index/styles"
```

---

### Task 2: Optimize the 27 couple photos with `sips`

**Files:**
- Create: `scripts/optimize-photos.sh`
- Create: `assets/photos/*.jpg` (27 optimized photos)

- [ ] **Step 1: Write `scripts/optimize-photos.sh`**

```bash
#!/usr/bin/env bash
set -euo pipefail

SRC_DIR="assets/photos/originals"
OUT_DIR="assets/photos"
MAX_DIM=1920
QUALITY=72

mkdir -p "$OUT_DIR"
shopt -s nullglob

for src in "$SRC_DIR"/*.jpg "$SRC_DIR"/*.jpeg "$SRC_DIR"/*.JPG; do
  filename=$(basename "$src")
  base="${filename%.*}"
  out="$OUT_DIR/${base}.jpg"

  # Skip if up-to-date
  if [[ -f "$out" && "$out" -nt "$src" ]]; then
    echo "skip $filename"
    continue
  fi

  echo "optimize $filename"
  # Resize so the long edge is MAX_DIM, then re-encode JPEG at QUALITY.
  sips --resampleHeightWidthMax "$MAX_DIM" \
       -s format jpeg \
       -s formatOptions "$QUALITY" \
       "$src" --out "$out" >/dev/null
done

echo
echo "Output sizes:"
du -sh "$OUT_DIR"/*.jpg | sort -h
echo
echo "Total:"
du -sh "$OUT_DIR"
```

- [ ] **Step 2: Make it executable and run it**

Run:

```bash
chmod +x scripts/optimize-photos.sh
./scripts/optimize-photos.sh
```

Expected: 27 `.jpg` files written to `assets/photos/`, each typically 100–400 KB; total under 10 MB. If any single photo is > 600 KB after optimization, lower `QUALITY` to 65 and re-run.

- [ ] **Step 3: Manually verify a couple of photos**

Open `assets/photos/couple_my_favorite.jpg` in Preview. Quality should still look good at a glance. If it's noticeably degraded, bump `QUALITY` to 78 and re-run.

- [ ] **Step 4: Commit**

```bash
git add scripts/optimize-photos.sh assets/photos/*.jpg
git commit -m "assets: optimize couple photos for web (long edge 1920, q72)"
```

---

### Task 3: Write `js/copy.js` — single source of truth for all data and strings

**Files:**
- Create: `js/copy.js`

- [ ] **Step 1: Write the file**

```js
// All recipient-facing strings and ordered data. Edit here, don't hunt through logic.

export const LANDING = {
  line: 'Three little puzzles. Then something for you.',
  startLabel: 'Start',
};

export const PUZZLE_1 = {
  title: 'Pick the real Italian dish.',
  options: [
    { id: 'cacio',     label: 'Cacio e Pepe',        img: 'assets/food/cacio_pepe.webp',          correct: true,  reaction: '' },
    { id: 'bolognese', label: 'Spaghetti Bolognese', img: 'assets/food/spaghetti_bolognese.jpeg', correct: false, reaction: "Tourist trap. No Italian eats this." },
    { id: 'alfredo',   label: 'Fettuccine Alfredo',  img: 'assets/food/fettucine_alfredo.webp',   correct: false, reaction: 'American invention. Try again.' },
    { id: 'melanzane', label: 'Lasagna di Melanzane',img: 'assets/food/lasanha_berinjela.webp',   correct: false, reaction: '😏 nice try.' },
  ],
};

export const PUZZLE_2 = {
  title: 'Now my side. Pick the real one.',
  options: [
    { id: 'pao',          label: 'Pão de queijo',         img: 'assets/food/pao_de_queijo.jpg',      correct: true,  reaction: '' },
    { id: 'brilhadeiro',  label: 'Brilhadeiro',           img: 'assets/food/brigadeiro.jpg',         correct: false, reaction: "'Shiny one' — almost. The real one is brigadeiro." },
    { id: 'beijoada',     label: 'Beijoada',              img: 'assets/food/feijoada.jpg',           correct: false, reaction: "'Kissed one' — cute, but no." },
    { id: 'lasanha',      label: 'Lasanha de berinjela',  img: 'assets/food/lasanha_berinjela.webp', correct: false, reaction: "Don't even start." },
  ],
};

export const SLOT = {
  title: 'Last one. What are our Sims called?',
  pullLabel: 'Pull',
  jackpotLine: "That's us. 💌",
  pressPlayLabel: 'Press play to start the show',
  // Order matters: index 1 on each reel is the jackpot target.
  leftReel:  ['Bolgheroni', 'Boquetoni', 'Bolognese', 'Bombolone', 'Brigadeiro', 'Boquerone'],
  rightReel: ['Mazzucco',   'Zucchero',  'Zuccotto',  'Zuccone',   'Zucchina',   'Zampone'],
  jackpotIndices: { left: 1, right: 1 }, // Boquetoni + Zucchero
  // Slotted by (leftIndex,rightIndex) for guaranteed lines on memorable combos.
  // Anything not listed uses one of the generic reactions below.
  specificReactions: {
    '0,0': 'Bolgheroni Mazzucco. Too official. No.',
    '3,4': 'Bombolone Zucchina. Sounds like a dessert. No.',
    '5,5': 'Boquerone Zampone. We are not selling cured meats. No.',
    '2,2': 'Bolognese Zuccotto. Two desserts walk into a bar. No.',
  },
  genericReactions: [
    'Quasi! Ma no.',
    'Cute. Wrong, but cute.',
    'Almost.',
    "Pull again — I believe in you.",
    'Nope. Keep going.',
    "That's a band name, not us. No.",
    'Closer. Maybe.',
    "I'd marry that name. Still no.",
  ],
};

export const REEL = {
  // file is relative to repo root. caption can be ''.
  // Final photo (couple_my_favorite.jpg) MUST be last; it gets special treatment.
  photos: [
    { file: 'assets/photos/first_date.jpg',         caption: 'where it started.' },
    { file: 'assets/photos/ire_beautiful.jpg',      caption: '' },
    { file: 'assets/photos/couple_vatican.jpg',     caption: 'Rome.' },
    { file: 'assets/photos/couple_train.jpg',       caption: 'on our way somewhere.' },
    { file: 'assets/photos/couple_lunch.jpg',       caption: 'sunday lunch.' },
    { file: 'assets/photos/couple_playing.jpg',     caption: '' },
    { file: 'assets/photos/couple_her_b_day.jpg',   caption: 'your day.' },
    { file: 'assets/photos/couple_bed.jpg',         caption: '' },
    { file: 'assets/photos/couple_bed_2.jpg',       caption: '' },
    { file: 'assets/photos/couple_cute.jpg',        caption: '' },
    { file: 'assets/photos/couple_cute_2.jpg',      caption: '' },
    { file: 'assets/photos/couple_cute_3.jpg',      caption: '' },
    { file: 'assets/photos/couple_cute_4.jpg',      caption: '' },
    { file: 'assets/photos/couple_cute_5.jpg',      caption: '' },
    { file: 'assets/photos/couple_cute_6.jpg',      caption: '' },
    { file: 'assets/photos/couple_cute_7.jpg',      caption: '' },
    { file: 'assets/photos/couple_cool.jpg',        caption: '' },
    { file: 'assets/photos/couple_cool_2.jpg',      caption: '' },
    { file: 'assets/photos/couple_cool_3.jpg',      caption: '' },
    { file: 'assets/photos/couple_2.jpg',           caption: '' },
    { file: 'assets/photos/couple_fun_1.jpg',       caption: '' },
    { file: 'assets/photos/couple_funny_2.jpg',     caption: '' },
    { file: 'assets/photos/her_funny.jpg',          caption: '' },
    { file: 'assets/photos/her_funny_2.jpg',        caption: '' },
    { file: 'assets/photos/her_pretty.jpg',         caption: '' },
    { file: 'assets/photos/ire_funny.jpg',          caption: '' },
    { file: 'assets/photos/couple_my_favorite.jpg', caption: 'my favorite. always.' }, // MUST stay last
  ],
  perPhotoMs: 4000,
  finalPhotoMs: 6500,
  crossfadeMs: 800,
  skipLabel: 'skip to the wall →',
};

export const WALL = {
  ourSongLabel: '♪ Our song',
  ourSongHref: 'https://www.youtube.com/watch?v=J36z7AnhvOM',
};
```

- [ ] **Step 2: Manually verify**

Open the file in a browser via a quick smoke test:

```bash
node --input-type=module -e "import('./js/copy.js').then(m => console.log(Object.keys(m), 'photos:', m.REEL.photos.length))"
```

Expected: `[ 'LANDING', 'PUZZLE_1', 'PUZZLE_2', 'SLOT', 'REEL', 'WALL' ] photos: 27`

- [ ] **Step 3: Commit**

```bash
git add js/copy.js
git commit -m "data: add copy.js as single source of truth"
```

---

### Task 4: `js/app.js` state machine + Landing screen

**Files:**
- Create: `js/app.js`
- Modify: `styles.css` (append landing styles)

- [ ] **Step 1: Append landing styles to `styles.css`**

```css
.screen.landing {
  display: none;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2.5rem;
  padding: 2rem;
  text-align: center;
}
#root[data-screen="landing"] .screen.landing { display: flex; }

.landing .line {
  font-family: var(--serif);
  font-size: clamp(1.5rem, 4vw, 2.4rem);
  font-style: italic;
  font-weight: 400;
  color: var(--text);
  opacity: 0;
  max-width: 22ch;
  line-height: 1.4;
}
.landing .start {
  opacity: 0;
}
```

- [ ] **Step 2: Write `js/app.js`**

```js
import { LANDING } from './copy.js';

const root = document.getElementById('root');

const SCREENS = ['landing', 'puzzle1', 'puzzle2', 'puzzle3', 'gate', 'reel', 'wall'];

const state = {
  current: 'landing',
  slotPulls: 0, // tracked here so the slot module can read it across pulls
};

function go(name) {
  if (!SCREENS.includes(name)) throw new Error(`Unknown screen: ${name}`);
  state.current = name;
  root.setAttribute('data-screen', name);
  // Each renderer is registered below; only the active one runs.
  renderers[name]?.();
}

const renderers = {
  landing: renderLanding,
};

function ensureScreen(name) {
  let el = root.querySelector(`.screen.${name}`);
  if (!el) {
    el = document.createElement('section');
    el.className = `screen ${name}`;
    root.appendChild(el);
  }
  return el;
}

function renderLanding() {
  const el = ensureScreen('landing');
  el.innerHTML = `
    <p class="line">${LANDING.line}</p>
    <button class="start">${LANDING.startLabel}</button>
  `;
  const line = el.querySelector('.line');
  const start = el.querySelector('.start');
  gsap.to(line,  { opacity: 1, y: 0, duration: 1.2, delay: 0.3, ease: 'power2.out' });
  gsap.fromTo(start, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 1.1, ease: 'power2.out' });
  start.addEventListener('click', onStart, { once: true });
}

function onStart() {
  // Audio + puzzle 1 wired up in Task 5/6 — placeholder for now.
  console.log('start clicked');
}

// Boot
go('landing');

// Expose for the other modules to call during development.
window.__app = { go, state };
```

- [ ] **Step 3: Manually verify**

Run: `python3 -m http.server 8000` and open `http://localhost:8000`.
Expected: black screen; the line *"Three little puzzles. Then something for you."* fades in; the **Start** button fades in shortly after; clicking it logs `start clicked` to the console.

- [ ] **Step 4: Commit**

```bash
git add js/app.js styles.css
git commit -m "feat: landing screen with fade-in line and start button"
```

---

### Task 5: Audio system — start `fun_song` on Start click

**Files:**
- Create: `js/audio.js`
- Modify: `js/app.js`

- [ ] **Step 1: Write `js/audio.js`**

```js
// Small wrapper around the two <audio> elements.
// Browsers require a user gesture to start audio; both starts happen on click events.

const fun = document.getElementById('fun-audio');
const our = document.getElementById('our-audio');

fun.volume = 0.3;
our.volume = 1.0;

export function startFun() {
  fun.currentTime = 0;
  return fun.play().catch(err => console.warn('fun_song play blocked:', err));
}

export function fadeOutFun(durationMs = 1500) {
  return new Promise(resolve => {
    const start = fun.volume;
    const t0 = performance.now();
    function step(now) {
      const t = Math.min(1, (now - t0) / durationMs);
      fun.volume = start * (1 - t);
      if (t < 1) requestAnimationFrame(step);
      else {
        fun.pause();
        fun.volume = 0.3; // restore for any replay
        resolve();
      }
    }
    requestAnimationFrame(step);
  });
}

export function startOur() {
  our.currentTime = 0;
  return our.play().catch(err => console.warn('our_song play blocked:', err));
}

export function pauseOur() { our.pause(); }
export function setOurMuted(m) { our.muted = m; }
```

- [ ] **Step 2: Modify `js/app.js` — import audio and start `fun_song` in `onStart`**

Change the top of `js/app.js`:

```js
import { LANDING } from './copy.js';
import { startFun } from './audio.js';
```

Replace `onStart`:

```js
function onStart() {
  startFun();
  go('puzzle1');
}
```

- [ ] **Step 3: Manually verify**

Reload `http://localhost:8000`. Click **Start**.
Expected: `fun_song.mp3` starts playing at low volume; console shows `Unknown screen` error? No — `puzzle1` is in the `SCREENS` array. You will see an empty black screen (puzzle1 isn't rendered yet). Audio should be audible. If audio is silent, check DevTools console for autoplay warning — clicking the button is a user gesture so this should work.

- [ ] **Step 4: Commit**

```bash
git add js/audio.js js/app.js
git commit -m "feat: audio module; fun_song starts on landing click"
```

---

### Task 6: Food puzzle component + Puzzle 1 (Italian)

**Files:**
- Create: `js/puzzles.js`
- Modify: `js/app.js`
- Modify: `styles.css`

- [ ] **Step 1: Append food-puzzle styles to `styles.css`**

```css
.food-puzzle {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  text-align: center;
}
#root[data-screen="puzzle1"] .screen.puzzle1,
#root[data-screen="puzzle2"] .screen.puzzle2 { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; gap: 2rem; }

.food-puzzle .title {
  font-family: var(--serif);
  font-size: clamp(1.4rem, 3.6vw, 2.1rem);
  font-style: italic;
  max-width: 22ch;
  line-height: 1.3;
}

.food-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(140px, 1fr));
  gap: 1rem;
  max-width: 680px;
  width: 100%;
}
@media (min-width: 720px) {
  .food-grid { grid-template-columns: repeat(4, 1fr); max-width: 920px; }
}

.food-card {
  display: flex; flex-direction: column;
  border-radius: 14px;
  overflow: hidden;
  background: #111;
  border: 1px solid #1c1c1c;
  cursor: pointer;
  transition: transform 0.25s var(--ease), border-color 0.25s var(--ease);
}
.food-card:hover { transform: translateY(-3px); border-color: #2c2c2c; }
.food-card img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}
.food-card .label {
  font-family: var(--sans);
  font-size: 0.92rem;
  padding: 0.75rem 0.5rem;
  color: var(--text);
}

.food-puzzle .reaction {
  min-height: 1.5em;
  font-family: var(--serif);
  font-style: italic;
  color: var(--accent);
  opacity: 0;
}
```

- [ ] **Step 2: Write `js/puzzles.js`**

```js
import { PUZZLE_1, PUZZLE_2 } from './copy.js';

export function renderFoodPuzzle(screenEl, config, onCorrect) {
  screenEl.innerHTML = `
    <h2 class="title">${config.title}</h2>
    <div class="food-grid">
      ${config.options.map(o => `
        <button class="food-card" data-id="${o.id}" data-correct="${o.correct}">
          <img src="${o.img}" alt="${o.label}" loading="eager" />
          <span class="label">${o.label}</span>
        </button>
      `).join('')}
    </div>
    <p class="reaction"></p>
  `;
  const reaction = screenEl.querySelector('.reaction');

  gsap.fromTo(screenEl.querySelector('.title'),     { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' });
  gsap.fromTo(screenEl.querySelectorAll('.food-card'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.15, stagger: 0.06, ease: 'power2.out' });

  screenEl.querySelectorAll('.food-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const opt = config.options.find(o => o.id === id);
      if (opt.correct) {
        gsap.to(screenEl, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.in',
          onComplete: () => { screenEl.style.opacity = ''; onCorrect(); },
        });
      } else {
        reaction.textContent = opt.reaction;
        gsap.fromTo(reaction, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        // Shake
        gsap.fromTo(card,
          { x: 0 },
          { x: 0, keyframes: [{ x: -8 }, { x: 8 }, { x: -6 }, { x: 6 }, { x: 0 }], duration: 0.45, ease: 'power1.out' }
        );
      }
    });
  });
}

export const renderPuzzle1 = (el, onDone) => renderFoodPuzzle(el, PUZZLE_1, onDone);
export const renderPuzzle2 = (el, onDone) => renderFoodPuzzle(el, PUZZLE_2, onDone);
```

- [ ] **Step 3: Wire puzzle 1 into `js/app.js`**

Add import:

```js
import { renderPuzzle1, renderPuzzle2 } from './puzzles.js';
```

Register the renderer (add an entry to the `renderers` object):

```js
const renderers = {
  landing: renderLanding,
  puzzle1: () => renderPuzzle1(ensureScreen('puzzle1'), () => go('puzzle2')),
  puzzle2: () => renderPuzzle2(ensureScreen('puzzle2'), () => go('puzzle3')),
};
```

- [ ] **Step 4: Manually verify Puzzle 1**

Reload. Click **Start**.
Expected:
- 4 cards appear (cards of Italian food images).
- Clicking *Spaghetti Bolognese* / *Fettuccine Alfredo* / *Lasagna di Melanzane*: card shakes; reaction line appears under the grid in pink-accent italic.
- Clicking *Cacio e Pepe*: whole puzzle fades out, then puzzle 2 fades in.

- [ ] **Step 5: Manually verify Puzzle 2**

After advancing from puzzle 1, the Brazilian food puzzle should appear. Verify wrong picks (Brilhadeiro / Beijoada / Lasanha de berinjela) shake + show reactions and **Pão de queijo** advances to puzzle 3 (which is not yet rendered — that's Task 7).

- [ ] **Step 6: Commit**

```bash
git add js/puzzles.js js/app.js styles.css
git commit -m "feat: food puzzle component, wire puzzles 1 & 2"
```

---

### Task 7: Slot machine — UI + spin animation

**Files:**
- Create: `js/slot-machine.js`
- Modify: `js/app.js`
- Modify: `styles.css`

- [ ] **Step 1: Append slot-machine styles to `styles.css`**

```css
#root[data-screen="puzzle3"] .screen.puzzle3 {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 2rem; gap: 2rem;
}
.slot {
  display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
  max-width: 720px; width: 100%;
}
.slot .title {
  font-family: var(--serif); font-style: italic;
  font-size: clamp(1.4rem, 3.6vw, 2.1rem);
  text-align: center; max-width: 22ch; line-height: 1.3;
}
.reels {
  display: flex; gap: 1rem; justify-content: center; width: 100%;
}
.reel {
  position: relative;
  flex: 1; max-width: 280px;
  height: 88px;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid #1c1c1c;
  background: #0f0f0f;
}
.reel-strip {
  position: absolute; inset-inline: 0; top: 0;
  display: flex; flex-direction: column;
  will-change: transform;
}
.reel-strip .cell {
  height: 88px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--serif); font-size: clamp(1.3rem, 3.2vw, 1.8rem);
  font-style: italic;
  color: var(--text);
}
.reel::before, .reel::after {
  content: ''; position: absolute; left: 0; right: 0; height: 24px; z-index: 2;
  pointer-events: none;
}
.reel::before { top: 0;    background: linear-gradient(to bottom, #0f0f0f, transparent); }
.reel::after  { bottom: 0; background: linear-gradient(to top,    #0f0f0f, transparent); }

.lever {
  border-radius: 999px;
  padding: 0.9em 2.4em;
  font-family: var(--serif);
  font-style: italic;
  letter-spacing: 0.05em;
}
.lever[disabled] { opacity: 0.45; cursor: not-allowed; }

.slot .reaction {
  min-height: 1.4em;
  font-family: var(--serif); font-style: italic;
  color: var(--accent);
  text-align: center;
  opacity: 0;
}

.jackpot-flash { box-shadow: 0 0 0 1px var(--accent), 0 0 32px var(--accent); }
```

- [ ] **Step 2: Write `js/slot-machine.js`**

```js
import { SLOT } from './copy.js';

const CELL_PX = 88;
const SPIN_ROUNDS = 8; // how many extra full passes before settling

// Generate a strip long enough that the spin always travels far enough to feel real.
function buildStrip(values, repeats) {
  return Array.from({ length: repeats }, () => values).flat();
}

export function renderSlot(screenEl, onJackpot) {
  screenEl.innerHTML = `
    <div class="slot">
      <h2 class="title">${SLOT.title}</h2>
      <div class="reels">
        <div class="reel" data-side="left">
          <div class="reel-strip">
            ${buildStrip(SLOT.leftReel, SPIN_ROUNDS + 2).map(v => `<div class="cell">${v}</div>`).join('')}
          </div>
        </div>
        <div class="reel" data-side="right">
          <div class="reel-strip">
            ${buildStrip(SLOT.rightReel, SPIN_ROUNDS + 2).map(v => `<div class="cell">${v}</div>`).join('')}
          </div>
        </div>
      </div>
      <button class="lever">${SLOT.pullLabel}</button>
      <p class="reaction"></p>
    </div>
  `;

  const leftStrip  = screenEl.querySelector('.reel[data-side="left"] .reel-strip');
  const rightStrip = screenEl.querySelector('.reel[data-side="right"] .reel-strip');
  const lever      = screenEl.querySelector('.lever');
  const reaction   = screenEl.querySelector('.reaction');
  const reelEls    = screenEl.querySelectorAll('.reel');

  gsap.fromTo(screenEl.querySelector('.title'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' });
  gsap.fromTo(reelEls,   { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.15, stagger: 0.08, ease: 'power2.out' });
  gsap.fromTo(lever,     { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.4, ease: 'power2.out' });

  // Set initial resting position to top of each strip
  gsap.set(leftStrip,  { y: 0 });
  gsap.set(rightStrip, { y: 0 });

  let pullCount = 0;
  const seenReactionKeys = new Set();

  function pickReaction(li, ri) {
    const specific = SLOT.specificReactions[`${li},${ri}`];
    if (specific && !seenReactionKeys.has(`s:${li},${ri}`)) {
      seenReactionKeys.add(`s:${li},${ri}`);
      return specific;
    }
    const available = SLOT.genericReactions.filter(r => !seenReactionKeys.has(`g:${r}`));
    const pool = available.length ? available : SLOT.genericReactions;
    const choice = pool[Math.floor(Math.random() * pool.length)];
    seenReactionKeys.add(`g:${choice}`);
    return choice;
  }

  function jackpotRoll() {
    // Pulls 1-3 are hard-locked misses. Probability begins at pull 4.
    if (pullCount < 3) return false;
    const offset = pullCount - 3; // 0 on pull 4, 1 on pull 5, ...
    const p = Math.min(1, 0.5 + 0.2 * offset);
    return Math.random() < p;
  }

  function pickLosingIndices() {
    let li, ri;
    do {
      li = Math.floor(Math.random() * SLOT.leftReel.length);
      ri = Math.floor(Math.random() * SLOT.rightReel.length);
    } while (li === SLOT.jackpotIndices.left && ri === SLOT.jackpotIndices.right);
    return { li, ri };
  }

  function spinTo(strip, finalIndex, durationS, valuesLen) {
    // Land such that finalIndex cell is centered (top of the cell aligned with reel top).
    const finalY = -finalIndex * CELL_PX;
    // Add extra full passes so the spin distance is long.
    const totalDistance = SPIN_ROUNDS * valuesLen * CELL_PX + (-finalY);
    const fromY = -totalDistance;
    gsap.fromTo(strip,
      { y: fromY },
      { y: finalY, duration: durationS, ease: 'power3.out' }
    );
  }

  function pull() {
    lever.disabled = true;
    reaction.style.opacity = '0';
    pullCount += 1;

    const win = jackpotRoll();
    const { li, ri } = win
      ? { li: SLOT.jackpotIndices.left, ri: SLOT.jackpotIndices.right }
      : pickLosingIndices();

    spinTo(leftStrip,  li, 1.6, SLOT.leftReel.length);
    spinTo(rightStrip, ri, 2.1, SLOT.rightReel.length);

    setTimeout(() => {
      if (win) onWin();
      else onLoss(li, ri);
    }, 2200);
  }

  function onLoss(li, ri) {
    reaction.textContent = pickReaction(li, ri);
    gsap.to(reaction, { opacity: 1, duration: 0.4 });
    lever.disabled = false;
  }

  function onWin() {
    reaction.textContent = SLOT.jackpotLine;
    gsap.to(reaction, { opacity: 1, duration: 0.6 });
    reelEls.forEach(r => r.classList.add('jackpot-flash'));
    // Hand off to the gate after a beat
    setTimeout(() => onJackpot(), 1800);
  }

  lever.addEventListener('click', pull);
}
```

- [ ] **Step 3: Register puzzle 3 in `js/app.js`**

Add import:

```js
import { renderSlot } from './slot-machine.js';
```

Add to `renderers`:

```js
puzzle3: () => renderSlot(ensureScreen('puzzle3'), () => go('gate')),
```

- [ ] **Step 4: Manually verify**

Reload, click through Start → puzzle 1 (Cacio) → puzzle 2 (Pão de queijo) → arrive at slot machine.
Expected:
- Two reels visible with surname strips, a "Pull" button below, no music interruption.
- Click **Pull** three times: each spin animates, reels stop on a random non-jackpot combo, a sassy reaction line appears under the lever. Pulls 1–3 NEVER show *"That's us. 💌"*.
- From pull 4 onward, eventually reels stop on **Boquetoni** + **Zucchero**, both reels get a pink glow, *"That's us. 💌"* appears, and after ~1.8s the screen transitions to `gate` (still empty — gate is Task 8).

- [ ] **Step 5: Commit**

```bash
git add js/slot-machine.js js/app.js styles.css
git commit -m "feat: slot machine with rigged jackpot (3-pull minimum)"
```

---

### Task 8: Press-play gate + audio crossfade

**Files:**
- Create: `js/gate.js`
- Modify: `js/app.js`
- Modify: `styles.css`

- [ ] **Step 1: Append gate styles to `styles.css`**

```css
#root[data-screen="gate"] .screen.gate {
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 2rem;
  padding: 2rem; text-align: center;
}
.screen.gate .press {
  font-family: var(--serif); font-style: italic;
  font-size: 1.2rem;
  padding: 1.1em 2.4em;
  border-color: var(--accent);
  color: var(--accent);
}
.screen.gate .press:hover { background: var(--accent); color: var(--bg); }
```

- [ ] **Step 2: Write `js/gate.js`**

```js
import { SLOT } from './copy.js';
import { fadeOutFun, startOur } from './audio.js';

export function renderGate(screenEl, onPlay) {
  screenEl.innerHTML = `
    <button class="press">${SLOT.pressPlayLabel}</button>
  `;
  const btn = screenEl.querySelector('.press');
  gsap.fromTo(btn, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power2.out' });
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    await Promise.all([fadeOutFun(1500), startOur()]);
    onPlay();
  }, { once: true });
}
```

- [ ] **Step 3: Register gate in `js/app.js`**

Add import:

```js
import { renderGate } from './gate.js';
```

Add to `renderers`:

```js
gate: () => renderGate(ensureScreen('gate'), () => go('reel')),
```

- [ ] **Step 4: Manually verify**

Reload, play through to jackpot.
Expected: After the slot transition, a "Press play to start the show" button appears. Click it. The fun_song fades out over ~1.5s, our_song.mp3 begins. Screen transitions to `reel` (blank for now — Task 9).

- [ ] **Step 5: Commit**

```bash
git add js/gate.js js/app.js styles.css
git commit -m "feat: press-play gate with audio crossfade"
```

---

### Task 9: Cinematic reel (Ken Burns + crossfade + captions)

**Files:**
- Create: `js/album.js`
- Modify: `js/app.js`
- Modify: `styles.css`

- [ ] **Step 1: Append reel styles to `styles.css`**

```css
#root[data-screen="reel"] .screen.reel {
  display: block;
  position: absolute; inset: 0;
  background: #000;
  overflow: hidden;
}
.reel-stage { position: absolute; inset: 0; }
.reel-photo {
  position: absolute; inset: 0;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0;
  will-change: transform, opacity;
}
.reel-caption {
  position: absolute; left: 0; right: 0; bottom: 8%;
  text-align: center;
  font-family: var(--serif); font-style: italic;
  font-size: clamp(1.1rem, 2.6vw, 1.6rem);
  color: var(--text);
  text-shadow: 0 2px 12px rgba(0,0,0,0.6);
  opacity: 0;
  pointer-events: none;
}
.reel-controls {
  position: absolute; top: 1rem; right: 1rem; z-index: 5;
  display: flex; gap: 0.5rem;
}
.reel-controls button {
  font-size: 0.8rem; padding: 0.5em 1em;
  border-color: rgba(245,236,217,0.4);
  color: rgba(245,236,217,0.8);
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(6px);
}
```

- [ ] **Step 2: Write `js/album.js`**

```js
import { REEL } from './copy.js';
import { setOurMuted } from './audio.js';

export function renderReel(screenEl, onDone) {
  screenEl.innerHTML = `
    <div class="reel-stage"></div>
    <p class="reel-caption"></p>
    <div class="reel-controls">
      <button class="mute">mute</button>
      <button class="skip">${REEL.skipLabel}</button>
    </div>
  `;
  const stage   = screenEl.querySelector('.reel-stage');
  const caption = screenEl.querySelector('.reel-caption');
  const muteBtn = screenEl.querySelector('.mute');
  const skipBtn = screenEl.querySelector('.skip');

  let muted = false;
  muteBtn.addEventListener('click', () => {
    muted = !muted;
    setOurMuted(muted);
    muteBtn.textContent = muted ? 'unmute' : 'mute';
  });

  let stopped = false;
  skipBtn.addEventListener('click', () => { stopped = true; finish(); });

  // Preload first few images to avoid early flashes
  REEL.photos.slice(0, 4).forEach(p => { const img = new Image(); img.src = p.file; });

  let i = 0;
  let prevPhoto = null;
  let prevTl = null;

  function advance() {
    if (stopped) return;
    if (i >= REEL.photos.length) return finish();

    const entry = REEL.photos[i];
    const isLast = i === REEL.photos.length - 1;
    const durationMs = isLast ? REEL.finalPhotoMs : REEL.perPhotoMs;

    const photo = document.createElement('div');
    photo.className = 'reel-photo';
    photo.style.backgroundImage = `url("${entry.file}")`;
    stage.appendChild(photo);

    // Ken Burns: start slightly zoomed, slowly zoom in or out and pan a touch
    const startScale = 1.05 + Math.random() * 0.05;
    const endScale   = startScale + 0.06 + Math.random() * 0.04;
    const panX = (Math.random() - 0.5) * 30;
    const panY = (Math.random() - 0.5) * 30;
    gsap.set(photo, { scale: startScale, x: 0, y: 0 });
    const tl = gsap.timeline();
    tl.to(photo, { opacity: 1, duration: REEL.crossfadeMs / 1000, ease: 'power2.out' }, 0);
    tl.to(photo, { scale: endScale, x: panX, y: panY, duration: durationMs / 1000, ease: 'none' }, 0);

    // Caption
    caption.textContent = entry.caption || '';
    if (entry.caption) {
      gsap.fromTo(caption,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 }
      );
      gsap.to(caption, { opacity: 0, duration: 0.5, delay: (durationMs / 1000) - 0.6 });
    } else {
      caption.style.opacity = '0';
    }

    // Crossfade out at end (except last — let it linger then finish)
    if (!isLast) {
      gsap.to(photo, { opacity: 0, duration: REEL.crossfadeMs / 1000, ease: 'power2.in', delay: (durationMs / 1000) - (REEL.crossfadeMs / 1000) });
    }

    // Clean up previous photo node after the new one's fade-in finishes
    if (prevPhoto) {
      const toRemove = prevPhoto;
      setTimeout(() => toRemove.remove(), REEL.crossfadeMs + 100);
    }
    prevPhoto = photo;
    prevTl = tl;

    i += 1;
    if (isLast) {
      setTimeout(() => finish(), durationMs + 400);
    } else {
      setTimeout(advance, durationMs - REEL.crossfadeMs);
    }
  }

  function finish() {
    if (prevTl) prevTl.kill();
    // Don't pause music — it carries into the wall.
    onDone();
  }

  advance();
}
```

- [ ] **Step 3: Register reel in `js/app.js`**

Add import:

```js
import { renderReel } from './album.js';
```

Add to `renderers`:

```js
reel: () => renderReel(ensureScreen('reel'), () => go('wall')),
```

- [ ] **Step 4: Manually verify**

Play through to the press-play gate, click it.
Expected:
- Photos fill the screen one after another, slowly zooming/panning, crossfading between each.
- Captions appear softly on captioned photos.
- our_song.mp3 plays throughout.
- Mute toggle works.
- Skip jumps to `wall` (empty for now — Task 10).
- The final photo (`couple_my_favorite.jpg`) lingers ~6.5s with the caption "my favorite. always."

- [ ] **Step 5: Commit**

```bash
git add js/album.js js/app.js styles.css
git commit -m "feat: cinematic reel with Ken Burns, crossfade, captions"
```

---

### Task 10: Polaroid wall + "Our song" badge

**Files:**
- Modify: `js/album.js` (append `renderWall`)
- Modify: `js/app.js`
- Modify: `styles.css`

- [ ] **Step 1: Append wall styles to `styles.css`**

```css
#root[data-screen="wall"] .screen.wall {
  display: block;
  position: absolute; inset: 0;
  background: var(--bg-soft);
  overflow: hidden;
}
.polaroid {
  position: absolute;
  width: 180px;
  background: #f5ecd9;
  padding: 10px 10px 36px 10px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.5);
  border-radius: 2px;
  cursor: grab;
  user-select: none;
  touch-action: none;
}
.polaroid:active { cursor: grabbing; }
.polaroid img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  background: #222;
}
.polaroid .cap {
  position: absolute; left: 0; right: 0; bottom: 8px;
  text-align: center;
  font-family: var(--serif); font-style: italic;
  font-size: 0.85rem;
  color: #2a2a2a;
}
.polaroid.enlarged {
  z-index: 9999;
  width: min(80vw, 520px);
}
.our-song-badge {
  position: fixed; right: 1rem; bottom: 1rem;
  font-family: var(--serif); font-style: italic;
  font-size: 0.9rem;
  color: var(--text);
  text-decoration: none;
  padding: 0.6em 1.1em;
  border: 1px solid rgba(245,236,217,0.35);
  border-radius: 999px;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(6px);
  z-index: 10000;
}
.our-song-badge:hover { background: rgba(232,120,138,0.2); border-color: var(--accent); color: var(--accent); }
```

- [ ] **Step 2: Append `renderWall` to `js/album.js`**

First, **update the import line at the top** of `js/album.js` from `import { REEL } from './copy.js';` to:

```js
import { REEL, WALL } from './copy.js';
```

Then append this function to the end of the file:

```js
export function renderWall(screenEl) {
  screenEl.innerHTML = `
    <a class="our-song-badge" href="${WALL.ourSongHref}" target="_blank" rel="noopener">${WALL.ourSongLabel}</a>
  `;

  const W = window.innerWidth;
  const H = window.innerHeight;
  let topZ = 1;

  REEL.photos.forEach((entry, idx) => {
    const el = document.createElement('div');
    el.className = 'polaroid';
    el.innerHTML = `
      <img src="${entry.file}" alt="" />
      ${entry.caption ? `<div class="cap">${entry.caption}</div>` : ''}
    `;
    // Scatter within safe insets
    const padX = 110, padY = 130;
    const x = padX + Math.random() * Math.max(40, W - padX * 2);
    const y = padY + Math.random() * Math.max(40, H - padY * 2);
    const rot = (Math.random() - 0.5) * 24; // -12deg to +12deg
    el.style.left = `${x - 90}px`;
    el.style.top = `${y - 100}px`;
    el.style.transform = `rotate(${rot}deg)`;
    el.style.zIndex = String(idx);

    screenEl.appendChild(el);

    // Drop animation (staggered)
    gsap.fromTo(el,
      { y: -300, opacity: 0, rotate: rot - 20 },
      { y: 0, opacity: 1, rotate: rot, duration: 0.7, delay: 0.04 * idx, ease: 'power2.out' }
    );

    enableDragAndEnlarge(el, () => { topZ += 1; el.style.zIndex = String(topZ); });
  });
}

function enableDragAndEnlarge(el, bringToFront) {
  let startX = 0, startY = 0, baseLeft = 0, baseTop = 0, moved = false, pointerId = null;

  el.addEventListener('pointerdown', e => {
    pointerId = e.pointerId;
    el.setPointerCapture(pointerId);
    bringToFront();
    startX = e.clientX; startY = e.clientY;
    baseLeft = parseFloat(el.style.left); baseTop = parseFloat(el.style.top);
    moved = false;
  });

  el.addEventListener('pointermove', e => {
    if (pointerId === null) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
    el.style.left = `${baseLeft + dx}px`;
    el.style.top  = `${baseTop  + dy}px`;
  });

  el.addEventListener('pointerup', () => {
    if (!moved) {
      el.classList.toggle('enlarged');
      bringToFront();
    }
    pointerId = null;
  });

  el.addEventListener('pointercancel', () => { pointerId = null; });
}
```

- [ ] **Step 3: Register wall in `js/app.js`**

Update import:

```js
import { renderReel, renderWall } from './album.js';
```

Add to `renderers`:

```js
wall: () => renderWall(ensureScreen('wall')),
```

- [ ] **Step 4: Manually verify**

Play all the way through. After the reel finishes (or skip), the polaroid wall appears.
Expected:
- 27 polaroids drop in, staggered, at random positions and rotations.
- Dragging works smoothly on both mouse and touch.
- Clicking without dragging toggles enlarge.
- "♪ Our song" badge bottom-right opens the YouTube link in a new tab.
- our_song.mp3 keeps playing.

- [ ] **Step 5: Commit**

```bash
git add js/album.js js/app.js styles.css
git commit -m "feat: polaroid wall with drag, enlarge, and our-song badge"
```

---

### Task 11: GitHub Actions deploy workflow + first push

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write the workflow**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Add remote and push**

Run:

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: GitHub Pages deploy on push to main"
git remote add origin https://github.com/bolgheroni/lp_irene.git
git branch -M main
git push -u origin main
```

- [ ] **Step 3: Enable Pages in repo settings**

This is a one-time UI step (do once, not codified):

1. Go to https://github.com/bolgheroni/lp_irene/settings/pages
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Wait ~30s for the workflow to finish; URL will appear.

- [ ] **Step 4: Manually verify live site**

Open `https://bolgheroni.github.io/lp_irene/` on:
- Desktop Chrome
- iPhone Safari

Expected: full flow works end-to-end on both. Audio plays after Start. All 27 photos load. Slot machine eventually hits jackpot. Polaroid wall is interactive.

- [ ] **Step 5: Final commit (if any tweaks needed after live test)**

If anything broke on Safari that didn't break locally (most common: aspect-ratio, audio autoplay, dvh units), fix in a follow-up commit.

---

## Notes for the implementer

- **Don't run all tasks back to back without browser-checking each one.** Each task's verification step is the test. If something looks wrong, fix it before moving on.
- **Photos can be re-ordered** in `js/copy.js` → `REEL.photos`. The last entry MUST stay `couple_my_favorite.jpg` because the reel gives the last index special timing.
- **Captions are placeholders.** Roberto will likely want to edit them all in `copy.js` before the final deploy — that's expected and the whole reason copy lives in one file.
- **The slot machine is deliberately rigged** (3-pull minimum, then increasing probability). This is per the spec — don't "fix" it.
- **No automated tests by design.** The spec explicitly leaves them out of scope; everything is verified by playing through in the browser.
