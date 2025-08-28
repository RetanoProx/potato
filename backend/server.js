import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 📌 Получить заметки за год
app.get("/api/notes", async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ error: "Укажите год" });

    const result = await pool.query(
      `SELECT date, note FROM notes WHERE EXTRACT(YEAR FROM date) = $1`,
      [year]
    );

    // Преобразуем в объект { "2025-01-12": "Заметка" }
    const notes = {};
    result.rows.forEach((row) => {
      notes[row.date.toISOString().split("T")[0]] = row.note;
    });

    res.json(notes);
  } catch (err) {
    console.error("Ошибка при получении заметок:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// 📌 Добавить заметку
app.post("/api/notes", async (req, res) => {
  try {
    const { date, note } = req.body;
    if (!date || !note) {
      return res.status(400).json({ error: "Нужны date и note" });
    }

    await pool.query(
      `INSERT INTO notes (date, note) VALUES ($1, $2)
       ON CONFLICT (date) DO UPDATE SET note = EXCLUDED.note`,
      [date, note]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка при сохранении заметки:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend запущен на http://localhost:${PORT}`));
