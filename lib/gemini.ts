import { getFromCache, saveToCache } from './cache';
import { getOfflineTranslation } from './dictionary';

// Use internal API route for Gemini
const GEMINI_API_URL = '/api/gemini';

const LANGUAGE_NAMES: Record<string, string> = {
    'ru': 'Russian',
    'kz': 'Kazakh',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'tr': 'Turkish',
    'pt': 'Portuguese',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean'
};

const getLangName = (code: string) => LANGUAGE_NAMES[code] || code;

interface ChatMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
}

// Generic AI call function
async function callAI(prompt: string, retries = 3): Promise<string> {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

            const apiKey = localStorage.getItem('gemini_api_key');
            
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt, apiKey }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Gemini API Error: ${response.status} ${errorData.error || response.statusText}`);
            }

            const data = await response.json();
            if (data.result) {
                return data.result;
            }
            throw new Error('Invalid response format');
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Request timed out, retrying...');
            } else if (attempt === retries - 1) {
                throw error;
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
    }
    throw new Error('Failed after all retries');
}

/** Translate a single word. Returns { translation }. Uses offline dictionary for Russian. */
export async function translateWord(
    word: string,
    context?: string,
    targetLang: string = 'ru'
): Promise<{ translation: string }> {
    const cacheKey = `word_${word.toLowerCase()}_${targetLang}`;
    const cached = getFromCache<{ translation: string }>(cacheKey);
    if (cached) return cached;

    if (targetLang === 'ru') {
        const offline = getOfflineTranslation(word);
        if (offline) {
            const result = { translation: offline };
            saveToCache(cacheKey, result);
            return result;
        }
    }

    const langName = getLangName(targetLang);
    const prompt = `Translate the English word "${word}" to ${langName}.${context ? ` Context: "${context}".` : ''} 
  Respond with ONLY a JSON object: {"translation": "your_translation_here"}. 
  Do not explain.`;

    let attempts = 0;
    while (attempts < 2) {
        try {
            const raw = await callAI(prompt);
            let parsed: any;
            try {
                // Try to find JSON in the response if it's wrapped in markdown
                const jsonMatch = raw.match(/\{[\s\S]*\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : raw;
                parsed = JSON.parse(jsonStr);
            } catch {
                // Fallback: just take the whole string if it's short, or try to clean it
                const clean = raw.replace(/<[^>]*>/g, '').replace(/\[OUT\]|\[\/OUT\]/g, '').replace(/```json/g, '').replace(/```/g, '').trim();
                parsed = { translation: clean };
            }

            const translation = parsed.translation || parsed.result || '';

            if (!translation || translation.toLowerCase() === word.toLowerCase()) {
                // Only check for Cyrillic if target is Russian or Kazakh
                if ((targetLang === 'kz' || targetLang === 'ru') && !/[а-яёіїґүәөұү]/i.test(translation)) {
                    attempts++;
                    continue;
                }
            }

            const result = { translation };
            saveToCache(cacheKey, result);
            return result;
        } catch (e) {
            console.error('Translation error:', e);
            attempts++;
        }
    }
    return { translation: '' };
}

/** Translate a sentence. Returns { translation }. */
export async function translateSentence(
    sentence: string,
    targetLang: string = 'ru'
): Promise<{ translation: string }> {
    const cacheKey = `sentence_${sentence}_${targetLang}`;
    const cached = getFromCache<{ translation: string }>(cacheKey);
    if (cached) return cached;

    const langName = getLangName(targetLang);
    const prompt = `Translate this English sentence to ${langName}: "${sentence}". Respond with ONLY the ${langName} translation, nothing else.`;

    let attempts = 0;
    while (attempts < 2) {
        try {
            const raw = await callAI(prompt);
            let parsed: any;
            try {
                parsed = JSON.parse(raw);
            } catch {
                parsed = { translation: raw.replace(/<[^>]*>/g, '').replace(/\[OUT\]|\[\/OUT\]/g, '').trim() };
            }
            const translation = parsed.translation || parsed.result || '';

            if (!translation) {
                attempts++;
                continue;
            }

            const result = { translation };
            saveToCache(cacheKey, result);
            return result;
        } catch (e) {
            attempts++;
        }
    }
    return { translation: '' };
}

/** Explain grammar. Returns { grammar }. */
export async function explainGrammar(
    sentence: string,
    targetLang: string = 'ru'
): Promise<{ grammar: string }> {
    const cacheKey = `grammar_${sentence}_${targetLang}`;
    const cached = getFromCache<{ grammar: string }>(cacheKey);
    if (cached) return cached;

    const langName = getLangName(targetLang);
    const prompt = `Explain the grammar of this sentence briefly in English AND ${langName} (max 3 sentences total): "${sentence}". 
  Provide the English explanation first, then the ${langName} translation of the explanation.
  Respond with ONLY the explanation text, no tags.`;

    let attempts = 0;
    while (attempts < 2) {
        try {
            const raw = await callAI(prompt);
            let parsed: any;
            try {
                parsed = JSON.parse(raw);
            } catch {
                parsed = { grammar: raw.replace(/<[^>]*>/g, '').replace(/\[OUT\]|\[\/OUT\]/g, '').trim() };
            }
            const grammar = parsed.grammar || parsed.result || '';

            if (!grammar) {
                attempts++;
                continue;
            }

            const result = { grammar };
            saveToCache(cacheKey, result);
            return result;
        } catch (e) {
            attempts++;
        }
    }
    return { grammar: '' };
}

/** Generate test questions */
export async function generateTestQuestions(text: string, count: number = 10) {
    const prompt = `You are creating a vocabulary and reading comprehension test for English learners.

Based on this text: "${text.substring(0, 1500)}"

Create ${count} multiple choice questions. Mix these types:
- Vocabulary: "What does 'word' mean?"
- Comprehension: "What happened in the story?"
- Grammar: "Which sentence is correct?"

IMPORTANT: Respond with ONLY a JSON array, no other text. Format:
[{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswerIndex": 0}]

Each question must have exactly 4 options. correctAnswerIndex is 0-3.`;

    try {
        const result = await callAI(prompt);
        let jsonStr = result
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .replace(/<[^>]*>/g, '')
            .replace(/\[OUT\]|\[\/OUT\]/g, '')
            .trim();
        const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
        if (jsonMatch) jsonStr = jsonMatch[0];
        const questions = JSON.parse(jsonStr);
        if (Array.isArray(questions) && questions.length > 0) {
            return questions.filter(
                (q) => q.question && Array.isArray(q.options) && q.options.length >= 4 && typeof q.correctAnswerIndex === 'number'
            );
        }
        console.error('Invalid questions format:', questions);
        return [];
    } catch (e) {
        console.error('Test generation error:', e);
        return [];
    }
}
