(function () {
  'use strict';

  // Prevent double injection
  if (window.__pp_injected) return;
  window.__pp_injected = true;

  let toolbar = null;
  let currentSite = null;
  let currentTextarea = null;
  let observerActive = false;

  // Exported toolbar reference so features can call updateBadges
  window.PP_Toolbar = {
    updateBadges: () => updateUsageBadges()
  };

  async function init() {
    currentSite = PP_Sites.detect();
    if (!currentSite) return;

    currentTextarea = PP_Sites.findTextarea(currentSite);
    if (!currentTextarea) return;

    // If toolbar already in DOM, only update badges
    if (toolbar && document.body.contains(toolbar)) {
      updateUsageBadges();
      return;
    }

    injectToolbar();
    await updateUsageBadges();
  }

  function injectToolbar() {
    if (!currentSite || !currentTextarea) return;

    // Find injection point
    const injectParent = PP_Sites.findInjectParent(currentSite, currentTextarea);
    if (!injectParent) return;

    // Build toolbar
    toolbar = document.createElement('div');
    toolbar.className = `pp-toolbar pp-site-${currentSite.shortName}`;
    toolbar.id = 'pp-toolbar';
    toolbar.innerHTML = `
      <div class="pp-toolbar-inner">
        <button class="pp-tool-btn pp-btn-perfect" id="pp-btn-perfect" title="Perfect your prompt with AI">
          <span class="pp-btn-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </span>
          <span class="pp-btn-label">Perfect</span>
          <span class="pp-btn-badge" id="pp-badge-perfect">20</span>
        </button>

        <button class="pp-tool-btn pp-btn-feedback" id="pp-btn-feedback" title="Get AI feedback on your prompt">
          <span class="pp-btn-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </span>
          <span class="pp-btn-label">Feedback</span>
          <span class="pp-btn-badge" id="pp-badge-feedback">20</span>
        </button>

        <button class="pp-tool-btn pp-btn-save" id="pp-btn-save" title="Save this prompt">
          <span class="pp-btn-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          </span>
          <span class="pp-btn-label">Save</span>
        </button>

        <button class="pp-tool-btn pp-btn-prompts" id="pp-btn-prompts" title="View saved prompts">
          <span class="pp-btn-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </span>
          <span class="pp-btn-label">Your Prompts</span>
        </button>

        <button class="pp-tool-btn pp-btn-templates" id="pp-btn-templates" title="Browse prompt templates">
          <span class="pp-btn-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </span>
          <span class="pp-btn-label">Templates</span>
        </button>
      </div>
    `;

    // Insert after the injection parent
    if (injectParent.nextSibling) {
      injectParent.parentNode.insertBefore(toolbar, injectParent.nextSibling);
    } else {
      injectParent.parentNode.appendChild(toolbar);
    }

    // Helper to catch context errors on action
    const handleAction = async (actionFn) => {
      try {
        currentTextarea = PP_Sites.findTextarea(currentSite) || currentTextarea;
        await actionFn();
      } catch (e) {
        if (e.message && e.message.includes('context invalidated')) {
          alert('PerfectPrompt update detected! Please refresh the page (F5) to continue using it.');
        } else {
          console.error('PerfectPrompt action error:', e);
        }
      }
    };

    // Bind events
    document.getElementById('pp-btn-perfect')?.addEventListener('click', () => {
      handleAction(() => PP_Perfect.run(currentSite, currentTextarea));
    });
    document.getElementById('pp-btn-feedback')?.addEventListener('click', () => {
      handleAction(() => PP_Feedback.run(currentSite, currentTextarea));
    });
    document.getElementById('pp-btn-save')?.addEventListener('click', () => {
      handleAction(() => PP_Save.run(currentSite, currentTextarea));
    });
    document.getElementById('pp-btn-prompts')?.addEventListener('click', () => {
      handleAction(() => PP_YourPrompts.run(currentSite, currentTextarea));
    });
    document.getElementById('pp-btn-templates')?.addEventListener('click', () => {
      handleAction(() => PP_Templates.run(currentSite, currentTextarea));
    });
  }

  async function updateUsageBadges() {
    const usage = await PP_Limits.getUsage();
    const perfectBtn = document.getElementById('pp-btn-perfect');
    const feedbackBtn = document.getElementById('pp-btn-feedback');
    const perfectBadge = document.getElementById('pp-badge-perfect');
    const feedbackBadge = document.getElementById('pp-badge-feedback');

    if (perfectBadge) perfectBadge.textContent = usage.perfect.remaining;
    if (feedbackBadge) feedbackBadge.textContent = usage.feedback.remaining;

    if (perfectBtn) {
      perfectBtn.classList.toggle('pp-btn-disabled', !usage.perfect.canUse);
    }
    if (feedbackBtn) {
      feedbackBtn.classList.toggle('pp-btn-disabled', !usage.feedback.canUse);
    }
  }

  // MutationObserver: watch for toolbar removal & textarea appearance
  function startObserver() {
    if (observerActive) return;
    observerActive = true;

    const observer = new MutationObserver(() => {
      // Re-init if toolbar was removed
      if (toolbar && !document.body.contains(toolbar)) {
        toolbar = null;
        init();
        return;
      }
      // Re-init if we haven't injected yet
      if (!toolbar) {
        init();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Boot
  function boot() {
    // Wait a bit for SPA to render
    setTimeout(() => {
      init();
      startObserver();
      // Retry every 2 seconds for first 10 seconds in case of slow SPA load
      let retries = 5;
      const interval = setInterval(() => {
        if (!toolbar || !document.body.contains(toolbar)) {
          init();
        }
        retries--;
        if (retries <= 0) clearInterval(interval);
      }, 2000);
    }, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
