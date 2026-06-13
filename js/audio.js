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
