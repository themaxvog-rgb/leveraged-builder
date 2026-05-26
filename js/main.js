/* === THE LEVERAGED BUILDER — Main JS === */

// Nav scroll effect
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Fade-up on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Newsletter forms — Beehiiv API integration
const BEEHIIV_FORM_ID = '7c1ff333-b992-4838-ba28-81679d315c72';

async function handleNewsletterSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const email = form.querySelector('input[type="email"]').value.trim();
  if (!email) return;

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Joining...';
  btn.disabled = true;

  const success = () => {
    window.location.href = '/thank-you.html';
  };

  try {
    const res = await fetch('https://subscribe-forms.beehiiv.com/v3/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, form_id: BEEHIIV_FORM_ID })
    });
    if (res.ok) {
      success();
    } else {
      // Fallback: redirect to Beehiiv subscribe page
      window.open('https://leveragedbuilder.beehiiv.com/subscribe?email=' + encodeURIComponent(email), '_blank');
      success();
    }
  } catch {
    // Fallback: redirect to Beehiiv subscribe page
    window.open('https://leveragedbuilder.beehiiv.com/subscribe?email=' + encodeURIComponent(email), '_blank');
    success();
  }
}

document.querySelectorAll('.newsletter-form-js').forEach(form => {
  form.addEventListener('submit', handleNewsletterSubmit);
});

// Hamburger menu
const hamburger = document.querySelector('.nav__hamburger');
const navLinks = document.querySelector('.nav__links');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '70px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'var(--black)';
    navLinks.style.padding = '24px';
    navLinks.style.borderBottom = '1px solid var(--border)';
  });
}

// Duplicate ticker for seamless loop
const track = document.querySelector('.ticker__track');
if (track) {
  track.innerHTML += track.innerHTML;
}
