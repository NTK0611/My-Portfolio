const API = 'https://my-portfolio-production-830c.up.railway.app';

// ── Auth guard ──
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (!token || !user || user.role !== 'admin') {
  window.location.href = '/frontend/pages/login.html';
}

// ── Populate admin info ──
if (user) {
  const name = user.name || 'Admin';
  document.getElementById('adminName').textContent = name;
  document.getElementById('adminCardName').textContent = name;
  document.getElementById('adminCardEmail').textContent = user.email || '';
}

// ── Logout ──
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/frontend/pages/login.html';
});

// ── Fetch helpers ──
async function apiFetch(endpoint) {
  const res = await fetch(`${API}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

function truncate(str, n = 60) {
  if (!str) return '—';
  return str.length > n ? str.slice(0, n) + '…' : str;
}

// ── Load messages ──
async function loadMessages() {
  const wrap = document.getElementById('messagesTableWrap');
  try {
    const data = await apiFetch('/api/admin/messages');
    const messages = Array.isArray(data) ? data : (data.messages || []);
    document.getElementById('totalMessages').textContent = messages.length;

    if (messages.length === 0) {
      wrap.innerHTML = '<div class="empty-state">No messages yet.</div>';
      return;
    }

    const recent = messages.slice(0, 5);
    wrap.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${recent.map(m => `
            <tr>
              <td style="font-weight:600; color:var(--ink)">${m.name || '—'}</td>
              <td>${m.email || '—'}</td>
              <td>${truncate(m.message)}</td>
              <td>${formatDate(m.createdAt)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (err) {
    wrap.innerHTML = `<div class="error-msg">Failed to load messages. ${err.message}</div>`;
  }
}

// ── Load users ──
async function loadUsers() {
  const wrap = document.getElementById('usersTableWrap');
  try {
    const data = await apiFetch('/api/admin/users');
    const users = Array.isArray(data) ? data : (data.users || []);
    document.getElementById('totalUsers').textContent = users.length;

    if (users.length === 0) {
      wrap.innerHTML = '<div class="empty-state">No users yet.</div>';
      return;
    }

    const recent = users.slice(0, 5);
    wrap.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          ${recent.map(u => `
            <tr>
              <td style="font-weight:600; color:var(--ink)">${u.name || '—'}</td>
              <td>${u.email || '—'}</td>
              <td><span class="badge ${u.role === 'admin' ? 'badge-admin' : 'badge-visitor'}">${u.role || 'visitor'}</span></td>
              <td>${formatDate(u.createdAt)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (err) {
    wrap.innerHTML = `<div class="error-msg">Failed to load users. ${err.message}</div>`;
  }
}

// ── Init ──
loadMessages();
loadUsers();