import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db.js";
import taskRoutes from "./routers/task.routes.js";
import projectRoutes from "./routers/project.routes.js";
import userRoutes from "./routers/user.routes.js";
import commentRoutes from "./routers/comment.routes.js";
import notificationRoutes from "./routers/notification.routes.js";
import { startDeadlineChecker } from "./jobs/deadlineChecker.js";
import subtaskRoutes from "./routers/subtask.routes.js";






dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/subtasks", subtaskRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startDeadlineChecker();
});
console.log(process.env.DB_HOST);