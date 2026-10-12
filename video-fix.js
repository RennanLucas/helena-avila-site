/* Helena Ávila — clean video player v38 */
(function () {
  'use strict';

  const CLEAN_POSTER = 'assets/videos/helena-video-cover-final.jpg?v=48';

  function ensureStyles() {
    if (document.getElementById('hv-clean-player-styles')) return;
    const style = document.createElement('style');
    style.id = 'hv-clean-player-styles';
    style.textContent = `
      .hv-poster-layer img {
        object-position: center 24% !important;
      }

      .hv-card:before {
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        height: 35% !important;
        background: linear-gradient(to bottom, rgba(23,23,25,0), rgba(23,23,25,.90) 46%, #171719 86%) !important;
        border-radius: 0 !important;
      }

      .hv-card:after {
        background: linear-gradient(to bottom, rgba(12,10,9,.02) 0%, rgba(12,10,9,.05) 48%, rgba(12,10,9,.76) 70%, rgba(12,10,9,.98) 100%) !important;
      }

      /* A marca Descript foi exportada dentro do MP4. Esta faixa substitui somente a
         região inferior contaminada por uma área de player coerente com o site. */
      .hv-watermark-mask {
        z-index: 6 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        height: 15% !important;
        border-radius: 0 !important;
        opacity: 1 !important;
        background: linear-gradient(to bottom, rgba(13,12,11,0) 0%, rgba(13,12,11,.58) 35%, rgba(13,12,11,.96) 62%, #0d0c0b 100%) !important;
        pointer-events: none !important;
      }

      .hv-clean-controls {
        position: absolute;
        z-index: 10;
        left: 12px;
        right: 12px;
        bottom: 10px;
        min-height: 46px;
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 7px 9px;
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 16px;
        background: rgba(13,12,11,.82);
        -webkit-backdrop-filter: blur(16px);
        backdrop-filter: blur(16px);
        box-shadow: 0 12px 30px rgba(0,0,0,.28);
        color: #fff;
        transition: opacity .2s ease, transform .2s ease;
      }

      .hv-clean-controls button {
        width: 34px;
        height: 34px;
        flex: 0 0 34px;
        display: grid;
        place-items: center;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: rgba(255,255,255,.10);
        color: #fff;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
        transition: background .18s ease, transform .18s ease;
      }

      .hv-clean-controls button:hover {
        background: rgba(255,255,255,.18);
        transform: scale(1.04);
      }

      .hv-clean-controls button svg {
        width: 16px;
        height: 16px;
        display: block;
      }

      .hv-clean-progress {
        flex: 1 1 auto;
        min-width: 56px;
        height: 4px;
        margin: 0;
        border: 0;
        accent-color: #c5a059;
        cursor: pointer;
      }

      .hv-clean-time {
        flex: 0 0 auto;
        min-width: 36px;
        color: rgba(255,255,255,.82);
        font: 700 9px/1 var(--font-sans, Arial, sans-serif);
        letter-spacing: .02em;
        text-align: center;
      }

      .hv-modal video {
        background: #0d0c0b !important;
      }

      @media (max-width: 600px) {
        .hv-card:before { height: 38% !important; }
        .hv-watermark-mask { height: 16% !important; }
        .hv-clean-controls {
          left: 8px;
          right: 8px;
          bottom: 8px;
          min-height: 44px;
          gap: 7px;
          padding: 6px 7px;
          border-radius: 14px;
        }
        .hv-clean-controls button {
          width: 32px;
          height: 32px;
          flex-basis: 32px;
        }
        .hv-clean-time {
          min-width: 32px;
          font-size: 8px;
        }
      }

      @media (max-width: 360px) {
        .hv-clean-controls .hv-clean-mute { display: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function cleanPosterImages(root) {
    const scope = root || document;
    scope.querySelectorAll('.hv-poster-layer img').forEach(img => {
      if (img.getAttribute('src') !== CLEAN_POSTER) img.setAttribute('src', CLEAN_POSTER);
      img.setAttribute('data-hv-clean-poster', 'true');
    });
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  }

  function setupCleanPlayer() {
    const frame = document.querySelector('.hv-modal-frame');
    const video = frame && frame.querySelector('video');
    if (!frame || !video) return false;
    if (frame.querySelector('.hv-clean-controls')) return true;

    video.controls = false;
    video.removeAttribute('controls');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const controls = document.createElement('div');
    controls.className = 'hv-clean-controls';
    controls.setAttribute('aria-label', 'Controles do vídeo');
    controls.innerHTML = `
      <button class="hv-clean-play" type="button" aria-label="Reproduzir vídeo">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5L8 5.5Z" fill="currentColor"/></svg>
      </button>
      <input class="hv-clean-progress" type="range" min="0" max="1000" value="0" step="1" aria-label="Progresso do vídeo" />
      <span class="hv-clean-time">0:00</span>
      <button class="hv-clean-mute" type="button" aria-label="Silenciar vídeo">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Zm12.3.2a4 4 0 0 1 0 5.6l-1.4-1.4a2 2 0 0 0 0-2.8l1.4-1.4Z" fill="currentColor"/></svg>
      </button>
      <button class="hv-clean-full" type="button" aria-label="Tela cheia">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h5v2H7v3H5V5Zm9 0h5v5h-2V7h-3V5ZM5 14h2v3h3v2H5v-5Zm12 0h2v5h-5v-2h3v-3Z" fill="currentColor"/></svg>
      </button>`;
    frame.appendChild(controls);

    const playButton = controls.querySelector('.hv-clean-play');
    const progress = controls.querySelector('.hv-clean-progress');
    const time = controls.querySelector('.hv-clean-time');
    const muteButton = controls.querySelector('.hv-clean-mute');
    const fullButton = controls.querySelector('.hv-clean-full');

    const playSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5L8 5.5Z" fill="currentColor"/></svg>';
    const pauseSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z" fill="currentColor"/></svg>';
    const volumeSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Zm12.3.2a4 4 0 0 1 0 5.6l-1.4-1.4a2 2 0 0 0 0-2.8l1.4-1.4Z" fill="currentColor"/></svg>';
    const mutedSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4.3 3 16.7 16.7-1.4 1.4-3.2-3.2a8 8 0 0 1-1.5.9l-.8-1.8.8-.4L13 14.7V19l-5-4H4V9h2.3L2.9 5.6 4.3 3Zm8.7 2v5.2L9.8 7H8l5-4v2Zm3.3 4.2a4 4 0 0 1 1.1 4.2l-1.8-1.8a2 2 0 0 0-.7-1l1.4-1.4Z" fill="currentColor"/></svg>';

    const updatePlayState = () => {
      const paused = video.paused || video.ended;
      playButton.innerHTML = paused ? playSvg : pauseSvg;
      playButton.setAttribute('aria-label', paused ? 'Reproduzir vídeo' : 'Pausar vídeo');
    };

    const updateProgress = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const current = Number.isFinite(video.currentTime) ? video.currentTime : 0;
      progress.value = duration > 0 ? Math.round((current / duration) * 1000) : 0;
      time.textContent = formatTime(current);
    };

    const updateMuteState = () => {
      muteButton.innerHTML = video.muted ? mutedSvg : volumeSvg;
      muteButton.setAttribute('aria-label', video.muted ? 'Ativar som' : 'Silenciar vídeo');
    };

    const togglePlay = event => {
      if (event) event.stopPropagation();
      if (video.paused || video.ended) {
        const result = video.play();
        if (result && typeof result.catch === 'function') result.catch(() => {});
      } else {
        video.pause();
      }
    };

    playButton.addEventListener('click', togglePlay);
    video.addEventListener('play', updatePlayState);
    video.addEventListener('pause', updatePlayState);
    video.addEventListener('ended', updatePlayState);
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateProgress);
    video.addEventListener('durationchange', updateProgress);

    progress.addEventListener('input', event => {
      event.stopPropagation();
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      video.currentTime = (Number(progress.value) / 1000) * video.duration;
      updateProgress();
    });

    muteButton.addEventListener('click', event => {
      event.stopPropagation();
      video.muted = !video.muted;
      updateMuteState();
    });
    video.addEventListener('volumechange', updateMuteState);

    fullButton.addEventListener('click', event => {
      event.stopPropagation();
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        return;
      }
      if (frame.requestFullscreen) {
        frame.requestFullscreen().catch(() => {});
      } else if (frame.webkitRequestFullscreen) {
        frame.webkitRequestFullscreen();
      } else if (typeof video.webkitEnterFullscreen === 'function') {
        video.webkitEnterFullscreen();
      }
    });

    updatePlayState();
    updateProgress();
    updateMuteState();
    frame.setAttribute('data-hv-clean-player', 'v38');
    return true;
  }

  function apply() {
    ensureStyles();
    cleanPosterImages(document);
    setupCleanPlayer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }

  const observer = new MutationObserver(mutations => {
    let needsApply = false;
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) needsApply = true;
      if (mutation.type === 'attributes' && mutation.attributeName === 'src') needsApply = true;
      if (needsApply) break;
    }
    if (!needsApply) return;
    cleanPosterImages(document);
    setupCleanPlayer();
  });

  const startObserver = () => {
    if (!document.body) return;
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
  };

  if (document.body) startObserver();
  else document.addEventListener('DOMContentLoaded', startObserver, { once: true });
})();
