import sql from "mssql";
import { poolPromise } from "../config/db.js";

export const createNotification = async (userId, message) => {

  const pool = await poolPromise;

  await pool.request()
    .input("userId", sql.UniqueIdentifier, userId)
    .input("message", sql.NVarChar, message)
    .query(`
      INSERT INTO Notifications (userId, message, isRead, createdAt)
      VALUES (@userId, @message, 0, GETDATE())
    `);
};


export const getNotificationsByUser = async (userId) => {

  const pool = await poolPromise;

  const result = await pool.request()
    .input("userId", sql.UniqueIdentifier, userId)
    .query(`
      SELECT *
      FROM Notifications
      WHERE userId = @userId
      ORDER BY createdAt DESC
    `);

  return result.recordset;
};


export const markNotificationRead = async (id) => {

  const pool = await poolPromise;

  await pool.request()
    .input("id", sql.Int, id)
    .query(`
      UPDATE Notifications
      SET isRead = 1
      WHERE id = @id
    `);
};

export const markAllNotificationsRead = async (userId) => {

  const pool = await poolPromise;

  await pool.request()
    .input("userId", sql.UniqueIdentifier, userId)
    .query(`
      UPDATE Notifications
      SET isRead = 1
      WHERE userId = @userId
    `);
};