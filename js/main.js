/* === THE LEVERAGED BUILDER — Main JS === */

// ─── Nav scroll effect ───────────────────────────────────────────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ─── Scroll reveal observer ──────────────────────────────────────────────────
const revealClasses = ['.fade-up', '.fade-in', '.slide-left', '.slide-right', '.scale-in'];
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(revealClasses.join(',')).forEach(el => revealObserver.observe(el));

// ─── Stagger grids — auto-apply fade-up to direct children ──────────────────
document.querySelectorAll('.stagger-grid').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.classList.add('fade-up');
    child.style.transitionDelay = `${i * 0.07}s`;
    revealObserver.observe(child);
  });
});

// ─── Card glow — apply to all cards ─────────────────────────────────────────
document.querySelectorAll('.feature-card, .article-card, .resource-card, .live-card, .beliefs li').forEach(card => {
  card.classList.add('card-glow');
});

// ─── Counter animation ───────────────────────────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target || el.textContent.replace(/[^0-9.]/g, ''));
  const suffix = el.dataset.suffix || el.textContent.replace(/[0-9.]/g, '');
  const isFloat = target % 1 !== 0;
  const duration = 1200;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else {
      el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
      el.classList.add('counter-pop');
    }
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.live-card__num, .stat__number').forEach(el => {
  const target = el.dataset.target;
  const suffix = el.dataset.suffix || '';
  if (target !== undefined) {
    el.textContent = '0' + suffix;
    counterObserver.observe(el);
  } else {
    // Auto-parse from text content
    const raw = el.textContent.trim();
    const num = raw.replace(/[^0-9.]/g, '');
    const sfx = raw.replace(/[0-9.]/g, '');
    if (num) {
      el.dataset.target = num;
      el.dataset.suffix = sfx;
      el.textContent = '0' + sfx;
      counterObserver.observe(el);
    }
  }
});

// ─── Cursor glow ─────────────────────────────────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion && window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  document.body.appendChild(glow);

  let mouseX = -1000, mouseY = -1000;
  let glowX = -1000, glowY = -1000;
  let rafId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    rafId = requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // Boost glow on interactive elements
  document.querySelectorAll('a, button, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      glow.style.background = 'radial-gradient(circle, rgba(212,255,0,0.07) 0%, transparent 65%)';
    });
    el.addEventListener('mouseleave', () => {
      glow.style.background = 'radial-gradient(circle, rgba(212,255,0,0.035) 0%, transparent 65%)';
    });
  });
}

// ─── Hamburger menu ───────────────────────────────────────────────────────────
const hamburger = document.querySelector('.nav__hamburger');
const navLinks  = document.querySelector('.nav__links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    const bars = hamburger.querySelectorAll('span');
    if (isOpen) {
      bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity   = '';
      bars[2].style.transform = '';
    }
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    });
  });
}

// ─── Ticker duplication ───────────────────────────────────────────────────────
const track = document.querySelector('.ticker__track');
if (track) { track.innerHTML += track.innerHTML; }
