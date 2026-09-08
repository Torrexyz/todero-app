import { Router } from "express";
import dotenv from "dotenv";

dotenv.config();

//====================//

const router = Router();

//====================//

router.get("/", (req, res) => {
  res.json({
    name: "Todero/Backend",
    description: "Backend API REST for Todero/Fronted",
    version: process.env.APP_VERSION,
  });
});

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    sha: null,
    at: new Date().toISOString(),
  });
});

router.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

//====================//

export default router;
