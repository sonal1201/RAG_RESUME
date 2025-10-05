import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import Resume from "../models/resumeModel.js";
import { getEmbedding, summarizeResume } from "../utils/gemini.js";

// Helper to extract text
const extractText = async (filePath, mimetype) => {
  if (mimetype === "application/pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else {
    throw new Error("Unsupported file type");
  }
};

// Simple regex to extract email
const extractEmail = (text) => {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
  return match ? match[0] : "";
};

// Simple regex to extract phone number
const extractPhone = (text) => {
  const match = text.match(/\+?\d[\d\s-]{7,}\d/);
  return match ? match[0] : "";
};

// Controller function
export const uploadResumes = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: "No files uploaded" });

    const results = [];

    for (const file of req.files) {
      const rawText = await extractText(file.path, file.mimetype);

      const email = extractEmail(rawText);
      const phone = extractPhone(rawText);

      const summaryData = await summarizeResume(rawText);
      const embedding = await getEmbedding(rawText);

      const resume = new Resume({
        name: summaryData.name || "Unknown",
        email,
        skills: summaryData.top_skills || [],
        summary: summaryData.experience_summary || "",
        fileUrl: file.path,
        rawText,
        embedding,
      });

      await resume.save();
      results.push(resume);
    }

    res.json({ message: "Files uploaded successfully", resumes: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
