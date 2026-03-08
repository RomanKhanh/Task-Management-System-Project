import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
} from "../models/task.model.js";


// ================= CREATE =================
export const addTask = async (req, res) => {

  try {

    const {
      projectId,
      title,
      description,
      assigneeId,
      creatorId,
      status,
      startDate,
      deadline
    } = req.body;

    const result = await createTask(
      projectId,
      title,
      description,
      assigneeId,
      creatorId,
      status,
      startDate,
      deadline
    );

    res.status(201).json({
      message: "Task created",
      affected: result
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Create task failed"
    });

  }
};


// ================= GET =================
export const getTasks = async (req, res) => {

  try {

    const tasks = await getAllTasks();

    res.json(tasks);

  } catch (err) {

    res.status(500).json({
      message: "Fetch tasks failed"
    });

  }
};


// ================= UPDATE =================
export const editTask = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      title,
      description,
      assigneeId,
      status,
      startDate,
      deadline
    } = req.body;

    const result = await updateTask(
      id,
      title,
      description,
      assigneeId,
      status,
      startDate,
      deadline
    );

    if (result === 0) {

      return res.status(404).json({
        message: "Task not found"
      });

    }

    res.json({
      message: "Task updated"
    });

  } catch (err) {

    res.status(500).json({
      message: "Update failed"
    });

  }
};


// ================= DELETE =================
export const removeTask = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await deleteTask(id);

    if (result === 0) {

      return res.status(404).json({
        message: "Task not found"
      });

    }

    res.json({
      message: "Task deleted"
    });

  } catch (err) {

    res.status(500).json({
      message: "Delete failed"
    });

  }
};