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

export const episodes: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const page = Number(req.query.page || 1);
    const r = await fetch(`${JIKAN_API}/anime/${id}/episodes?page=${page}`);
    const j = await r.json();
    res.json({ data: j.data ?? [], pagination: j.pagination ?? {} });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch episodes" });
  }
};

export const recommendations: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const r = await fetch(`${JIKAN_API}/anime/${id}/recommendations`);
    const j = await r.json();
    const data = Array.isArray(j.data)
      ? j.data.map((x: any) => x.entry).filter(Boolean)
      : [];
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
};

export const byGenre: RequestHandler = async (req, res) => {
  try {
    const ids = String(req.query.ids || "");
    const limit = Number(req.query.limit || 18);
    const r = await fetch(`${JIKAN_API}/anime?genres=${ids}&order_by=popularity&sort=desc&limit=${limit}`);
    const j = await r.json();
    res.json({ data: j.data ?? [] });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch by genre" });
  }
};

export const byType: RequestHandler = async (req, res) => {
  try {
    const type = String(req.query.type || "tv");
    const limit = Number(req.query.limit || 18);
    const r = await fetch(`${JIKAN_API}/anime?type=${encodeURIComponent(type)}&order_by=popularity&sort=desc&limit=${limit}`);
    const j = await r.json();
    res.json({ data: j.data ?? [] });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch by type" });
  }
};
