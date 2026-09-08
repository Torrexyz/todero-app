import express, { json, urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";

import dashboardTodoRoutes from "#routes/dashboard/todo";
import dashboardNotesRoutes from "#routes/dashboard/notes";
import dashboardClockRoutes from "#routes/dashboard/clock";
import dashboardProfileRoutes from "#routes/dashboard/profile";
import dashboardSettingsRoutes from "#routes/dashboard/settings";

import publicMainRoutes from "#routes/public/main";

import { testConnection } from "#config/dbconn";

dotenv.config();

//====================//

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use("/api/dashboard/todo", dashboardTodoRoutes);
app.use("/api/dashboard/notes", dashboardNotesRoutes);
app.use("/api/dashboard/clock", dashboardClockRoutes);
app.use("/api/dashboard/profile", dashboardProfileRoutes);
app.use("/api/dashboard/settings", dashboardSettingsRoutes);

app.use("/", publicMainRoutes);

//====================//

(async () => {
  const isConnected = await testConnection();

  if (!isConnected)
    console.log(
      "⚠️  No se pudo conectar a PostgreSQL:\n  » Verifica que PostgreSQL esté corriendo",
    );

  app.listen(PORT, () => {
    console.log("──────────────────────────────");
    console.log("🚀 Todero API running..");
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📦 PostgreSQL: ${isConnected ? "Connected" : "Disconnected"}`);
    console.log("──────────────────────────────");
  });
})();
