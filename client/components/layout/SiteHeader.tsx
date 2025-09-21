import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Logo } from "@/components/branding/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Search } from "lucide-react";

export function SiteHeader() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState("");

  useEffect(() => {
    const qp = params.get("q") ?? "";
    setQ(qp);
  }, [params]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (query) navigate(`/?q=${encodeURIComponent(query)}`);
    else navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Logo />
        <nav className="ml-6 hidden items-center gap-4 text-sm md:flex">
          <a className="text-muted-foreground hover:text-foreground" href="/">Home</a>
          <a className="text-muted-foreground hover:text-foreground" href="/">Discover</a>
          <a className="text-muted-foreground hover:text-foreground" href="/">Genres</a>
        </nav>
        <form onSubmit={onSubmit} className="ml-auto flex w-full max-w-lg items-center gap-2">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search anime..."
              className="w-full pl-9"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search anime"
            />
          </div>
          <Button type="submit" variant="default">Search</Button>
          <ThemeToggle />
        </form>
      </div>
    </header>
  );
}
