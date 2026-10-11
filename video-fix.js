/* Helena Ávila — video cleanup v37 */
(function () {
  'use strict';

  const CLEAN_POSTER = 'assets/helena-portrait.jpg';

  function ensureStyles() {
    if (document.getElementById('hv-clean-poster-styles')) return;
    const style = document.createElement('style');
    style.id = 'hv-clean-poster-styles';
    style.textContent = `
      .hv-card img,
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
      .hv-watermark-mask {
        right: 0 !important;
        bottom: 5.5% !important;
        width: 58% !important;
        height: 9% !important;
        background: linear-gradient(135deg, rgba(13,12,11,0), rgba(13,12,11,.96) 54%, #0d0c0b 100%) !important;
      }
      @media (max-width: 600px) {
        .hv-card:before { height: 38% !important; }
        .hv-watermark-mask { width: 62% !important; height: 10% !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function cleanPosterImages(root) {
    const scope = root || document;
    scope.querySelectorAll('.hv-card img, .hv-poster-layer img').forEach(img => {
      if (img.getAttribute('src') !== CLEAN_POSTER) img.setAttribute('src', CLEAN_POSTER);
      img.setAttribute('data-hv-clean-poster', 'true');
    });
  }

  function apply() {
    ensureStyles();
    cleanPosterImages(document);
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
    if (needsApply) cleanPosterImages(document);
  });

  const startObserver = () => {
    if (!document.body) return;
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
  };

  if (document.body) startObserver();
  else document.addEventListener('DOMContentLoaded', startObserver, { once: true });
})();
