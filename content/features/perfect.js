const PP_Perfect = (() => {
  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'pp-overlay';
    overlay.id = 'pp-perfect-overlay';
    return overlay;
  }

  function showLoading(message = 'Analyzing your prompt...') {
    removeModal();
    const overlay = createOverlay();
    overlay.innerHTML = `
      <div class="pp-modal pp-loading-modal">
        <div class="pp-spinner"></div>
        <p class="pp-loading-text">${message}</p>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  function removeModal() {
    document.getElementById('pp-perfect-overlay')?.remove();
  }

  function showQuestions(originalPrompt, questions, onSubmit) {
    removeModal();
    const overlay = createOverlay();

    const questionsHTML = questions.map((q, i) => `
      <div class="pp-question" data-index="${i}">
        <p class="pp-question-text"><span class="pp-question-num">${i + 1}</span>${q.question}</p>
        <div class="pp-options">
          ${q.options.map((opt, j) => `
            <label class="pp-option">
              <input type="radio" name="pp-q${i}" value="${escapeHtml(opt)}" ${j === 0 ? 'checked' : ''}>
              <span class="pp-option-label">${escapeHtml(opt)}</span>
            </label>
          `).join('')}
          <label class="pp-option pp-option-custom">
            <input type="radio" name="pp-q${i}" value="__custom__">
            <span class="pp-option-label">Other</span>
          </label>
          <input type="text" class="pp-custom-input" placeholder="Type your own answer..." data-q="${i}">
        </div>
      </div>
    `).join('');

    overlay.innerHTML = `
      <div class="pp-modal pp-questions-modal">
        <div class="pp-modal-header">
          <div class="pp-modal-title-group">
            <span class="pp-modal-icon">⚡</span>
            <h2 class="pp-modal-title">Perfect Your Prompt</h2>
          </div>
          <button class="pp-close-btn" id="pp-perfect-close">✕</button>
        </div>
        <div class="pp-modal-body">
          <div class="pp-original-prompt">
            <span class="pp-original-label">Your prompt</span>
            <p class="pp-original-text">${escapeHtml(truncate(originalPrompt, 200))}</p>
          </div>
          <p class="pp-modal-subtitle">Answer a few quick questions to get the perfect prompt:</p>
          <div class="pp-questions-list">
            ${questionsHTML}
          </div>
        </div>
        <div class="pp-modal-footer">
          <button class="pp-btn pp-btn-ghost" id="pp-perfect-cancel">Cancel</button>
          <button class="pp-btn pp-btn-primary" id="pp-perfect-submit">
            <span>Refine My Prompt</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelectorAll('.pp-option-custom input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const qIdx = radio.closest('.pp-question').dataset.index;
        overlay.querySelector(`.pp-custom-input[data-q="${qIdx}"]`).focus();
      });
    });
    overlay.querySelectorAll('.pp-custom-input').forEach(input => {
      input.addEventListener('focus', () => {
        const qIdx = input.dataset.q;
        overlay.querySelector(`.pp-question[data-index="${qIdx}"] input[value="__custom__"]`).checked = true;
      });
    });

    overlay.getElementById?.('pp-perfect-close')?.addEventListener('click', removeModal);
    overlay.querySelector('#pp-perfect-close')?.addEventListener('click', removeModal);
    overlay.querySelector('#pp-perfect-cancel')?.addEventListener('click', removeModal);

    overlay.querySelector('#pp-perfect-submit')?.addEventListener('click', () => {
      const answers = questions.map((q, i) => {
        const selected = overlay.querySelector(`input[name="pp-q${i}"]:checked`);
        if (!selected) return { question: q.question, answer: q.options[0] };
        if (selected.value === '__custom__') {
          const custom = overlay.querySelector(`.pp-custom-input[data-q="${i}"]`).value.trim();
          return { question: q.question, answer: custom || q.options[0] };
        }
        return { question: q.question, answer: selected.value };
      });
      onSubmit(answers);
    });
  }

  function showResult(perfectedPrompt, onUse) {
    removeModal();
    const overlay = createOverlay();

    overlay.innerHTML = `
      <div class="pp-modal pp-result-modal">
        <div class="pp-modal-header">
          <div class="pp-modal-title-group">
            <span class="pp-modal-icon">✨</span>
            <h2 class="pp-modal-title">Your Perfected Prompt</h2>
          </div>
          <button class="pp-close-btn" id="pp-result-close">✕</button>
        </div>
        <div class="pp-modal-body">
          <div class="pp-result-prompt" id="pp-result-text">${escapeHtml(perfectedPrompt)}</div>
        </div>
        <div class="pp-modal-footer">
          <button class="pp-btn pp-btn-ghost" id="pp-result-cancel">Cancel</button>
          <button class="pp-btn pp-btn-primary" id="pp-result-use">
            <span>Use This Prompt</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.querySelector('#pp-result-close')?.addEventListener('click', removeModal);
    overlay.querySelector('#pp-result-cancel')?.addEventListener('click', removeModal);
    overlay.querySelector('#pp-result-use')?.addEventListener('click', () => {
      onUse(perfectedPrompt);
      removeModal();
    });
  }

  function showError(message) {
    removeModal();
    const overlay = createOverlay();
    overlay.innerHTML = `
      <div class="pp-modal pp-error-modal">
        <div class="pp-modal-header">
          <div class="pp-modal-title-group">
            <span class="pp-modal-icon">⚠️</span>
            <h2 class="pp-modal-title">Something went wrong</h2>
          </div>
          <button class="pp-close-btn" id="pp-error-close">✕</button>
        </div>
        <div class="pp-modal-body">
          <p class="pp-error-text">${escapeHtml(message)}</p>
          ${(message === 'NO_API_KEY' || message === 'INVALID_API_KEY') ? `<p class="pp-error-hint">Please add a valid Gemini API key in the extension settings. Click the PerfectPrompt icon in your toolbar → Settings.</p>` : ''}
          ${message.includes('Limit reached') ? `<p class="pp-error-hint">Your daily "Perfect" limit resets at midnight. Upgrade to unlimited — coming soon!</p>` : ''}
        </div>
        <div class="pp-modal-footer">
          <button class="pp-btn pp-btn-primary" id="pp-error-ok">Got it</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#pp-error-close')?.addEventListener('click', removeModal);
    overlay.querySelector('#pp-error-ok')?.addEventListener('click', removeModal);
  }

  async function run(site, textarea) {
    const usage = await PP_Limits.getUsage();
    if (!usage.perfect.canUse) {
      showError('Limit reached — you\'ve used all 20 perfects for today.');
      return;
    }

    const originalPrompt = PP_Sites.getText(textarea).trim();
    if (!originalPrompt) {
      showError('Please type something in the prompt box first.');
      return;
    }

    // Consume limit upfront
    await PP_Limits.consume('perfect');

    showLoading('Analyzing your prompt...');

    try {
      const questions = await PP_AI.generateQuestions(originalPrompt);

      showQuestions(originalPrompt, questions, async (answers) => {
        showLoading('Crafting your perfect prompt...');
        try {
          const perfected = await PP_AI.perfectPrompt(originalPrompt, answers);
          showResult(perfected, (text) => {
            PP_Sites.setText(textarea, text);
            PP_Toolbar.updateBadges();
          });
        } catch (err) {
          showError((err.message === 'NO_API_KEY' || err.message === 'INVALID_API_KEY') ? err.message : `Failed to generate prompt: ${err.message}`);
        }
      });
    } catch (err) {
      showError((err.message === 'NO_API_KEY' || err.message === 'INVALID_API_KEY') ? err.message : `Failed to analyze prompt: ${err.message}`);
    }
  }

  return { run };
})();

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}
