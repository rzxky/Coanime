import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchInfo, fetchEpisodes, fetchRecommendations } from "@/lib/animeApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { useState } from "react";

export default function Watch() {
  const { id } = useParams();
  const { data } = useQuery({ queryKey: ["info", id], queryFn: () => fetchInfo(id!), enabled: !!id });
  const [page, setPage] = useState(1);
  const { data: eps } = useQuery({ queryKey: ["episodes", id, page], queryFn: () => fetchEpisodes(id!, page), enabled: !!id });
  const { data: recs } = useQuery({ queryKey: ["recs", id], queryFn: () => fetchRecommendations(id!), enabled: !!id });

  if (!data) return (
    <div className="mx-auto max-w-7xl px-4 py-12"><p className="text-muted-foreground">Loading...</p></div>
  );

  const bg = data.images?.jpg?.large_image_url || data.images?.jpg?.image_url;
  const yt = data.trailer?.youtube_id;

  return (
    <div className="min-h-screen">
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10">
          {bg ? <img src={bg} alt="background" className="h-full w-full object-cover opacity-20" /> : null}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
        </div>
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:gap-10">
          <div className="w-full md:w-2/3">
            <div className="aspect-video w-full overflow-hidden rounded-lg border bg-black">
              {yt ? (
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${yt}`}
                  title={data.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">Trailer unavailable</div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button asChild size="sm"><a href="#episodes">Episodes</a></Button>
              {data.score ? <Badge>⭐ {data.score}</Badge> : null}
              {data.status ? <Badge variant="secondary">{data.status}</Badge> : null}
              <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                {data.streaming?.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="rounded border px-2 py-1 hover:text-foreground">{s.name}</a>
                ))}
                {yt ? <a href={`https://www.youtube.com/watch?v=${yt}`} target="_blank" rel="noreferrer" className="rounded border px-2 py-1 hover:text-foreground">YouTube Trailer</a> : null}
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <h1 className="text-2xl font-bold">{data.title}</h1>
              {data.synopsis ? <p className="text-sm text-muted-foreground leading-6">{data.synopsis}</p> : null}
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {data.genres?.map((g) => <Badge key={g.name} variant="outline">{g.name}</Badge>)}
              </div>
            </div>
          </div>
          <aside className="w-full md:w-1/3">
            <div className="rounded-lg border p-4">
              <h2 className="mb-3 text-sm font-semibold">Details</h2>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <dt>Type</dt><dd className="text-foreground">{data.type || "—"}</dd>
                <dt>Episodes</dt><dd className="text-foreground">{data.episodes ?? "—"}</dd>
                <dt>Duration</dt><dd className="text-foreground">{data.duration ?? "—"}</dd>
                <dt>Season</dt><dd className="text-foreground">{data.season ?? "—"}</dd>
                <dt>Studios</dt><dd className="text-foreground">{data.studios?.map(s=>s.name).join(", ") || "—"}</dd>
                <dt>Producers</dt><dd className="text-foreground">{data.producers?.map(p=>p.name).join(", ") || "—"}</dd>
              </dl>
            </div>
          </aside>
        </div>
      </div>

      <div id="episodes" className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="mb-3 text-lg font-semibold">Episodes</h2>
        {eps?.data?.length ? (
          <div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {eps.data.map((e) => (
                <a key={e.mal_id} href={data.trailer?.url || "#"} target={data.trailer?.url ? "_blank" : undefined} rel="noreferrer" className="rounded-md border p-2 text-xs hover:bg-accent">
                  <div className="font-semibold">Ep {e.episode}</div>
                  <div className="mt-1 line-clamp-2 text-muted-foreground">{e.title || "Episode"}</div>
                </a>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
              <div className="text-xs text-muted-foreground">Page {page}</div>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
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
          <p className="text-sm text-muted-foreground">No suggestions available.</p>
        )}
      </div>
    </div>
  );
}
