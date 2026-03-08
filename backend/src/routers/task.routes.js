import express from "express";

import {
  addTask,
  getTasks,
  editTask,
  removeTask
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/", getTasks);
router.post("/", addTask);
router.put("/:id", editTask);
router.delete("/:id", removeTask);

export default router;