import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

//====================//

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  console.log("📦 Nueva conexión a PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Error en el pool de PostgreSQL:", err);
});

//====================//

const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("✅ Conectado a PostgreSQL");
    console.log(
      "📅 Hora del servidor:",
      new Date(result.rows[0].now).toLocaleString("es-CO", {
        timeZone: "America/Bogota",
        dateStyle: "long",
        timeStyle: "short",
      }),
    );
    client.release();
    return true;
  } catch (err) {
    console.error(`❌ Error de conexión:\n  » ${err.message}`);
    return false;
  }
};

//====================//

export const query = (text, params) => pool.query(text, params);
export { pool, testConnection };
