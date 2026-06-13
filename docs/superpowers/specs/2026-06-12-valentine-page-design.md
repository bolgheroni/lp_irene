# Valentine's Webpage for Irene — Design

**Date:** 2026-06-12 (Dia dos Namorados)
**Author:** Roberto
**Recipient:** Irene
**Repo:** https://github.com/bolgheroni/lp_irene
**Deploy target:** GitHub Pages → `https://bolgheroni.github.io/lp_irene/`

## Purpose

A surprise single-page webpage for Roberto's girlfriend Irene, given on Brazilian Valentine's Day. The page is a small, playful gauntlet: three short puzzles built around inside jokes, ending in a cinematic photo album with their song playing. The goal is cute + funny + intimate — not slick or generic.

## Inside-joke vocabulary (load-bearing)

- **Roberto Bolgheroni** (Brazilian) × **Irene Mazzucco** (Italian) — their real names.
- **Roberto Boquetoni** × **Irene Zucchero** — their characters' names in their shared Sims world. The Sims-name reveal is the third puzzle's payoff.
- **"Lasanha de berinjela"** — running inside joke (used twice: once in the Brazilian food puzzle, mirrored as "Lasagna di Melanzane" in the Italian one).
- **"Can't Take My Eyes Off You"** — their song. Plays during the cinematic reel.

## User flow

```
Landing (black)
    ↓ click "Start"
Puzzle 1 — Italian food picker
    ↓ correct answer
Puzzle 2 — Brazilian food picker
    ↓ correct answer
Puzzle 3 — Sims name slot machine
    ↓ jackpot
"Press play" gate (required for audio)
    ↓ click
Cinematic photo reel (with song)
    ↓ auto-advance through 27 photos
Polaroid wall (freeform exploration)
    ↓ "♪ Our song" badge links to YouTube
```

Wrong answers are never blocking — they show a sassy line and let her retry. The page is in **English**.

## Screens

### 1. Landing

- Full black background.
- Single line fades in (serif, cream): *"Three little puzzles. Then something for you."*
- Below: a soft button labeled **Start**.
- No music yet. (The Start click is the user gesture that unlocks audio playback — `fun_song.mp3` starts looping the moment she enters puzzle 1.)

### 2. Puzzle 1 — Italian food picker

**Prompt:** *"Pick the real Italian dish."*

Four cards, each with a food image and label. She clicks one.

| Label | File | Correct? | Reaction on click |
|---|---|---|---|
| Cacio e Pepe | `assets/food/cacio_pepe.webp` | ✅ | (advance) |
| Spaghetti Bolognese | `assets/food/spaghetti_bolognese.jpeg` | ❌ | *"Tourist trap. No Italian eats this."* |
| Fettuccine Alfredo | `assets/food/fettucine_alfredo.webp` | ❌ | *"American invention. Try again."* |
| Lasagna di Melanzane | `assets/food/lasanha_berinjela.webp` | ❌ | *"😏 nice try."* (callback) |

Wrong picks shake the card and show the reaction line. Correct pick fades the puzzle out and transitions to puzzle 2.

### 3. Puzzle 2 — Brazilian food picker

**Prompt:** *"Now my side. Pick the real one."*

Same UI as puzzle 1. The wrong options use intentionally misspelled "cutesy" names (the spelling itself is the joke).

| Label | File | Correct? | Reaction on click |
|---|---|---|---|
| Pão de queijo | `assets/food/pao_de_queijo.jpg` | ✅ | (advance) |
| Brilhadeiro | `assets/food/brigadeiro.jpg` | ❌ | *"'Shiny one' — almost. The real one is brigadeiro."* |
| Beijoada | `assets/food/feijoada.jpg` | ❌ | *"'Kissed one' — cute, but no."* |
| Lasanha de berinjela | `assets/food/lasanha_berinjela.webp` | ❌ | *"Don't even start."* |

### 4. Puzzle 3 — Sims name slot machine

**Prompt:** *"Last one. What are our Sims called?"*

A two-reel slot machine UI on a black stage.

