import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { trending, popular, latest, search, info, episodes, recommendations, byGenre, byType } from "./routes/anime";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Anime proxy routes
  app.get("/api/anime/trending", trending);
  app.get("/api/anime/popular", popular);
  app.get("/api/anime/latest", latest);
  app.get("/api/anime/search", search);
  app.get("/api/anime/info/:id", info);
  app.get("/api/anime/episodes/:id", episodes);
  app.get("/api/anime/recommendations/:id", recommendations);
  app.get("/api/anime/genre", byGenre);
  app.get("/api/anime/type", byType);

  return app;
}
