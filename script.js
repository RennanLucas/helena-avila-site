/* Helena Ávila — premium video hero bootstrap
   Preserves the original site script and upgrades only the homepage hero. */
(function () {
  'use strict';

  // Keep all original site behavior intact. This script is parser-inserted at the end
  // of the page, so document.write loads the preserved original synchronously.
  document.write('<script src="script-original.js?v=18"><\/script>');

  const REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const VIDEO_SOURCES = {
    one: {
      count: 3,
      prefix: 'assets/video-data/helena-video-01.part',
      title: 'Reflexões sobre vínculos e emoções',
      eyebrow: 'Psicoterapia na prática',
      duration: '1:35',
    },
    two: {
      count: 4,
      prefix: 'assets/video-data/helena-video-02.part',
      title: 'Um olhar sobre conflitos e relações',
      eyebrow: 'Com Helena Ávila',
      duration: '2:45',
    }
  };

  const videoUrlCache = new Map();

  function partPath(source, index) {
    return `${source.prefix}${String(index + 1).padStart(2, '0')}.txt`;
  }

  async function buildVideoUrl(key) {
    if (videoUrlCache.has(key)) return videoUrlCache.get(key);
    const source = VIDEO_SOURCES[key];
    const requests = Array.from({ length: source.count }, (_, index) =>
      fetch(partPath(source, index), { cache: 'force-cache' }).then(response => {
        if (!response.ok) throw new Error(`Falha ao carregar ${response.url}`);
        return response.text();
      })
    );
    const encodedParts = await Promise.all(requests);
    const byteParts = encodedParts.map(encoded => {
      const clean = encoded.trim();
      const binary = atob(clean);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
      return bytes;
    });
    const url = URL.createObjectURL(new Blob(byteParts, { type: 'video/mp4' }));
    videoUrlCache.set(key, url);
    return url;
  }

  function iconPlay() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.8 6.5v11l9-5.5-9-5.5Z" fill="currentColor"/></svg>';
  }

  function iconVolume() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h4l5 4V5.5l-5 4H4Zm12.6-.9a5 5 0 0 1 0 6.8l1.4 1.4a7 7 0 0 0 0-9.6l-1.4 1.4Z" fill="currentColor"/></svg>';
  }

  function iconClose() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.4 5 12.6 12.6-1.4 1.4L5 6.4 6.4 5Zm11.2 0L19 6.4 6.4 19 5 17.6 17.6 5Z" fill="currentColor"/></svg>';
  }

  function injectStyles() {
    if (document.getElementById('helena-video-hero-styles')) return;
    const style = document.createElement('style');
    style.id = 'helena-video-hero-styles';
    style.textContent = `
      .hv-stage{position:relative;width:100%;max-width:430px;margin:0 auto;padding:18px 18px 42px;isolation:isolate}
      .hv-stage::before{content:"";position:absolute;inset:4% -8% 12%;z-index:-2;background:
        radial-gradient(circle at 34% 28%,rgba(197,160,89,.24),transparent 33%),
        radial-gradient(circle at 80% 70%,rgba(142,101,71,.16),transparent 38%);
        filter:blur(24px);opacity:.9;pointer-events:none}
      .hv-stage::after{content:"";position:absolute;inset:0;z-index:-1;border-radius:42px;
        border:1px solid rgba(142,101,71,.14);background:linear-gradient(145deg,rgba(255,255,255,.72),rgba(250,248,245,.38));
        backdrop-filter:blur(14px);box-shadow:0 30px 90px rgba(35,24,17,.08)}
      .hv-kicker{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 4px 14px}
      .hv-kicker-left{display:flex;align-items:center;gap:8px;color:#72503a;font:700 10px/1.2 var(--font-sans,Arial,sans-serif);
        letter-spacing:.16em;text-transform:uppercase}
      .hv-live-dot{width:7px;height:7px;border-radius:99px;background:#477053;box-shadow:0 0 0 5px rgba(71,112,83,.10)}
      .hv-kicker-note{color:#8a8178;font:600 9px/1.2 var(--font-sans,Arial,sans-serif);letter-spacing:.08em;text-transform:uppercase}
      .hv-main{position:relative;overflow:hidden;width:min(100%,340px);aspect-ratio:9/15;margin:0 auto;border-radius:30px;
        background:#171717;border:1px solid rgba(255,255,255,.45);box-shadow:0 30px 70px rgba(28,18,12,.22);
        transform:translateZ(0);cursor:pointer}
      .hv-main::after,.hv-mini::after{content:"";position:absolute;inset:0;pointer-events:none;background:
        linear-gradient(to bottom,rgba(9,8,7,.13) 0%,transparent 32%,transparent 58%,rgba(9,8,7,.72) 100%)}
      .hv-main video,.hv-main img,.hv-mini img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center}
      .hv-main img{transition:opacity .55s ease}
      .hv-main.is-video-ready img{opacity:0}
      .hv-noise{position:absolute;inset:0;z-index:2;opacity:.055;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.58'/%3E%3C/svg%3E")}
      .hv-topline{position:absolute;z-index:4;top:18px;left:18px;right:18px;display:flex;align-items:center;justify-content:space-between;gap:10px}
      .hv-chip{display:inline-flex;align-items:center;gap:6px;padding:7px 10px;border-radius:99px;background:rgba(17,17,17,.50);
        backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.20);color:#fff;font:700 9px/1 var(--font-sans,Arial,sans-serif);
        letter-spacing:.12em;text-transform:uppercase}
      .hv-chip--light{background:rgba(255,255,255,.84);color:#29231f;border-color:rgba(255,255,255,.75)}
      .hv-bottom{position:absolute;z-index:4;left:20px;right:20px;bottom:20px;color:#fff}
      .hv-eyebrow{font:700 9px/1.3 var(--font-sans,Arial,sans-serif);letter-spacing:.17em;text-transform:uppercase;color:#e9d3bd;margin-bottom:7px}
      .hv-title{font:500 clamp(22px,3vw,29px)/1.02 var(--font-serif,Georgia,serif);letter-spacing:-.02em;text-shadow:0 2px 15px rgba(0,0,0,.20)}
      .hv-watch{display:flex;align-items:center;gap:9px;margin-top:13px;font:700 10px/1.2 var(--font-sans,Arial,sans-serif);
        letter-spacing:.08em;text-transform:uppercase;color:#f7f2ec}
      .hv-play{width:36px;height:36px;border-radius:99px;display:grid;place-items:center;background:#fff;color:#161412;
        box-shadow:0 8px 25px rgba(0,0,0,.22);transition:transform .25s ease,background .25s ease}
      .hv-play svg{width:17px;height:17px;margin-left:1px}
      .hv-main:hover .hv-play,.hv-mini:hover .hv-play{transform:scale(1.08);background:#f2e5d8}
      .hv-mini{position:absolute;z-index:7;right:-2px;bottom:2px;width:148px;aspect-ratio:9/15;border-radius:23px;overflow:hidden;
        background:#191817;border:5px solid #faf8f5;box-shadow:0 24px 55px rgba(22,14,10,.24);cursor:pointer;
        transform:rotate(2.25deg);transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s ease}
      .hv-mini:hover{transform:rotate(0deg) translateY(-5px);box-shadow:0 30px 70px rgba(22,14,10,.28)}
      .hv-mini-info{position:absolute;z-index:4;left:12px;right:12px;bottom:13px;color:white}
      .hv-mini-info .hv-play{width:30px;height:30px;margin-bottom:8px}
      .hv-mini-info .hv-play svg{width:14px;height:14px}
      .hv-mini-label{font:700 8px/1.2 var(--font-sans,Arial,sans-serif);letter-spacing:.12em;text-transform:uppercase;color:#ecd7c3}
      .hv-mini-title{font:600 15px/1.04 var(--font-serif,Georgia,serif);margin-top:4px}
      .hv-stage-caption{display:flex;align-items:center;gap:8px;margin:16px 0 0 9px;color:#777068;font:600 10px/1.3 var(--font-sans,Arial,sans-serif)}
      .hv-stage-caption svg{width:14px;height:14px;color:#8e6547}
      .hv-loader{position:absolute;z-index:5;inset:0;display:grid;place-items:center;opacity:0;pointer-events:none;background:rgba(18,16,15,.10);
        backdrop-filter:blur(1px);transition:opacity .2s ease}
      .hv-main.is-loading .hv-loader{opacity:1}
      .hv-spinner{width:28px;height:28px;border-radius:50%;border:2px solid rgba(255,255,255,.36);border-top-color:#fff;animation:hv-spin .8s linear infinite}
      @keyframes hv-spin{to{transform:rotate(360deg)}}
      .hv-modal{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:22px;background:rgba(12,11,10,.88);
        backdrop-filter:blur(18px);opacity:0;visibility:hidden;transition:opacity .28s ease,visibility .28s ease}
      .hv-modal.is-open{opacity:1;visibility:visible}
      .hv-modal-shell{position:relative;width:min(94vw,430px);max-height:92vh;display:flex;flex-direction:column;align-items:stretch}
      .hv-modal-video-wrap{position:relative;width:100%;aspect-ratio:9/16;max-height:82vh;border-radius:28px;overflow:hidden;background:#000;
        border:1px solid rgba(255,255,255,.18);box-shadow:0 40px 120px rgba(0,0,0,.55)}
      .hv-modal video{width:100%;height:100%;object-fit:contain;background:#000}
      .hv-close{position:absolute;z-index:4;top:-13px;right:-13px;width:43px;height:43px;border:0;border-radius:99px;background:#faf8f5;color:#161412;
        display:grid;place-items:center;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.30)}
      .hv-close svg{width:19px;height:19px}
      .hv-modal-copy{display:flex;justify-content:space-between;gap:14px;align-items:center;padding:14px 5px 0;color:#fff}
      .hv-modal-copy strong{display:block;font:600 18px/1.05 var(--font-serif,Georgia,serif)}
      .hv-modal-copy span{display:block;margin-top:4px;color:#bbb5ae;font:600 9px/1.3 var(--font-sans,Arial,sans-serif);letter-spacing:.12em;text-transform:uppercase}
      .hv-modal-cta{flex:0 0 auto;text-decoration:none;color:#171514;background:#f4e7da;padding:10px 13px;border-radius:99px;
        font:800 9px/1 var(--font-sans,Arial,sans-serif);letter-spacing:.10em;text-transform:uppercase}
      body.hv-modal-lock{overflow:hidden}
      @media(max-width:1023px){
        .hv-stage{max-width:430px;margin-top:10px}
        .hv-main{width:min(88%,340px)}
        .hv-mini{right:1%;bottom:4px}
      }
      @media(max-width:520px){
        .hv-stage{padding:12px 8px 28px}
        .hv-stage::after{border-radius:30px}
        .hv-main{width:82%;margin-left:4%;border-radius:25px;aspect-ratio:9/15.4}
        .hv-mini{width:35%;right:1%;bottom:8px;border-width:4px;border-radius:20px}
        .hv-kicker{margin-inline:7px}
        .hv-kicker-note{display:none}
        .hv-title{font-size:23px}
        .hv-bottom{left:16px;right:16px;bottom:17px}
        .hv-stage-caption{margin-left:10px;font-size:9px;max-width:68%}
      }
      @media(prefers-reduced-motion:reduce){
        .hv-mini,.hv-play{transition:none!important}
        .hv-spinner{animation:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  function createModal() {
    const modal = document.createElement('div');
    modal.className = 'hv-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Vídeo de Helena Ávila');
    modal.innerHTML = `
      <div class="hv-modal-shell">
        <div class="hv-modal-video-wrap">
          <button class="hv-close" type="button" aria-label="Fechar vídeo">${iconClose()}</button>
          <video controls playsinline preload="metadata"></video>
        </div>
        <div class="hv-modal-copy">
          <div><strong></strong><span>Helena Ávila · Psicoterapia Integrativa</span></div>
          <a class="hv-modal-cta" href="https://wa.me/5511945035218?text=Ol%C3%A1%2C%20Helena.%20Vi%20seus%20v%C3%ADdeos%20no%20site%20e%20gostaria%20de%20conversar%20sobre%20uma%20sess%C3%A3o." target="_blank" rel="noopener">Conversar</a>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const video = modal.querySelector('video');
    const title = modal.querySelector('strong');
    const closeButton = modal.querySelector('.hv-close');

    function close() {
      video.pause();
      modal.classList.remove('is-open');
      document.body.classList.remove('hv-modal-lock');
    }
    closeButton.addEventListener('click', close);
    modal.addEventListener('click', event => {
      if (event.target === modal) close();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    return {
      async open(key) {
        const source = VIDEO_SOURCES[key];
        title.textContent = source.title;
        modal.classList.add('is-open');
        document.body.classList.add('hv-modal-lock');
        try {
          const url = await buildVideoUrl(key);
          if (video.src !== url) video.src = url;
          video.muted = false;
          await video.play().catch(() => {});
        } catch (error) {
          console.error('[Helena Video]', error);
        }
      }
    };
  }

  function createStage(modal, fallbackPoster) {
    const stage = document.createElement('div');
    stage.className = 'hv-stage';
    stage.innerHTML = `
      <div class="hv-kicker">
        <div class="hv-kicker-left"><span class="hv-live-dot"></span><span>Conheça a Helena em vídeo</span></div>
        <span class="hv-kicker-note">Conteúdo original · com som</span>
      </div>

      <button class="hv-main" type="button" aria-label="Assistir vídeo: ${VIDEO_SOURCES.one.title}">
        <img src="${fallbackPoster}" alt="Helena Ávila falando sobre saúde emocional" />
        <video muted loop playsinline preload="none" aria-hidden="true"></video>
        <span class="hv-noise"></span>
        <span class="hv-topline">
          <span class="hv-chip">Vídeo · ${VIDEO_SOURCES.one.duration}</span>
          <span class="hv-chip hv-chip--light">Helena Ávila</span>
        </span>
        <span class="hv-bottom">
          <span class="hv-eyebrow">${VIDEO_SOURCES.one.eyebrow}</span>
          <span class="hv-title">${VIDEO_SOURCES.one.title}</span>
          <span class="hv-watch"><span class="hv-play">${iconPlay()}</span><span>Assistir com som</span></span>
        </span>
        <span class="hv-loader"><span class="hv-spinner"></span></span>
      </button>

      <button class="hv-mini" type="button" aria-label="Assistir vídeo: ${VIDEO_SOURCES.two.title}">
        <img src="${fallbackPoster}" alt="Helena Ávila em uma segunda reflexão em vídeo" />
        <span class="hv-noise"></span>
        <span class="hv-mini-info">
          <span class="hv-play">${iconPlay()}</span>
          <span class="hv-mini-label">Outro vídeo · ${VIDEO_SOURCES.two.duration}</span>
          <span class="hv-mini-title">Conflitos &amp; relações</span>
        </span>
      </button>

      <div class="hv-stage-caption">${iconVolume()}<span>O primeiro vídeo começa sem som. Toque para ouvir a Helena.</span></div>
    `;

    const main = stage.querySelector('.hv-main');
    const mini = stage.querySelector('.hv-mini');
    const preview = main.querySelector('video');

    main.addEventListener('click', () => modal.open('one'));
    mini.addEventListener('click', () => modal.open('two'));

    if (!REDUCED_MOTION) {
      const startPreview = async () => {
        if (main.dataset.previewLoaded) return;
        main.dataset.previewLoaded = 'true';
        main.classList.add('is-loading');
        try {
          preview.src = await buildVideoUrl('one');
          preview.muted = true;
          preview.loop = true;
          preview.playsInline = true;
          await preview.play().catch(() => {});
          main.classList.add('is-video-ready');
        } catch (error) {
          console.error('[Helena Video Preview]', error);
        } finally {
          main.classList.remove('is-loading');
        }
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(startPreview, { timeout: 1100 });
      } else {
        setTimeout(startPreview, 450);
      }
    }

    return stage;
  }

  function initPremiumVideoHero() {
    const hero = document.getElementById('inicio');
    if (!hero || document.querySelector('.hv-stage')) return;

    injectStyles();

    // The current homepage hero has a direct grid with text in the first column
    // and Helena's editorial portrait in the second. Replace only that visual
    // column, leaving all copy, authority metrics, CTAs, analytics and SEO intact.
    const heroGrid = hero.querySelector('.site-container > .grid');
    if (!heroGrid || heroGrid.children.length < 2) return;
    const visualColumn = heroGrid.children[1];
    const existingPortrait = visualColumn.querySelector('img');
    const fallbackPoster = existingPortrait ? (existingPortrait.currentSrc || existingPortrait.src) : '';

    const modal = createModal();
    const stage = createStage(modal, fallbackPoster);

    visualColumn.innerHTML = '';
    visualColumn.classList.add('hv-video-column');
    visualColumn.appendChild(stage);
  }

  document.addEventListener('DOMContentLoaded', initPremiumVideoHero, { once: true });
})();
