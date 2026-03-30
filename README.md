# PerfectPrompt

> Supercharge your AI prompts — right where you type them.

PerfectPrompt is a **Chrome Extension (Manifest V3)** that injects a floating toolbar into the world's top AI chat platforms, giving you instant tools to refine, review, save, and reuse your prompts — all powered by the Gemini API.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🪄 **Perfect** | AI rewrites your prompt to be clearer, more specific, and more effective |
| 💬 **Feedback** | AI reviews your prompt and tells you exactly what's weak and how to fix it |
| 💾 **Save Prompt** | Save the current prompt to local storage with a single click |
| 📂 **Your Prompts** | Browse your saved prompts and auto-fill them back into the chat |
| 📋 **Templates** | Pick from a library of expert-crafted prompt templates by category |

---

## 🌐 Supported Platforms

- [ChatGPT](https://chatgpt.com)
- [Gemini](https://gemini.google.com)
- [Claude](https://claude.ai)
- [DeepSeek](https://chat.deepseek.com)
- [Perplexity](https://www.perplexity.ai)

---

## 🏗️ Project Structure

```
perfectPrompt/
├── manifest.json               # Extension config (MV3)
├── background.js               # Service worker — handles AI API calls & storage
├── icons/                      # Extension icons (16, 48, 128px)
├── popup/
│   ├── popup.html              # Popup UI (status + settings link)
│   ├── popup.js                # Popup logic (API key status, usage stats)
│   └── popup.css               # Popup styles
├── options/
│   ├── options.html            # Settings page
│   ├── options.js              # Save/load API key & model preference
│   └── options.css             # Options page styles
└── content/
    ├── content.js              # Toolbar injection + orchestration
    ├── content.css             # Toolbar & modal styles (light/dark adaptive)
    ├── sites.js                # Site adapter — detects platform, finds textarea
    ├── ai.js                   # AI request helper (talks to background.js)
    ├── limits.js               # Daily usage tracker (client-side rate limiting)
    └── features/
        ├── perfect.js          # "Perfect" feature — AI prompt rewriting
        ├── feedback.js         # "Feedback" feature — AI prompt review
        ├── save.js             # "Save Prompt" feature — localStorage management
        ├── your-prompts.js     # "Your Prompts" feature — browse & autofill
        └── templates.js        # "Templates" feature — categorised prompt library
```

---

## 🚀 Getting Started

### Prerequisites

- Google Chrome (or any Chromium-based browser)
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation (Developer Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/perfectPrompt.git
   ```
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer Mode** (toggle in the top-right)
4. Click **Load unpacked** and select the `perfectPrompt/` folder
5. Click the PerfectPrompt icon in your toolbar → open **Options**
6. Paste your Gemini API key and save

---

## ⚙️ Configuration

Open the extension Options page to configure:

- **API Key** — Your Gemini API key (stored locally, never sent to any server other than Google)

---

## 🔒 Privacy

- Your API key is stored in Chrome's local extension storage — **never transmitted** to any third party
- Prompts saved via "Save Prompt" are stored entirely in **local browser storage**
- AI requests go **directly** to Google's Gemini API from your browser — no PerfectPrompt backend

---

## 🛠️ Tech Stack

- **Manifest V3** Chrome Extension API
- Vanilla JavaScript (no frameworks, no build step)
- CSS with automatic **light/dark mode** detection
- [Gemini API](https://ai.google.dev/docs) for AI inference

---

## 📄 License

MIT © 2025 Hafeez
