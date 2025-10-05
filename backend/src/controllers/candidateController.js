import Resume from "../models/resumeModel.js";

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

export const listCandidates = async (req, res) => {
  try {
    const userId = req.user?._id;
    const filter = userId ? { uploadedBy: userId } : {};
    const resumes = await Resume.find(filter).sort({ createdAt: -1 });
    res.json({ resumes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
