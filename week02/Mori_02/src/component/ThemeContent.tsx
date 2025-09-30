import clsx from "clsx";
import { THEME, useTheme } from "../context/ThemeProvider";

export default function ThemeContent() {
  const { theme, toggleTheme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <div 
      className={clsx('p-4 h-dvh', isLightMode ? 'bg-white' : 'bg-gray-800')}
    >
      <h1 className={clsx(
        'text-2xl font-bold',
        isLightMode ? 'text-black' : 'text-white'
      )}
      >
        Theme Content
      </h1>
      <p className={clsx('mt-2', isLightMode ? 'text-black' : 'text-white')}>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi, rem 
        eius. Deserunt praesentium ut tempore asperiores sed ab architecto. 
        Exercitationem, blanditiis fugit itaque sint deserunt unde deleniti 
        at praesentium fuga!
      </p>
    </div>
  )
}
