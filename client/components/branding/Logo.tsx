import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <a href="/" className={cn("inline-flex items-center gap-2", className)} aria-label="coanime home">
      <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent text-background shadow-md ring-1 ring-primary/30">
        <span className="text-[10px] font-extrabold">co</span>
      </span>
      <span className="font-extrabold tracking-tight text-xl">
        <span className="text-foreground">anime</span>
      </span>
    </a>
  );
}
