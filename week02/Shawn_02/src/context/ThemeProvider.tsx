import { createContext, useContext, useState } from "react";

interface ThemeContextType {
    theme: 'light' | 'dark'
    setTheme: (theme: 'light' | 'dark') => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>("light")
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useThemeContext = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("ThemeContext must be used within a ThemeProvider")
    }
    return context
}
