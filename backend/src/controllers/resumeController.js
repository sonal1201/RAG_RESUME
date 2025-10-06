import fs from "fs";
import path from "path";
import { uploadBufferToBlob } from "../utils/blob.js";
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

//extract text from buffer
const extractText = async (buffer, mimetype) => {
  if (mimetype === "application/pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
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
      const rawText = await extractText(file.buffer, file.mimetype);

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

      // Upload to Vercel Blob and use returned public URL
      const safeName = `${Date.now()}-${file.originalname}`.replace(/[^a-zA-Z0-9._-]/g, "_");
      const publicFileUrl = await uploadBufferToBlob(file.buffer, safeName, file.mimetype);

      const resume = new Resume({
        name: resolvedName,
        email: summaryData?.email || email,
        skills: (Array.isArray(summaryData?.top_skills) ? summaryData.top_skills : extractSkills(rawText)),
        summary: summaryData?.experience_summary || "",
        fileUrl: publicFileUrl,
        rawText,
        embedding,
        uploadedBy: req.user?._id,
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

export const downloadResume = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    // If stored URL is a blob/public URL, redirect
    let fileUrl = resume.fileUrl || "";
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      return res.redirect(302, fileUrl);
    }

    // Legacy disk fallback
    let filename = "";
    if (fileUrl.startsWith("/uploads/")) {
      filename = fileUrl.replace("/uploads/", "");
    } else if (fileUrl.includes("uploads")) {
      // handle legacy absolute/relative paths like C:\...\uploads\file.pdf or uploads/file.pdf
      filename = path.basename(fileUrl);
    } else {
      // fallback: treat as basename
      filename = path.basename(fileUrl);
    }

    const absolutePath = path.join(process.cwd(), "uploads", filename);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    return res.sendFile(absolutePath);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
