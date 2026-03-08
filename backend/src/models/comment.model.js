import sql from "mssql";
import { poolPromise } from "../config/db.js";

export const getCommentsByTask = async (taskId) => {

  const pool = await poolPromise;

  const result = await pool.request()
    .input("taskId", sql.UniqueIdentifier, taskId)
    .query(`
      SELECT c.*, u.name
      FROM Comments c
      JOIN Users u ON c.userId = u.id
      WHERE c.taskId = @taskId
      ORDER BY c.createdAt ASC
    `);

  return result.recordset;
};

export const createComment = async (taskId, userId, content) => {

  const pool = await poolPromise;

  await pool.request()
    .input("taskId", sql.UniqueIdentifier, taskId)
    .input("userId", sql.UniqueIdentifier, userId)
    .input("content", sql.NVarChar(500), content)
    .query(`
      INSERT INTO Comments (taskId, userId, content)
      VALUES (@taskId, @userId, @content)
    `);
};