import { Project } from "../models/project.model.js";
import { poolPromise } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createProject = async (req, res) => {
  try {
    const { name, description, managerId } = req.body;

    const pool = await poolPromise;   // 👈 QUAN TRỌNG
    const id = uuidv4();

    await pool.request()
      .input("id", id)
      .input("name", name)
      .input("description", description)
      .input("managerId", managerId)
      .query(`
        INSERT INTO Projects (id, name, description, managerId)
        VALUES (@id, @name, @description, @managerId)
      `);

    res.status(201).json({ id, name, description, managerId });

  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);
    res.status(500).json({ message: "Create project failed" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT * FROM Projects
    `);

    const projects = result.recordset.map(p => ({
      ...p,
      memberIds: []   // thêm cái này
    }));

    res.json(projects);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.getById(req.params.id);

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { name } = req.body;

    const updatedProject = await Project.update(req.params.id, name);

    if (!updatedProject)
      return res.status(404).json({ message: "Project not found" });

    res.json(updatedProject);
  } catch (error) {
    console.error("UPDATE PROJECT ERROR:", error);
    res.status(500).json({ message: "Error updating project" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await Project.delete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);
    res.status(500).json({ message: "Error deleting project" });
  }
};