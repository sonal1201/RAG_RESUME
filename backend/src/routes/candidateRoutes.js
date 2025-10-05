import express from "express";
import { getCandidate, listCandidates } from "../controllers/candidateController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:id", authMiddleware, getCandidate);
router.get("/", authMiddleware, listCandidates);

export default router;
