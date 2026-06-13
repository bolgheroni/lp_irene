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
