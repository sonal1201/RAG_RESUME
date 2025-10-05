import Resume from "../models/Resume.js";

export const getCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);
    if (!resume) return res.status(404).json({ error: "Candidate not found" });

    res.json({ resume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
