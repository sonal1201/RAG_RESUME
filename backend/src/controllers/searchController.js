import Resume from "../models/resumeModel.js";
let getEmbedding;
try {
  ({ getEmbedding } = await import("../utils/gemini.js"));
} catch (e) {
  // allow server start
}

// Cosine similarity helper (safe)
const cosineSimilarity = (vecA, vecB) => {
  if (!Array.isArray(vecA) || !Array.isArray(vecB)) return 0;
  const n = Math.min(vecA.length, vecB.length);
  if (n === 0) return 0;
  let dot = 0, sumA = 0, sumB = 0;
  for (let i = 0; i < n; i++) {
    const a = Number(vecA[i]);
    const b = Number(vecB[i]);
    if (Number.isNaN(a) || Number.isNaN(b)) continue;
    dot += a * b;
    sumA += a * a;
    sumB += b * b;
  }
  const magA = Math.sqrt(sumA);
  const magB = Math.sqrt(sumB);
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
};

export const searchResumes = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    // Try AI embedding if available; otherwise fallback to keyword scoring
    let queryEmbedding = null;
    if (getEmbedding) {
      try {
        queryEmbedding = await getEmbedding(query);
      } catch (e) {
        queryEmbedding = null;
      }
    }

    const resumes = await Resume.find();
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    const computeKeywordScore = (r) => {
      const hay = `${r.name} ${r.skills.join(" ")} ${r.summary} ${r.rawText}`.toLowerCase();
      let matches = 0;
      for (const t of tokens) if (hay.includes(t)) matches++;
      return matches / Math.max(tokens.length, 1);
    };
    const eligible = resumes.filter((r) => r);
    const results = eligible
      .map((r) => {
        const score = queryEmbedding && Array.isArray(r.embedding) && r.embedding.length > 0
          ? cosineSimilarity(queryEmbedding, r.embedding)
          : computeKeywordScore(r);
        const snippet = r.rawText
          .split(/\.|\n|\r/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
          .filter((s) => tokens.some((word) => s.toLowerCase().includes(word)))
          .slice(0, 2)
          .join(". ");
        const display = r.name && r.name.toLowerCase() !== "unknown"
          ? r.name
          : [r.email, r.phone].filter(Boolean).join(" | ") || "Unknown";
        return { resume: { ...r.toObject(), name: display }, score, snippet };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
