import { UserModel } from "../models/user.model.js";


import { poolPromise } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const pool = await poolPromise;

    // CHECK EMAIL EXIST
    const check = await pool.request()
      .input("email", email)
      .query("SELECT id FROM Users WHERE email = @email");

    if (check.recordset.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const id = uuidv4();
    const avatar = `https://i.pravatar.cc/150?u=${id}`;

    await pool.request()
      .input("id", id)
      .input("name", name)
      .input("email", email)
      .input("password", password)
      .input("role", role)
      .input("avatar", avatar)
      .query(`
        INSERT INTO Users (id, name, email, password, role, avatar)
        VALUES (@id, @name, @email, @password, @role, @avatar)
      `);

    res.status(201).json({ id, name, email, role, avatar });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Register failed" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    // test login 
    console.log("LOGIN REQUEST:", req.body);
    const { email, password } = req.body;

    const pool = await poolPromise;

    const result = await pool.request()
      .input("email", email)
      .input("password", password)
      .query(`
        SELECT id, name, email, password, role, avatar
        FROM Users
        WHERE email = @email AND password = @password
      `);
    //   test DB
      console.log("SQL RESULT:", result.recordset);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(result.recordset[0]);

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// GET USERS
export const getUsers = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .query("SELECT id, name, email, role, avatar FROM Users");

    res.json(result.recordset);

  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: "Fetch users failed" });
  }
};