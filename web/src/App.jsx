import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const githubUrl = 'https://github.com/hafzism/perfectprompt';
const zipUrl = '/perfectprompt-extension.zip';

const featureCards = [
  {
    eyebrow: 'Perfect',
    title: 'Turn rough prompts into cleaner, higher-signal requests',
    text: 'PerfectPrompt analyzes what you typed, asks a few focused follow-up questions, and rewrites the prompt for clarity, specificity, and better outcomes.',
    accent: 'var(--pp-orange)',
  },
  {
    eyebrow: 'Feedback',
    title: 'See what is weak before you waste a message',
    text: 'A side panel scores the prompt, highlights what is already working, and points out the most useful improvements to make next.',
    accent: 'var(--pp-blue)',
  },
  {
    eyebrow: 'Reuse',
    title: 'Save prompts, resurface them fast, and fill them back in',
    text: 'Store prompts locally, open your saved library later, and drop the right prompt back into the active chat box without rebuilding it from scratch.',
    accent: 'var(--pp-teal)',
  },
];

const supportedPlatforms = ['ChatGPT', 'Gemini', 'Claude', 'DeepSeek', 'Perplexity'];

const setupSteps = [
  'Download the ZIP, unzip it, and keep the extracted folder on your machine.',
  'Open Chrome, go to chrome://extensions, and enable Developer Mode.',
  'Click Load unpacked and select the extracted PerfectPrompt folder.',
  'Open the extension Options page and paste in your Google Gemini API key.',
  'Visit a supported AI chat app and use the floating toolbar beside the prompt box.',
];

const usageNotes = [
  'Chrome extension built with Manifest V3.',
  'Gemini API requests go directly from the browser to Google.',
  'Saved prompts and API key stay in local browser storage.',
  'Current build tracks daily limits for Perfect and Feedback.',
];

const heroStats = [
  { value: '5', label: 'supported AI chat platforms' },
  { value: '20 / day', label: 'Perfect actions in the current free build' },
  { value: '20 / day', label: 'Feedback actions in the current free build' },
];

const faqItems = [
  {
    question: 'What is PerfectPrompt?',
    answer:
      'PerfectPrompt is a Chrome extension for better AI prompts. It adds prompt improvement, prompt feedback, saved prompts, and prompt templates directly inside supported AI chat apps.',
  },
  {
    question: 'Which AI tools does PerfectPrompt support?',
    answer:
      'The current landing page and codebase list ChatGPT, Gemini, Claude, DeepSeek, and Perplexity as supported platforms.',
  },
  {
    question: 'Where is my data stored?',
    answer:
      'Based on the current build, your Gemini API key and saved prompts stay in browser storage, and requests go directly from the browser to Google rather than through a PerfectPrompt backend.',
  },
];

const visuals = [
  {
    title: 'Prompt refinement',
    caption: 'PerfectPrompt asks focused follow-up questions before rewriting the prompt.',
    src: '/prompt.png',
    alt: 'PerfectPrompt prompt refinement flow screenshot',
  },
  {
    title: 'Prompt feedback',
    caption: 'The feedback panel scores the draft and shows what to improve next.',
    src: '/feedback.png',
    alt: 'PerfectPrompt prompt feedback screenshot',
  },
];

