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

// Newsletter forms — redirect to Beehiiv subscribe page
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const email = form.querySelector('input[type="email"]').value.trim();
  if (!email) return;

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Redirecting...';
  btn.disabled = true;

  window.location.href = 'https://leveragedbuilder.beehiiv.com/subscribe?email=' + encodeURIComponent(email);
}

document.querySelectorAll('.newsletter-form-js, .cta-form').forEach(form => {
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
