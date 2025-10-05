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

    // Fetch only resumes uploaded by the current user
    const resumes = await Resume.find({ uploadedBy: req.user._id });
    console.log(`Found ${resumes.length} resumes for search by user ${req.user._id}`);

    // Enhanced keyword processing
    const tokens = query.toLowerCase()
      .split(/[,\s]+/) // Split by commas and spaces
      .filter(Boolean)
      .filter(token => token.length > 1); // Filter out single characters
    
    console.log(`Search tokens: ${tokens.join(', ')}`);

    const computeKeywordScore = (r) => {
      const candidateText = `${r.name || ''} ${r.email || ''} ${(r.skills || []).join(" ")} ${r.summary || ''} ${r.rawText || ''}`.toLowerCase();
      
      let totalScore = 0;
      let skillMatches = 0;
      
      // Check for skill matches (higher weight)
      if (r.skills && Array.isArray(r.skills)) {
        for (const skill of r.skills) {
          const skillLower = skill.toLowerCase();
          for (const token of tokens) {
            if (skillLower.includes(token) || token.includes(skillLower)) {
              skillMatches += 2; // Skills get double weight
            }
          }
        }
      }
      
      // Check for general keyword matches
      let generalMatches = 0;
      for (const token of tokens) {
        if (candidateText.includes(token)) {
          generalMatches += 1;
        }
      }
      
      totalScore = skillMatches + generalMatches;
      const maxPossibleScore = (r.skills?.length || 0) * 2 + tokens.length;
      
      return maxPossibleScore > 0 ? Math.min(totalScore / maxPossibleScore, 1) : 0;
    };

    const results = resumes
      .map((r) => {
        let score = 0;
        
        // Try AI embedding first if available
        if (queryEmbedding && Array.isArray(r.embedding) && r.embedding.length > 0) {
          const cosineScore = cosineSimilarity(queryEmbedding, r.embedding);
          score = Math.max(cosineScore, 0); // Ensure non-negative
        }
        
        // If AI score is too low or unavailable, use keyword scoring
        if (score < 0.1) {
          score = computeKeywordScore(r);
        }
        
        // Ensure minimum score for any resume with relevant content
        if (score === 0 && (r.skills?.length > 0 || r.summary || r.rawText)) {
          score = 0.1; // Minimum 10% for any resume with content
        }

        // Generate snippet
        const snippet = r.rawText
          ? r.rawText
              .split(/\.|\n|\r/)
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
              .filter((s) => tokens.some((word) => s.toLowerCase().includes(word)))
              .slice(0, 2)
              .join(". ") || "No relevant snippet"
          : "No relevant snippet";

        // Use email as display name
        const display = r.email || "Unknown";

        return { 
          resume: { ...r.toObject(), name: display }, 
          score: Math.max(score * 100, score > 0 ? 1 : 0).toFixed(1), 
          snippet 
        };
      })
      .filter(r => r.score > 0) // Only include resumes with some relevance
      .sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
      .slice(0, 10); // Show up to 10 results

    console.log(`Found ${results.length} search results with scores:`, results.map(r => ({ email: r.resume.email, score: r.score })));

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