function Section({ id, eyebrow, title, children, className = '' }) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-3xl">
        <p className="section-eyebrow">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Reveal({ children, delay = 0, y = 28, className = '' }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="min-h-screen bg-[var(--pp-ink)] text-[var(--pp-paper)]">
      <motion.div
        aria-hidden="true"
        className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-[linear-gradient(90deg,var(--pp-orange),var(--pp-blue),var(--pp-teal))]"
        style={{ scaleX: progressScale }}
      />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[color:rgba(13,20,30,0.72)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <img src="/newLogo.png" alt="PerfectPrompt logo" className="h-11 w-11 rounded-2xl shadow-[0_18px_40px_rgba(216,122,90,0.22)]" />
            <div>
              <div className="font-[var(--font-display)] text-lg tracking-[0.02em]">PerfectPrompt</div>
              <div className="text-xs uppercase tracking-[0.28em] text-white/55">AI Prompt Toolkit</div>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
            <a className="nav-link" href="#what-it-is">What it is</a>
            <a className="nav-link" href="#features">Features</a>
            <a className="nav-link" href="#setup">Setup</a>
            <a className="nav-link" href="#download">Download</a>
          </nav>
        </div>
      </header>

      <main id="top" className="relative overflow-hidden">
        <div className="hero-aura hero-aura-one" />
        <div className="hero-aura hero-aura-two" />
        <div className="hero-grid" />

        <section className="relative mx-auto grid min-h-[calc(100dvh-81px)] max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-20">
          <Reveal className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-2 text-sm text-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--pp-teal)] shadow-[0_0_0_6px_rgba(21,171,133,0.16)]" />
              Built for people who live inside AI chat windows
            </div>

            <h1 className="mt-7 max-w-4xl font-[var(--font-display)] text-5xl leading-[0.92] text-white sm:text-6xl lg:text-7xl">
              PerfectPrompt makes prompts sharper,
              <span className="hero-highlight"> right where you type.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/74 sm:text-xl">
              PerfectPrompt is a Chrome extension for better AI prompts. It adds a floating prompt toolkit to major AI chat apps so you can refine, review, save, and reuse prompts without breaking your flow.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <motion.a
                href={zipUrl}
                download
                className="cta-primary"
                whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                Download Free
              </motion.a>
              <motion.a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="cta-secondary"
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              >
                GitHub
              </motion.a>
            </div>

            <div className="hero-stats mt-10">
              {heroStats.map((stat, index) => (
                <Reveal key={stat.label} delay={0.08 + index * 0.06}>
                  <div className="stat-card">
                    <div className="text-2xl font-semibold text-white">{stat.value}</div>
                    <div className="mt-2 text-sm leading-6 text-white/62">{stat.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.14} className="relative">
            <motion.div
              className="showcase-shell"
              whileHover={reduceMotion ? undefined : { rotateX: 1.6, rotateY: -2.5, y: -4 }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            >
              <div className="showcase-panel">
                <div className="showcase-topline">
                  <span className="showcase-chip">Toolbar injected into chat</span>
                  <span className="showcase-dotline" />
                </div>

                <div className="showcase-window">
                  <div className="pill-grid showcase-toolbar">
                    <span className="tool-pill tool-pill-orange">Perfect</span>
                    <span className="tool-pill tool-pill-blue">Feedback</span>
                    <span className="tool-pill">Save</span>
                    <span className="tool-pill">Your Prompts</span>
                    <span className="tool-pill">Templates</span>
                  </div>

                  <div className="showcase-chat">
                    <div className="chat-label">Prompt draft</div>
                    <div className="chat-card">
                      Write a launch announcement for my Chrome extension that sounds clear, human, and confident.
                    </div>
                    <div className="chat-label mt-5">PerfectPrompt feedback</div>
                    <div className="feedback-card">
                      <div className="feedback-score">8/10</div>
                      <div>
                        <p className="text-sm font-medium text-white">Strong start</p>
                        <p className="mt-1 text-sm leading-6 text-white/62">
                          Add audience, tone, and desired structure to get a more usable result.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="showcase-footer showcase-footer-grid">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-white/42">Works on</div>
                    <div className="pill-grid pill-grid-compact mt-3">
                      {supportedPlatforms.map((platform) => (
                        <span key={platform} className="platform-pill">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="usage-mini-card">
                    <div className="text-xs uppercase tracking-[0.3em] text-white/44">Current build</div>
                    <p className="mt-3 text-sm leading-6 text-white/66">
                      Daily counters for Perfect and Feedback, plus local prompt storage and a Gemini-powered settings flow.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </section>

        <Section id="what-it-is" eyebrow="What It Is" title="A prompt toolkit that lives inside the chat interface, not in another tab.">
          <div className="mt-12 grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr] xl:gap-8">
            <Reveal>
              <div className="editorial-card setup-support-card">
                <p className="kicker">Product summary</p>
                <p className="mt-5 text-xl leading-9 text-white/80">
                  PerfectPrompt injects a floating toolbar next to the prompt box on supported AI platforms. From there, you can perfect a draft, get prompt feedback, save a useful prompt, reopen your saved prompt library, or start from a built-in template.
                </p>
                <div className="info-list-grid mt-8">
                  {usageNotes.map((note) => (
                    <div key={note} className="info-row">
                      <span className="info-bullet" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="image-stack">
                {visuals.map((visual, index) => (
                  <figure key={visual.src} className={`placeholder-frame ${index === 0 ? 'placeholder-frame-primary' : 'placeholder-frame-secondary'}`}>
                    <img
                      src={visual.src}
                      alt={visual.alt}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      className="h-full w-full object-cover"
                    />
                    <figcaption>
                      <div className="text-xs uppercase tracking-[0.28em] text-white/52">{visual.title}</div>
                      <div className="mt-2 text-sm text-white/80">{visual.caption}</div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Reveal>
          </div>
        </Section>

        <Section id="faq" eyebrow="FAQ" title="Answers for people comparing AI prompt tools and Chrome extensions.">
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {faqItems.map((item, index) => (
              <Reveal key={item.question} delay={index * 0.06}>
                <article className="editorial-card h-full p-8">
                  <h3 className="text-2xl font-semibold leading-tight text-white">{item.question}</h3>
                  <p className="mt-4 text-base leading-7 text-white/72">{item.answer}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="features" eyebrow="Features" title="Five tools designed to improve prompts without slowing you down.">
          <div className="feature-grid mt-12">
            {featureCards.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.08}>
                <motion.article
                  className="feature-card"
                  whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.992 }}
                >
                  <span className="feature-accent" style={{ background: feature.accent }} />
                  <p className="kicker">{feature.eyebrow}</p>
                  <h3 className="mt-5 text-2xl font-semibold leading-tight text-white">{feature.title}</h3>
                  <p className="mt-4 text-base leading-7 text-white/68">{feature.text}</p>
                </motion.article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.12} className="mt-8">
            <div className="wide-detail-card">
              <div>
                <p className="kicker">Template library</p>
                <h3 className="mt-4 text-3xl font-semibold text-white">Start from reusable prompts across multiple categories.</h3>
              </div>
              <p className="max-w-2xl text-base leading-7 text-white/68">
                The current template library includes categories like coding, writing, image generation, research, and business, each with structured fields that help users fill in the right context before sending.
              </p>
            </div>
          </Reveal>
        </Section>

        <Section id="setup" eyebrow="Setup / How It Works" title="Download, load unpacked, add your Gemini key, and use it where you already work.">
          <div className="mt-12 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <Reveal>
              <div className="editorial-card">
                <p className="kicker">Supported platforms</p>
                <div className="pill-grid pill-grid-compact mt-6">
                  {supportedPlatforms.map((platform, index) => (
                    <motion.span
                      key={platform}
                      className="platform-pill"
                      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: 0.04 * index }}
                    >
                      {platform}
                    </motion.span>
                  ))}
                </div>

                <div className="mt-10 rounded-[28px] border border-white/10 bg-white/4 p-6">
                  <p className="kicker">Privacy</p>
                  <p className="mt-4 text-base leading-7 text-white/70">
                    Based on the current codebase, your API key is stored in Chrome local storage, saved prompts stay in browser storage, and Gemini requests go directly to Google rather than through a PerfectPrompt backend.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="setup-steps">
              {setupSteps.map((step, index) => (
                <Reveal key={step} delay={index * 0.05}>
                  <motion.div
                    className="step-card"
                    whileHover={reduceMotion ? undefined : { x: 6 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                  >
                    <div className="step-index">{index + 1}</div>
                    <p className="text-base leading-7 text-white/78">{step}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>

        <Section id="download" eyebrow="Download" title="Everything you need to try the extension is one click away.">
          <Reveal className="mt-12">
            <div className="final-cta-card">
              <div className="max-w-2xl">
                <p className="kicker">Launch the current build</p>
                <h3 className="mt-4 font-[var(--font-display)] text-4xl leading-tight text-white sm:text-5xl">
                  Download the ZIP, load it in Chrome, and start upgrading prompts today.
                </h3>
                <p className="mt-6 text-lg leading-8 text-white/74">
                  The ZIP contains the extension code for the current build. After downloading, unzip it first, then use Chrome’s <span className="font-semibold text-white">Load unpacked</span> flow.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <motion.a
                  href={zipUrl}
                  download
                  className="cta-primary"
                  whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                >
                  Download Free
                </motion.a>
                <motion.a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-secondary"
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                >
                  View on GitHub
                </motion.a>
              </div>
            </div>
          </Reveal>
        </Section>
      </main>
    </div>
  );
}

export default App;
