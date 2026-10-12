/* Helena Ávila — original uploaded image cover v48 */
(function () {
  'use strict';

  function applyFullscreenGuard() {
    const frame = document.querySelector('.hv-modal-frame');
    const fullButton = frame && frame.querySelector('.hv-clean-full');
    if (!frame || !fullButton) return;
    const canFullscreen = typeof frame.requestFullscreen === 'function' || typeof frame.webkitRequestFullscreen === 'function';
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isiOS && !canFullscreen) {
      fullButton.hidden = true;
      frame.setAttribute('data-hv-native-fullscreen-blocked', 'true');
    }
  }

  function mountCover() {
    const card = document.querySelector('.hv-card');
    if (!card) return false;
    if (!document.getElementById('hv-final-cover-v48')) {
      const style = document.createElement('style');
      style.id = 'hv-final-cover-v48';
      style.textContent = `.hv-card>img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;transform:none!important}.hv-card::before,.hv-card::after,.hv-card-top,.hv-card-bottom{display:none!important}`;
      document.head.appendChild(style);
    }
    return true;
  }

  function boot() {
    applyFullscreenGuard();
    if (mountCover()) return;
    const observer = new MutationObserver(() => { applyFullscreenGuard(); if (mountCover()) observer.disconnect(); });
    observer.observe(document.documentElement, { childList:true, subtree:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();
