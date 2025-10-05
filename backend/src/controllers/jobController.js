import Resume from "../models/resumeModel.js";
let getEmbedding, summarizeResume;
try {
  ({ getEmbedding, summarizeResume } = await import("../utils/gemini.js"));
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

export const matchJob = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription)
      return res.status(400).json({ error: "Job description is required" });

    // Embed the job description
    // Try AI embedding if available; otherwise fallback to keyword scoring
    let jobEmbedding = null;
    if (getEmbedding) {
      try {
        jobEmbedding = await getEmbedding(jobDescription);
      } catch (e) {
        jobEmbedding = null;
      }
    }

    // Fetch all resumes
    const resumes = await Resume.find();

    // Compute similarity
    const jobTokens = jobDescription.toLowerCase().split(/\s+/).filter(Boolean);
    const keywordScore = (r) => {
      const hay = `${r.name} ${r.skills.join(" ")} ${r.summary} ${r.rawText}`.toLowerCase();
      let matches = 0;
      for (const t of jobTokens) if (hay.includes(t)) matches++;
      return matches / Math.max(jobTokens.length, 1);
    };
    const matches = resumes
      .map((r) => ({
        resume: r,
        score: jobEmbedding && Array.isArray(r.embedding) && r.embedding.length > 0
          ? cosineSimilarity(jobEmbedding, r.embedding)
          : keywordScore(r),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // Generate reasoning using Gemini for each top candidate
    const results = [];
    for (const m of matches) {
      const reasoningPrompt = `
        Why is this candidate a good fit for the job?
        Candidate Skills: ${m.resume.skills.join(", ")}
        Experience Summary: ${m.resume.summary}
        Job Description: ${jobDescription}
        Provide reasoning in 2-3 sentences.
      `;
      let reasoningResponse = {};
      if (summarizeResume) {
        try {
          reasoningResponse = await summarizeResume(reasoningPrompt);
        } catch (e) {
          reasoningResponse = {};
        }
      }

      results.push({
        candidate: m.resume,
        score: (m.score * 100).toFixed(2),
        reasoning: reasoningResponse.experience_summary || reasoningResponse.summary || "Good fit based on skills and experience",
      });
    }

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
