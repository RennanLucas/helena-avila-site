/* Helena Ávila — iOS fullscreen guard v39 */
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

/* Helena Ávila — premium video cover v40 */
(function () {
  'use strict';

  const CARD_COVER = 'assets/videos/helena-video-cover-premium.jpg';

  function ensureCoverStyles() {
    if (document.getElementById('hv-premium-cover-v40')) return;
    const style = document.createElement('style');
    style.id = 'hv-premium-cover-v40';
    style.textContent = `
      .hv-card {
        background-image: url('${CARD_COVER}') !important;
        background-size: cover !important;
        background-position: center center !important;
        background-repeat: no-repeat !important;
      }
      .hv-card > img {
        opacity: 0 !important;
        visibility: hidden !important;
      }
      .hv-card::before,
      .hv-card::after,
      .hv-card-top,
      .hv-card-bottom {
        display: none !important;
      }
      .hv-card[data-hv-premium-cover="v40"] {
        box-shadow: 0 34px 80px rgba(40,27,18,.20) !important;
      }
      @media (max-width: 600px) {
        .hv-card {
          background-position: center center !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function applyPremiumCover() {
    ensureCoverStyles();
    const card = document.querySelector('.hv-card');
    if (!card) return false;
    card.setAttribute('data-hv-premium-cover', 'v40');
    card.setAttribute('aria-label', 'Assistir vídeo de Helena Ávila');
    return true;
  }

  function boot() {
    if (applyPremiumCover()) return;
    const observer = new MutationObserver(() => {
      if (applyPremiumCover()) observer.disconnect();
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
