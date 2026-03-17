  const PP_Limits = (() => {
  const DAILY_LIMITS = { perfect: 20, feedback: 20 };

  function getTodayKey() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  }

  async function getState() {
    return new Promise(resolve => {
      chrome.storage.local.get(['pp_limits'], result => {
        const stored = result.pp_limits || {};
        const today = getTodayKey();

        // Reset if it's a new day
        if (stored.date !== today) {
          resolve({ date: today, perfect: 0, feedback: 0 });
        } else {
          resolve(stored);
        }
      });
    });
  }

  async function saveState(state) {
    return new Promise(resolve => {
      chrome.storage.local.set({ pp_limits: state }, resolve);
    });
  }

  async function getUsage() {
    try {
      const state = await getState();
      return {
        perfect: {
          used: state.perfect,
          remaining: Math.max(0, DAILY_LIMITS.perfect - state.perfect),
          limit: DAILY_LIMITS.perfect,
          canUse: state.perfect < DAILY_LIMITS.perfect
        },
        feedback: {
          used: state.feedback,
          remaining: Math.max(0, DAILY_LIMITS.feedback - state.feedback),
          limit: DAILY_LIMITS.feedback,
          canUse: state.feedback < DAILY_LIMITS.feedback
        }
      };
    } catch (e) {
      if (e.message && e.message.includes('context invalidated')) throw e;
      console.warn("PerfectPrompt limit check failed:", e);
      return {
        perfect: { used: 0, remaining: DAILY_LIMITS.perfect, limit: DAILY_LIMITS.perfect, canUse: true },
        feedback: { used: 0, remaining: DAILY_LIMITS.feedback, limit: DAILY_LIMITS.feedback, canUse: true }
      };
    }
  }

  async function consume(type) {
    const state = await getState();
    if (state[type] >= DAILY_LIMITS[type]) return false;
    state[type] = (state[type] || 0) + 1;
    await saveState(state);
    return true;
  }

  async function reset() {
    await saveState({ date: getTodayKey(), perfect: 0, feedback: 0 });
  }

  return { getUsage, consume, reset, DAILY_LIMITS };
})();
