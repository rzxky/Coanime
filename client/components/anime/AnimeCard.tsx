import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Anime = {
  mal_id: number;
  title: string;
  images?: { jpg?: { image_url?: string; large_image_url?: string } };
  score?: number | null;
  type?: string | null;
  year?: number | null;
};

export function AnimeCard({ anime, className }: { anime: Anime; className?: string }) {
  const img = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  return (
    <a href={`/watch/${anime.mal_id}`} className={cn("group", className)}>
      <Card className="overflow-hidden border-muted/40 bg-card/60 backdrop-blur transition-colors">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {img ? (
            <img
              src={img}
              alt={anime.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">No image</div>
          )}
          {anime.score ? (
            <span className="absolute left-2 top-2 rounded-md bg-background/80 px-2 py-0.5 text-xs font-semibold text-foreground shadow ring-1 ring-border">⭐ {anime.score.toFixed(1)}</span>
          ) : null}
        </div>
        <CardContent className="p-3">
          <div className="line-clamp-1 text-sm font-medium text-foreground">{anime.title}</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            {anime.type ? <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">{anime.type}</Badge> : null}
            {anime.year ? <span>{anime.year}</span> : null}
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
