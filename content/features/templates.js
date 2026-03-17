const PP_Templates = (() => {
  const PANEL_ID = 'pp-templates-panel';
  const FILL_OVERLAY_ID = 'pp-template-fill-overlay';

  const LIBRARY = {
    coding: {
      label: 'Coding',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
      templates: [
        { id: 'debug', name: 'Debug Code', desc: 'Fix errors in your code',
          template: 'I have a [LANGUAGE] code that is producing the following error:\n\n"[ERROR]"\n\nHere is the code:\n```\n[CODE]\n```\n\nPlease identify the root cause of the bug, explain why it happens, and provide a corrected version with a clear explanation of the fix.',
          placeholders: [
            { key: 'LANGUAGE', label: 'Programming Language', hint: 'e.g. Python, JavaScript, Java' },
            { key: 'ERROR', label: 'Error Message', hint: 'Paste the error message here' },
            { key: 'CODE', label: 'Your Code', hint: 'Paste your code here', multiline: true }
          ]
        },
        { id: 'explain', name: 'Explain Code', desc: 'Understand what code does',
          template: 'Explain the following [LANGUAGE] code clearly and concisely. Break down what each section does, explain any complex logic, and describe its overall purpose.\n\n```\n[CODE]\n```\n\nPitch your explanation at: [AUDIENCE]',
          placeholders: [
            { key: 'LANGUAGE', label: 'Language', hint: 'e.g. Python, TypeScript, Rust' },
            { key: 'CODE', label: 'Code to Explain', hint: 'Paste your code here', multiline: true },
            { key: 'AUDIENCE', label: 'Audience Level', hint: 'e.g. complete beginner, intermediate developer' }
          ]
        },
        { id: 'build', name: 'Build a Feature', desc: 'Generate working code',
          template: 'Write production-quality [LANGUAGE] code to implement the following feature:\n\n[FEATURE]\n\nRequirements:\n[REQUIREMENTS]\n\nPlease include inline comments, handle edge cases, follow best practices, and provide a brief usage example.',
          placeholders: [
            { key: 'LANGUAGE', label: 'Language / Framework', hint: 'e.g. React, Python, Node.js + Express' },
            { key: 'FEATURE', label: 'Feature Description', hint: 'e.g. a login form with email + password validation' },
            { key: 'REQUIREMENTS', label: 'Specific Requirements', hint: 'List any constraints or must-haves', multiline: true }
          ]
        },
        { id: 'review', name: 'Code Review', desc: 'Get expert code feedback',
          template: 'Please conduct a thorough code review of the following [LANGUAGE] code. Evaluate it for:\n- Code quality and adherence to best practices\n- Potential bugs or edge cases\n- Performance bottlenecks\n- Security vulnerabilities\n- Readability and maintainability\n\nCode:\n```\n[CODE]\n```\n\nProvide specific, actionable suggestions for each issue found.',
          placeholders: [
            { key: 'LANGUAGE', label: 'Language', hint: 'e.g. JavaScript, Python, Go' },
            { key: 'CODE', label: 'Code to Review', hint: 'Paste your code here', multiline: true }
          ]
        }
      ]
    },
    writing: {
      label: 'Writing',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
      templates: [
        { id: 'article', name: 'Blog Article', desc: 'Write an engaging blog post',
          template: 'Write a well-structured [WORD_COUNT]-word blog article about "[TOPIC]".\n\nTarget audience: [AUDIENCE]\nTone: [TONE]\nKey points to cover:\n[KEY_POINTS]\n\nInclude a compelling headline, engaging introduction, clear subheadings, and a strong conclusion with a call to action.',
          placeholders: [
            { key: 'WORD_COUNT', label: 'Word Count', hint: 'e.g. 800, 1200, 2000' },
            { key: 'TOPIC', label: 'Article Topic', hint: 'e.g. Benefits of remote work for startups' },
            { key: 'AUDIENCE', label: 'Target Audience', hint: 'e.g. startup founders, college students' },
            { key: 'TONE', label: 'Tone', hint: 'e.g. professional, conversational, informative' },
            { key: 'KEY_POINTS', label: 'Key Points to Cover', hint: 'List the main points', multiline: true }
          ]
        },
        { id: 'email', name: 'Professional Email', desc: 'Write a clear, effective email',
          template: 'Write a professional email to [RECIPIENT] regarding [SUBJECT].\n\nPurpose: [PURPOSE]\nKey information: [INFO]\nDesired outcome: [OUTCOME]\n\nKeep it concise, respectful, and action-oriented. Use a professional greeting and sign-off.',
          placeholders: [
            { key: 'RECIPIENT', label: 'Recipient', hint: 'e.g. my manager, a potential client' },
            { key: 'SUBJECT', label: 'Email Subject', hint: 'e.g. project deadline extension request' },
            { key: 'PURPOSE', label: 'Main Purpose', hint: 'What is this email about?' },
            { key: 'INFO', label: 'Key Information', hint: 'Important details to include', multiline: true },
            { key: 'OUTCOME', label: 'Desired Outcome', hint: 'e.g. approval for leave, schedule a meeting' }
          ]
        },
        { id: 'linkedin', name: 'LinkedIn Post', desc: 'Create an engaging LinkedIn post',
          template: 'Write an authentic, value-driven LinkedIn post about [TOPIC].\n\nMy context: [BACKGROUND]\nCore insight or lesson: [INSIGHT]\nTone: [TONE]\nEnd with: [CTA]\n\nKeep it under 300 words, use short paragraphs for readability, and make it feel genuine — not salesy.',
          placeholders: [
            { key: 'TOPIC', label: 'Post Topic', hint: 'e.g. lessons from launching my first product' },
            { key: 'BACKGROUND', label: 'Your Context', hint: 'Brief background about yourself' },
            { key: 'INSIGHT', label: 'Key Insight', hint: 'The main thing you want to share' },
            { key: 'TONE', label: 'Tone', hint: 'e.g. reflective, inspiring, direct' },
            { key: 'CTA', label: 'Call to Action', hint: 'e.g. a question, invite discussion' }
          ]
        },
        { id: 'product_desc', name: 'Product Description', desc: 'Write compelling product copy',
          template: 'Write a compelling product description for [PRODUCT].\n\nKey features:\n[FEATURES]\nTarget customer: [CUSTOMER]\nPrimary benefit: [BENEFIT]\nTone: [TONE]\n\nStructure: hook → features as benefits → emotional appeal → call to action. Keep it scannable.',
          placeholders: [
            { key: 'PRODUCT', label: 'Product Name', hint: 'e.g. Smart Water Bottle Pro' },
            { key: 'FEATURES', label: 'Key Features', hint: 'List 3-5 main features', multiline: true },
            { key: 'CUSTOMER', label: 'Target Customer', hint: 'e.g. busy professionals, fitness enthusiasts' },
            { key: 'BENEFIT', label: 'Primary Benefit', hint: 'e.g. effortless hydration tracking' },
            { key: 'TONE', label: 'Brand Tone', hint: 'e.g. energetic, premium, friendly' }
          ]
        }
      ]
    },
    image_gen: {
      label: 'Image Gen',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
      templates: [
        { id: 'portrait', name: 'Portrait Photo', desc: 'Photorealistic portrait prompt',
          template: 'A photorealistic portrait of [SUBJECT], [LIGHTING] lighting, [MOOD] atmosphere, [STYLE] aesthetic, DSLR quality, highly detailed, sharp focus, 8K resolution',
          placeholders: [
            { key: 'SUBJECT', label: 'Subject', hint: 'e.g. a young woman with short dark hair' },
            { key: 'LIGHTING', label: 'Lighting Style', hint: 'e.g. golden hour, soft studio, dramatic rim' },
            { key: 'MOOD', label: 'Mood', hint: 'e.g. contemplative, joyful, mysterious' },
            { key: 'STYLE', label: 'Visual Style', hint: 'e.g. cinematic, editorial, candid documentary' }
          ]
        },
        { id: 'landscape', name: 'Landscape Scene', desc: 'Breathtaking landscape generation',
          template: 'A breathtaking [STYLE] landscape of [LOCATION], [TIME_OF_DAY], [WEATHER] conditions, [MOOD] atmosphere, ultra-detailed, award-winning nature photography, masterpiece',
          placeholders: [
            { key: 'STYLE', label: 'Art Style', hint: 'e.g. hyperrealistic, impressionist, cinematic' },
            { key: 'LOCATION', label: 'Location / Setting', hint: 'e.g. misty mountain valley, tropical beach at sunrise' },
            { key: 'TIME_OF_DAY', label: 'Time of Day', hint: 'e.g. golden hour, blue hour, midday sun' },
            { key: 'WEATHER', label: 'Weather', hint: 'e.g. foggy, clear sky, stormy clouds' },
            { key: 'MOOD', label: 'Mood', hint: 'e.g. serene, dramatic, ethereal' }
          ]
        },
        { id: 'product_shot', name: 'Product Shot', desc: 'Commercial product photography',
          template: 'Professional commercial product photography of [PRODUCT], [BACKGROUND] background, softbox studio lighting, shallow depth of field, [STYLE] aesthetic, advertising quality, clean and polished',
          placeholders: [
            { key: 'PRODUCT', label: 'Product', hint: 'e.g. luxury minimalist watch, skincare serum bottle' },
            { key: 'BACKGROUND', label: 'Background', hint: 'e.g. white marble, dark gradient, textured linen' },
            { key: 'STYLE', label: 'Style', hint: 'e.g. minimalist, luxurious, vibrant' }
          ]
        },
        { id: 'concept_art', name: 'Concept Art', desc: 'Fantasy or sci-fi concept art',
          template: 'Detailed digital concept art of [SUBJECT], set in [SETTING], [MOOD] lighting, [ART_STYLE] style, intricate details, cinematic composition, rich color palette, trending on ArtStation',
          placeholders: [
            { key: 'SUBJECT', label: 'Subject', hint: 'e.g. a lone warrior, a futuristic city skyline' },
            { key: 'SETTING', label: 'World / Setting', hint: 'e.g. post-apocalyptic wasteland, underwater civilization' },
            { key: 'MOOD', label: 'Lighting & Mood', hint: 'e.g. epic warm, dark and gritty, soft ethereal' },
            { key: 'ART_STYLE', label: 'Art Style Reference', hint: 'e.g. Greg Rutkowski, Studio Ghibli-inspired, Artgerm' }
          ]
        }
      ]
    },
    research: {
      label: 'Research',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
      templates: [
        { id: 'summarize', name: 'Summarize Content', desc: 'Get a concise, clear summary',
          template: 'Summarize the following [CONTENT_TYPE] in approximately [WORD_COUNT] words.\n\nFocus on: [FOCUS_AREAS]\n\nContent:\n[CONTENT]\n\nProvide a clear, well-structured summary with the most important takeaways. Use bullet points where appropriate.',
          placeholders: [
            { key: 'CONTENT_TYPE', label: 'Content Type', hint: 'e.g. research paper, article, book chapter' },
            { key: 'WORD_COUNT', label: 'Summary Length', hint: 'e.g. 100, 200, 300 words' },
            { key: 'FOCUS_AREAS', label: 'Focus Areas', hint: 'e.g. key findings, statistics, main arguments' },
            { key: 'CONTENT', label: 'Content to Summarize', hint: 'Paste the content here', multiline: true }
          ]
        },
        { id: 'compare', name: 'Compare & Contrast', desc: 'In-depth comparison analysis',
          template: 'Compare [ITEM_1] and [ITEM_2] across the following criteria: [CRITERIA].\n\nContext/use case: [USE_CASE]\n\nInclude:\n- A structured comparison table\n- Key differences and similarities\n- Pros and cons of each\n- A clear recommendation with reasoning',
          placeholders: [
            { key: 'ITEM_1', label: 'First Item', hint: 'e.g. React, PostgreSQL, iPhone 15' },
            { key: 'ITEM_2', label: 'Second Item', hint: 'e.g. Vue.js, MongoDB, Samsung S24' },
            { key: 'CRITERIA', label: 'Comparison Criteria', hint: 'e.g. performance, cost, learning curve, scalability' },
            { key: 'USE_CASE', label: 'Your Use Case', hint: 'e.g. small startup with 3 developers, solo project' }
          ]
        },
        { id: 'deep_research', name: 'Deep Research', desc: 'Comprehensive topic deep-dive',
          template: 'Provide a comprehensive, well-researched overview of [TOPIC].\n\nCover the following aspects:\n[ASPECTS]\n\nDepth level: [DEPTH]\n\nUse clear headers, include relevant data/statistics where applicable, cite key concepts, and provide actionable insights.',
          placeholders: [
            { key: 'TOPIC', label: 'Research Topic', hint: 'e.g. transformer neural networks, sustainable investing' },
            { key: 'ASPECTS', label: 'Aspects to Cover', hint: 'e.g. history, how it works, applications, future trends', multiline: true },
            { key: 'DEPTH', label: 'Depth Level', hint: 'e.g. beginner overview, intermediate technical, executive summary' }
          ]
        }
      ]
    },
    business: {
      label: 'Business',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>`,
      templates: [
        { id: 'biz_plan', name: 'Business Plan', desc: 'Structured business plan outline',
          template: 'Create a detailed business plan outline for: [BUSINESS_IDEA]\n\nTarget market: [MARKET]\nUnique value proposition: [VALUE_PROP]\nInitial budget/stage: [BUDGET]\n\nInclude: executive summary, market analysis, product/service description, revenue model, marketing strategy, operations plan, and 12-month financial projections.',
          placeholders: [
            { key: 'BUSINESS_IDEA', label: 'Business Idea', hint: 'e.g. an AI-powered tutoring platform for STEM' },
            { key: 'MARKET', label: 'Target Market', hint: 'e.g. high school students in the US' },
            { key: 'VALUE_PROP', label: 'Value Proposition', hint: 'What makes you uniquely better?' },
            { key: 'BUDGET', label: 'Budget / Stage', hint: 'e.g. bootstrapped with $5K, pre-seed stage' }
          ]
        },
        { id: 'swot', name: 'SWOT Analysis', desc: 'Strategic SWOT analysis',
          template: 'Conduct a comprehensive SWOT analysis for [SUBJECT] in the [INDUSTRY] industry.\n\nAdditional context: [CONTEXT]\n\nFor each quadrant (Strengths, Weaknesses, Opportunities, Threats), provide 4-6 specific, insightful points with brief explanations. End with 3 strategic recommendations based on the analysis.',
          placeholders: [
            { key: 'SUBJECT', label: 'Company / Idea / Product', hint: 'e.g. my SaaS startup, Tesla, my freelance business' },
            { key: 'INDUSTRY', label: 'Industry', hint: 'e.g. fintech, e-commerce, B2B SaaS' },
            { key: 'CONTEXT', label: 'Additional Context', hint: 'Any relevant background information', multiline: true }
          ]
        },
        { id: 'marketing', name: 'Marketing Strategy', desc: 'Go-to-market strategy',
          template: 'Develop a comprehensive marketing strategy for [PRODUCT_SERVICE] targeting [AUDIENCE].\n\nBudget: [BUDGET] | Timeline: [TIMELINE] | Main goal: [GOAL]\n\nCover: target audience persona, key messaging, channel strategy (organic + paid), content calendar framework, growth tactics, and a 30-60-90 day action plan with KPIs.',
          placeholders: [
            { key: 'PRODUCT_SERVICE', label: 'Product / Service', hint: 'e.g. a fitness tracking app, B2B consulting service' },
            { key: 'AUDIENCE', label: 'Target Audience', hint: 'e.g. fitness-conscious millennials aged 25-35' },
            { key: 'BUDGET', label: 'Marketing Budget', hint: 'e.g. $500/month, $5,000 total, equity-free' },
            { key: 'TIMELINE', label: 'Timeline', hint: 'e.g. Q2-Q3 2025, next 3 months' },
            { key: 'GOAL', label: 'Primary Goal', hint: 'e.g. 500 signups, $10K MRR, brand awareness' }
          ]
        }
      ]
    }
  };

  function removePanel() { document.getElementById(PANEL_ID)?.remove(); }
  function removeFillOverlay() { document.getElementById(FILL_OVERLAY_ID)?.remove(); }

  function showTemplatePanel(textarea) {
    removePanel();
    const categories = Object.keys(LIBRARY);
    const firstCat = categories[0];

    const categoryTabs = categories.map((key, i) => `
      <button class="pp-filter-tab ${i === 0 ? 'pp-filter-active' : ''}" data-cat="${key}">
        ${LIBRARY[key].icon}
        ${LIBRARY[key].label}
      </button>
    `).join('');

    const panel = document.createElement('div');
    panel.className = 'pp-side-panel';
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="pp-panel-inner">
        <div class="pp-panel-header">
          <div class="pp-panel-title-group">
            <span class="pp-panel-icon">📎</span>
            <h2 class="pp-panel-title">Templates</h2>
          </div>
          <button class="pp-close-btn pp-panel-close">✕</button>
        </div>
        <div class="pp-panel-search-area">
          <div class="pp-filter-tabs pp-filter-tabs-wrap">${categoryTabs}</div>
        </div>
        <div class="pp-panel-body">
          <div class="pp-templates-grid" id="pp-templates-grid"></div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    panel.querySelector('.pp-panel-close')?.addEventListener('click', removePanel);
    requestAnimationFrame(() => panel.classList.add('pp-panel-visible'));

    renderTemplates(panel, firstCat, textarea);

    panel.querySelectorAll('.pp-filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        panel.querySelectorAll('.pp-filter-tab').forEach(t => t.classList.remove('pp-filter-active'));
        tab.classList.add('pp-filter-active');
        renderTemplates(panel, tab.dataset.cat, textarea);
      });
    });
  }

  function renderTemplates(panel, catKey, textarea) {
    const grid = panel.querySelector('#pp-templates-grid');
    if (!grid) return;
    const cat = LIBRARY[catKey];
    grid.innerHTML = cat.templates.map(t => `
      <div class="pp-template-card" data-id="${t.id}" data-cat="${catKey}">
        <p class="pp-template-name">${escapeHtml(t.name)}</p>
        <p class="pp-template-desc">${escapeHtml(t.desc)}</p>
        <button class="pp-btn pp-btn-sm pp-use-template-btn" data-id="${t.id}" data-cat="${catKey}">
          Use template
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    `).join('');

    grid.querySelectorAll('.pp-use-template-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = LIBRARY[btn.dataset.cat].templates.find(t => t.id === btn.dataset.id);
        if (t) showTemplateFill(t, textarea);
      });
    });
  }

  function showTemplateFill(template, textarea) {
    removeFillOverlay();
    const overlay = document.createElement('div');
    overlay.className = 'pp-overlay';
    overlay.id = FILL_OVERLAY_ID;

    const fieldsHTML = template.placeholders.map(p => `
      <div class="pp-field-group">
        <label class="pp-field-label">${escapeHtml(p.label)}</label>
        ${p.multiline
          ? `<textarea class="pp-field-input pp-field-textarea" placeholder="${escapeHtml(p.hint)}" data-ppkey="${p.key}" rows="3"></textarea>`
          : `<input type="text" class="pp-field-input" placeholder="${escapeHtml(p.hint)}" data-ppkey="${p.key}">`
        }
      </div>
    `).join('');

    overlay.innerHTML = `
      <div class="pp-modal pp-template-fill-modal">
        <div class="pp-modal-header">
          <div class="pp-modal-title-group">
            <span class="pp-modal-icon">📎</span>
            <h2 class="pp-modal-title">${escapeHtml(template.name)}</h2>
          </div>
          <button class="pp-close-btn" id="pp-fill-close">✕</button>
        </div>
        <div class="pp-modal-body">
          <p class="pp-modal-subtitle">Fill in the details to generate your prompt:</p>
          <div class="pp-fields-list">${fieldsHTML}</div>
        </div>
        <div class="pp-modal-footer">
          <button class="pp-btn pp-btn-ghost" id="pp-fill-back">← Back</button>
          <button class="pp-btn pp-btn-primary" id="pp-fill-generate">
            Generate Prompt
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.querySelector('#pp-fill-close')?.addEventListener('click', removeFillOverlay);
    overlay.querySelector('#pp-fill-back')?.addEventListener('click', removeFillOverlay);
    overlay.querySelector('#pp-fill-generate')?.addEventListener('click', () => {
      let result = template.template;
      template.placeholders.forEach(p => {
        // Use data-ppkey to avoid matching the parent div
        const input = overlay.querySelector(`input[data-ppkey="${p.key}"], textarea[data-ppkey="${p.key}"]`);
        const val = (input?.value || '').trim();
        // Only replace if user actually typed something
        if (val) {
          result = result.split(`[${p.key}]`).join(val);
        }
      });
      showGeneratedPrompt(result, textarea);
    });
  }

  function showGeneratedPrompt(prompt, textarea) {
    removeFillOverlay();
    const overlay = document.createElement('div');
    overlay.className = 'pp-overlay';
    overlay.id = FILL_OVERLAY_ID;

    overlay.innerHTML = `
      <div class="pp-modal pp-result-modal">
        <div class="pp-modal-header">
          <div class="pp-modal-title-group">
            <span class="pp-modal-icon">✨</span>
            <h2 class="pp-modal-title">Your Generated Prompt</h2>
          </div>
          <button class="pp-close-btn" id="pp-gen-close">✕</button>
        </div>
        <div class="pp-modal-body">
          <div class="pp-result-prompt" contenteditable="true" id="pp-gen-text">${escapeHtml(prompt)}</div>
          <p class="pp-edit-hint">✏️ You can edit the prompt above before using it.</p>
        </div>
        <div class="pp-modal-footer">
          <button class="pp-btn pp-btn-ghost" id="pp-gen-back">← Edit</button>
          <button class="pp-btn pp-btn-primary" id="pp-gen-use">
            Use This Prompt
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.querySelector('#pp-gen-close')?.addEventListener('click', () => { removeFillOverlay(); removePanel(); });
    overlay.querySelector('#pp-gen-back')?.addEventListener('click', removeFillOverlay);
    overlay.querySelector('#pp-gen-use')?.addEventListener('click', () => {
      const text = overlay.querySelector('#pp-gen-text')?.innerText || prompt;
      PP_Sites.setText(textarea, text);
      removeFillOverlay();
      removePanel();
    });
  }

  function run(site, textarea) {
    showTemplatePanel(textarea);
  }

  return { run };
})();
