const PP_AI = (() => {

  async function getSettings() {
    return new Promise(resolve => {
      chrome.runtime.sendMessage({
        type: 'GET_STORAGE',
        keys: ['api_key']
      }, resolve);
    });
  }

  async function call(messages, maxTokens = 2000, responseFormat = 'text') {
    const settings = await getSettings();

    if (!settings.api_key) {
      throw new Error('NO_API_KEY');
    }

    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        type: 'AI_REQUEST',
        payload: {
          apiKey: settings.api_key,
          messages,
          maxTokens,
          responseFormat
        }
      }, response => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        if (response && response.error) {
          reject(new Error(response.error));
          return;
        }
        resolve(response?.content || '');
      });
    });
  }

  // Generate 3 dynamic clarifying questions + 4 options 
  async function generateQuestions(prompt) {
    const messages = [
      {
        role: 'system',
        content: `You are a prompt engineering expert. Given a user's rough prompt, generate exactly 3 short, targeted clarifying questions that would help refine it into a perfect AI prompt. For each question, provide exactly 4 distinct answer options.

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "questions": [
    {
      "question": "Short question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"]
    },
    {
      "question": "Short question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"]
    },
    {
      "question": "Short question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"]
    }
  ]
}`
      },
      {
        role: 'user',
        content: `User's prompt: "${prompt}"`
      }
    ];

    const raw = await call(messages, 2000, 'json');

    const startIdx = raw.indexOf('{');
    const endIdx = raw.lastIndexOf('}');
    if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) {
      throw new Error('AI did not return valid JSON: ' + raw);
    }
    
    const jsonStr = raw.substring(startIdx, endIdx + 1);
    const parsed = JSON.parse(jsonStr);
    return parsed.questions;
  }

  async function perfectPrompt(originalPrompt, questionsAndAnswers) {
    const qaText = questionsAndAnswers
      .map((qa, i) => `Q${i + 1}: ${qa.question}\nA: ${qa.answer}`)
      .join('\n\n');

    const messages = [
      {
        role: 'system',
        content: `You are a world-class prompt engineer. Your job is to rewrite the user's rough prompt into a highly effective, well-structured AI prompt based on their clarification answers.

Rules:
- Write the prompt directly (not "Here is your prompt:", just the prompt itself)
- Make it specific, actionable, and comprehensive
- Include relevant details from the answers naturally
- Keep it focused — no unnecessary padding
- Output ONLY the improved prompt text, nothing else`
      },
      {
        role: 'user',
        content: `Original prompt: "${originalPrompt}"\n\nClarifying answers:\n${qaText}\n\nRewrite this into a perfect, comprehensive AI prompt.`
      }
    ];

    return await call(messages, 4000);
  }

  async function getFeedback(prompt) {
    const messages = [
      {
        role: 'system',
        content: `You are an expert prompt reviewer. Analyze the given AI prompt and provide concise, actionable feedback.

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "score": 7,
  "positives": ["Point 1", "Point 2"],
  "improvements": [
    { "title": "Short title", "detail": "Actionable suggestion" },
    { "title": "Short title", "detail": "Actionable suggestion" },
    { "title": "Short title", "detail": "Actionable suggestion" }
  ]
}`
      },
      {
        role: 'user',
        content: `Prompt to review: "${prompt}"`
      }
    ];

    const raw = await call(messages, 2000, 'json');
    
    // Parse JSON safely: find the first { and last }
    const startIdx = raw.indexOf('{');
    const endIdx = raw.lastIndexOf('}');
    if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) {
      throw new Error('AI did not return valid JSON: ' + raw);
    }

    const jsonStr = raw.substring(startIdx, endIdx + 1);
    return JSON.parse(jsonStr);
  }

  return { generateQuestions, perfectPrompt, getFeedback };
})();
