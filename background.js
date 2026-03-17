chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'AI_REQUEST') {
    handleAIRequest(message.payload)
      .then(sendResponse)
      .catch(err => sendResponse({ error: err.message }));
    return true; // Keep channel open for async response
  }

  if (message.type === 'GET_STORAGE') {
    chrome.storage.local.get(message.keys, (result) => sendResponse(result));
    return true;
  }

  if (message.type === 'SET_STORAGE') {
    chrome.storage.local.set(message.data, () => sendResponse({ ok: true }));
    return true;
  }
});

async function handleAIRequest({ apiKey, messages, maxTokens, responseFormat }) {
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const generationConfig = {
    maxOutputTokens: maxTokens || 2000,
    temperature: 0.7
  };
  if (responseFormat === 'json') {
    generationConfig.responseMimeType = 'application/json';
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ contents, generationConfig })
  });

  if (!response.ok) {
    const errText = await response.text();
    try {
      const errJson = JSON.parse(errText);
      const isInvalidKey = errJson.error?.details?.some(d => d.reason === 'API_KEY_INVALID');
      if (isInvalidKey) {
        throw new Error('INVALID_API_KEY');
      }
      throw new Error(`Gemini API error ${response.status}: ${errJson.error?.message || errText}`);
    } catch(e) {
      if (e.message === 'INVALID_API_KEY' || e.message.startsWith('Gemini API error')) throw e;
      throw new Error(`Gemini API error ${response.status}: ${errText}`);
    }
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || 'Unknown AI error');
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return {
    content: text,
    model: 'gemini-2.5-flash',
    usage: data.usageMetadata
  };
}
