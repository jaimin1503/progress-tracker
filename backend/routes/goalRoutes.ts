import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth";

import { newGoal, updateStatus } from "../controllers/goalController";

router.post("/newgoal", auth, newGoal);
router.put(
  "/update-status/:goalId/:type/:subjectIndex/:topicIndex",
  auth,
  updateStatus
);

export default router;
