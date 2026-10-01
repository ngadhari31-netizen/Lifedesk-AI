import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiClient: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your-gemini-api-key') {
    return null;
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(apiKey);
  }
  return geminiClient;
}

export async function generateJsonCompletion<T>(
  systemPrompt: string,
  userPrompt: string,
  modelName: string = 'gemini-1.5-flash'
): Promise<T | null> {
  const client = getGeminiClient();
  if (!client) {
    return null;
  }

  try {
    const model = client.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    const text = result.response.text();
    if (!text) return null;

    // Clean any accidental markdown code fence if present
    const cleaned = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error('Gemini API call error (fallback activated):', error);
    return null;
  }
}
