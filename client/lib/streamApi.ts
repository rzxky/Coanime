export type StreamSearchResult = {
  id: string | number;
  title?: any;
  malId?: number;
  isAdult?: boolean;
};
export type StreamEpisode = {
  id: string;
  number: number;
  title?: string;
  isDub?: boolean;
  url?: string;
};
export type StreamInfo = {
  id: string | number;
  title?: any;
  malId?: number;
  episodes?: StreamEpisode[];
  hasDub?: boolean;
};

async function safeJson(url: string) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${r.status}`);
    return await r.json();
  } catch {
    return null;
  }
}

export async function streamSearch(q: string): Promise<StreamSearchResult[]> {
  const j = await safeJson(`/api/stream/search?q=${encodeURIComponent(q)}`);
  const results = j?.results || j?.data || [];
  return results as StreamSearchResult[];
}

export async function streamInfoByAnilist(
  id: string | number,
): Promise<StreamInfo> {
  const j = await safeJson(`/api/stream/info/${id}?provider=gogoanime`);
  const episodes: StreamEpisode[] = (j?.episodes || j?.results || []).map(
    (e: any) => ({
      id: e.id || e.episodeId || String(e.number),
      number: e.number || e.episodeNumber || e.id,
      title: e.title,
      isDub: e.isDub || e.language === "dub",
    }),
  );
  const hasDub = episodes.some((e) => e.isDub);
  return {
    id: j?.id ?? id,
    title: j?.title,
    malId: j?.malId || j?.mal_id,
    episodes,
    hasDub,
  } as StreamInfo;
}

export async function streamWatchEpisode(
  episodeId: string,
  server = "gogocdn",
): Promise<{
  sources: { url: string; quality?: string }[];
  subtitles?: any[];
}> {
  const j = await safeJson(
    `/api/stream/watch/${encodeURIComponent(episodeId)}?server=${server}&provider=gogoanime`,
  );
  const sources = j?.sources || [];
  const subtitles = j?.subtitles || [];
  return { sources, subtitles };
}

// Gogo direct fallback
export async function gogoSearch(q: string) {
  const j = await safeJson(`/api/gogo/search?q=${encodeURIComponent(q)}`);
  return j?.results || [];
}
export async function gogoInfoById(id: string) {
  const j = await safeJson(`/api/gogo/info/${id}`);
  const episodes: StreamEpisode[] = (j?.episodes || []).map((e: any) => ({
    id: e.id || e.episodeId,
    number: e.number || e.episode,
    title: e.title,
    isDub: Boolean(
      e.isDub || (e.id && String(e.id).toLowerCase().includes("dub")),
    ),
  }));
  const hasDub = episodes.some((e) => e.isDub);
  return { id: j?.id || id, title: j?.title, episodes, hasDub } as StreamInfo;
}
export async function gogoWatchEpisode(episodeId: string, server = "gogocdn") {
  const j = await safeJson(
    `/api/gogo/watch/${encodeURIComponent(episodeId)}?server=${server}`,
  );
  return { sources: j?.sources || [], subtitles: j?.subtitles || [] };
}
