import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  skills: [String],
  summary: String,
  fileUrl: String,
  rawText: String,
  embedding: [Number],
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);
