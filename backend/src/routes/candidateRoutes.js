import express from "express";
import { getCandidate } from "../controllers/candidateController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", authMiddleware, getCandidate);

export default router;
