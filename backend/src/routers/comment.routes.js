import express from "express";
import { getComments, addComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/:taskId", getComments);

router.post("/", addComment);

export default router;