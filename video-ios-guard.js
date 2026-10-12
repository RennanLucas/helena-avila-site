/* Helena Ávila — iOS fullscreen guard v46 */
(function () {
  'use strict';

  function applyGuard() {
    const frame = document.querySelector('.hv-modal-frame');
    const fullButton = frame && frame.querySelector('.hv-clean-full');
    if (!frame || !fullButton) return;

    const frameFullscreenSupported =
      typeof frame.requestFullscreen === 'function' ||
      typeof frame.webkitRequestFullscreen === 'function';

    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isiOS && !frameFullscreenSupported) {
      fullButton.hidden = true;
      fullButton.setAttribute('aria-hidden', 'true');
      fullButton.setAttribute('tabindex', '-1');
      frame.setAttribute('data-hv-native-fullscreen-blocked', 'true');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyGuard, { once: true });
  } else {
    applyGuard();
  }

  const observer = new MutationObserver(() => applyGuard());
  const start = () => {
    if (!document.body) return;
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();

/* Helena Ávila — crisp video cover v46 — Safari/iPhone safe
 * Em vez de ampliar uma JPG comprimida, o card captura um frame do MP4 original
 * em resolução nativa. Assim a capa fica nítida em telas Retina sem carregar o
 * vídeo inteiro. O vídeo é reproduzido mudo por uma fração de segundo e pausado.
 */
(function () {
  'use strict';

  const VIDEO_SRC = 'assets/videos/helena-video-01.mp4?v=46';

  function ensureStyles() {
    if (document.getElementById('hv-crisp-cover-v46')) return;
    const style = document.createElement('style');
    style.id = 'hv-crisp-cover-v46';
    style.textContent = `
      .hv-card {
        position: relative !important;
        isolation: isolate !important;
        overflow: hidden !important;
        background: #171719 !important;
      }
      .hv-card > img,
      .hv-card > picture {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
      .hv-card::before,
      .hv-card::after,
      .hv-card-top,
      .hv-card-bottom {
        display: none !important;
      }
      .hv-crisp-cover-video {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        object-position: center center !important;
        z-index: 0 !important;
        pointer-events: none !important;
        background: #171719 !important;
        transform: translateZ(0) !important;
        -webkit-transform: translateZ(0) !important;
      }
      .hv-crisp-cover-shade {
        position: absolute !important;
        inset: 0 !important;
        z-index: 1 !important;
        pointer-events: none !important;
        background: linear-gradient(to bottom, rgba(10,10,12,.02) 0%, rgba(10,10,12,.04) 48%, rgba(10,10,12,.35) 68%, rgba(10,10,12,.94) 100%) !important;
      }
      .hv-crisp-cover-copy {
        position: absolute !important;
        z-index: 2 !important;
        left: clamp(22px, 6vw, 42px) !important;
        right: clamp(22px, 6vw, 42px) !important;
        bottom: clamp(30px, 8vw, 54px) !important;
        color: #fff !important;
        pointer-events: none !important;
        text-align: left !important;
      }
      .hv-crisp-kicker {
        display: block !important;
        margin-bottom: 8px !important;
        color: rgba(255,255,255,.72) !important;
        font: 700 10px/1.2 var(--font-sans, Arial, sans-serif) !important;
        letter-spacing: .18em !important;
        text-transform: uppercase !important;
      }
      .hv-crisp-title {
        display: block !important;
        max-width: 420px !important;
        color: #fff !important;
        font: 500 clamp(28px, 7vw, 44px)/.98 var(--font-serif, Georgia, serif) !important;
        letter-spacing: -.02em !important;
        text-shadow: 0 2px 18px rgba(0,0,0,.28) !important;
      }
      .hv-crisp-play {
        margin-top: 18px !important;
        width: 52px !important;
        height: 52px !important;
        display: grid !important;
        place-items: center !important;
        border-radius: 999px !important;
        background: rgba(255,255,255,.96) !important;
        color: #171719 !important;
        box-shadow: 0 10px 30px rgba(0,0,0,.22) !important;
      }
      .hv-crisp-play svg { width: 18px !important; height: 18px !important; margin-left: 2px !important; }
      .hv-card[data-hv-crisp-cover="v46"] {
        box-shadow: 0 34px 80px rgba(40,27,18,.20) !important;
      }
      @media (max-width: 600px) {
        .hv-crisp-cover-copy { left: 24px !important; right: 24px !important; bottom: 34px !important; }
        .hv-crisp-title { font-size: 34px !important; max-width: 330px !important; }
        .hv-crisp-play { width: 48px !important; height: 48px !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function buildCover(card) {
    if (!card || card.querySelector('.hv-crisp-cover-video')) return true;

    card.setAttribute('data-hv-crisp-cover', 'v46');
    card.setAttribute('aria-label', 'Assistir vídeo de Helena Ávila');
    card.style.removeProperty('background-image');

    const video = document.createElement('video');
    video.className = 'hv-crisp-cover-video';
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('preload', 'metadata');
    video.setAttribute('aria-hidden', 'true');
    video.src = VIDEO_SRC;

    const shade = document.createElement('div');
    shade.className = 'hv-crisp-cover-shade';
    shade.setAttribute('aria-hidden', 'true');

    const copy = document.createElement('div');
    copy.className = 'hv-crisp-cover-copy';
    copy.setAttribute('aria-hidden', 'true');
    copy.innerHTML = `
      <span class="hv-crisp-kicker">Uma conversa com Helena</span>
      <strong class="hv-crisp-title">Uma experiência em primeira pessoa.</strong>
      <span class="hv-crisp-play">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5L8 5.5Z" fill="currentColor"/></svg>
      </span>`;

    card.prepend(video);
    card.appendChild(shade);
    card.appendChild(copy);

    let frozen = false;
    const freezeFrame = () => {
      if (frozen) return;
      frozen = true;
      try { video.pause(); } catch (_) {}
      try {
        if (Number.isFinite(video.duration) && video.duration > 0) video.currentTime = Math.min(0.35, video.duration / 20);
      } catch (_) {}
    };

    video.addEventListener('loadedmetadata', () => {
      try { video.currentTime = Math.min(0.35, Math.max(0.05, video.duration / 100)); } catch (_) {}
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => setTimeout(freezeFrame, 220)).catch(() => freezeFrame());
      } else {
        setTimeout(freezeFrame, 220);
      }
    }, { once: true });

    video.addEventListener('timeupdate', () => {
      if (video.currentTime >= 0.25) freezeFrame();
    });
    video.addEventListener('loadeddata', () => {
      if (video.currentTime > 0) freezeFrame();
    });

    return true;
  }

  function apply() {
    ensureStyles();
    const card = document.querySelector('.hv-card');
    if (!card) return false;
    return buildCover(card);
  }

  function boot() {
    ensureStyles();
    if (apply()) return;
    const observer = new MutationObserver(() => {
      if (apply()) observer.disconnect();
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
