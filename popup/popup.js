document.addEventListener('DOMContentLoaded', async () => {
  await loadUsage();
  await loadApiStatus();
  bindButtons();
});

async function loadUsage() {
  const data = await storage(['pp_limits', 'pp_saved_prompts']);
  const limits = data.pp_limits || {};
  const today = new Date().toISOString().slice(0, 10);
  const isToday = limits.date === today;

  const perfectUsed = isToday ? (limits.perfect || 0) : 0;
  const feedbackUsed = isToday ? (limits.feedback || 0) : 0;
  const savedCount = (data.pp_saved_prompts || []).length;

  const perfectRemaining = Math.max(0, 20 - perfectUsed);
  const feedbackRemaining = Math.max(0, 20 - feedbackUsed);

  // Update counts
  document.getElementById('perfect-count').textContent = `${perfectRemaining} left`;
  document.getElementById('feedback-count').textContent = `${feedbackRemaining} left`;
  document.getElementById('saved-count').textContent = `${savedCount} saved`;

  // Update bars
  const perfectPct = ((20 - perfectUsed) / 20) * 100;
  const feedbackPct = ((20 - feedbackUsed) / 20) * 100;
  const perfectBar = document.getElementById('perfect-bar');
  const feedbackBar = document.getElementById('feedback-bar');

  perfectBar.style.width = `${perfectPct}%`;
  feedbackBar.style.width = `${feedbackPct}%`;

  if (perfectPct <= 25) perfectBar.classList.add('bar-low');
  if (feedbackPct <= 25) feedbackBar.classList.add('bar-low');
}

async function loadApiStatus() {
  const data = await storage(['api_key']);
  const dot = document.getElementById('api-dot');
  const text = document.getElementById('api-text');

  if (data.api_key && data.api_key.trim().length > 10) {
    dot.classList.add('dot-green');
    text.textContent = 'API key configured ✓';
    text.style.color = 'var(--success)';
  } else {
    dot.classList.add('dot-red');
    text.textContent = 'API key missing — click Settings';
    text.style.color = 'var(--danger)';
  }
}

function bindButtons() {
  document.getElementById('btn-settings').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
    window.close();
  });

  document.getElementById('btn-supported').addEventListener('click', () => {
    const list = document.getElementById('sites-list');
    list.hidden = !list.hidden;
  });
}

function storage(keys) {
  return new Promise(resolve => chrome.storage.local.get(keys, resolve));
}
