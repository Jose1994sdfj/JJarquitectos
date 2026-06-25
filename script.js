/* ═══════════════════════════════════════════════════════
   JJ ARQUITECTOS — JESÚS JUÁREZ
   JavaScript principal
═══════════════════════════════════════════════════════ */

'use strict';

/* ── Navbar: scroll effect ──────────────────────────── */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Hamburger / menú móvil ─────────────────────────── */
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const navCta    = document.querySelector('.nav-cta');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    if (navCta) navCta.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  // Cerrar al hacer click en un link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      if (navCta) navCta.classList.remove('open');
    });
  });
})();

/* ── Scroll suave para anclas ───────────────────────── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 72;

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH,
        behavior: 'smooth'
      });
    });
  });
})();

/* ── Animaciones de entrada (Intersection Observer) ──── */
(function () {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el    = entry.target;
      const delay = parseInt(el.dataset.delay) || 0;

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);

      observer.unobserve(el);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

/* ── Contadores animados ─────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1800; // ms
    let start      = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOut(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ── Botón scroll-top ───────────────────────────────── */
(function () {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── Formulario de contacto ──────────────────────────── */
(function () {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  /* Validación simple */
  const validate = (form) => {
    let valid = true;

    // Nombre
    const nombre     = form.querySelector('#nombre');
    const errNombre  = form.querySelector('#error-nombre');
    if (!nombre.value.trim()) {
      errNombre.textContent = 'Por favor ingresa tu nombre.';
      nombre.classList.add('error');
      valid = false;
    } else {
      errNombre.textContent = '';
      nombre.classList.remove('error');
    }

    // Email
    const email     = form.querySelector('#email');
    const errEmail  = form.querySelector('#error-email');
    const emailReg  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailReg.test(email.value.trim())) {
      errEmail.textContent = 'Ingresa un correo electrónico válido.';
      email.classList.add('error');
      valid = false;
    } else {
      errEmail.textContent = '';
      email.classList.remove('error');
    }

    return valid;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(form)) return;

    const btnText    = form.querySelector('.btn-text');
    const btnLoading = form.querySelector('.btn-loading');
    const submitBtn  = form.querySelector('[type="submit"]');

    // Estado de carga
    submitBtn.disabled    = true;
    btnText.style.display    = 'none';
    btnLoading.style.display = 'inline';

    // Simulación de envío (reemplazar con fetch a backend real)
    setTimeout(() => {
      submitBtn.disabled       = false;
      btnText.style.display    = 'inline';
      btnLoading.style.display = 'none';

      form.reset();
      success.style.display = 'block';

      setTimeout(() => {
        success.style.display = 'none';
      }, 5000);
    }, 1500);
  });

  // Limpiar error al escribir
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
    });
  });
})();

/* ── Efecto parallax sutil en hero ──────────────────── */
(function () {
  const heroPattern = document.querySelector('.hero-pattern');
  if (!heroPattern || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const heroH   = document.querySelector('.hero').offsetHeight;

      if (scrollY <= heroH) {
        heroPattern.style.transform = `translateY(${scrollY * 0.25}px)`;
      }
      ticking = false;
    });
  }, { passive: true });
})();

/* ── Marcar link activo en navbar ────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const navH = 80;

  const updateActive = () => {
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= navH + 40) currentId = sec.id;
    });

    navLinks.forEach(link => {
      link.removeAttribute('aria-current');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.setAttribute('aria-current', 'page');
      }
    });
  };

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();

/* ── Log de bienvenida ───────────────────────────────── */
console.log(
  '%c JJ ARQUITECTOS %c Jesús Juárez — Diseño con propósito. ',
  'background:#C0392B;color:#fff;font-weight:bold;padding:4px 8px;',
  'background:#111;color:#aaa;padding:4px 8px;'
);
