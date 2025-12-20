import { THEME } from "./context/types";
import { useTheme } from "./context/useTheme";
import clsx from "clsx";

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  const isLightMode = theme === THEME.Light;
  return (
    <button
      onClick={toggleTheme}
      className={clsx("px-4 py-2 rounded-md transition-all", {
        "bg-black text-white": isLightMode,
        "bg-white text-black": !isLightMode,
      })}
    >
      {isLightMode ? "Dark Mode" : "Light Mode"}
    </button>
  ); 
};
