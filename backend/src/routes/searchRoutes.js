import express from "express";
import { searchResumes } from "../controllers/searchController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, searchResumes);

export default router;
