import sql from "mssql";
import { poolPromise } from "../config/db.js";

export const UserModel = {
  async create({ name, email, password, role, avatar }) {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, password)
      .input("role", sql.NVarChar, role)
      .input("avatar", sql.NVarChar, avatar || null)
      .query(`
        INSERT INTO Users (name, email, password, role, avatar)
        OUTPUT INSERTED.*
        VALUES (@name, @email, @password, @role, @avatar)
      `);

    return result.recordset[0];
  },

  async findByEmail(email) {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM Users WHERE email = @email");

    return result.recordset[0];
  }
};