import { RequestHandler } from "express";

const BASE = "https://api.consumet.org/meta/anilist";
const GOGO = "https://api.consumet.org/anime/gogoanime";

async function proxyJson(url: string, res: any) {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "coanime" } });
    const j = await r.json();
    res.json(j);
  } catch (e) {
    res.status(500).json({ error: "Upstream error" });
  }
}

export const streamSearch: RequestHandler = async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json({ results: [] });
  return proxyJson(`${BASE}/${encodeURIComponent(q)}`, res);
};

export const streamInfo: RequestHandler = async (req, res) => {
  const id = req.params.id;
  const provider = String(req.query.provider || "gogoanime");
  return proxyJson(`${BASE}/info/${id}?provider=${provider}`, res);
};

export const streamWatch: RequestHandler = async (req, res) => {
  const episodeId = req.params.episodeId;
  const server = String(req.query.server || "gogocdn");
  const provider = String(req.query.provider || "gogoanime");
  return proxyJson(
    `${BASE}/watch/${episodeId}?server=${server}&provider=${provider}`,
    res,
  );
};

// Gogoanime direct (fallback)
export const gogoSearch: RequestHandler = async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json({ results: [] });
  return proxyJson(`${GOGO}/${encodeURIComponent(q)}`, res);
};

export const gogoInfo: RequestHandler = async (req, res) => {
  const id = req.params.id;
  return proxyJson(`${GOGO}/info/${id}`, res);
};

export const gogoWatch: RequestHandler = async (req, res) => {
  const episodeId = req.params.episodeId;
  const server = String(req.query.server || "gogocdn");
  return proxyJson(
    `${GOGO}/watch?episodeId=${encodeURIComponent(episodeId)}&server=${server}`,
    res,
  );
};
