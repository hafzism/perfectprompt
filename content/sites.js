  const PP_Sites = (() => {
  const SITE_CONFIGS = {
    'chatgpt.com': {
      name: 'ChatGPT',
      shortName: 'chatgpt',
      color: '#10a37f',
      textareaSelectors: [
        '#prompt-textarea',
        'div[contenteditable="true"][data-virtualkeyboardpolicy]',
        'div[contenteditable="true"][id]',
        'div[contenteditable="true"]'
      ],
      injectAnchorSelectors: [],
      getInjectParent: (anchor, textarea) => {
        let current = textarea;
        while (current && current.tagName !== 'MAIN' && current.tagName !== 'BODY') {
            if (current.classList && current.classList.contains('mx-auto') && current.classList.contains('text-base')) {
               return current.firstElementChild || current;
            }
            current = current.parentElement;
        }

        current = textarea;
        while (current && current.tagName !== 'MAIN' && current.tagName !== 'BODY') {
            if (current.nextElementSibling && current.nextElementSibling.classList && current.nextElementSibling.classList.contains('text-xs') && current.nextElementSibling.classList.contains('text-center')) {
               return current;
            }
            current = current.parentElement;
        }

        let p = textarea;
        for (let i = 0; i < 4; i++) {
          if (p && p.parentElement) p = p.parentElement;
        }
        return p || textarea.parentElement;
      }
    },
    'gemini.google.com': {
      name: 'Gemini',
      shortName: 'gemini',
      color: '#1a73e8',
      textareaSelectors: [
        'div.ql-editor[contenteditable="true"]',
        'rich-textarea .ql-editor',
        'div[contenteditable="true"][class*="ql"]',
        'div[contenteditable="true"]'
      ],
      injectAnchorSelectors: [],
      getInjectParent: (anchor, textarea) => {
        let el = textarea;
        while (el && el.tagName !== 'BODY') {
          if (el.classList && el.classList.contains('input-area-container')) {
            return el;
          }
          el = el.parentElement;
        }
        
        // Fallback
        el = textarea;
        for (let i = 0; i < 5; i++) {
          if (el && el.parentElement) el = el.parentElement;
        }
        return el || textarea.parentElement;
      }
    },
    'claude.ai': {
      name: 'Claude',
      shortName: 'claude',
      color: '#d97706',
      textareaSelectors: [
        'div[contenteditable="true"].ProseMirror',
        'div[contenteditable="true"][class*="prose"]',
        'div.ProseMirror[contenteditable]',
        'div[contenteditable="true"]'
      ],
      injectAnchorSelectors: [
        'div[class*="composer"]',
        'div[class*="input"]',
        'fieldset'
      ],
      getInjectParent: (anchor, textarea) => {
        let el = textarea;
        for (let i = 0; i < 5; i++) {
          if (el && el.parentElement) el = el.parentElement;
        }
        return el || textarea.parentElement;
      }
    },
    'chat.deepseek.com': {
      name: 'DeepSeek',
      shortName: 'deepseek',
      color: '#6366f1',
      textareaSelectors: [
        'textarea#chat-input',
        'textarea[class*="input"]',
        'div[contenteditable="true"]',
        'textarea'
      ],
      injectAnchorSelectors: [],
      getInjectParent: (anchor, textarea) => {
        let el = textarea;
        for (let i = 0; i < 3; i++) {
          if (el && el.parentElement) el = el.parentElement;
        }
        return el || textarea.parentElement;
      }
    }
  };

  function detect() {
    const host = window.location.hostname;
    for (const key of Object.keys(SITE_CONFIGS)) {
      if (host.includes(key)) return { ...SITE_CONFIGS[key], key };
    }
    return null;
  }

  function findTextarea(site) {
    for (const sel of site.textareaSelectors) {
      const el = document.querySelector(sel);
      if (el && isVisible(el)) return el;
    }
    return null;
  }

  function findInjectParent(site, textarea) {
    // Try anchor selectors first
    for (const sel of site.injectAnchorSelectors) {
      const anchor = document.querySelector(sel);
      if (anchor) return anchor.parentElement || anchor;
    }
    // Fallback: traverse up from textarea
    return site.getInjectParent(null, textarea);
  }

  function getText(el) {
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      return el.value || '';
    }
    return el.innerText || el.textContent || '';
  }

  function setText(el, text) {
    el.focus();
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      const proto = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, 'value'
      ) || Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
      );
      if (proto && proto.set) {
        proto.set.call(el, text);
      } else {
        el.value = text;
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (el.contentEditable === 'true') {
      document.execCommand('selectAll', false, null);
      document.execCommand('insertText', false, text);
      // Fallback
      if ((el.innerText || '').trim() !== text.trim()) {
        el.innerText = text;
        el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, data: text }));
      }
    }
  }

  function isVisible(el) {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 &&
      window.getComputedStyle(el).display !== 'none' &&
      window.getComputedStyle(el).visibility !== 'hidden';
  }

  return { detect, findTextarea, findInjectParent, getText, setText };
})();
