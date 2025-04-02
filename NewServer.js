import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const app = express();
const port = 3000;

app.use(express.json());


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/* Get users */

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ADD a new user:

app.post("/adduser", async (req, res) => {
    try {
      const { name, email, age } = req.body;
  
      const query = "INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *";
      const values = [name, email, age];
  
      const result = await pool.query(query, values);
      res.status(201).json({ message: "User added successfully", user: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});