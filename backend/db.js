import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

// Використовуємо connectionString і SSL для Render.com
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`,
  ssl: {
    rejectUnauthorized: false, // важливо для зовнішнього підключення до Render Postgres
  },
});

// Тестуємо з'єднання при старті
pool.connect()
  .then(client => {
    console.log("✅ Connection to the database successful");
    client.release();
  })
  .catch(err => {
    console.error("❌ Database connection error:", err.message);
  });

export default pool;
