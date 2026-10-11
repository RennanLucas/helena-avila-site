/* Helena Ávila — premium editorial video experience v33 */
(function () {
  'use strict';

  if (!document.getElementById('inicio')) {
    document.write('<script src="script-original.js?v=18"><\\/script>');
    return;
  }

  const VIDEO_SOURCES = {
    one: {
      src: 'assets/videos/helena-video-01.mp4',
      title: 'Uma conversa com Helena Ávila',
      duration: '1:35',
      poster: 'assets/videos/helena-video-01-cover.jpg'
    },
    two: {
      src: 'assets/videos/helena-video-02.mp4',
      title: 'Uma reflexão com Helena',
      duration: '2:45',
      poster: 'assets/helena-portrait.jpg'
    }
  };

  const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 6.4v11.2L18 12 8.5 6.4Z" fill="currentColor"/></svg>';
  const closeIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.4 5 12.6 12.6-1.4 1.4L5 6.4 6.4 5Zm11.2 0L19 6.4 6.4 19 5 17.6 17.6 5Z" fill="currentColor"/></svg>';

  function addStyles() {
    if (document.getElementById('helena-editorial-video-styles')) return;
    const style = document.createElement('style');
    style.id = 'helena-editorial-video-styles';
    style.textContent = `
      .hv-section{position:relative;padding:clamp(64px,8vw,104px) 0;background:#f5f0e9;border-bottom:1px solid #e6dfd5;overflow:hidden;content-visibility:auto;contain-intrinsic-size:900px}
      .hv-section:before{content:"";position:absolute;width:clamp(360px,42vw,540px);height:clamp(360px,42vw,540px);border-radius:50%;right:-220px;top:-260px;background:radial-gradient(circle,rgba(197,160,89,.15),transparent 68%);pointer-events:none}
      .hv-wrap{width:100%;max-width:1280px;margin:auto;padding:0 clamp(18px,3vw,32px);display:grid;grid-template-columns:minmax(0,1.04fr) minmax(320px,.76fr);gap:clamp(42px,6vw,76px);align-items:center}
      .hv-copy{max-width:620px}.hv-kicker{display:inline-flex;align-items:center;gap:9px;margin-bottom:18px;color:#8e6547;font:800 10px/1.2 var(--font-sans,Arial,sans-serif);letter-spacing:.18em;text-transform:uppercase}.hv-kicker:before{content:"";width:26px;height:1px;background:#c5a059}
      .hv-heading{margin:0;color:#171719;font:400 clamp(38px,4.3vw,64px)/.98 var(--font-serif,Georgia,serif);letter-spacing:-.035em}.hv-heading em{font-weight:400;color:#8e6547}.hv-lead{margin:24px 0 0;max-width:560px;color:#665f58;font:400 16px/1.75 var(--font-sans,Arial,sans-serif)}
      .hv-meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}.hv-meta span{padding:8px 11px;border-radius:999px;background:rgba(255,255,255,.72);border:1px solid #ded5ca;color:#655d55;font:700 10px/1 var(--font-sans,Arial,sans-serif);letter-spacing:.06em;text-transform:uppercase}
      .hv-actions{display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin-top:30px}.hv-cta{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:48px;padding:14px 20px;border-radius:14px;background:#171719;color:#fff;text-decoration:none;font:800 11px/1 var(--font-sans,Arial,sans-serif);letter-spacing:.08em;text-transform:uppercase;transition:transform .28s ease,background .28s ease,box-shadow .28s ease;will-change:transform}.hv-cta:hover{background:#8e6547;transform:translateY(-2px);box-shadow:0 14px 30px rgba(70,45,30,.18)}.hv-small-note{color:#8d8379;font:600 10px/1.4 var(--font-sans,Arial,sans-serif);letter-spacing:.04em}
      .hv-media{position:relative;display:flex;justify-content:center;min-width:0}.hv-media:before{content:"";position:absolute;inset:8% 2% -4% 16%;border:1px solid rgba(142,101,71,.20);border-radius:38px;transform:rotate(3deg);background:rgba(255,255,255,.36);pointer-events:none}
      .hv-card{position:relative;width:min(100%,370px);aspect-ratio:9/16;border:0;border-radius:30px;overflow:hidden;padding:0;background:#171719;cursor:pointer;box-shadow:0 34px 80px rgba(40,27,18,.20);transform:translateZ(0);transition:transform .35s cubic-bezier(.2,.7,.2,1),box-shadow .35s ease;touch-action:manipulation}.hv-card:hover{transform:translateY(-6px) scale(1.012);box-shadow:0 42px 95px rgba(40,27,18,.26)}
      .hv-card img,.hv-about-poster img{width:100%;height:100%;object-fit:cover;display:block}.hv-card img{object-position:center}.hv-card:after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,rgba(12,10,9,.02) 0%,rgba(12,10,9,.03) 48%,rgba(12,10,9,.62) 69%,rgba(12,10,9,.96) 100%);pointer-events:none}
      .hv-card-top{position:absolute;z-index:2;top:18px;left:18px;right:18px;display:flex;justify-content:space-between;align-items:center;gap:10px;min-width:0}.hv-pill{display:inline-flex;max-width:48%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:7px 10px;border-radius:999px;background:rgba(255,255,255,.90);backdrop-filter:blur(12px);color:#221f1d;font:800 9px/1 var(--font-sans,Arial,sans-serif);letter-spacing:.10em;text-transform:uppercase}.hv-card-bottom{position:absolute;z-index:2;left:22px;right:22px;bottom:22px;color:#fff;text-align:left}.hv-card-label{font:800 9px/1.2 var(--font-sans,Arial,sans-serif);letter-spacing:.16em;text-transform:uppercase;color:#ecd8c3;margin-bottom:8px}.hv-card-title{font:500 clamp(23px,2.4vw,27px)/1.02 var(--font-serif,Georgia,serif)}.hv-card-play{display:flex;align-items:center;gap:10px;margin-top:14px;font:800 10px/1 var(--font-sans,Arial,sans-serif);letter-spacing:.08em;text-transform:uppercase}.hv-play{width:42px;height:42px;flex:0 0 auto;border-radius:50%;display:grid;place-items:center;background:#fff;color:#171719;box-shadow:0 10px 30px rgba(0,0,0,.18);transition:transform .25s ease,background .25s ease}.hv-play svg{width:18px;height:18px;margin-left:2px}.hv-card:hover .hv-play,.hv-about-poster:hover .hv-play{transform:scale(1.08);background:#f1dfcf}

      .hv-about{max-width:1080px;margin:72px auto 0;padding:22px;border:1px solid #e3d9cc;border-radius:30px;background:linear-gradient(145deg,#fffdfa,#f7f1ea);display:grid;grid-template-columns:minmax(210px,230px) minmax(0,1fr) auto;gap:clamp(22px,3vw,30px);align-items:center;box-shadow:0 20px 60px rgba(36,24,17,.07);overflow:hidden;position:relative}.hv-about:before{content:"";position:absolute;inset:auto -80px -130px auto;width:270px;height:270px;border-radius:50%;background:radial-gradient(circle,rgba(197,160,89,.13),transparent 68%);pointer-events:none}
      .hv-about-poster{position:relative;width:100%;max-width:230px;aspect-ratio:4/5;border:0;border-radius:22px;overflow:hidden;padding:0;background:#221f1d;cursor:pointer;box-shadow:0 18px 45px rgba(30,20,15,.15);isolation:isolate;transition:transform .35s cubic-bezier(.2,.7,.2,1);touch-action:manipulation}.hv-about-poster:hover{transform:translateY(-3px)}.hv-about-poster img{object-position:center 24%;transform:scale(1.02)}.hv-about-poster:after{content:"";position:absolute;z-index:1;inset:0;background:linear-gradient(180deg,rgba(20,16,13,.04),rgba(20,16,13,.08) 48%,rgba(20,16,13,.78) 100%)}
      .hv-about-poster .hv-play{position:absolute;z-index:3;left:18px;bottom:18px}.hv-cover-brand{position:absolute;z-index:3;top:16px;left:16px;right:16px;color:#fff;text-align:left;text-shadow:0 2px 16px rgba(0,0,0,.4)}.hv-cover-brand strong{display:block;font:600 21px/1 var(--font-serif,Georgia,serif)}.hv-cover-brand small{display:block;margin-top:5px;font:800 7px/1 var(--font-sans,Arial,sans-serif);letter-spacing:.16em;text-transform:uppercase}.hv-cover-title{position:absolute;z-index:3;left:70px;right:14px;bottom:20px;color:#fff;text-align:left;font:500 17px/1.05 var(--font-serif,Georgia,serif)}.hv-cover-title em{display:block;color:#e2bd7c;font-weight:400}
      .hv-about-copy{position:relative;z-index:2;min-width:0}.hv-about-copy small{display:block;color:#8e6547;font:800 9px/1.25 var(--font-sans,Arial,sans-serif);letter-spacing:.16em;text-transform:uppercase;margin-bottom:10px}.hv-about-copy h3{margin:0;color:#181719;font:500 clamp(30px,3.2vw,44px)/1.02 var(--font-serif,Georgia,serif);letter-spacing:-.025em}.hv-about-copy p{margin:13px 0 0;color:#6d655e;font:400 14px/1.7 var(--font-sans,Arial,sans-serif);max-width:580px}.hv-about-action{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid #d8cabb;color:#6f4d37;background:rgba(255,255,255,.68);font:800 9px/1.2 var(--font-sans,Arial,sans-serif);letter-spacing:.09em;text-transform:uppercase;white-space:nowrap;cursor:pointer;transition:.25s ease;touch-action:manipulation}.hv-about-action:hover{background:#171719;color:#fff;border-color:#171719;transform:translateY(-2px)}

      .hv-modal{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:max(16px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));background:rgba(12,11,10,.92);backdrop-filter:blur(18px);opacity:0;visibility:hidden;transition:opacity .25s ease,visibility .25s ease}.hv-modal.is-open{opacity:1;visibility:visible}.hv-modal-shell{position:relative;width:min(430px,calc(100vw - 34px),calc((100svh - 116px) * .5625));max-width:100%}.hv-modal-frame{position:relative;width:100%;aspect-ratio:9/16;background:#0d0c0b;border-radius:28px;overflow:hidden;border:1px solid rgba(255,255,255,.14);box-shadow:0 40px 120px rgba(0,0,0,.56)}
      .hv-modal video{position:absolute;inset:-1.5% 0 auto 0;width:100%;height:106%;object-fit:cover;object-position:center 49%;background:#000;display:block}.hv-modal[data-video-key="two"] video{object-position:center 47%}.hv-watermark-mask{position:absolute;z-index:2;left:0;right:0;bottom:0;height:10.5%;pointer-events:none;background:linear-gradient(to bottom,rgba(13,12,11,0),rgba(13,12,11,.94) 72%,#0d0c0b 100%)}
      .hv-close{position:absolute;z-index:4;right:-12px;top:-12px;width:44px;height:44px;border:0;border-radius:50%;display:grid;place-items:center;background:#faf8f5;color:#171719;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.3);transition:transform .2s ease;touch-action:manipulation}.hv-close:hover{transform:rotate(4deg) scale(1.04)}.hv-close svg{width:18px;height:18px}.hv-modal-caption{padding:12px 4px 0;color:#fff;min-height:34px}.hv-modal-caption strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:500 20px/1.1 var(--font-serif,Georgia,serif)}body.hv-lock{overflow:hidden;overscroll-behavior:none}

      .hv-reveal{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}.hv-reveal.is-visible{opacity:1;transform:none}

      @media(max-width:1080px){
        .hv-wrap{grid-template-columns:minmax(0,1fr) minmax(300px,.72fr);gap:42px}
        .hv-card{width:min(100%,350px)}
        .hv-about{grid-template-columns:210px minmax(0,1fr);max-width:900px}
        .hv-about-poster{max-width:210px}
        .hv-about-action{grid-column:2;justify-self:start}
      }

      @media(max-width:900px){
        .hv-section{padding:72px 0}
        .hv-wrap{grid-template-columns:1fr;gap:38px;padding:0 24px}
        .hv-copy{max-width:720px;margin:0 auto;text-align:left}
        .hv-media{justify-content:center}
        .hv-card{width:min(100%,370px)}
        .hv-media:before{inset:8% 10% -4% 18%}
        .hv-about{grid-template-columns:minmax(220px,280px) minmax(0,1fr);margin:54px 20px 0;padding:18px;max-width:820px}
        .hv-about-poster{max-width:280px}
        .hv-about-action{grid-column:2;justify-self:start}
      }

      @media(max-width:720px){
        .hv-about{display:flex;flex-direction:column;align-items:stretch;gap:0;margin:46px 18px 0;padding:14px;border-radius:28px}
        .hv-about-poster{width:min(100%,390px);max-width:none;aspect-ratio:4/5;margin:0 auto;border-radius:22px}
        .hv-about-poster img{object-position:center 24%;transform:scale(1.015)}
        .hv-about-copy{padding:22px 10px 8px}
        .hv-about-action{width:calc(100% - 20px);margin:14px 10px 10px;min-height:50px}
      }

      @media(max-width:600px){
        .hv-section{padding:56px 0}
        .hv-section:before{right:-250px;top:-240px}
        .hv-wrap{padding:0 16px;gap:28px}
        .hv-heading{font-size:clamp(36px,10.5vw,44px);line-height:1}
        .hv-lead{font-size:15px;line-height:1.65;margin-top:20px}
        .hv-meta{gap:7px;margin-top:20px}.hv-meta span{font-size:8px;padding:7px 9px}
        .hv-actions{margin-top:22px;gap:10px}.hv-cta{width:100%;min-height:52px}.hv-small-note{width:100%;text-align:center;font-size:9px}
        .hv-media{width:100%}.hv-media:before{inset:6% 2% -3% 10%;border-radius:30px}
        .hv-card{width:min(100%,350px);border-radius:24px}
        .hv-card-top{top:14px;left:14px;right:14px;gap:7px}.hv-pill{font-size:7.5px;padding:6px 8px;letter-spacing:.07em}
        .hv-card-bottom{left:18px;right:18px;bottom:18px}.hv-card-label{font-size:8px}.hv-card-title{font-size:22px;max-width:14ch}.hv-card-play{margin-top:11px;font-size:9px}.hv-play{width:40px;height:40px}
        .hv-about{margin:40px 14px 0;padding:12px;border-radius:26px}
        .hv-about-poster{width:100%;aspect-ratio:4/5;max-height:none;border-radius:20px}
        .hv-cover-brand{top:14px;left:14px}.hv-cover-brand strong{font-size:21px}.hv-cover-brand small{font-size:6px}.hv-cover-title{left:66px;right:16px;bottom:18px;font-size:18px}.hv-about-poster .hv-play{left:16px;bottom:16px;width:40px;height:40px}
        .hv-about-copy{padding:20px 8px 8px}.hv-about-copy small{font-size:8px;margin-bottom:8px}.hv-about-copy h3{font-size:30px;line-height:1.02}.hv-about-copy p{font-size:14px;line-height:1.6}.hv-about-action{width:calc(100% - 16px);margin:14px 8px 8px;min-height:50px;font-size:9px}
        .hv-modal{padding:max(10px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left))}
        .hv-modal-shell{width:min(calc(100vw - 20px),calc((100svh - 90px) * .5625),390px)}
        .hv-modal-frame{border-radius:22px}
        .hv-close{right:6px;top:6px;width:44px;height:44px}
        .hv-modal-caption{padding:10px 8px 0;min-height:30px}.hv-modal-caption strong{font-size:17px;text-align:center}
        .hv-watermark-mask{height:11%}
      }

      @media(max-width:380px){
        .hv-wrap{padding:0 12px}
        .hv-heading{font-size:34px}
        .hv-card{width:100%;border-radius:22px}
        .hv-card-top{left:12px;right:12px;top:12px}.hv-pill{font-size:7px;padding:6px 7px}
        .hv-card-bottom{left:16px;right:16px;bottom:16px}.hv-card-title{font-size:20px}
        .hv-about{margin-left:10px;margin-right:10px}
        .hv-about-copy h3{font-size:28px}
        .hv-modal-shell{width:min(calc(100vw - 14px),calc((100svh - 78px) * .5625),360px)}
        .hv-modal-caption strong{font-size:16px}
      }

      @media(max-height:620px) and (orientation:landscape){
        .hv-modal{padding:8px}
        .hv-modal-shell{width:min(360px,calc((100svh - 24px) * .5625),calc(100vw - 70px))}
        .hv-modal-frame{border-radius:18px}
        .hv-modal-caption{display:none}
        .hv-close{right:6px;top:6px;width:40px;height:40px}
        .hv-watermark-mask{height:10%}
      }

      @media(prefers-reduced-motion:reduce){.hv-card,.hv-cta,.hv-about-poster,.hv-about-action,.hv-reveal,.hv-close{transition:none!important}.hv-reveal{opacity:1!important;transform:none!important}}
    `;
    document.head.appendChild(style);
  }

  function createModal() {
    const modal = document.createElement('div');
    modal.className = 'hv-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `<div class="hv-modal-shell"><button class="hv-close" type="button" aria-label="Fechar vídeo">${closeIcon}</button><div class="hv-modal-frame"><video controls playsinline preload="metadata"></video><div class="hv-watermark-mask" aria-hidden="true"></div></div><div class="hv-modal-caption"><strong></strong></div></div>`;
    document.body.appendChild(modal);

    const video = modal.querySelector('video');
    const title = modal.querySelector('strong');

    const close = () => {
      video.pause();
      video.currentTime = 0;
      video.removeAttribute('src');
      video.removeAttribute('poster');
      video.load();
      delete modal.dataset.videoKey;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('hv-lock');
    };

    modal.querySelector('.hv-close').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });

    return {
      open(key) {
        const source = VIDEO_SOURCES[key];
        modal.dataset.videoKey = key;
        title.textContent = source.title;
        video.poster = source.poster;
        video.src = source.src;
        video.muted = false;
        video.load();
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('hv-lock');
        const attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
      }
    };
  }

  function createMainSection(modal) {
    const section = document.createElement('section');
    section.className = 'hv-section hv-reveal';
    section.setAttribute('aria-label', 'Conheça Helena Ávila em vídeo');
    section.innerHTML = `
      <div class="hv-wrap">
        <div class="hv-copy">
          <div class="hv-kicker">Conheça Helena Ávila</div>
          <h2 class="hv-heading">Uma conversa antes da <em>primeira sessão.</em></h2>
          <p class="hv-lead">Mais do que conhecer uma formação, é importante perceber a presença, a forma de escutar e o cuidado de quem vai acompanhar o seu processo. Assista a uma breve apresentação da Helena.</p>
          <div class="hv-meta"><span>Psicoterapia Integrativa</span><span>Presencial &amp; online</span><span>${VIDEO_SOURCES.one.duration}</span></div>
          <div class="hv-actions"><a class="hv-cta" href="https://wa.me/5511945035218?text=Ol%C3%A1%2C%20Helena.%20Conheci%20um%20pouco%20mais%20do%20seu%20trabalho%20pelo%20site%20e%20gostaria%20de%20conversar%20sobre%20uma%20sess%C3%A3o." target="_blank" rel="noopener">Agendar uma conversa →</a><span class="hv-small-note">O vídeo só começa quando você tocar.</span></div>
        </div>
        <div class="hv-media">
          <button class="hv-card" type="button" aria-label="Assistir vídeo de Helena Ávila">
            <img src="${VIDEO_SOURCES.one.poster}" alt="Helena Ávila em vídeo" loading="lazy" decoding="async" />
            <span class="hv-card-top"><span class="hv-pill">Vídeo · ${VIDEO_SOURCES.one.duration}</span><span class="hv-pill">Helena Ávila</span></span>
            <span class="hv-card-bottom"><span class="hv-card-label">Conheça a terapeuta</span><span class="hv-card-title">Uma apresentação em primeira pessoa.</span><span class="hv-card-play"><span class="hv-play">${playIcon}</span><span>Assistir com som</span></span></span>
          </button>
        </div>
      </div>`;
    section.querySelector('.hv-card').addEventListener('click', () => modal.open('one'));
    return section;
  }

  function createAboutVideo(modal) {
    const block = document.createElement('div');
    block.className = 'hv-about hv-reveal';
    block.innerHTML = `
      <button class="hv-about-poster" type="button" aria-label="Assistir segunda reflexão em vídeo">
        <img src="${VIDEO_SOURCES.two.poster}" alt="Helena Ávila em uma reflexão em vídeo" loading="lazy" decoding="async" />
        <span class="hv-cover-brand"><strong>Helena Ávila</strong><small>Psicoterapia Integrativa</small></span>
        <span class="hv-play">${playIcon}</span>
        <span class="hv-cover-title">Uma reflexão <em>com Helena</em></span>
      </button>
      <div class="hv-about-copy"><small>Vídeo oficial · ${VIDEO_SOURCES.two.duration}</small><h3>Escuta, relações e os movimentos da vida.</h3><p>Um conteúdo complementar para conhecer mais de perto a forma como Helena fala sobre emoções, vínculos e processo terapêutico.</p></div>
      <button class="hv-about-action" type="button">Assistir vídeo →</button>`;
    block.querySelector('.hv-about-poster').addEventListener('click', () => modal.open('two'));
    block.querySelector('.hv-about-action').addEventListener('click', () => modal.open('two'));
    return block;
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
    if (document.querySelector('.hv-section')) return;
    addStyles();
    const modal = createModal();
    const hero = document.getElementById('inicio');
    const marquee = hero && hero.nextElementSibling;
    if (marquee) marquee.insertAdjacentElement('afterend', createMainSection(modal));
    const about = document.getElementById('sobre');
    const aboutContainer = about && about.querySelector('.site-container');
    if (aboutContainer) aboutContainer.appendChild(createAboutVideo(modal));
    requestAnimationFrame(initReveal);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

/* Helena Ávila — premium interaction engine v33 */
(function () {
  'use strict';

  const start = () => {
    const nav = document.getElementById('mainNav');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

    /* Compact glass navigation after the first scroll. */
    if (nav) {
      let navTicking = false;
      const updateNav = () => {
        nav.classList.toggle('lux-scrolled', window.scrollY > 24);
        navTicking = false;
      };
      window.addEventListener('scroll', () => {
        if (navTicking) return;
        navTicking = true;
        requestAnimationFrame(updateNav);
      }, { passive: true });
      updateNav();
    }

    /* Active navigation follows the section in view. */
    const navLinks = Array.from(document.querySelectorAll('#mainNav nav a[href^="#"]'));
    const sectionPairs = navLinks.map(link => {
      const id = link.getAttribute('href');
      const section = id && id.length > 1 ? document.querySelector(id) : null;
      return section ? { link, section } : null;
    }).filter(Boolean);

    if ('IntersectionObserver' in window && sectionPairs.length) {
      const activeObserver = new IntersectionObserver(entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        navLinks.forEach(link => link.classList.remove('lux-active'));
        const pair = sectionPairs.find(item => item.section === visible.target);
        if (pair) pair.link.classList.add('lux-active');
      }, { rootMargin: '-26% 0px -58% 0px', threshold: [0, .08, .18, .32] });
      sectionPairs.forEach(item => activeObserver.observe(item.section));
    }

    if (!finePointer || reducedMotion) return;

    /* Subtle cinematic parallax on the hero portrait only. */
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
        heroPortrait.style.removeProperty('--lux-rx');
        heroPortrait.style.removeProperty('--lux-ry');
        heroPortrait.style.removeProperty('--lux-tx');
        heroPortrait.style.removeProperty('--lux-ty');
      });
    }

    /* Magnetic response for only the primary high-value CTAs. */
    const magnetic = document.querySelectorAll('.shimmer-btn, .hv-cta, #bottomStickyBar a');
    magnetic.forEach(element => {
      element.classList.add('lux-magnetic');
      element.addEventListener('pointermove', event => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.setProperty('--lux-mx', `${(x * .055).toFixed(2)}px`);
        element.style.setProperty('--lux-my', `${(y * .075).toFixed(2)}px`);
      });
      element.addEventListener('pointerleave', () => {
        element.style.removeProperty('--lux-mx');
        element.style.removeProperty('--lux-my');
      });
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
