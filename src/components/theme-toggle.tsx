import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

type Theme = "mocha" | "latte";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof localStorage !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme;
      if (savedTheme) {
        return savedTheme;
      }
    }
    if (typeof window !== "undefined") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "mocha";
      }
      return "latte";
    }
    return "latte";
  });

  const handleToggleClick = () => {
    setTheme((prevTheme) => (prevTheme === "latte" ? "mocha" : "latte"));
  };

  useEffect(() => {
    const element = document.documentElement;
    if (theme === "latte") {
      element.classList.remove("mocha");
    } else {
      element.classList.add("mocha");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={handleToggleClick}
      aria-label="Toggle theme"
      className="p-2 rounded-xl bg-ctp-latte-crust dark:bg-ctp-mocha-crust"
    >
      {theme === "mocha" ? <Sun className="sun" /> : <Moon className="moon" />}
    </button>
  );
}
