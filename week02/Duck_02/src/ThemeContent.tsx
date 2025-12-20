import clsx from "clsx";
import { useTheme } from "./context/useTheme";
import { THEME } from "./context/types";

export const ThemeContent = () => {
  const { theme } = useTheme();

  const isLightMode = theme === THEME.Light;
  return (
    <div className={clsx("p-4 h-dvh", isLightMode ? "bg-white" : "bg-black")}>
      <h1
        className={clsx(
          "text-4xl font-bold",
          isLightMode ? "text-black" : "text-white"
        )}
      >
        Theme Context Example
      </h1>
      <p className={clsx("mt-4", isLightMode ? "text-black" : "text-white")}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </p>
    </div>
  );
};
