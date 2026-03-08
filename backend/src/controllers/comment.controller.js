import { getCommentsByTask, createComment } from "../models/comment.model.js";
import { createNotification } from "../models/notification.model.js";

export const getComments = async (req, res) => {

  const { taskId } = req.params;

  const data = await getCommentsByTask(taskId);

  res.json(data);
};

export const addComment = async (req, res) => {

  try {

    const { taskId, userId, content, assigneeId } = req.body;

    // lưu comment
    await createComment(taskId, userId, content);

    // tạo notification cho người được assign task
    if (assigneeId && assigneeId !== userId) {
        console.log("assigneeId:", assigneeId);
        console.log("userId:", userId);
      await createNotification(
        assigneeId,
        "Someone commented on your task"
      );

    }

    res.json({
      message: "Comment added"
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }

};