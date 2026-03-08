import sql from "mssql";
import { poolPromise } from "../config/db.js";

export const createSubtask = async (subtask) => {

  const pool = await poolPromise;

  await pool.request()
    .input("taskId", sql.UniqueIdentifier, subtask.taskId)
    .input("title", sql.NVarChar, subtask.title)
    .input("status", sql.NVarChar, subtask.status)
    .input("startDate", sql.DateTime, subtask.startDate)
    .input("deadline", sql.DateTime, subtask.deadline)
    .query(`
      INSERT INTO Subtasks (taskId, title, status, startDate, deadline)
      VALUES (@taskId, @title, @status, @startDate, @deadline)
    `);

};

export const getSubtasksByTask = async (taskId) => {

  const pool = await poolPromise;

  const result = await pool.request()
    .input("taskId", sql.UniqueIdentifier, taskId)
    .query(`
      SELECT *
      FROM Subtasks
      WHERE taskId = @taskId
      ORDER BY startDate
    `);

  return result.recordset;

};

export const updateSubtaskStatus = async (id, status) => {

  const pool = await poolPromise;

  await pool.request()
    .input("id", sql.UniqueIdentifier, id)
    .input("status", sql.NVarChar, status)
    .query(`
      UPDATE Subtasks
      SET status = @status
      WHERE id = @id
    `);

};

export const deleteSubtask = async (id) => {

  const pool = await poolPromise;

  await pool.request()
    .input("id", sql.UniqueIdentifier, id)
    .query(`
      DELETE FROM Subtasks
      WHERE id = @id
    `);

};