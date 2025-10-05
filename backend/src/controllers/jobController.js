import Resume from "../models/Resume.js";
import { getEmbedding, summarizeResume } from "../utils/gemini.js";

// Cosine similarity helper
const cosineSimilarity = (vecA, vecB) => {
  const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dot / (magA * magB);
};

export const matchJob = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription)
      return res.status(400).json({ error: "Job description is required" });

    // Embed the job description
    const jobEmbedding = await getEmbedding(jobDescription);

    // Fetch all resumes
    const resumes = await Resume.find();

    // Compute similarity
    const matches = resumes
      .map((r) => ({
        resume: r,
        score: cosineSimilarity(jobEmbedding, r.embedding),
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
      const reasoningResponse = await summarizeResume(reasoningPrompt);

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
