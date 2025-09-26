import { useTheme } from "./context/useTheme";
import { THEME } from "./context/types";
import { ThemeToggleButton } from "./ThemeToggleButton";
import clsx from "clsx";

export const Navbar = () => {
  const { theme } = useTheme();

  const isLightMode = theme === THEME.Light;
  return (
    <nav
      className={clsx(
        "p-4 mt-28 w-full flex justify-end",
        isLightMode ? "bg-white" : "bg-black"
      )}
    >
      <ThemeToggleButton />
    </nav>
  );
};
