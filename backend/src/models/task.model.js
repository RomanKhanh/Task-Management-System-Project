import sql from "mssql";
import { poolPromise } from "../config/db.js";


// ================= GET ALL =================
export const getAllTasks = async () => {

  const pool = await poolPromise;

  const result = await pool.request()
    .query("SELECT * FROM Tasks");

  return result.recordset;
};


// ================= CREATE =================
export const createTask = async (
  projectId,
  title,
  description,
  assigneeId,
  creatorId,
  status,
  startDate,
  deadline
) => {

  const pool = await poolPromise;

  const result = await pool.request()
    .input("projectId", sql.UniqueIdentifier, projectId)
    .input("title", sql.NVarChar(200), title)
    .input("description", sql.NVarChar(500), description)
    .input("assigneeId", sql.UniqueIdentifier, assigneeId)
    .input("creatorId", sql.UniqueIdentifier, creatorId)
    .input("status", sql.NVarChar(20), status)
    .input("startDate", sql.DateTime2, startDate)
    .input("deadline", sql.DateTime2, deadline)
    .query(`
      INSERT INTO Tasks
      (id, projectId, title, description, assigneeId, creatorId, status, startDate, deadline)
      VALUES
      (NEWID(), @projectId, @title, @description, @assigneeId, @creatorId, @status, @startDate, @deadline)
    `);

  return result.rowsAffected[0];
};


// ================= UPDATE =================
export const updateTask = async (
  id,
  title,
  description,
  assigneeId,
  status,
  startDate,
  deadline
) => {

  const pool = await poolPromise;

  const result = await pool.request()
    .input("id", sql.UniqueIdentifier, id)
    .input("title", sql.NVarChar(200), title)
    .input("description", sql.NVarChar(500), description)
    .input("assigneeId", sql.UniqueIdentifier, assigneeId)
    .input("status", sql.NVarChar(20), status)
    .input("startDate", sql.DateTime2, startDate)
    .input("deadline", sql.DateTime2, deadline)
    .query(`
      UPDATE Tasks
      SET
        title = @title,
        description = @description,
        assigneeId = @assigneeId,
        status = @status,
        startDate = @startDate,
        deadline = @deadline
      WHERE id = @id
    `);

  return result.rowsAffected[0];
};


// ================= DELETE =================
export const deleteTask = async (id) => {

  const pool = await poolPromise;

  const result = await pool.request()
    .input("id", sql.UniqueIdentifier, id)
    .query(`
      DELETE FROM Tasks
      WHERE id = @id
    `);

  return result.rowsAffected[0];
};