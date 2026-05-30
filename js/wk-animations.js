/**
 * WK Animations - Web Kingdom Premium UX
 * Scroll reveals, micro-interactions, particles, smooth UX
 */

(function () {
  'use strict';

  // =====================================================
  // PAGE LOADER
  // =====================================================
  function initLoader() {
    var loader = document.querySelector('.page-loader');
    if (!loader) return;
    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('loaded');
        setTimeout(function () {
          loader.remove();
        }, 600);
      }, 800);
    });
  }

  // =====================================================
  // SCROLL REVEAL
  // =====================================================
  function initScrollReveal() {
    var elements = document.querySelectorAll('[data-wk-reveal]');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // =====================================================
  // AUTO-INJECT REVEAL ATTRS ON COMMON ELEMENTS
  // =====================================================
  function injectRevealAttrs() {
    var delay = 0;

    // About section
    var aboutImg = document.querySelector('.about_img');
    if (aboutImg) {
      aboutImg.setAttribute('data-wk-reveal', 'left');
      aboutImg.setAttribute('data-wk-delay', '0');
    }
    var aboutText = document.querySelector('.about_text');
    if (aboutText) {
      aboutText.setAttribute('data-wk-reveal', 'right');
      aboutText.setAttribute('data-wk-delay', '100');
    }

    // Service cards
    document.querySelectorAll('.single_service_text').forEach(function (el, i) {
      el.setAttribute('data-wk-reveal', '');
      el.setAttribute('data-wk-delay', String(i * 100));
    });

    // Portfolio items
    document.querySelectorAll('.portfolio_box').forEach(function (el, i) {
      el.setAttribute('data-wk-reveal', 'scale');
      el.setAttribute('data-wk-delay', String(i * 150));
    });

    // FAQ cards
    document.querySelectorAll('.single_blog').forEach(function (el, i) {
      el.setAttribute('data-wk-reveal', '');
      el.setAttribute('data-wk-delay', String(i * 100));
    });

    // Counter
    document.querySelectorAll('.single_counter').forEach(function (el, i) {
      el.setAttribute('data-wk-reveal', 'scale');
      el.setAttribute('data-wk-delay', String(i * 100));
    });

    // How we work steps
    document.querySelectorAll('.service_part .col-lg-3').forEach(function (el, i) {
      el.setAttribute('data-wk-reveal', '');
      el.setAttribute('data-wk-delay', String(i * 150));
    });

    // Gallery grid items
    document.querySelectorAll('.grid-item').forEach(function (el, i) {
      el.setAttribute('data-wk-reveal', 'scale');
      el.setAttribute('data-wk-delay', String(i * 100));
    });

    // Contact info items
    document.querySelectorAll('.contact-info').forEach(function (el, i) {
      el.setAttribute('data-wk-reveal', 'left');
      el.setAttribute('data-wk-delay', String(i * 150));
    });

    // Section titles
    document.querySelectorAll('.section_tittle, .blog_part_tittle, .project_gallery_tittle').forEach(function (el) {
      el.setAttribute('data-wk-reveal', '');
    });
  }

  // =====================================================
  // PARTICLE ANIMATION ON BANNER
  // =====================================================
  function initParticles() {
    var banner = document.querySelector('.banner_part');
    if (!banner) return;

    var canvas = document.createElement('canvas');
    canvas.id = 'banner-particles';
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;';
    banner.insertBefore(canvas, banner.firstChild);

    var ctx = canvas.getContext('2d');
    var particles = [];
    var count = 60;

    function resize() {
      canvas.width = banner.offsetWidth;
      canvas.height = banner.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
      this.opacity = Math.random() * 0.4 + 0.1;
    }

    Particle.prototype.update = function () {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + this.opacity + ')';
      ctx.fill();
    };

    for (var i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    function connectParticles() {
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255,255,255,' + (0.08 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) { p.update(); p.draw(); });
      connectParticles();
      requestAnimationFrame(animate);
    }
    animate();
  }

  // =====================================================
  // TYPING EFFECT ON BANNER H2
  // =====================================================
  function initTyping() {
    var el = document.querySelector('.banner_part .banner_text h2');
    if (!el) return;

    var phrases = [
      'Step inside the center of excellence',
      'Where Bold Websites Come to Life',
      'Your Digital Growth Partner'
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var full = phrases[0];

    el.innerHTML = '';
    var span = document.createElement('span');
    el.appendChild(span);

    var cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    cursor.textContent = '|';
    el.appendChild(cursor);

    function type() {
      full = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        span.textContent = full.substring(0, charIndex);
      } else {
        charIndex++;
        span.textContent = full.substring(0, charIndex);
      }

      var speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === full.length) {
        isDeleting = true;
        speed = 2000; // pause
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 400;
      }

      setTimeout(type, speed);
    }

    setTimeout(type, 1200);
  }

  // =====================================================
  // SMOOTH HOVER ON SERVICE TEXT SIDE PANEL
  // =====================================================
  function initServiceHover() {
    var serviceBoxes = document.querySelectorAll('.single_service_text');
    serviceBoxes.forEach(function (box) {
      box.addEventListener('mouseenter', function () {
        this.style.willChange = 'transform';
      });
      box.addEventListener('mouseleave', function () {
        this.style.willChange = 'auto';
      });
    });
  }

  // =====================================================
  // BACK TO TOP BUTTON
  // =====================================================
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =====================================================
  // COUNTER ANIMATION (vanilla fallback)
  // =====================================================
  function initCounters() {
    var counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.textContent, 10);
          var current = 0;
          var step = Math.ceil(target / 60);
          var timer = setInterval(function () {
            current += step;
            if (current >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = current;
            }
          }, 30);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  // =====================================================
  // SCROLL PROGRESS BAR
  // =====================================================
  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.style.cssText = [
      'position: fixed',
      'top: 0',
      'left: 0',
      'height: 3px',
      'width: 0%',
      'background: linear-gradient(90deg, #ff3334, #ff6b35)',
      'z-index: 99999',
      'transition: width 0.1s linear',
      'pointer-events: none'
    ].join(';');
    document.body.appendChild(bar);

    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      var total = document.body.scrollHeight - window.innerHeight;
      bar.style.width = ((scrolled / total) * 100) + '%';
    });
  }

  // =====================================================
  // SCROLL INDICATOR
  // =====================================================
  function initScrollIndicator() {
    var banner = document.querySelector('.banner_part');
    if (!banner) return;

    var indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.innerHTML = '<span>Scroll</span><div class="mouse"></div>';
    indicator.addEventListener('click', function () {
      var next = document.querySelector('.about_part, .service_part');
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    });
    banner.appendChild(indicator);
  }

  // =====================================================
  // CUSTOM CURSOR (desktop only)
  // =====================================================
  function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    var cursor = document.createElement('div');
    cursor.className = 'wk-cursor';
    var follower = document.createElement('div');
    follower.className = 'wk-cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    var mouseX = 0, mouseY = 0;
    var followerX = 0, followerY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = (followerX - 16) + 'px';
      follower.style.top = (followerY - 16) + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Grow on hoverable elements
    var hoverables = document.querySelectorAll('a, button, .btn_1, .single_service_text, .portfolio_box, .grid-item');
    hoverables.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.style.transform = 'scale(2.5)';
        follower.style.transform = 'scale(1.5)';
        follower.style.opacity = '0.2';
      });
      el.addEventListener('mouseleave', function () {
        cursor.style.transform = 'scale(1)';
        follower.style.transform = 'scale(1)';
        follower.style.opacity = '0.5';
      });
    });
  }

  // =====================================================
  // NAV ACTIVE STATE ON SCROLL
  // =====================================================
  function initNavHighlight() {
    var sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    window.addEventListener('scroll', function () {
      var scrollPos = window.scrollY + 100;
      sections.forEach(function (section) {
        var id = section.getAttribute('id');
        var link = document.querySelector('.navbar-nav a[href="#' + id + '"]');
        if (!link) return;
        if (section.offsetTop <= scrollPos && (section.offsetTop + section.offsetHeight) > scrollPos) {
          document.querySelectorAll('.navbar-nav li').forEach(function (li) {
            li.classList.remove('active');
          });
          link.parentElement.classList.add('active');
        }
      });
    });
  }

  // =====================================================
  // SMOOTH ANCHOR SCROLL (for in-page links)
  // =====================================================
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  // =====================================================
  // ADD BACK TO TOP BUTTON TO DOM
  // =====================================================
  function addBackToTopBtn() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Back to top');
    btn.setAttribute('title', 'Back to top');
    document.body.appendChild(btn);
  }

  // =====================================================
  // ADD PAGE LOADER TO DOM
  // =====================================================
  function addPageLoader() {
    var loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loader-inner"><div class="loader-logo"><span>W</span></div><div class="loader-bar"></div></div>';
    document.body.insertBefore(loader, document.body.firstChild);
  }

  // =====================================================
  // INIT ALL
  // =====================================================
  function init() {
    addPageLoader();
    addBackToTopBtn();
    initLoader();
    injectRevealAttrs();
    initScrollReveal();
    initScrollProgress();
    initParticles();
    initTyping();
    initServiceHover();
    initBackToTop();
    initCounters();
    initScrollIndicator();
    initCursor();
    initNavHighlight();
    initSmoothAnchors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
