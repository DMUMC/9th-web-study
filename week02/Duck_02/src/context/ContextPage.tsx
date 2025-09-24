import { Navbar } from "../Navbar";
import { ThemeContent } from "../ThemeContent";
import { ThemeProvider } from "./ThemeProvider";
export const ContextPage = () => {
  return (
    <ThemeProvider>
      <div className="flex flex-col items-center justify-center h-screen">
        <Navbar />
        <main className="flex-1 w-full">
          <ThemeContent />
        </main>
      </div>
    </ThemeProvider>
  );
};
