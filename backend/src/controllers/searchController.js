import Resume from "../models/Resume.js";
import { getEmbedding } from "../utils/gemini.js";

// Cosine similarity helper
const cosineSimilarity = (vecA, vecB) => {
  const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dot / (magA * magB);
};

export const searchResumes = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const queryEmbedding = await getEmbedding(query);

    const resumes = await Resume.find();
    const results = resumes
      .map((r) => {
        const score = cosineSimilarity(queryEmbedding, r.embedding);

        const snippet = r.rawText
          .split(".")
          .filter((s) =>
            query
              .toLowerCase()
              .split(" ")
              .some((word) => s.toLowerCase().includes(word))
          )
          .slice(0, 2)
          .join(". ");
        return { resume: r, score, snippet };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
