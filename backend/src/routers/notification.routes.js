import express from "express";

import {
  getNotifications,
  createNotificationController,
  markAsRead,
  markAllAsRead
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/:userId", getNotifications);

router.post("/", createNotificationController);

router.put("/:id/read", markAsRead);

router.put("/read-all/:userId", markAllAsRead);

export default router;