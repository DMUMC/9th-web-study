import { THEME } from '../context/ThemeProvider';

type Theme = typeof THEME[keyof typeof THEME];

type ThemeStyleSet = {
  [key in Theme]: string;
};

type ThemeClasses = {
  background: ThemeStyleSet;
  text: ThemeStyleSet;
  toggleButton: ThemeStyleSet;
  [key: string]: ThemeStyleSet;
};

export const themeClasses: ThemeClasses = {
  background: {
    [THEME.LIGHT]: 'bg-white',
    [THEME.DARK]: 'bg-gray-800',
  },
  text: {
    [THEME.LIGHT]: 'text-black',
    [THEME.DARK]: 'text-white',
  },
  toggleButton: {
    [THEME.LIGHT]: 'bg-white text-black',
    [THEME.DARK]: 'bg-black text-white',
  },
};