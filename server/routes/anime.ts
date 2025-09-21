import { RequestHandler } from "express";

const JIKAN_API = "https://api.jikan.moe/v4";

export const trending: RequestHandler = async (_req, res) => {
  try {
    const r = await fetch(`${JIKAN_API}/top/anime?filter=airing&limit=18`);
    const j = await r.json();
    res.json({ data: j.data ?? [] });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch trending" });
  }
};

export const popular: RequestHandler = async (_req, res) => {
  try {
    const r = await fetch(`${JIKAN_API}/top/anime?type=tv&limit=18`);
    const j = await r.json();
    res.json({ data: j.data ?? [] });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch popular" });
  }
};

export const latest: RequestHandler = async (_req, res) => {
  try {
    const r = await fetch(`${JIKAN_API}/seasons/now?limit=18`);
    const j = await r.json();
    res.json({ data: j.data ?? [] });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch latest" });
  }
};

export const search: RequestHandler = async (req, res) => {
  try {
    const q = String(req.query.q || "");
    const r = await fetch(
      `${JIKAN_API}/anime?q=${encodeURIComponent(q)}&sfw=true&order_by=popularity&sort=desc&limit=24`,
    );
    const j = await r.json();
    res.json({ data: j.data ?? [] });
  } catch (e) {
    res.status(500).json({ error: "Failed to search" });
  }
};

export const info: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const r = await fetch(`${JIKAN_API}/anime/${id}/full`);
    const j = await r.json();
    res.json(j.data ?? {});
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch info" });
  }
};
