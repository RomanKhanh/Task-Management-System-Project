import express from "express";

import {
  getSubtasks,
  createSubtaskController,
  updateSubtask,
  deleteSubtaskController
} from "../controllers/subtask.controller.js";

const router = express.Router();

router.get("/:taskId", getSubtasks);

router.post("/", createSubtaskController);

router.put("/:id/status", updateSubtask);

router.delete("/:id", deleteSubtaskController);

export default router;