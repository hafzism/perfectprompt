document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await loadUsage();
  bindEvents();
});

async function loadSettings() {
  const data = await storage(['api_key']);

  const keyInput = document.getElementById('api-key-input');
  const keyBadge = document.getElementById('key-badge');

  if (data.api_key) {
    keyInput.value = data.api_key;
    keyBadge.textContent = 'Configured ✓';
    keyBadge.classList.add('badge-green');
  }
}

async function loadUsage() {
  const data = await storage(['pp_limits']);
  const limits = data.pp_limits || {};
  const today = new Date().toISOString().slice(0, 10);
  const isToday = limits.date === today;

  const perfectUsed = isToday ? (limits.perfect || 0) : 0;
  const feedbackUsed = isToday ? (limits.feedback || 0) : 0;

  const perfectPct = (perfectUsed / 20) * 100;
  const feedbackPct = (feedbackUsed / 20) * 100;

  document.getElementById('opt-perfect-val').textContent = `${perfectUsed} / 20`;
  document.getElementById('opt-feedback-val').textContent = `${feedbackUsed} / 20`;

  const perfectBar = document.getElementById('opt-perfect-bar');
  const feedbackBar = document.getElementById('opt-feedback-bar');
  perfectBar.style.width = `${perfectPct}%`;
  feedbackBar.style.width = `${feedbackPct}%`;

  if (perfectPct >= 75) perfectBar.classList.add('bar-high');
  if (feedbackPct >= 75) feedbackBar.classList.add('bar-high');

  document.getElementById('reset-date').textContent = `Resets at midnight`;
}

function bindEvents() {
  // Toggle API key visibility
  const toggleBtn = document.getElementById('toggle-key');
  const keyInput = document.getElementById('api-key-input');
  toggleBtn.addEventListener('click', () => {
    const isHidden = keyInput.type === 'password';
    keyInput.type = isHidden ? 'text' : 'password';
    toggleBtn.title = isHidden ? 'Hide key' : 'Show key';
  });

  // Save settings
  document.getElementById('save-btn').addEventListener('click', saveSettings);
  document.getElementById('api-key-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') saveSettings();
  });

  // Reset limits
  document.getElementById('reset-limits').addEventListener('click', async () => {
    const today = new Date().toISOString().slice(0, 10);
    await setStorage({ pp_limits: { date: today, perfect: 0, feedback: 0 } });
    await loadUsage();
    showBanner('Limits reset!');
  });
}

async function saveSettings() {
  const key = document.getElementById('api-key-input').value.trim();
  const keyBadge = document.getElementById('key-badge');

  if (!key) {
    document.getElementById('api-key-input').classList.add('input-error');
    setTimeout(() => document.getElementById('api-key-input').classList.remove('input-error'), 1500);
    return;
  }

  await setStorage({ api_key: key });

  keyBadge.textContent = 'Configured ✓';
  keyBadge.classList.add('badge-green');
  showBanner('Settings saved!');
}

function showBanner(text) {
  const banner = document.getElementById('save-banner');
  banner.textContent = '';
  banner.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> ${text}`;
  banner.hidden = false;
  setTimeout(() => { banner.hidden = true; }, 2500);
}

function storage(keys) {
  return new Promise(resolve => chrome.storage.local.get(keys, resolve));
}

function setStorage(data) {
  return new Promise(resolve => chrome.storage.local.set(data, resolve));
}
