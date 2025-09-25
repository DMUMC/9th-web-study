// src/components/ThemeToggle.tsx
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      aria-pressed={theme === "dark"}
      onClick={toggle}
      className="rounded-xl px-4 py-2 font-semibold transition
                 bg-zinc-800 text-white hover:opacity-90
                 dark:bg-zinc-200 dark:text-zinc-900"
      title="다크모드 토글"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
