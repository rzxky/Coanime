import { Anime } from "@/components/anime/AnimeCard";

export type AnimeInfo = Anime & {
  synopsis?: string | null;
  episodes?: number | null;
  duration?: string | null;
  trailer?: { url?: string | null; youtube_id?: string | null } | null;
  genres?: { name: string }[];
  studios?: { name: string }[];
  producers?: { name: string }[];
  titles?: { title: string }[];
  status?: string | null;
  season?: string | null;
};

export async function fetchTrending(): Promise<Anime[]> {
  const r = await fetch("/api/anime/trending");
  const j = await r.json();
  return j.data as Anime[];
}

export async function fetchPopular(): Promise<Anime[]> {
  const r = await fetch("/api/anime/popular");
  const j = await r.json();
  return j.data as Anime[];
}

export async function fetchLatest(): Promise<Anime[]> {
  const r = await fetch("/api/anime/latest");
  const j = await r.json();
  return j.data as Anime[];
}

export async function searchAnime(q: string): Promise<Anime[]> {
  const r = await fetch(`/api/anime/search?q=${encodeURIComponent(q)}`);
  const j = await r.json();
  return j.data as Anime[];
}

export async function fetchInfo(id: string): Promise<AnimeInfo> {
  const r = await fetch(`/api/anime/info/${id}`);
  const j = await r.json();
  return j as AnimeInfo;
}
