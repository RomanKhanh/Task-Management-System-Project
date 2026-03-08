import cron from "node-cron";
import sql from "mssql";
import { poolPromise } from "../config/db.js";
import { createNotification } from "../models/notification.model.js";

export const startDeadlineChecker = () => {

  
  cron.schedule("0 0 * * *", async () => {
        
    try {

      const pool = await poolPromise;

      const result = await pool.request().query(`
        SELECT *
        FROM Tasks
        WHERE CAST(deadline AS DATE) < CAST(GETDATE() AS DATE)
        AND deadlineNotified = 0
        AND status != 'Done'
      `);

      const tasks = result.recordset;

      for (const task of tasks) {

        if (task.assigneeId) {

          await createNotification(
            task.assigneeId,
            `Task "${task.title}" is overdue`
          );

        }

        await pool.request()
          .input("id", sql.UniqueIdentifier, task.id)
          .query(`
            UPDATE Tasks
            SET deadlineNotified = 1
            WHERE id = @id
          `);

      }

      if (tasks.length > 0) {
        console.log("Deadline notifications sent:", tasks.length);
      }

    } catch (err) {
      console.error("Deadline checker error:", err);
    }

  });

};