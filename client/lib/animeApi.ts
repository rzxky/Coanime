import { Anime } from "@/components/anime/AnimeCard";

export type AnimeInfo = Anime & {
  synopsis?: string | null;
  episodes?: number | null;
  duration?: string | null;
  trailer?: { url?: string | null; youtube_id?: string | null } | null;
  genres?: { name: string; mal_id?: number }[];
  studios?: { name: string }[];
  producers?: { name: string }[];
  titles?: { title: string }[];
  status?: string | null;
  season?: string | null;
  streaming?: { name: string; url: string }[];
};

export type Episode = {
  mal_id: number;
  title: string;
  title_japanese?: string | null;
  aired?: string | null;
  episode: number;
  filler?: boolean;
  recap?: boolean;
  forum_url?: string | null;
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

export async function fetchEpisodes(
  id: string,
  page = 1,
): Promise<{ data: Episode[]; pagination: any }> {
  const r = await fetch(`/api/anime/episodes/${id}?page=${page}`);
  const j = await r.json();
  return { data: j.data as Episode[], pagination: j.pagination };
}

export async function fetchRecommendations(id: string): Promise<Anime[]> {
  const r = await fetch(`/api/anime/recommendations/${id}`);
  const j = await r.json();
  return j.data as Anime[];
}

export async function fetchByGenre(ids: string, limit = 18): Promise<Anime[]> {
  const r = await fetch(
    `/api/anime/genre?ids=${encodeURIComponent(ids)}&limit=${limit}`,
  );
  const j = await r.json();
  return j.data as Anime[];
}

export async function fetchByType(type: string, limit = 18): Promise<Anime[]> {
  const r = await fetch(
    `/api/anime/type?type=${encodeURIComponent(type)}&limit=${limit}`,
  );
  const j = await r.json();
  return j.data as Anime[];
}