- **Left reel** (Roberto's surname pool): `Bolgheroni, Boquetoni, Bolognese, Bombolone, Brigadeiro, Boquerone`
- **Right reel** (Irene's surname pool): `Mazzucco, Zucchero, Zuccotto, Zuccone, Zucchina, Zampone`
- A lever (clickable / tappable). She pulls; reels spin (GSAP) and stop on a random combo.
- Each non-jackpot combo flashes a generated "couple name" + a one-liner from a pool of ~12 reactions (e.g., *"Bombolone Zucchina. Sounds like a dessert. No."*). Same combo never shows the same line twice in a session.
- Jackpot = **Boquetoni + Zucchero** → reels stop, light up, soft chime, screen fades to white-on-black: *"That's us. 💌"* → button: **Press play to start the show**.

Reels are deterministically rigged with a **minimum of 3 losing pulls before any jackpot is possible**. From pull 4 onward, jackpot probability starts at 50% and increases +20% per subsequent pull (capped at 100%) — so she wins by pull 6 at the latest, but the first three pulls are *guaranteed* misses that show funny generated combos. Implementation: each reel has independent target indices; the "jackpot roll" is hard-locked to false for pulls 1–3, then becomes probabilistic from pull 4 onward.

### 5. Press-play gate

- One full-screen button: **Press play to start the show**.
- Required so the browser allows audio playback (autoplay-with-sound is blocked).
- Click → starts `our_song.mp3` and launches the cinematic reel.

### 6. Cinematic photo reel

- 27 photos auto-advance, full-screen, one at a time.
- Each photo: Ken Burns (slow zoom + slight pan) + 800ms crossfade.
- Per-photo duration: ~4s default, ~6s for the final favorite.
- Each photo has a soft caption that fades in/out (cream serif, bottom center).
- Music plays throughout. A small mute/unmute toggle in the corner.
- A skip-to-end pill in the corner (small, easy to miss) — *"skip to the wall →"*. Not advertised but available.
- **Final photo: `couple_my_favorite.jpg`** — lingers longest, special caption, slowest fade.

Photo order and captions live in `js/copy.js` as an array of `{ file, caption }`. Initial order (Roberto fills/edits captions later):

1. `first_date.jpg` — *"where it started."*
2. `ire_beautiful.jpg` — *"..."*
3. `couple_vatican.jpg` — *"Rome."*
4. `couple_train.jpg` — *"on our way somewhere."*
5. `couple_lunch.jpg` — *"sunday lunch."*
6. `couple_playing.jpg`
7. `couple_her_b_day.jpg` — *"your day."*
8. `couple_bed.jpg`
9. `couple_bed_2.jpg`
10. `couple_cute.jpg`
11. `couple_cute_2.jpg`
12. `couple_cute_3.jpg`
13. `couple_cute_4.jpg`
14. `couple_cute_5.jpg`
15. `couple_cute_6.jpg`
16. `couple_cute_7.jpg`
17. `couple_cool.jpg`
18. `couple_cool_2.jpg`
19. `couple_cool_3.jpg`
20. `couple_2.jpg`
21. `couple_fun_1.jpg`
22. `couple_funny_2.jpg`
23. `her_funny.jpg`
24. `her_funny_2.jpg`
25. `her_pretty.jpg`
26. `ire_funny.jpg`
27. **`couple_my_favorite.jpg`** — *"my favorite. always."*

Captions can stay empty (`""`) — those photos just play without text.

### 7. Polaroid wall

- After the reel ends (or skip is pressed), all 27 photos drop onto the screen as scattered, slightly-rotated polaroids on a dark "memory board" background.
- Each polaroid is draggable (pointer events) and click-to-enlarge.
- Z-index updates on drag so the dragged polaroid comes to front.
- A small **"♪ Our song"** badge bottom-right links to the YouTube video.
- No "end" — she plays with it as long as she wants.

## Visual design

- **Background:** pure black (`#000`) for landing/puzzles, very dark gray (`#0a0a0a`) for polaroid wall.
- **Text:** warm cream (`#f5ecd9`) for body, soft pink/red (`#e8788a`) as single accent.
- **Fonts:** Playfair Display (serif, for romantic lines) + Inter (sans, for UI). Both via Google Fonts.
- **Motion:** everything enters with a subtle animation — nothing just appears. Default ease: `power2.out`.
- **Tone of copy:** playful, never mean. "Almost." "Cute try." "😏 nice try." Light, warm, teasing.

## Tech stack

- **Vanilla HTML + CSS + JS.** No framework. No build step required for prod.
- **GSAP** (CDN) for animations: slot machine reel spin, polaroid drops, Ken Burns, crossfades.
- **Vite** as optional local dev server (`npm create vite@latest -- --template vanilla`) — only for dev convenience. Final deployable artifact is plain static files.
- **No backend, no analytics, no auth.**
- **Audio:** two files, both played via `<audio>` elements.
  - `our_song.mp3` — "Can't Take My Eyes Off You". Plays during the cinematic reel, starts on the press-play gesture.
  - `fun_song.mp3` — playful background music. Starts on the Landing "Start" click (this gesture also unlocks audio), loops at low volume (~30%) through all three puzzles, fades out over ~1.5s when the press-play gate is shown.

## File structure

```
/
  index.html
  styles.css
  js/
    app.js            // top-level state machine: landing → p1 → p2 → p3 → gate → reel → wall
    puzzles.js        // puzzle definitions + click handlers (config-driven)
    slot-machine.js   // reel rendering, spin animation, rigged jackpot logic, generated reactions
    album.js          // cinematic reel (Ken Burns + crossfade) + polaroid wall (drag/enlarge)
    copy.js           // all strings + photo list + caption list (single source of truth)
  assets/
    food/             // 8 food photos (already in repo, currently at project root — to be moved)
    photos/           // 27 couple photos (currently at project root — to be moved)
    audio/
      our_song.mp3    // currently at project root — to be moved (cinematic reel)
      fun_song.mp3    // currently at project root — to be moved (puzzles, looped)
  docs/
    superpowers/specs/2026-06-12-valentine-page-design.md   // this file
```

**Note:** assets currently live at the repo root. Part of the implementation is moving them into `assets/` subdirectories and updating the `.gitignore` / paths accordingly.

## Photo optimization

The 27 source JPGs total ~80MB — too heavy for GitHub Pages. Before commit:

- Resize to max 1920px on the long edge.
- Re-encode JPGs at quality 80, WebP where supported.
- Target: each photo < 300KB, total < 10MB.
- Tooling: `sharp-cli` or `squoosh` (one-shot script in `scripts/optimize-photos.sh`).
- Originals stay out of the repo (added to `.gitignore`), optimized versions go into `assets/photos/`.

## Deployment

- Repo: `https://github.com/bolgheroni/lp_irene` (already created, remote ready).
- First push:
  ```
  git remote add origin https://github.com/bolgheroni/lp_irene.git
  git branch -M main
  git push -u origin main
  ```
- GitHub Pages source: **GitHub Actions** (modern flow) — a tiny workflow that publishes the repo root on push to `main`. No `gh-pages` branch needed.
- Final URL: `https://bolgheroni.github.io/lp_irene/`.

## State machine (logical)

```
LANDING
  → start clicked → PUZZLE_1
PUZZLE_1
  → wrong: shake + show reaction; stay
  → right: fade out → PUZZLE_2
PUZZLE_2
  → wrong: shake + show reaction; stay
  → right: fade out → PUZZLE_3
PUZZLE_3
  → spin: animate reels; if not jackpot, show generated combo + reaction; allow retry
  → jackpot: lights + chime → PRESS_PLAY_GATE
PRESS_PLAY_GATE
  → play clicked → REEL (audio.play())
REEL
  → advance through photos; when last finishes → WALL
  → skip clicked → WALL
WALL
  → terminal state; drag/enlarge polaroids; YouTube link visible
```

State is held in a single `appState` variable in `app.js`. No router, no URL changes — it's a single screen.

## Out of scope

- No mobile-first redesign — must work on her phone (iPhone Safari) and on a laptop, but not pixel-tuned for tablets.
- No skip button on the landing or puzzles — only on the reel.
- No multiple-language support — English only.
- No custom domain.
- No keyboard shortcuts.
- No analytics, no error tracking.
- No persistence — refreshing resets her to the landing screen. (She'll finish once.)
- No accessibility audit beyond "buttons are buttons and images have alt text."
- No tests beyond manual playthrough.

## Success criteria

1. Irene can open the URL on her phone, complete all three puzzles without getting stuck, see the photo reel with the song, and reach the polaroid wall.
2. The Sims-name reveal lands as a joke (Boquetoni + Zucchero).
3. The final photo (her favorite) feels like a payoff.
4. Total page weight < 15MB.
5. No crashes / no broken images on iPhone Safari + desktop Chrome.

## Open assumptions (to validate during implementation)

- The food puzzle images are already in the repo root at the filenames listed in the tables above — confirmed.
- `our_song.mp3` is legally fine to host publicly on GitHub Pages — Roberto's call, not flagged here.
- Photo captions: Roberto will fine-tune the caption text in `copy.js` before the final deploy. Spec just provides starting captions.
