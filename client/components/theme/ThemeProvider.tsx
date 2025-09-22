import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";

type ThemeContextType = {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = "coanime_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved === "light" || saved === "dark") applyTheme(saved);
    else applyTheme("dark");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyTheme = (next: ThemeMode) => {
    const root = document.documentElement;
    root.classList.remove("dark");
    if (next === "dark") root.classList.add("dark");
    localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
  };

  const value = useMemo(() => ({ theme, setTheme: applyTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
