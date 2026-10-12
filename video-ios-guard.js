/* Helena Ávila — real video frame cover v47 */
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

  function installStyles() {
    if (document.getElementById('hv-real-frame-v47')) return;
    const style = document.createElement('style');
    style.id = 'hv-real-frame-v47';
    style.textContent = `
      .hv-card{position:relative!important;isolation:isolate!important;overflow:hidden!important;background:#171719!important}
      .hv-card>img,.hv-card>picture{display:none!important}
      .hv-card::before,.hv-card::after,.hv-card-top,.hv-card-bottom{display:none!important}
      .hv-real-frame{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center center!important;z-index:0!important;pointer-events:none!important;background:#171719!important}
      .hv-real-shade{position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;background:linear-gradient(to bottom,rgba(10,10,12,0) 0%,rgba(10,10,12,.03) 52%,rgba(10,10,12,.38) 70%,rgba(10,10,12,.94) 100%)!important}
      .hv-real-copy{position:absolute!important;left:24px!important;right:24px!important;bottom:34px!important;z-index:2!important;color:#fff!important;pointer-events:none!important;text-align:left!important}
      .hv-real-kicker{display:block!important;margin-bottom:8px!important;color:rgba(255,255,255,.72)!important;font:700 10px/1.2 var(--font-sans,Arial,sans-serif)!important;letter-spacing:.18em!important;text-transform:uppercase!important}
      .hv-real-title{display:block!important;max-width:330px!important;color:#fff!important;font:500 34px/.98 var(--font-serif,Georgia,serif)!important;letter-spacing:-.02em!important;text-shadow:0 2px 18px rgba(0,0,0,.28)!important}
      .hv-real-play{margin-top:18px!important;width:48px!important;height:48px!important;display:grid!important;place-items:center!important;border-radius:999px!important;background:rgba(255,255,255,.96)!important;color:#171719!important;box-shadow:0 10px 30px rgba(0,0,0,.22)!important}
      .hv-real-play svg{width:18px!important;height:18px!important;margin-left:2px!important}
    `;
    document.head.appendChild(style);
  }

  function mountCover() {
    installStyles();
    const card = document.querySelector('.hv-card');
    if (!card || card.querySelector('.hv-real-frame')) return !!card;

    const video = document.createElement('video');
    video.className = 'hv-real-frame';
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');
    video.setAttribute('aria-hidden','true');
    video.src = 'assets/videos/helena-video-01.mp4?v=47';

    const shade = document.createElement('div');
    shade.className = 'hv-real-shade';
    const copy = document.createElement('div');
    copy.className = 'hv-real-copy';
    copy.innerHTML = '<span class="hv-real-kicker">Uma conversa com Helena</span><strong class="hv-real-title">Uma experiência em primeira pessoa.</strong><span class="hv-real-play"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5L8 5.5Z" fill="currentColor"/></svg></span>';

    card.prepend(video);
    card.appendChild(shade);
    card.appendChild(copy);
    card.setAttribute('data-hv-real-frame','v47');

    const freeze = () => { try { video.pause(); } catch (_) {} };
    video.addEventListener('loadedmetadata', () => {
      try { video.currentTime = 1.0; } catch (_) {}
    }, { once:true });
    video.addEventListener('seeked', freeze, { once:true });
    video.addEventListener('loadeddata', () => {
      if (video.currentTime < .8) { try { video.currentTime = 1.0; } catch (_) {} }
      else freeze();
    });
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
