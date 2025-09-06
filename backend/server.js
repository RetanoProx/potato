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
app.use(
  cors({
    origin: [
      "http://localhost:5173", // для локальной разработки
      "https://potato-bnbk.onrender.com", // для деплоя
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const COOKIE_NAME = "auth_token";

// Middleware для проверки авторизации
function authMiddleware(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Not authorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// ---------------- AUTH API ----------------

// регистрация
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (email, password) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING`,
      [email, hashed]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// вход
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Incorrect data" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Incorrect data" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
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

// ---------------- SESSIONS API ----------------

// Сохраняем сессию
app.post("/api/sessions/save", authMiddleware, async (req, res) => {
  try {
    const { notes_text } = req.body;
    if (!notes_text || notes_text.trim() === "") {
      return res.status(400).json({ error: "No notes provided" });
    }

    const result = await pool.query(
      `INSERT INTO sessions (notes_text, session_date) VALUES ($1, NOW()) RETURNING *`,
      [notes_text]
    );

    res.json({ success: true, session: result.rows[0] });
  } catch (err) {
    console.error("Save session error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Получаем все сессии
app.get("/api/sessions", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM sessions ORDER BY session_date ASC`);
    res.json({ sessions: result.rows });
  } catch (err) {
    console.error("Fetch sessions error:", err);
    res.status(500).json({ error: "Server error" });
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
app.listen(PORT, () =>
  console.log(`✅ Backend + Frontend запущены на порту ${PORT}`)
);
