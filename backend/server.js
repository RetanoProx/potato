import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./db.js";

// ---- auth
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ---- auth helpers
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // задай в .env
const COOKIE_NAME = "auth_token";

// Middleware для проверки авторизации
function authMiddleware(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Не авторизован" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Неверный токен" });
  }
}

// ---------------- AUTH API ----------------

// регистрация
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Нужны email и пароль" });

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (email, password) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING`,
      [email, hashed]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка регистрации:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// вход
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Нужны email и пароль" });

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Неверные данные" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Неверные данные" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // в проде поставить true + https
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 год
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка входа:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// выход
app.post("/api/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
});

// проверка авторизации
app.get("/api/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// ---------------- API calendar ----------------
app.get("/api/notes", authMiddleware, async (req, res) => {
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

app.post("/api/notes", authMiddleware, async (req, res) => {
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
