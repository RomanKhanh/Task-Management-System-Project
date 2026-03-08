import sql from "mssql";
import { poolPromise } from "../config/db.js";

export const Project = {

  async create(name) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("name", sql.NVarChar, name)
      .query(`
        INSERT INTO Projects (name)
        OUTPUT INSERTED.*
        VALUES (@name)
      `);

    return result.recordset[0];
  },

  async getAll() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query("SELECT * FROM Projects");

    return result.recordset;
  },

  async getById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query("SELECT * FROM Projects WHERE id = @id");

    return result.recordset[0];
  },

  async update(id, name) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .input("name", sql.NVarChar, name)
      .query(`
        UPDATE Projects
        SET name = @name
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    return result.recordset[0];
  },

  async delete(id) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query("DELETE FROM Projects WHERE id = @id");

    return { message: "Project deleted successfully" };
  }

};