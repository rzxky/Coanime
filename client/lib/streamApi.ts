export type StreamSearchResult = { id: string | number; title?: any; malId?: number; isAdult?: boolean };
export type StreamEpisode = { id: string; number: number; title?: string; isDub?: boolean; url?: string };
export type StreamInfo = { id: string | number; title?: any; malId?: number; episodes?: StreamEpisode[]; hasDub?: boolean };

export async function streamSearch(q: string): Promise<StreamSearchResult[]> {
  const r = await fetch(`/api/stream/search?q=${encodeURIComponent(q)}`);
  const j = await r.json();
  const results = j?.results || j?.data || [];
  return results as StreamSearchResult[];
}

export async function streamInfoByAnilist(id: string | number): Promise<StreamInfo> {
  const r = await fetch(`/api/stream/info/${id}?provider=gogoanime`);
  const j = await r.json();
  const episodes: StreamEpisode[] = (j?.episodes || j?.results || []).map((e: any) => ({ id: e.id || e.episodeId || String(e.number), number: e.number || e.episodeNumber || e.id, title: e.title, isDub: e.isDub || e.language === 'dub' }));
  const hasDub = episodes.some((e) => e.isDub);
  return { id: j?.id ?? id, title: j?.title, malId: j?.malId || j?.mal_id, episodes, hasDub } as StreamInfo;
}

export async function streamWatchEpisode(episodeId: string, server = 'gogocdn'): Promise<{ sources: { url: string; quality?: string }[]; subtitles?: any[] }>{
  const r = await fetch(`/api/stream/watch/${encodeURIComponent(episodeId)}?server=${server}&provider=gogoanime`);
  const j = await r.json();
  const sources = j?.sources || [];
  const subtitles = j?.subtitles || [];
  return { sources, subtitles };
}
