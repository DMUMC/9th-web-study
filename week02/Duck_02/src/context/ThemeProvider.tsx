import type { PropsWithChildren } from "react";
import { useState } from "react";
import { THEME, type TTheme } from "./types";
import { ThemeContext } from "./context";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<TTheme>(THEME.Light);

  const toggleTheme = (): void => {
    setTheme((prevTheme: TTheme) =>
      prevTheme === THEME.Light ? THEME.Dark : THEME.Light
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
