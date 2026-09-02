document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-list a');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            const isActive = nav.classList.contains('active');
            
            if (isActive) {
                mobileMenuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            } else {
                mobileMenuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            }
        });
    });

    // --- Header Blur on Scroll ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- FAQ Accordion Interactivity ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Close other items
                faqItems.forEach(otherItem => otherItem.classList.remove('active'));
                
                // Toggle current item
                if (!isOpen) {
                    item.classList.add('active');
                }
            });
        }
    });

    // --- High-Conversion Form to WhatsApp Redirect ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const nome = formData.get('nome');
            const email = formData.get('email');
            const telefone = formData.get('telefone');
            const mensagem = formData.get('mensagem');

            // Format message for WhatsApp
            const text = `Olá Helena, meu nome é *${nome}*.\n\n*E-mail:* ${email}\n*Telefone:* ${telefone}\n*Mensagem:* ${mensagem}`;
            const encodedText = encodeURIComponent(text);
            
            // Redirect to Helena's direct WhatsApp (using location.href to prevent popup blocking on mobile)
            const waUrl = `https://wa.me/5511995235839?text=${encodedText}`;
            window.location.href = waUrl;

            contactForm.reset();
        });
    }

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-up');
    fadeElements.forEach(el => observer.observe(el));

    // --- Testimonials Carousel Slider Interactivity ---
    const testimonialsSlider = document.getElementById('testimonialsSlider');
    const prevReviewBtn = document.getElementById('prevReviewBtn');
    const nextReviewBtn = document.getElementById('nextReviewBtn');

    const renderReviewCard = (review, prepend = true) => {
        const initial = review.nome.charAt(0).toUpperCase();
        const starsString = '★'.repeat(review.nota) + '☆'.repeat(5 - review.nota);
        
        const card = document.createElement('div');
        card.className = 'testimonial-card google-card fade-in-up is-visible';
        card.innerHTML = `
            <div class="google-card-header">
                <div class="author-avatar-google" style="background:${review.color};">${initial}</div>
                <div class="author-info">
                    <strong>${review.nome}</strong>
                    <span class="review-date">${review.date || 'Avaliação recente'}</span>
                </div>
                <svg class="google-g-icon" width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            </div>
            <div class="stars-gold mb-sm">${starsString}</div>
            <p class="testimonial-quote">"${review.depoimento}"</p>
        `;
        
        if (prepend) {
            testimonialsSlider.insertBefore(card, testimonialsSlider.firstChild);
        } else {
            testimonialsSlider.appendChild(card);
        }
    };

    if (testimonialsSlider && prevReviewBtn && nextReviewBtn) {
        prevReviewBtn.addEventListener('click', () => {
            const cardWidth = testimonialsSlider.querySelector('.testimonial-card').offsetWidth + 32;
            testimonialsSlider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });

        nextReviewBtn.addEventListener('click', () => {
            const cardWidth = testimonialsSlider.querySelector('.testimonial-card').offsetWidth + 32;
            testimonialsSlider.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
    }

    // =================================================================
    // PROFESSIONAL ANIMATION ENGINE
    // =================================================================

    // --- 1. Scroll Reveal com Stagger Real ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    if (revealElements.length > 0) {
        const revealOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -60px 0px"
        };
        
        const revealOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);
        
        revealElements.forEach(el => {
            revealOnScroll.observe(el);
        });
    }

    // --- 2. Stagger automático para grids de cartões ---
    const staggerContainers = document.querySelectorAll('.methodology-grid, .journey-steps, .faq-accordion, .videos-grid');
    
    staggerContainers.forEach(container => {
        const children = container.children;
        const staggerObserver = new IntersectionObserver(function(entries, observer) {
            if (entries[0].isIntersecting) {
                Array.from(children).forEach((child, index) => {
                    child.style.opacity = '0';
                    child.style.transform = 'translateY(30px)';
                    child.style.transition = `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s`;
                    
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, 50);
                    });
                });
                observer.unobserve(entries[0].target);
            }
        }, { threshold: 0.1 });
        
        staggerObserver.observe(container);
    });

    // --- 3. Parallax suave no Hero ---
    const heroImage = document.querySelector('.hero-image-wrapper');
    const heroText = document.querySelector('.hero-text');
    
    if (heroImage && heroText) {
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    const scrollY = window.scrollY;
                    if (scrollY < 800) {
                        heroImage.style.transform = `translateY(${scrollY * 0.04}px)`;
                        heroText.style.transform = `translateY(${scrollY * 0.02}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // --- 4. Smooth reveal para links de navegação (scroll suave refinado) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 6. Hover tilt sutil nos cartões (efeito 3D leve) ---
    const tiltCards = document.querySelectorAll('.method-card, .video-card, .floating-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -2;
            const rotateY = (x - centerX) / centerX * 2;
            
            card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // --- 6. Cursor personalizado dourado (apenas em dispositivos desktop com mouse) ---
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        document.body.appendChild(cursorDot);
        
        let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function animateCursor() {
            dotX += (mouseX - dotX) * 0.15;
            dotY += (mouseY - dotY) * 0.15;
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Grow cursor on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .method-card, .faq-item, .specialty-card, .video-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorDot.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursorDot.classList.remove('cursor-hover'));
        });
    }

    // --- 7. Lógica do Carrossel de Credenciais ---
    const credSlider = document.getElementById('credentialsSlider');
    const credPrevBtn = document.getElementById('credPrevBtn');
    const credNextBtn = document.getElementById('credNextBtn');

    if (credSlider && credPrevBtn && credNextBtn) {
        credPrevBtn.addEventListener('click', () => {
            const cardWidth = credSlider.querySelector('.credential-card').offsetWidth + 24;
            credSlider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
        credNextBtn.addEventListener('click', () => {
            const cardWidth = credSlider.querySelector('.credential-card').offsetWidth + 24;
            credSlider.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
    }

    // --- 8. Lógica do Carrossel de Metodologia (Mobile) ---
    const methodSlider = document.getElementById('methodologyGrid');
    const methodPrevBtn = document.getElementById('methodPrevBtn');
    const methodNextBtn = document.getElementById('methodNextBtn');

    if (methodSlider && methodPrevBtn && methodNextBtn) {
        methodPrevBtn.addEventListener('click', () => {
            const cardWidth = methodSlider.querySelector('.method-card').offsetWidth + 20;
            methodSlider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
        methodNextBtn.addEventListener('click', () => {
            const cardWidth = methodSlider.querySelector('.method-card').offsetWidth + 20;
            methodSlider.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
    }

    // --- 9. Modal Lightbox de Vídeos do YouTube ---
    const videoCards = document.querySelectorAll('.video-card[data-video-id]');
    const videoModal = document.getElementById('videoModal');
    const videoModalIframe = document.getElementById('videoModalIframe');
    const videoModalClose = document.getElementById('videoModalClose');
    const videoModalBackdrop = document.getElementById('videoModalBackdrop');

    if (videoModal && videoCards.length > 0) {
        function closeVideoModal() {
            videoModal.classList.remove('active');
            videoModal.setAttribute('aria-hidden', 'true');
            if (videoModalIframe) videoModalIframe.src = '';
        }

        videoCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const videoId = card.getAttribute('data-video-id');
                if (videoId && videoModalIframe) {
                    videoModalIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
                    videoModal.classList.add('active');
                    videoModal.setAttribute('aria-hidden', 'false');
                }
            });
        });

        if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
        if (videoModalBackdrop) videoModalBackdrop.addEventListener('click', closeVideoModal);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeVideoModal();
            }
        });
    }

});
