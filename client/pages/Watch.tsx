import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchInfo, fetchRecommendations, fetchEpisodes, fetchByGenre, fetchPopular } from "@/lib/animeApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { useEffect, useMemo, useState } from "react";
import {
  streamInfoByAnilist,
  streamSearch,
  streamWatchEpisode,
  StreamEpisode,
  gogoSearch,
  gogoInfoById,
  gogoWatchEpisode,
} from "@/lib/streamApi";
import { VideoPlayer } from "@/components/player/VideoPlayer";

type ServerOption = "gogocdn" | "vidstreaming" | "streamsb";

export default function Watch() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["info", id],
    queryFn: () => fetchInfo(id!),
    enabled: !!id,
  });
  const { data: recs } = useQuery({
    queryKey: ["recs", id],
    queryFn: () => fetchRecommendations(id!),
    enabled: !!id,
  });

  const genreIds = useMemo(
    () => (data?.genres?.map((g) => g.mal_id).filter(Boolean) as number[] | undefined)?.join(",") || "",
    [data?.genres],
  );
  const { data: byGenreList } = useQuery({
    queryKey: ["byGenreForAnime", genreIds],
    queryFn: () => fetchByGenre(genreIds, 12),
    enabled: Boolean(genreIds),
  });
  const { data: popularFallback } = useQuery({
    queryKey: ["popular-fallback"],
    queryFn: () => fetchPopular(),
  });

  const title = data?.title || data?.titles?.[0]?.title;

  const { data: search } = useQuery({
    queryKey: ["stream-search", title],
    queryFn: () => streamSearch(title || ""),
    enabled: !!title,
  });

  const streamCandidate = useMemo(() => {
    if (!search?.length) return null;
    const withMal = search.find((s: any) => s.malId === data?.mal_id);
    return withMal || search[0];
  }, [search, data?.mal_id]);

  const { data: streamInfo } = useQuery({
    queryKey: ["stream-info", streamCandidate?.id],
    queryFn: () => streamInfoByAnilist(String(streamCandidate!.id)),
    enabled: !!streamCandidate?.id,
  });

  // Fallback to Gogo if meta/anilist returns no episodes
  const { data: gogoCandidates } = useQuery({
    queryKey: ["gogo-search", title],
    queryFn: () => gogoSearch(title || ""),
    enabled: !!title,
  });
  const gogoFirst = useMemo(
    () => (gogoCandidates && gogoCandidates[0]?.id ? gogoCandidates[0] : null),
    [gogoCandidates],
  );
  const { data: gogoInfo } = useQuery({
    queryKey: ["gogo-info", gogoFirst?.id],
    queryFn: () => gogoInfoById(String(gogoFirst!.id)),
    enabled: !!gogoFirst?.id && !streamInfo?.episodes?.length,
  });

  const [filter, setFilter] = useState<"sub" | "dub">("sub");
  const episodes: StreamEpisode[] = useMemo(() => {
    const base =
      (streamInfo?.episodes?.length
        ? streamInfo?.episodes
        : gogoInfo?.episodes) || [];
    return base.filter((e) => (filter === "dub" ? e.isDub : !e.isDub));
  }, [streamInfo?.episodes, gogoInfo?.episodes, filter]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentEpisode = episodes[currentIndex];

  const [server, setServer] = useState<ServerOption>("gogocdn");
  const { data: watch } = useQuery({
    queryKey: ["watch", currentEpisode?.id, server],
    queryFn: async () => {
      if (!currentEpisode?.id) return { sources: [] };
      // Prefer meta watch; fallback to gogo
      const meta = await streamWatchEpisode(currentEpisode.id, server).catch(
        () => ({ sources: [] }),
      );
      if (meta?.sources?.length) return meta;
      return gogoWatchEpisode(currentEpisode.id, server);
    },
    enabled: !!currentEpisode?.id,
  });

  // Jikan fallback list (for display only)
  const { data: jikanEps } = useQuery({
    queryKey: ["jikan-episodes", id],
    queryFn: () => fetchEpisodes(id!),
    enabled: !!id,
  });

  useEffect(() => {
    setCurrentIndex(0);
  }, [filter, streamInfo?.id]);

  if (!data)
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );

  const bg = data.images?.jpg?.large_image_url || data.images?.jpg?.image_url;
  const source =
    (watch?.sources || []).find((s: any) => String(s.url).includes("m3u8"))
      ?.url ||
    (watch?.sources?.[0]?.url ?? undefined);

  const nextEp = () =>
    setCurrentIndex((i) => Math.min(episodes.length - 1, i + 1));
  const prevEp = () => setCurrentIndex((i) => Math.max(0, i - 1));

  return (
    <div className="min-h-screen">
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10">
          {bg ? (
            <img
              src={bg}
              alt="background"
              className="h-full w-full object-cover opacity-20"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
        </div>
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:gap-10">
          <div className="w-full md:w-2/3">
            <VideoPlayer
              src={source}
              onNext={nextEp}
              onPrev={prevEp}
              title={title}
            />
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <div className="inline-flex rounded border p-1">
                <Button
                  size="sm"
                  variant={filter === "sub" ? "default" : "ghost"}
                  onClick={() => setFilter("sub")}
                >
                  Sub
                </Button>
                <Button
                  size="sm"
                  variant={filter === "dub" ? "default" : "ghost"}
                  onClick={() => setFilter("dub")}
                >
                  Dub
                </Button>
              </div>
              <div className="inline-flex rounded border p-1">
                {(
                  ["gogocdn", "vidstreaming", "streamsb"] as ServerOption[]
                ).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={server === s ? "secondary" : "ghost"}
                    onClick={() => setServer(s)}
                    className="capitalize"
                  >
                    {s}
                  </Button>
                ))}
              </div>
              <div className="ml-auto text-muted-foreground">
                Episode {currentEpisode?.number ?? "—"} /{" "}
                {episodes.length || "—"}
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <h1 className="text-2xl font-bold">{data.title}</h1>
              <div className="flex items-center gap-2 text-xs">
                <Badge variant={filter === "sub" ? "default" : "secondary"}>
                  SUB
                </Badge>
                <Badge variant={filter === "dub" ? "default" : "secondary"}>
                  DUB
                </Badge>
                {streamInfo?.hasDub ? (
                  <span className="text-muted-foreground">
                    (Both available)
                  </span>
                ) : (
                  <span className="text-muted-foreground">(Sub only)</span>
                )}
              </div>
              {data.synopsis ? (
                <p className="text-sm text-muted-foreground leading-6">
                  {data.synopsis}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {data.genres?.map((g) => (
                  <Badge key={g.name} variant="outline">
                    {g.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <aside className="w-full md:w-1/3">
            <div className="rounded-lg border p-4">
              <h2 className="mb-3 text-sm font-semibold">Details</h2>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <dt>Type</dt>
                <dd className="text-foreground">{data.type || "—"}</dd>
                <dt>Episodes</dt>
                <dd className="text-foreground">
                  {data.episodes ??
                    episodes.length ??
                    jikanEps?.data?.length ??
                    "—"}
                </dd>
                <dt>Duration</dt>
                <dd className="text-foreground">{data.duration ?? "—"}</dd>
                <dt>Season</dt>
                <dd className="text-foreground">{data.season ?? "—"}</dd>
                <dt>Studios</dt>
                <dd className="text-foreground">
                  {data.studios?.map((s) => s.name).join(", ") || "—"}
                </dd>
                <dt>Producers</dt>
                <dd className="text-foreground">
                  {data.producers?.map((p) => p.name).join(", ") || "—"}
                </dd>
              </dl>
            </div>
          </aside>
        </div>
      </div>

      <div id="episodes" className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="mb-3 text-lg font-semibold">
          Episodes ({episodes.length || jikanEps?.data?.length || 0})
        </h2>
        {episodes?.length ? (
          <div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {episodes.map((e, idx) => (
                <button
                  key={e.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`rounded-md border p-2 text-xs hover:bg-accent ${idx === currentIndex ? "bg-accent/40 border-accent" : ""}`}
                >
                  <div className="font-semibold">Ep {e.number}</div>
                  <div className="mt-1 line-clamp-2 text-muted-foreground">
                    {e.title || "Episode"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : jikanEps?.data?.length ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {jikanEps.data.map((e: any) => (
              <div
                key={e.mal_id}
                className="cursor-not-allowed rounded-md border p-2 text-xs opacity-70"
              >
                <div className="font-semibold">Ep {e.mal_id}</div>
                <div className="mt-1 line-clamp-2 text-muted-foreground">
                  {e.title || "Episode"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No episodes found.</p>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12">
        <h2 className="mb-4 text-lg font-semibold">Suggested anime</h2>
        {recs?.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {recs.map((a) => (
              <AnimeCard key={a.mal_id} anime={a as any} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No suggestions available.
          </p>
        )}
      </div>
    </div>
  );
}
