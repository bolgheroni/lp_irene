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
