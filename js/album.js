import { REEL, WALL } from './copy.js';
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
