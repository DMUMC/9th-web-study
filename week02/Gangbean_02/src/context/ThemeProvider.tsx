import {
    createContext,
    useContext,
    useState,
    type PropsWithChildren,
} from 'react';

export type TTHEME = 'LIGHT' | 'DARK';

interface IThemeContextState {
    theme: TTHEME;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContextState | undefined>(
    undefined
);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const [theme, setTheme] = useState<TTHEME>('LIGHT');
    const toggleTheme = () => {
        setTheme((prev): TTHEME => (prev === 'LIGHT' ? 'DARK' : 'LIGHT'));
    };
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme은 themeProvider에 감싸져야 해!');
    }
    return context;
};
