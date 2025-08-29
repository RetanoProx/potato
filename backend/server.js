import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ---------------- API ----------------
app.get("/api/notes", async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ error: "Укажите год" });

    const result = await pool.query(
      `SELECT date, note FROM notes WHERE EXTRACT(YEAR FROM date) = $1`,
      [year]
    );

    const notes = result.rows.map(row => ({
      date: row.date.toISOString().split("T")[0],
      note: row.note
    }));

    res.json(notes);
  } catch (err) {
    console.error("Ошибка сервера при получении заметок:", err);
    res.status(500).json({ error: "Ошибка сервера", details: err.message });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const { date, note } = req.body;
    if (!date || !note) return res.status(400).json({ error: "Нужны date и note" });

    await pool.query(
      `INSERT INTO notes (date, note) VALUES ($1, $2)
       ON CONFLICT (date) DO UPDATE SET note = EXCLUDED.note`,
      [date, note]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка при сохранении заметки:", err);
    res.status(500).json({ error: "Ошибка сервера", details: err.message });
  }
});

// ---------------- Фронтенд ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ---------------- Сервер ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend + Frontend запущены на порту ${PORT}`));
