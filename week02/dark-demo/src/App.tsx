// src/App.tsx
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

function PageShell() {
  const { theme } = useTheme();          // ✅ 현재 테마 읽기
  const isDark = theme === "dark";

  return (
    // ✅ dark: 변형 대신, 조건부로 Tailwind 클래스를 직접 적용
    <div className={isDark
      ? "min-h-screen w-screen bg-black text-zinc-100"
      : "min-h-screen w-screen bg-white text-zinc-900"
    }>
      <header className="max-w-3xl mx-auto p-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Dark Mode Demo</h1>
        <ThemeToggle />
      </header>

      {/* 테스트 바: 색 변화를 바로 눈으로 확인 */}
      <div className={isDark ? "h-12 bg-blue-800" : "h-12 bg-red-300"} />

      <main className="max-w-3xl mx-auto p-6 space-y-4">
        <p className={isDark ? "text-zinc-300" : "text-zinc-700"}>
          버튼을 누르면 배경의 색이 전환됩니다.
        </p>
        <div className={isDark
          ? "rounded-2xl border p-6 border-zinc-700"
          : "rounded-2xl border p-6 border-zinc-200"
        }>
          카드 박스도 색 전환이 일어납니다.
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PageShell />
    </ThemeProvider>
  );
}


