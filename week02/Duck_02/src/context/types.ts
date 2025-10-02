export const THEME = {
  Light: "LIGHT",
  Dark: "DARK",
} as const;

export type TTheme = typeof THEME[keyof typeof THEME];

export interface IThemeContext {
  theme: TTheme;
  toggleTheme: () => void;
}
