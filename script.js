/* Helena Ávila — premium editorial video experience v36 — mobile touch fix */
(function () {
  'use strict';

  if (!document.getElementById('inicio')) {
    document.write('<script src="script-original.js?v=18"><\/script>');
    return;
  }

  const VIDEO = {
    src: 'assets/videos/helena-video-01.mp4',
    title: 'Uma conversa com Helena Ávila',
    duration: '1:35',
    poster: 'assets/videos/helena-video-cover-final.jpg?v=48'
  };

  const REFLECTION = {
    src: 'assets/videos/helena-reflexao-20261012.mp4',
    title: 'Uma reflexão com Helena Ávila',
    duration: '2:45',
    poster: 'assets/videos/helena-reflexao-cover-20261012.jpg'
  };

  const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 6.4v11.2L18 12 8.5 6.4Z" fill="currentColor"/></svg>';
  const closeIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.4 5 12.6 12.6-1.4 1.4L5 6.4 6.4 5Zm11.2 0L19 6.4 6.4 19 5 17.6 17.6 5Z" fill="currentColor"/></svg>';

  function addStyles() {
    if (document.getElementById('helena-editorial-video-styles')) return;
    const style = document.createElement('style');
    style.id = 'helena-editorial-video-styles';
    style.textContent = `
      .hv-section,.hv-section *,.hv-modal,.hv-modal *{box-sizing:border-box}
      .hv-section{position:relative;padding:clamp(64px,8vw,104px) 0;background:#f5f0e9;border-bottom:1px solid #e6dfd5;overflow:hidden;content-visibility:auto;contain-intrinsic-size:850px}
      .hv-section:before{content:"";position:absolute;width:clamp(360px,42vw,540px);height:clamp(360px,42vw,540px);border-radius:50%;right:-220px;top:-260px;background:radial-gradient(circle,rgba(197,160,89,.15),transparent 68%);pointer-events:none}
      .hv-wrap{width:100%;max-width:1280px;margin:auto;padding:0 clamp(18px,3vw,32px);display:grid;grid-template-columns:minmax(0,1.04fr) minmax(320px,.76fr);gap:clamp(42px,6vw,76px);align-items:center}
      .hv-copy{max-width:620px;min-width:0}
      .hv-kicker{display:inline-flex;align-items:center;gap:9px;margin-bottom:18px;color:#8e6547;font:800 10px/1.2 var(--font-sans,Arial,sans-serif);letter-spacing:.18em;text-transform:uppercase}
      .hv-kicker:before{content:"";width:26px;height:1px;background:#c5a059}
      .hv-heading{margin:0;color:#171719;font:400 clamp(38px,4.3vw,64px)/.98 var(--font-serif,Georgia,serif);letter-spacing:-.035em}
      .hv-heading em{font-weight:400;color:#8e6547}
      .hv-lead{margin:24px 0 0;max-width:560px;color:#665f58;font:400 16px/1.75 var(--font-sans,Arial,sans-serif)}
      .hv-meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}
      .hv-meta span{padding:8px 11px;border-radius:999px;background:rgba(255,255,255,.72);border:1px solid #ded5ca;color:#655d55;font:700 10px/1 var(--font-sans,Arial,sans-serif);letter-spacing:.06em;text-transform:uppercase}
      .hv-actions{display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin-top:30px}
      .hv-cta{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:48px;padding:14px 20px;border-radius:14px;background:#171719;color:#fff;text-decoration:none;font:800 11px/1 var(--font-sans,Arial,sans-serif);letter-spacing:.08em;text-transform:uppercase;transition:transform .28s ease,background .28s ease,box-shadow .28s ease}
      .hv-cta:hover{background:#8e6547;transform:translateY(-2px);box-shadow:0 14px 30px rgba(70,45,30,.18)}
      .hv-small-note{color:#8d8379;font:600 10px/1.4 var(--font-sans,Arial,sans-serif);letter-spacing:.04em}

      .hv-media{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:0;z-index:2}
      .hv-media:before{content:"";position:absolute;inset:8% 2% -4% 16%;border:1px solid rgba(142,101,71,.20);border-radius:38px;transform:rotate(3deg);background:rgba(255,255,255,.36);pointer-events:none}
      .hv-card{position:relative;z-index:3;width:min(100%,370px);aspect-ratio:9/16;border:0;border-radius:30px;overflow:hidden;padding:0;background:#171719;cursor:pointer;box-shadow:0 34px 80px rgba(40,27,18,.20);transform:translateZ(0);transition:transform .35s cubic-bezier(.2,.7,.2,1),box-shadow .35s ease;touch-action:manipulation;isolation:isolate;-webkit-tap-highlight-color:transparent;pointer-events:auto}
      .hv-card>*{pointer-events:none}
      .hv-card{cursor:default}
      .hv-cover-play{position:absolute;z-index:7;left:6.8%;bottom:5.6%;width:11.7%;aspect-ratio:1;min-width:44px;border:0;border-radius:50%;background:transparent;cursor:pointer;pointer-events:auto!important;padding:0}
      .hv-cover-play:focus-visible{outline:3px solid #c5a059;outline-offset:4px}
      .hv-poster-layer{pointer-events:none!important}
      .hv-poster-center{pointer-events:auto!important;cursor:pointer}
      .hv-card:hover{transform:translateY(-6px) scale(1.012);box-shadow:0 42px 95px rgba(40,27,18,.26)}
      .hv-card img{width:100%;height:100%;object-fit:cover;object-position:center 35%;display:block}
      .hv-card:after{content:"";position:absolute;z-index:1;inset:0;background:linear-gradient(to bottom,rgba(12,10,9,.02) 0%,rgba(12,10,9,.04) 45%,rgba(12,10,9,.66) 72%,rgba(12,10,9,.96) 100%);pointer-events:none}
      .hv-card:before{content:"";position:absolute;z-index:2;right:0;bottom:0;width:52%;height:10%;background:linear-gradient(135deg,rgba(23,23,25,0),rgba(23,23,25,.88) 58%,#171719 100%);pointer-events:none}
      .hv-card-top{position:absolute;z-index:3;top:18px;left:18px;right:18px;display:flex;justify-content:space-between;align-items:center;gap:10px}
      .hv-pill{display:inline-flex;max-width:48%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:7px 10px;border-radius:999px;background:rgba(255,255,255,.90);backdrop-filter:blur(12px);color:#221f1d;font:800 9px/1 var(--font-sans,Arial,sans-serif);letter-spacing:.10em;text-transform:uppercase}
      .hv-card-bottom{position:absolute;z-index:4;left:22px;right:22px;bottom:22px;color:#fff;text-align:left}
      .hv-card-label{font:800 9px/1.2 var(--font-sans,Arial,sans-serif);letter-spacing:.16em;text-transform:uppercase;color:#ecd8c3;margin-bottom:8px}
      .hv-card-title{font:500 clamp(23px,2.4vw,27px)/1.02 var(--font-serif,Georgia,serif)}
      .hv-card-play{display:flex;align-items:center;gap:10px;margin-top:14px;font:800 10px/1 var(--font-sans,Arial,sans-serif);letter-spacing:.08em;text-transform:uppercase}
      .hv-play{width:42px;height:42px;flex:0 0 auto;border-radius:50%;display:grid;place-items:center;background:#fff;color:#171719;box-shadow:0 10px 30px rgba(0,0,0,.18);transition:transform .25s ease,background .25s ease}
      .hv-play svg{width:18px;height:18px;margin-left:2px}
      .hv-card:hover .hv-play{transform:scale(1.08);background:#f1dfcf}

      .hv-mobile-open{display:none;position:relative;z-index:6;width:min(100%,350px);min-height:54px;margin-top:14px;border:0;border-radius:16px;background:#171719;color:#fff;align-items:center;justify-content:center;gap:10px;padding:14px 18px;font:800 11px/1 var(--font-sans,Arial,sans-serif);letter-spacing:.08em;text-transform:uppercase;box-shadow:0 12px 26px rgba(23,23,25,.16);touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer}
      .hv-mobile-open svg{width:18px;height:18px}

      .hv-modal{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:max(16px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));background:rgba(12,11,10,.92);backdrop-filter:blur(18px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .25s ease,visibility .25s ease}
      .hv-modal.is-open{opacity:1;visibility:visible;pointer-events:auto}
      .hv-modal-shell{position:relative;width:min(430px,calc(100vw - 34px),calc((100dvh - 110px) * .5625));max-width:100%}
      .hv-modal-frame{position:relative;width:100%;aspect-ratio:9/16;background:#0d0c0b;border-radius:28px;overflow:hidden;border:1px solid rgba(255,255,255,.14);box-shadow:0 40px 120px rgba(0,0,0,.56);isolation:isolate}
      .hv-modal video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center;background:#0d0c0b;display:block}
      .hv-poster-layer{position:absolute;z-index:3;inset:0;width:100%;height:100%;border:0;padding:0;background:#0d0c0b;cursor:pointer;overflow:hidden;opacity:1;visibility:visible;transition:opacity .24s ease,visibility .24s ease;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
      .hv-poster-layer.is-hidden{opacity:0;visibility:hidden;pointer-events:none}
      .hv-poster-layer img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 32%;display:block;pointer-events:none}
      .hv-poster-layer:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,9,8,.03),rgba(10,9,8,.08) 58%,rgba(10,9,8,.62) 100%);pointer-events:none}
      .hv-poster-center{position:absolute;z-index:2;left:50%;top:50%;transform:translate(-50%,-50%);display:grid;place-items:center;width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,.94);color:#171719;box-shadow:0 16px 40px rgba(0,0,0,.26);pointer-events:none}
      .hv-poster-center svg{width:28px;height:28px;margin-left:3px}
      .hv-poster-hint{position:absolute;z-index:2;left:22px;right:22px;bottom:24px;color:#fff;text-align:center;font:800 9px/1.35 var(--font-sans,Arial,sans-serif);letter-spacing:.12em;text-transform:uppercase;text-shadow:0 2px 14px rgba(0,0,0,.4);pointer-events:none}
      .hv-watermark-mask{position:absolute;z-index:4;right:0;bottom:7.5%;width:48%;height:6.5%;pointer-events:none;background:linear-gradient(135deg,rgba(13,12,11,0),rgba(13,12,11,.86) 64%,#0d0c0b 100%);border-radius:22px 0 0 0;opacity:.98}
      .hv-close{position:absolute;z-index:6;right:-12px;top:-12px;width:44px;height:44px;border:0;border-radius:50%;display:grid;place-items:center;background:#faf8f5;color:#171719;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.3);transition:transform .2s ease;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
      .hv-close:hover{transform:rotate(4deg) scale(1.04)}
      .hv-close svg{width:18px;height:18px}
      .hv-modal-caption{padding:12px 4px 0;color:#fff;min-height:34px}
      .hv-modal-caption strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:500 20px/1.1 var(--font-serif,Georgia,serif)}
      body.hv-lock{overflow:hidden;overscroll-behavior:none}
      .hv-reveal{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}
      .hv-reveal.is-visible{opacity:1;transform:none}

      @media(max-width:900px){
        .hv-section{padding:72px 0;content-visibility:visible!important;contain-intrinsic-size:auto!important}
        .hv-wrap{grid-template-columns:1fr;gap:38px;padding:0 24px}
        .hv-copy{max-width:720px;margin:0 auto}
        .hv-media{justify-content:center;z-index:5}
        .hv-card{width:min(100%,370px);z-index:6}
        .hv-mobile-open{display:inline-flex}
      }
      @media(max-width:600px){
        .hv-section{padding:56px 0}
        .hv-wrap{padding:0 16px;gap:28px}
        .hv-heading{font-size:clamp(36px,10.5vw,44px);line-height:1}
        .hv-lead{font-size:15px;line-height:1.65;margin-top:20px}
        .hv-meta{gap:7px;margin-top:20px}
        .hv-meta span{font-size:8px;padding:7px 9px}
        .hv-actions{margin-top:22px;gap:10px}
        .hv-cta{width:100%;min-height:52px}
        .hv-small-note{width:100%;text-align:center;font-size:9px}
        .hv-card{width:min(100%,350px);border-radius:24px}
        .hv-card-top{top:14px;left:14px;right:14px}
        .hv-card-bottom{left:18px;right:18px;bottom:18px}
        .hv-card-title{font-size:22px}
        .hv-mobile-open{width:min(100%,350px);min-height:56px}
        .hv-modal{padding:max(10px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left))}
        .hv-modal-shell{width:min(calc(100vw - 20px),calc((100dvh - 82px) * .5625),390px)}
        .hv-modal-frame{border-radius:22px}
        .hv-close{right:6px;top:6px}
        .hv-modal-caption strong{font-size:17px;text-align:center}
        .hv-poster-center{width:64px;height:64px}
        .hv-watermark-mask{width:46%;height:6%}
      }
      @media(max-height:620px) and (orientation:landscape){
        .hv-modal{padding:8px}
        .hv-modal-shell{width:min(350px,calc((100dvh - 18px) * .5625),calc(100vw - 70px))}
        .hv-modal-caption{display:none}
      }
      @media(prefers-reduced-motion:reduce){
        .hv-card,.hv-cta,.hv-reveal,.hv-close,.hv-poster-layer{transition:none!important}
        .hv-reveal{opacity:1!important;transform:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  function createModal() {
    const modal = document.createElement('div');
    modal.className = 'hv-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `<div class="hv-modal-shell"><button class="hv-close" type="button" aria-label="Fechar vídeo">${closeIcon}</button><div class="hv-modal-frame"><video controls playsinline preload="metadata"></video><button class="hv-poster-layer" type="button" aria-label="Reproduzir vídeo"><img alt="" decoding="async"/><span class="hv-poster-center">${playIcon}</span><span class="hv-poster-hint">Tocar para reproduzir</span></button><div class="hv-watermark-mask" aria-hidden="true"></div></div><div class="hv-modal-caption"><strong></strong></div></div>`;
    document.body.appendChild(modal);

    const video = modal.querySelector('video');
    const title = modal.querySelector('strong');
    const posterLayer = modal.querySelector('.hv-poster-layer');
    const posterImg = posterLayer.querySelector('img');
    const posterHint = posterLayer.querySelector('.hv-poster-hint');
    let hasStarted = false;

    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const showPoster = hint => {
      posterHint.textContent = hint || 'Tocar para reproduzir';
      posterLayer.classList.remove('is-hidden');
    };
    const hidePoster = () => posterLayer.classList.add('is-hidden');
    const tryPlay = () => {
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => showPoster('Tocar para reproduzir'));
      }
    };

    video.addEventListener('playing', () => {
      hasStarted = true;
      hidePoster();
    });
    video.addEventListener('canplay', () => {
      if (!hasStarted && !video.paused) hidePoster();
    });
    video.addEventListener('error', () => showPoster('Tocar para tentar novamente'));

    posterLayer.addEventListener('click', event => {
      event.preventDefault();
      showPoster('Carregando vídeo…');
      tryPlay();
    });

    const close = () => {
      video.pause();
      video.currentTime = 0;
      video.removeAttribute('src');
      video.removeAttribute('poster');
      video.load();
      hasStarted = false;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('hv-lock');
      showPoster();
    };

    modal.querySelector('.hv-close').addEventListener('click', close);
    modal.addEventListener('click', event => {
      if (event.target === modal) close();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    return {
      open(selectedVideo = VIDEO) {
        hasStarted = false;
        title.textContent = selectedVideo.title;
        posterImg.src = selectedVideo.poster;
        posterImg.alt = selectedVideo.title;
        video.poster = selectedVideo.poster;
        video.src = selectedVideo.src;
        video.muted = false;
        video.playsInline = true;
        video.pause();
        video.removeAttribute('autoplay');
        showPoster('Tocar para reproduzir');
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('hv-lock');
        video.load();
      }
    };
  }

  function bindMobileSafeOpen(element, modal, selectedVideo = VIDEO) {
    if (!element) return;
    let lastTouch = 0;

    element.addEventListener('touchend', event => {
      event.preventDefault();
      lastTouch = Date.now();
      modal.open(selectedVideo);
    }, { passive: false });

    element.addEventListener('click', event => {
      event.preventDefault();
      if (Date.now() - lastTouch < 700) return;
      modal.open(selectedVideo);
    });
  }

  function createMainSection(modal, selectedVideo = VIDEO) {
    const section = document.createElement('section');
    section.className = 'hv-section hv-reveal';
    section.setAttribute('aria-label', selectedVideo.title);
    if (selectedVideo === REFLECTION) section.id = 'reflexao-helena';
    section.innerHTML = `
      <div class="hv-wrap">
        <div class="hv-copy">
          <div class="hv-kicker">Conheça Helena Ávila</div>
          <h2 class="hv-heading">Uma conversa antes da <em>primeira sessão.</em></h2>
          <p class="hv-lead">Mais do que conhecer uma formação, é importante perceber a presença, a forma de escutar e o cuidado de quem vai acompanhar o seu processo. Assista a uma breve apresentação da Helena.</p>
          <div class="hv-meta"><span>Psicoterapia Integrativa</span><span>Presencial & online</span><span>${selectedVideo.duration}</span></div>
          <div class="hv-actions"><a class="hv-cta" href="https://wa.me/5511945035218?text=Ol%C3%A1%2C%20Helena.%20Conheci%20um%20pouco%20mais%20do%20seu%20trabalho%20pelo%20site%20e%20gostaria%20de%20conversar%20sobre%20uma%20sess%C3%A3o." target="_blank" rel="noopener">Agendar uma conversa →</a><span class="hv-small-note">Toque no botão de play para assistir.</span></div>
        </div>
        <div class="hv-media">
          <div class="hv-card">
            <img src="${selectedVideo.poster}" alt="Helena Ávila" loading="lazy" decoding="async" />
            <span class="hv-card-top"><span class="hv-pill">Vídeo · ${selectedVideo.duration}</span><span class="hv-pill">Helena Ávila</span></span>
            <span class="hv-card-bottom"><span class="hv-card-label">Conheça a terapeuta</span><span class="hv-card-title">Uma apresentação em primeira pessoa.</span><span class="hv-card-play"><span class="hv-play">${playIcon}</span><span>Assistir com som</span></span></span>
            <button class="hv-cover-play" type="button" aria-label="Assistir vídeo de Helena Ávila"></button>
          </div>
          <button class="hv-mobile-open" type="button" aria-label="Abrir vídeo de Helena Ávila">${playIcon}<span>Assistir vídeo</span></button>
        </div>
      </div>`;

    if (selectedVideo === REFLECTION) {
      section.querySelector('.hv-kicker').textContent = 'Reflexões com Helena';
      section.querySelector('.hv-heading').innerHTML = 'Um momento para <em>escutar e refletir.</em>';
      section.querySelector('.hv-lead').textContent = 'Acompanhe mais uma reflexão da Helena Ávila. Um convite para fazer uma pausa e olhar com atenção para a sua própria experiência.';
    }
    bindMobileSafeOpen(section.querySelector('.hv-cover-play'), modal, selectedVideo);
    bindMobileSafeOpen(section.querySelector('.hv-mobile-open'), modal, selectedVideo);
    return section;
  }

  function initReveal() {
    const items = Array.from(document.querySelectorAll('.hv-reveal'));
    if (!items.length) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(item => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });
    items.forEach(item => observer.observe(item));
  }

  function init() {
    document.querySelectorAll('.hv-about').forEach(el => el.remove());
    if (document.querySelector('.hv-section')) return;
    addStyles();
    const modal = createModal();
    const hero = document.getElementById('inicio');
    const marquee = hero && hero.nextElementSibling;
    if (marquee) {
      const introduction = createMainSection(modal);
      marquee.insertAdjacentElement('afterend', introduction);
      introduction.insertAdjacentElement('afterend', createMainSection(modal, REFLECTION));
    }
    requestAnimationFrame(initReveal);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

/* Helena Ávila — premium interaction engine v36 */
(function () {
  'use strict';

  const start = () => {
    const nav = document.getElementById('mainNav');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

    if (nav) {
      let ticking = false;
      const update = () => {
        nav.classList.toggle('lux-scrolled', window.scrollY > 24);
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      }, { passive: true });
      update();
    }

    const navLinks = Array.from(document.querySelectorAll('#mainNav nav a[href^="#"]'));
    const pairs = navLinks.map(link => {
      const id = link.getAttribute('href');
      const section = id && id.length > 1 ? document.querySelector(id) : null;
      return section ? { link, section } : null;
    }).filter(Boolean);

    if ('IntersectionObserver' in window && pairs.length) {
      const observer = new IntersectionObserver(entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        navLinks.forEach(link => link.classList.remove('lux-active'));
        const pair = pairs.find(item => item.section === visible.target);
        if (pair) pair.link.classList.add('lux-active');
      }, { rootMargin: '-26% 0px -58% 0px', threshold: [0, .08, .18, .32] });
      pairs.forEach(item => observer.observe(item.section));
    }

    if (!finePointer || reducedMotion) return;

    const heroPortrait = document.querySelector('#inicio .lg\\:col-span-5 > div:first-child');
    if (heroPortrait) {
      heroPortrait.classList.add('lux-hero-portrait');
      heroPortrait.addEventListener('pointermove', event => {
        const rect = heroPortrait.getBoundingClientRect();
        const nx = ((event.clientX - rect.left) / rect.width) - .5;
        const ny = ((event.clientY - rect.top) / rect.height) - .5;
        heroPortrait.style.setProperty('--lux-rx', `${(-ny * 2.4).toFixed(2)}deg`);
        heroPortrait.style.setProperty('--lux-ry', `${(nx * 2.8).toFixed(2)}deg`);
        heroPortrait.style.setProperty('--lux-tx', `${(nx * 5).toFixed(2)}px`);
        heroPortrait.style.setProperty('--lux-ty', `${(ny * 5).toFixed(2)}px`);
      });
      heroPortrait.addEventListener('pointerleave', () => {
        ['--lux-rx', '--lux-ry', '--lux-tx', '--lux-ty'].forEach(prop => heroPortrait.style.removeProperty(prop));
      });
    }

    document.querySelectorAll('.shimmer-btn, .hv-cta, #bottomStickyBar a').forEach(element => {
      element.classList.add('lux-magnetic');
      element.addEventListener('pointermove', event => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty('--lux-mx', `${((event.clientX - rect.left - rect.width / 2) * .055).toFixed(2)}px`);
        element.style.setProperty('--lux-my', `${((event.clientY - rect.top - rect.height / 2) * .075).toFixed(2)}px`);
      });
      element.addEventListener('pointerleave', () => {
        element.style.removeProperty('--lux-mx');
        element.style.removeProperty('--lux-my');
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();