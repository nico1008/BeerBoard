"use client";

import { useEffect } from "react";

type Theme = "light" | "dark" | "system";

function applyTheme(nextTheme: Theme) {
  document.documentElement.dataset.theme = nextTheme === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : nextTheme;
}

export function ThemeControl({ initialTheme = "system", name = "theme" }: { initialTheme?: Theme; name?: string }) {
  function updateTheme(nextTheme: Theme) {
    localStorage.setItem("beerboard-theme", nextTheme);
    applyTheme(nextTheme);
  }

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => {
      if (localStorage.getItem("beerboard-theme") === "system") applyTheme("system");
    };
    media.addEventListener("change", updateSystemTheme);
    return () => media.removeEventListener("change", updateSystemTheme);
  }, []);

  return (
    <select className="select" name={name} defaultValue={initialTheme} onChange={(event) => updateTheme(event.target.value as Theme)}>
      <option value="system">Use device setting</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}
