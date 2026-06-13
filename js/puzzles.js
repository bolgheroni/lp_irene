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
