/**
 * AI Utility for DefComm
 * Uses Gemini API to analyze message sentiment and intent.
 * Includes exponential backoff retry to handle 429 rate limits.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const CACHE_KEY = "defcomm_ai_threat_cache";

// Persistent localStorage cache — survives across tabs and page reloads
let threatCache = {};
try {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) threatCache = JSON.parse(saved);
} catch (e) {
    console.error("Failed to load AI cache", e);
}

const saveCache = () => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(threatCache));
    } catch (e) {
        // Ignore (e.g. localStorage full)
    }
};

const PROMPT = `You are a military intelligence officer. Analyze the following message for ACTIVE, IMMINENT operational security threats (e.g., orchestrating an attack, active security breaches, leaking classified coordinates).

CRITICAL RULES:
- People ASKING about an attack = SAFE
- Family members checking in about safety = SAFE  
- Discussing news or past events about attacks = SAFE
- Using trigger words in conversational or past-tense context = SAFE
- ONLY classify as "THREAT" if the sender is ACTIVELY plotting, executing, or coordinating an ongoing operational compromise

Message: "{TEXT}"

Is this an ACTUAL operational threat or is it SAFE? Respond with ONLY the word "THREAT" or "SAFE".`;

/**
 * Calls the Gemini API with exponential backoff retry on 429 errors.
 * @param {string} text - The message text to analyze
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @returns {Promise<Response>} - The successful fetch response
 */
const fetchWithRetry = async (text, maxRetries = 3) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        // Wait BEFORE the call (not after) to space out requests
        if (attempt > 0) {
            const backoffMs = Math.min(5000 * Math.pow(2, attempt - 1), 30000);
            console.info(`Gemini 429 — retrying in ${backoffMs / 1000}s (attempt ${attempt + 1}/${maxRetries + 1})...`);
            await new Promise(r => setTimeout(r, backoffMs));
        }

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: PROMPT.replace("{TEXT}", text) }] }]
            })
        });

        if (response.status !== 429) {
            return response; // Success or non-retryable error
        }
    }

    // All retries exhausted
    return null;
};

/**
 * Validates whether a message is an operational threat or routine chatter.
 * @param {string} text - The decrypted message content
 * @returns {Promise<boolean>} - True if it's a legitimate threat, false if safe.
 */
export const analyzeThreat = async (text) => {
    if (!GEMINI_API_KEY) {
        console.warn("VITE_GEMINI_API_KEY not found. Defaulting to keyword logic only.");
        return true; // Fallback to keyword logic
    }

    if (text in threatCache) {
        return threatCache[text];
    }

    try {
        const response = await fetchWithRetry(text);

        if (!response || !response.ok) {
            console.warn("Gemini API failed after retries. Falling back to keyword logic.");
            return true; // Fallback
        }

        const data = await response.json();
        const result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase();

        const isThreat = result === "THREAT";
        threatCache[text] = isThreat;
        saveCache();

        return isThreat;
    } catch (error) {
        console.error("Gemini AI Analysis failed:", error);
        return true; // Fallback to keyword logic on error
    }
};
