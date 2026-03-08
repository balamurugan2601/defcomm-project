/**
 * AI Utility for DefComm
 * Uses Gemini API to analyze message sentiment and intent.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const threatCache = new Map();

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

    if (threatCache.has(text)) {
        return threatCache.get(text);
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Act as a security intelligence officer. Analyze the following message for operational security threats (e.g. attacks, breaches, intelligence leaks). Routine conversation or news discussion is SAFE.
            
            Message: "${text}"
            
            Is this an ACTUAL operational threat or is it SAFE? Respond with ONLY the word "THREAT" or "SAFE".`
                    }]
                }]
            })
        });

        if (response.status === 429) {
            console.warn("Gemini API Rate Limit Exceeded (429). Falling back to keyword logic for this message.");
            return true; // Fallback on 429
        }

        const data = await response.json();
        const result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase();

        const isThreat = result === "THREAT";
        threatCache.set(text, isThreat);

        return isThreat;
    } catch (error) {
        console.error("Gemini AI Analysis failed:", error);
        return true; // Fallback to keyword logic on error
    }
};
