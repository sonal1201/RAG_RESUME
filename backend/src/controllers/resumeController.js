import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import mammoth from "mammoth";
import Resume from "../models/resumeModel.js";
import { extractSkills } from "../utils/index.js";
let getEmbedding, summarizeResume;
try {
  ({ getEmbedding, summarizeResume } = await import("../utils/gemini.js"));
} catch (e) {
  // Defer throwing until request handling, so server can still start
}

//extract text
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

//  extract email
const extractEmail = (text) => {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
  return match ? match[0] : "";
};

// extract phone number
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

      // If AI isn't configured, continue with minimal data
      let summaryData = {};
      let embedding = [];
      if (summarizeResume) {
        try {
          summaryData = await summarizeResume(rawText);
        } catch (e) {
          summaryData = {};
        }
      }
      if (getEmbedding) {
        try {
          embedding = await getEmbedding(rawText);
        } catch (e) {
          embedding = [];
        }
      }

      const identifiers = [email, phone].filter(Boolean).join(" | ");
      const resolvedName = (summaryData?.name && summaryData.name.trim().length > 0)
        ? summaryData.name
        : (identifiers || "Unknown");

      const resume = new Resume({
        name: resolvedName,
        email: summaryData?.email || email,
        skills: (Array.isArray(summaryData?.top_skills) ? summaryData.top_skills : extractSkills(rawText)),
        summary: summaryData?.experience_summary || "",
        fileUrl: file.path.replace(/\\/g, "/"),
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
