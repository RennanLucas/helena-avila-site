/* Helena Ávila — iOS fullscreen guard v45 */
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

/* Helena Ávila — premium video cover v45 — Safari/iPhone safe.
 * A capa é renderizada como background do card, e não como <img>.
 * Isso elimina o ícone azul de imagem quebrada que o Safari estava exibindo.
 */
(function () {
  'use strict';

  const CARD_COVER = 'assets/videos/helena-video-cover-premium.jpg';
  const CARD_COVER_VERSIONED = CARD_COVER + '?v=45';

  function ensureCoverStyles() {
    if (document.getElementById('hv-premium-cover-v45')) return;
    const style = document.createElement('style');
    style.id = 'hv-premium-cover-v45';
    style.textContent = `
      .hv-card {
        background-color: #171719 !important;
        background-image: url("${CARD_COVER_VERSIONED}") !important;
        background-repeat: no-repeat !important;
        background-position: center center !important;
        background-size: cover !important;
        -webkit-background-size: cover !important;
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
      .hv-card[data-hv-premium-cover="v45"] {
        box-shadow: 0 34px 80px rgba(40,27,18,.20) !important;
      }
    `;
    document.head.appendChild(style);
  }

  function applyPremiumCover() {
    ensureCoverStyles();
    const card = document.querySelector('.hv-card');
    if (!card) return false;

    card.setAttribute('data-hv-premium-cover', 'v45');
    card.setAttribute('aria-label', 'Assistir vídeo de Helena Ávila');
    card.style.setProperty('background-image', `url("${CARD_COVER_VERSIONED}")`, 'important');
    card.style.setProperty('background-size', 'cover', 'important');
    card.style.setProperty('background-position', 'center center', 'important');

    const legacyImage = card.querySelector(':scope > img, :scope > picture');
    if (legacyImage) {
      legacyImage.setAttribute('aria-hidden', 'true');
      legacyImage.style.setProperty('display', 'none', 'important');
    }

    return true;
  }

  function boot() {
    ensureCoverStyles();
    applyPremiumCover();

    const observer = new MutationObserver(() => applyPremiumCover());
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
