import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-6xl font-extrabold text-transparent">404</h1>
        <p className="mb-4 text-sm text-muted-foreground">Page not found</p>
        <a href="/" className="text-sm font-medium text-primary hover:underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
