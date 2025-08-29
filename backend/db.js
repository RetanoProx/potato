import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

// Используем connectionString и SSL для Render.com
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`,
  ssl: {
    rejectUnauthorized: false, // важно для внешнего подключения к Render Postgres
  },
});

// Тестируем соединение при старте
pool.connect()
  .then(client => {
    console.log("✅ Подключение к базе успешно");
    client.release();
  })
  .catch(err => {
    console.error("❌ Ошибка подключения к базе:", err.message);
  });

export default pool;
