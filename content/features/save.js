const PP_Save = (() => {
  const STORAGE_KEY = 'pp_saved_prompts';

  async function getSaved() {
    return new Promise(resolve => {
      chrome.storage.local.get([STORAGE_KEY], result => {
        resolve(result[STORAGE_KEY] || []);
      });
    });
  }

  async function save(prompt, siteName) {
    const saved = await getSaved();
    const entry = {
      id: Date.now().toString(),
      text: prompt,
      site: siteName,
      savedAt: new Date().toISOString()
    };
    saved.unshift(entry); // Most recent first
    // Keep max 200 prompts
    if (saved.length > 200) saved.splice(200);
    await new Promise(resolve => {
      chrome.storage.local.set({ [STORAGE_KEY]: saved }, resolve);
    });
    return entry;
  }

  async function deletePrompt(id) {
    const saved = await getSaved();
    const updated = saved.filter(p => p.id !== id);
    await new Promise(resolve => {
      chrome.storage.local.set({ [STORAGE_KEY]: updated }, resolve);
    });
  }

  function showToast(message, type = 'success') {
    document.querySelector('.pp-toast')?.remove();
    const toast = document.createElement('div');
    toast.className = `pp-toast pp-toast-${type}`;
    toast.innerHTML = `
      <span class="pp-toast-icon">${type === 'success' ? '✓' : '⚠'}</span>
      <span class="pp-toast-text">${escapeHtml(message)}</span>
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('pp-toast-visible'));
    setTimeout(() => {
      toast.classList.remove('pp-toast-visible');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  async function run(site, textarea) {
    const prompt = PP_Sites.getText(textarea).trim();
    if (!prompt) {
      showToast('Nothing to save — type a prompt first!', 'warn');
      return;
    }
    await save(prompt, site.name);
    showToast(`Saved to ${site.name} prompts!`);
  }

  return { run, getSaved, deletePrompt };
})();
