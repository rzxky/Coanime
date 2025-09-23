import { Anime } from "@/components/anime/AnimeCard";

const JIKAN = "https://api.jikan.moe/v4";

async function tryJson(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

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
  try {
    const j = await tryJson("/api/anime/trending");
    return j.data as Anime[];
  } catch {
    const j = await tryJson(`${JIKAN}/top/anime?filter=airing&limit=18`);
    return j.data as Anime[];
  }
}

export async function fetchPopular(): Promise<Anime[]> {
  try {
    const j = await tryJson("/api/anime/popular");
    return j.data as Anime[];
  } catch {
    const j = await tryJson(`${JIKAN}/top/anime?type=tv&limit=18`);
    return j.data as Anime[];
  }
}

export async function fetchLatest(): Promise<Anime[]> {
  try {
    const j = await tryJson("/api/anime/latest");
    return j.data as Anime[];
  } catch {
    const j = await tryJson(`${JIKAN}/seasons/now?limit=18`);
    return j.data as Anime[];
  }
}

export async function searchAnime(q: string): Promise<Anime[]> {
  try {
    const j = await tryJson(`/api/anime/search?q=${encodeURIComponent(q)}`);
    return j.data as Anime[];
  } catch {
    const j = await tryJson(
      `${JIKAN}/anime?q=${encodeURIComponent(q)}&sfw=true&order_by=popularity&sort=desc&limit=24`,
    );
    return j.data as Anime[];
  }
}

export async function fetchInfo(id: string): Promise<AnimeInfo> {
  try {
    const j = await tryJson(`/api/anime/info/${id}`);
    return j as AnimeInfo;
  } catch {
    const j = await tryJson(`${JIKAN}/anime/${id}/full`);
    return j.data as AnimeInfo;
  }
}

export async function fetchEpisodes(
  id: string,
  page = 1,
): Promise<{ data: Episode[]; pagination: any }> {
  try {
    const j = await tryJson(`/api/anime/episodes/${id}?page=${page}`);
    return { data: j.data as Episode[], pagination: j.pagination };
  } catch {
    const j = await tryJson(`${JIKAN}/anime/${id}/episodes?page=${page}`);
    return { data: (j.data || []) as Episode[], pagination: j.pagination };
  }
}

export async function fetchRecommendations(id: string): Promise<Anime[]> {
  try {
    const j = await tryJson(`/api/anime/recommendations/${id}`);
    return j.data as Anime[];
  } catch {
    // Jikan recommendations endpoint
    const j = await tryJson(`${JIKAN}/anime/${id}/recommendations`);
    const data = Array.isArray(j.data)
      ? j.data.map((x: any) => x.entry).filter(Boolean)
      : [];
    return data as Anime[];
  }
}

export async function fetchByGenre(ids: string, limit = 18): Promise<Anime[]> {
  try {
    const j = await tryJson(
      `/api/anime/genre?ids=${encodeURIComponent(ids)}&limit=${limit}`,
    );
    return j.data as Anime[];
  } catch {
    const j = await tryJson(
      `${JIKAN}/anime?genres=${ids}&order_by=popularity&sort=desc&limit=${limit}`,
    );
    return j.data as Anime[];
  }
}

export async function fetchByType(type: string, limit = 18): Promise<Anime[]> {
  try {
    const j = await tryJson(
      `/api/anime/type?type=${encodeURIComponent(type)}&limit=${limit}`,
    );
    return j.data as Anime[];
  } catch {
    const j = await tryJson(
      `${JIKAN}/anime?type=${encodeURIComponent(type)}&order_by=popularity&sort=desc&limit=${limit}`,
    );
    return j.data as Anime[];
  }
}
