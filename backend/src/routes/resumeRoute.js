import express from "express";
import { upload } from "../utils/multerConfig.js";
import { uploadResumes } from "../controllers/resumeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.array("files"), uploadResumes);

export default router;
