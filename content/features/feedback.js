const PP_Feedback = (() => {
  const PANEL_ID = 'pp-feedback-panel';

  function removePanel() {
    document.getElementById(PANEL_ID)?.remove();
  }

  function showLoading(promptPreview) {
    removePanel();
    const panel = document.createElement('div');
    panel.className = 'pp-side-panel';
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="pp-panel-inner">
        <div class="pp-panel-header">
          <div class="pp-panel-title-group">
            <span class="pp-panel-icon">💬</span>
            <h2 class="pp-panel-title">Prompt Feedback</h2>
          </div>
          <button class="pp-close-btn pp-panel-close">✕</button>
        </div>
        <div class="pp-panel-body">
          <div class="pp-original-prompt pp-original-compact">
            <span class="pp-original-label">Reviewing</span>
            <p class="pp-original-text">${escapeHtml(truncate(promptPreview, 150))}</p>
          </div>
          <div class="pp-feedback-loading">
            <div class="pp-spinner"></div>
            <p>Analyzing your prompt...</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    panel.querySelector('.pp-panel-close')?.addEventListener('click', removePanel);
    // Slide in
    requestAnimationFrame(() => panel.classList.add('pp-panel-visible'));
  }

  function showFeedback(promptPreview, feedbackData) {
    removePanel();
    const panel = document.createElement('div');
    panel.className = 'pp-side-panel';
    panel.id = PANEL_ID;

    const score = feedbackData.score || 5;
    const scoreColor = score >= 8 ? '#22c55e' : score >= 5 ? '#f59e0b' : '#ef4444';
    const scoreLabel = score >= 8 ? 'Strong' : score >= 5 ? 'Good start' : 'Needs work';

    const positives = (feedbackData.positives || []).map(p => `
      <li class="pp-feedback-positive">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
        ${escapeHtml(p)}
      </li>
    `).join('');

    const improvements = (feedbackData.improvements || []).map((item, i) => `
      <li class="pp-improvement-item">
        <div class="pp-improvement-num">${i + 1}</div>
        <div class="pp-improvement-body">
          <span class="pp-improvement-title">${escapeHtml(item.title)}</span>
          <span class="pp-improvement-detail">${escapeHtml(item.detail)}</span>
        </div>
      </li>
    `).join('');

    panel.innerHTML = `
      <div class="pp-panel-inner">
        <div class="pp-panel-header">
          <div class="pp-panel-title-group">
            <span class="pp-panel-icon">💬</span>
            <h2 class="pp-panel-title">Prompt Feedback</h2>
          </div>
          <button class="pp-close-btn pp-panel-close">✕</button>
        </div>
        <div class="pp-panel-body">
          <div class="pp-original-prompt pp-original-compact">
            <span class="pp-original-label">Reviewed prompt</span>
            <p class="pp-original-text">${escapeHtml(truncate(promptPreview, 150))}</p>
          </div>

          <div class="pp-score-row">
            <div class="pp-score-badge" style="--score-color: ${scoreColor}">
              <span class="pp-score-num">${score}</span>
              <span class="pp-score-out">/10</span>
            </div>
            <span class="pp-score-label" style="color: ${scoreColor}">${scoreLabel}</span>
          </div>

          ${positives ? `
          <div class="pp-feedback-section">
            <h3 class="pp-feedback-section-title">What's working</h3>
            <ul class="pp-positives-list">${positives}</ul>
          </div>` : ''}

          ${improvements ? `
          <div class="pp-feedback-section">
            <h3 class="pp-feedback-section-title">How to improve</h3>
            <ul class="pp-improvements-list">${improvements}</ul>
          </div>` : ''}
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    panel.querySelector('.pp-panel-close')?.addEventListener('click', removePanel);
    requestAnimationFrame(() => panel.classList.add('pp-panel-visible'));
  }

  function showError(message) {
    const panel = document.getElementById(PANEL_ID);
    if (panel) {
      panel.querySelector('.pp-panel-body').innerHTML = `
        <div class="pp-panel-error">
          <p>⚠️ ${escapeHtml(message)}</p>
          ${(message === 'NO_API_KEY' || message === 'INVALID_API_KEY') ? '<p class="pp-error-hint">Add your Gemini API key in extension settings.</p>' : ''}
        </div>
      `;
    }
  }

  async function run(site, textarea) {
    const usage = await PP_Limits.getUsage();
    if (!usage.feedback.canUse) {
      // Show panel with limit message
      removePanel();
      const panel = document.createElement('div');
      panel.className = 'pp-side-panel';
      panel.id = PANEL_ID;
      panel.innerHTML = `
        <div class="pp-panel-inner">
          <div class="pp-panel-header">
            <div class="pp-panel-title-group"><span class="pp-panel-icon">💬</span><h2 class="pp-panel-title">Prompt Feedback</h2></div>
            <button class="pp-close-btn pp-panel-close">✕</button>
          </div>
          <div class="pp-panel-body">
            <div class="pp-panel-error"><p>⚠️ You've used all 20 feedbacks for today. Limit resets at midnight.</p></div>
          </div>
        </div>
      `;
      document.body.appendChild(panel);
      panel.querySelector('.pp-panel-close')?.addEventListener('click', removePanel);
      requestAnimationFrame(() => panel.classList.add('pp-panel-visible'));
      return;
    }

    const prompt = PP_Sites.getText(textarea).trim();
    if (!prompt) {
      removePanel();
      const panel = document.createElement('div');
      panel.className = 'pp-side-panel';
      panel.id = PANEL_ID;
      panel.innerHTML = `
        <div class="pp-panel-inner">
          <div class="pp-panel-header">
            <div class="pp-panel-title-group"><span class="pp-panel-icon">💬</span><h2 class="pp-panel-title">Prompt Feedback</h2></div>
            <button class="pp-close-btn pp-panel-close">✕</button>
          </div>
          <div class="pp-panel-body">
            <div class="pp-panel-error"><p>Please type something in the prompt box first.</p></div>
          </div>
        </div>
      `;
      document.body.appendChild(panel);
      panel.querySelector('.pp-panel-close')?.addEventListener('click', removePanel);
      requestAnimationFrame(() => panel.classList.add('pp-panel-visible'));
      return;
    }

    await PP_Limits.consume('feedback');
    showLoading(prompt);

    try {
      const feedback = await PP_AI.getFeedback(prompt);
      showFeedback(prompt, feedback);
      PP_Toolbar.updateBadges();
    } catch (err) {
      showError((err.message === 'NO_API_KEY' || err.message === 'INVALID_API_KEY') ? err.message : `Failed to get feedback: ${err.message}`);
    }
  }

  return { run };
})();
