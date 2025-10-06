import express from "express";
import { upload } from "../utils/multerConfig.js";
import { uploadResumes, downloadResume } from "../controllers/resumeController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.array("files"), uploadResumes);
router.get("/:id/download", authMiddleware, downloadResume);

export default router;
