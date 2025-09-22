import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetchLatest, fetchPopular, fetchTrending, searchAnime, fetchByGenre, fetchByType } from "@/lib/animeApi";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GENRES: { name: string; id: number }[] = [
  { name: "Action", id: 1 },
  { name: "Adventure", id: 2 },
  { name: "Comedy", id: 4 },
  { name: "Drama", id: 8 },
  { name: "Fantasy", id: 10 },
  { name: "Romance", id: 22 },
  { name: "Sci-Fi", id: 24 },
];

export default function Index() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const [genre, setGenre] = useState<number>(GENRES[0].id);
  const [type, setType] = useState<string>("tv");

  const { data: trending, refetch: refetchTrending } = useQuery({ queryKey: ["trending"], queryFn: fetchTrending });
  const { data: popular, refetch: refetchPopular } = useQuery({ queryKey: ["popular"], queryFn: fetchPopular });
  const { data: latest, refetch: refetchLatest } = useQuery({ queryKey: ["latest"], queryFn: fetchLatest });
  const { data: results, refetch: refetchSearch } = useQuery({ queryKey: ["search", q], queryFn: () => searchAnime(q), enabled: !!q });

  const { data: byGenre } = useQuery({ queryKey: ["genre", genre], queryFn: () => fetchByGenre(String(genre)) });
  const { data: byType } = useQuery({ queryKey: ["type", type], queryFn: () => fetchByType(type) });

  useEffect(() => {
    refetchTrending();
    refetchPopular();
    refetchLatest();
    if (q) refetchSearch();
  }, [q, refetchTrending, refetchPopular, refetchLatest, refetchSearch]);

  const section = (title: string, items?: any[], emptyText?: string, extra?: React.ReactNode) => (
    <section className="mx-auto mt-10 w-full max-w-7xl px-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-3">{extra}<Button variant="ghost" className="text-xs">View all</Button></div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items?.length
          ? items.map((a) => <AnimeCard key={a.mal_id} anime={a} />)
          : <p className="col-span-full text-sm text-muted-foreground">{emptyText ?? "No items"}</p>}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background">
      <Hero trending={trending ?? []} />

      {q ? (
        section(`Search results for "${q}"`, results, "No results. Try another query.")
      ) : (
        <>
          {section("Trending now", trending, "No trending items available.")}
          {section("Popular", popular, "No popular items available.")}
          {section("Latest season", latest, "No latest items available.")}

          {section(
            "Browse by genre",
            byGenre,
            "No anime for this genre.",
            <div className="hidden gap-2 md:flex">
              {GENRES.map((g) => (
                <Button key={g.id} size="sm" variant={genre === g.id ? "default" : "outline"} onClick={() => setGenre(g.id)}>
                  {g.name}
                </Button>
              ))}
            </div>
          )}

          {section(
            "Categories",
            byType,
            "No items.",
            <div className="hidden gap-2 md:flex">
              {(["tv", "movie", "ova", "special"] as const).map((t) => (
                <Button key={t} size="sm" variant={type === t ? "default" : "outline"} onClick={() => setType(t)} className="capitalize">
                  {t}
                </Button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Hero({ trending }: { trending: any[] }) {
  if (!trending?.length) return null;

  return (
    <section className="relative isolate w-full overflow-hidden border-b bg-[radial-gradient(1200px_600px_at_10%_-20%,hsl(var(--primary)/0.25),transparent),radial-gradient(800px_400px_at_90%_-10%,hsl(var(--accent)/0.2),transparent)]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Watch anime free on <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">coanime</span></h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Minimal, fast, and beautiful anime streaming experience. Discover trending shows, explore seasons, and watch trailers.</p>
          </div>
        </div>
        <div className="relative">
          <Carousel opts={{ align: "start" }}>
            <CarouselContent>
              {trending.slice(0, 10).map((a) => (
                <CarouselItem key={a.mal_id} className={cn("basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4")}>
                  <a href={`/watch/${a.mal_id}`} className="group block overflow-hidden rounded-lg border bg-card/60 shadow transition-colors">
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <img src={a.images?.jpg?.large_image_url || a.images?.jpg?.image_url} alt={a.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/0 to-transparent" />
                    </div>
                    <div className="p-3">
                      <div className="line-clamp-1 text-sm font-semibold">{a.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{a.year || ""}</div>
                    </div>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
