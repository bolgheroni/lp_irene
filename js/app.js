import { LANDING } from './copy.js';
import { startFun } from './audio.js';
import { renderPuzzle1, renderPuzzle2 } from './puzzles.js';
import { renderSlot } from './slot-machine.js';

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
  puzzle1: () => renderPuzzle1(ensureScreen('puzzle1'), () => go('puzzle2')),
  puzzle2: () => renderPuzzle2(ensureScreen('puzzle2'), () => go('puzzle3')),
  puzzle3: () => renderSlot(ensureScreen('puzzle3'), () => go('gate')),
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
  startFun();
  go('puzzle1');
}

// Boot
go('landing');

// Expose for the other modules to call during development.
window.__app = { go, state };
