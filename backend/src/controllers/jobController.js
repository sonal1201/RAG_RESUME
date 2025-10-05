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

    // Fetch only resumes uploaded by the current user
    const resumes = await Resume.find({ uploadedBy: req.user._id });
    console.log(`Found ${resumes.length} resumes for user ${req.user._id}`);

    // Enhanced keyword scoring
    const jobTokens = jobDescription.toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .filter(token => token.length > 2); // Filter out short words
    
    const calculateKeywordScore = (resume) => {
      const candidateText = `${resume.name || ''} ${resume.email || ''} ${(resume.skills || []).join(" ")} ${resume.summary || ''} ${resume.rawText || ''}`.toLowerCase();
      
      let totalScore = 0;
      let skillMatches = 0;
      
      // Check for skill matches (higher weight)
      if (resume.skills && Array.isArray(resume.skills)) {
        for (const skill of resume.skills) {
          const skillLower = skill.toLowerCase();
          for (const token of jobTokens) {
            if (skillLower.includes(token) || token.includes(skillLower)) {
              skillMatches += 2; // Skills get double weight
            }
          }
        }
      }
      
      // Check for general keyword matches
      let generalMatches = 0;
      for (const token of jobTokens) {
        if (candidateText.includes(token)) {
          generalMatches += 1;
        }
      }
      
      totalScore = skillMatches + generalMatches;
      const maxPossibleScore = (resume.skills?.length || 0) * 2 + jobTokens.length;
      
      return maxPossibleScore > 0 ? Math.min(totalScore / maxPossibleScore, 1) : 0;
    };

    const matches = resumes
      .map((r) => {
        let score = 0;
        
        // Try AI embedding first if available
        if (jobEmbedding && Array.isArray(r.embedding) && r.embedding.length > 0) {
          const cosineScore = cosineSimilarity(jobEmbedding, r.embedding);
          score = Math.max(cosineScore, 0); // Ensure non-negative
        }
        
        // If AI score is too low or unavailable, use keyword scoring
        if (score < 0.1) {
          score = calculateKeywordScore(r);
        }
        
        // Ensure minimum score for any resume with relevant content
        if (score === 0 && (r.skills?.length > 0 || r.summary || r.rawText)) {
          score = 0.1; // Minimum 10% for any resume with content
        }
        
        return {
          resume: r,
          score: score
        };
      })
      .filter(m => m.score > 0) // Only include resumes with some relevance
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Show up to 5 matches
    
    console.log(`Job tokens: ${jobTokens.slice(0, 10).join(', ')}...`);
    console.log(`Found ${matches.length} matches with scores:`, matches.map(m => ({ email: m.resume.email, score: m.score })));

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

      // Ensure score is meaningful (at least 1% if there's any match)
      const displayScore = Math.max(m.score * 100, m.score > 0 ? 1 : 0);
      
      results.push({
        candidate: m.resume,
        score: displayScore.toFixed(1),
        reasoning: reasoningResponse.experience_summary || reasoningResponse.summary || "Good fit based on skills and experience",
      });
    }

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
