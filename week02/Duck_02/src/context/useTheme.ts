import { useContext } from "react";
import { ThemeContext } from "./context";
import type { IThemeContext } from "./types";

export const useTheme = (): IThemeContext => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
