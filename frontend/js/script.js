// ── Active nav link + side nav on scroll ──
const sections = document.querySelectorAll('section');
const navLinkItems = document.querySelectorAll('.nav-links a');
const sideNavItems = document.querySelectorAll('.side-nav-item');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 140) {
      current = section.getAttribute('id');
    }
  });

  // Update top nav active link
  navLinkItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  // Update side nav active item
  sideNavItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
});

// ── Mobile hamburger menu ──
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

navLinkItems.forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('open'));
});

// ── Scroll fade-in animation ──
const faders = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

faders.forEach(el => observer.observe(el));

// ── Contact form (frontend only for now) ──
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Message Sent!';
  btn.style.background = 'var(--accent)';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.style.background = '';
    btn.disabled = false;
    contactForm.reset();
  }, 3000);
});

// ── Auth state in nav ──
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (token && user) {
  const loginLi = document.querySelector('.nav-links .login-link');
  if (loginLi) loginLi.remove();

  if (user.role === 'admin') {
    navMenu.insertAdjacentHTML('beforeend', `
      <li><a href="pages/dashboard.html" style="color: var(--accent); font-weight:500;">Dashboard</a></li>
      <li><a href="#" id="logoutBtn">Logout</a></li>
    `);
  } else {
    navMenu.insertAdjacentHTML('beforeend', `
      <li><span style="color: var(--ink-mid); font-size:0.875rem;">Hi, ${user.name.split(' ')[0]}</span></li>
      <li><a href="#" id="logoutBtn">Logout</a></li>
    `);
  }

  document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  });
}