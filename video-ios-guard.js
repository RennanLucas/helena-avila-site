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
