export function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted-foreground">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p>
            © {new Date().getFullYear()} coanime. Built for anime fans.
          </p>
          <nav className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
