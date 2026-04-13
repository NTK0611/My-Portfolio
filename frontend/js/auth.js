const API_URL = 'https://my-portfolio-production-830c.up.railway.app/api';

const showError = (msg) => {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  el.classList.add('show');
};

const hideError = () => {
  const el = document.getElementById('errorMsg');
  el.classList.remove('show');
};

const saveAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// ── Login ──
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const btn = document.getElementById('loginBtn');
    btn.textContent = 'Signing in...';
    btn.disabled = true;

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.message || 'Login failed');
        btn.textContent = 'Sign In';
        btn.disabled = false;
        return;
      }

      saveAuth(data.token, data.user);
      window.location.href = '../index.html';

    } catch (err) {
      showError('Server error. Please try again.');
      btn.textContent = 'Sign In';
      btn.disabled = false;
    }
  });
}

// ── Register ──
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    const btn = document.getElementById('registerBtn');
    btn.textContent = 'Creating account...';
    btn.disabled = true;

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.message || 'Registration failed');
        btn.textContent = 'Create Account';
        btn.disabled = false;
        return;
      }

      saveAuth(data.token, data.user);
      window.location.href = '../index.html';

    } catch (err) {
      showError('Server error. Please try again.');
      btn.textContent = 'Create Account';
      btn.disabled = false;
    }
  });
}

// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => navMenu.classList.toggle('open'));
}