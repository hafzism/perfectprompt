  const PP_YourPrompts = (() => {
  const PANEL_ID = 'pp-prompts-panel';

  function removePanel() {
    document.getElementById(PANEL_ID)?.remove();
  }

  function formatDate(iso) {
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  const SITE_COLORS = {
    'ChatGPT': '#10a37f',
    'Gemini': '#1a73e8',
    'Claude': '#d97706',
    'Copilot': '#0078d4',
    'DeepSeek': '#6366f1'
  };

  function renderPromptList(prompts, searchQuery, activeFilter, panel, textarea) {
    const listEl = panel.querySelector('.pp-prompts-list');
    if (!listEl) return;

    let filtered = prompts;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(p => p.site.toLowerCase() === activeFilter.toLowerCase());
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.text.toLowerCase().includes(q));
    }

    if (!filtered.length) {
      listEl.innerHTML = `<div class="pp-empty-state">
        <p class="pp-empty-icon">📭</p>
        <p class="pp-empty-text">${searchQuery || activeFilter !== 'all' ? 'No prompts match your filter.' : 'No saved prompts yet.\nSave a prompt using the toolbar!'}</p>
      </div>`;
      return;
    }

    listEl.innerHTML = filtered.map(p => `
      <div class="pp-prompt-item" data-id="${p.id}">
        <div class="pp-prompt-body">
          <p class="pp-prompt-preview">${escapeHtml(truncate(p.text, 120))}</p>
          <div class="pp-prompt-meta">
            <span class="pp-site-badge" style="color: ${SITE_COLORS[p.site] || '#6366f1'}">${escapeHtml(p.site)}</span>
            <span class="pp-prompt-date">${formatDate(p.savedAt)}</span>
          </div>
        </div>
        <div class="pp-prompt-actions">
          <button class="pp-use-prompt-btn" data-id="${p.id}" title="Use this prompt">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button class="pp-delete-prompt-btn" data-id="${p.id}" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    // Use prompt
    listEl.querySelectorAll('.pp-use-prompt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const found = prompts.find(p => p.id === id);
        if (found) {
          PP_Sites.setText(textarea, found.text);
          removePanel();
        }
      });
    });

    // Delete prompt
    listEl.querySelectorAll('.pp-delete-prompt-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        await PP_Save.deletePrompt(id);
        // Remove from local array and re-render
        const idx = prompts.findIndex(p => p.id === id);
        if (idx > -1) prompts.splice(idx, 1);
        renderPromptList(
          prompts,
          panel.querySelector('.pp-search-input')?.value || '',
          panel.querySelector('.pp-filter-tab.pp-filter-active')?.dataset.filter || 'all',
          panel,
          textarea
        );
      });
    });

    // Click on item body to use prompt
    listEl.querySelectorAll('.pp-prompt-item').forEach(item => {
      item.querySelector('.pp-prompt-body')?.addEventListener('click', () => {
        const id = item.dataset.id;
        const found = prompts.find(p => p.id === id);
        if (found) {
          PP_Sites.setText(textarea, found.text);
          removePanel();
        }
      });
    });
  }

  async function run(site, textarea) {
    removePanel();
    const prompts = await PP_Save.getSaved();

    // Build site filter tabs
    const sites = ['all', ...new Set(prompts.map(p => p.site))];
    const filterTabs = sites.map(s => `
      <button class="pp-filter-tab ${s === 'all' ? 'pp-filter-active' : ''}" data-filter="${s === 'all' ? 'all' : s}">
        ${s === 'all' ? 'All' : escapeHtml(s)}
        ${s !== 'all' ? `<span class="pp-filter-count">${prompts.filter(p => p.site === s).length}</span>` : `<span class="pp-filter-count">${prompts.length}</span>`}
      </button>
    `).join('');

    const panel = document.createElement('div');
    panel.className = 'pp-side-panel';
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="pp-panel-inner">
        <div class="pp-panel-header">
          <div class="pp-panel-title-group">
            <span class="pp-panel-icon">📋</span>
            <h2 class="pp-panel-title">Your Prompts</h2>
          </div>
          <button class="pp-close-btn pp-panel-close">✕</button>
        </div>
        <div class="pp-panel-search-area">
          <div class="pp-search-wrap">
            <svg class="pp-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" class="pp-search-input" placeholder="Search saved prompts...">
          </div>
          <div class="pp-filter-tabs">${filterTabs}</div>
        </div>
        <div class="pp-panel-body">
          <div class="pp-prompts-list"></div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    panel.querySelector('.pp-panel-close')?.addEventListener('click', removePanel);
    requestAnimationFrame(() => panel.classList.add('pp-panel-visible'));

    renderPromptList(prompts, '', 'all', panel, textarea);

    // Search
    panel.querySelector('.pp-search-input')?.addEventListener('input', (e) => {
      const activeFilter = panel.querySelector('.pp-filter-tab.pp-filter-active')?.dataset.filter || 'all';
      renderPromptList(prompts, e.target.value, activeFilter, panel, textarea);
    });

    // Filter tabs
    panel.querySelectorAll('.pp-filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        panel.querySelectorAll('.pp-filter-tab').forEach(t => t.classList.remove('pp-filter-active'));
        tab.classList.add('pp-filter-active');
        const search = panel.querySelector('.pp-search-input')?.value || '';
        renderPromptList(prompts, search, tab.dataset.filter, panel, textarea);
      });
    });
  }

  return { run };
})();
