import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey.trim().length === 0) {
  // Throw early with a clear message so controllers can map to 503
  throw new Error(
    "GEMINI_API_KEY is missing. Set it in backend/.env to enable AI features."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

export const getEmbedding = async (text) => {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
};

export const summarizeResume = async (text) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const response = await model.generateContent(
    `Summarize this resume in JSON format with fields: name, email, top_skills (array), experience_summary. Only return JSON. Text: ${text}`
  );
  const raw = response.response.text();
  try {
    return JSON.parse(raw);
  } catch (e) {
    // fallback: try to extract JSON block
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch {}
    }
    return {};
  }
};
