import express from "express";
import { matchJob } from "../controllers/jobController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, matchJob);

export default router;
