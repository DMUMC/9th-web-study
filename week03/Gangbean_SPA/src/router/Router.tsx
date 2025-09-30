import { createContext, useContext, useState, useEffect } from 'react';

const RouterContext = createContext<{ path: string }>({
    path: window.location.pathname,
});

export const Router = ({ children }: { children: React.ReactNode }) => {
    const [path, setPath] = useState(window.location.pathname);

    useEffect(() => {
        const handlePopState = () => {
            setPath(window.location.pathname);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    return (
        <RouterContext.Provider value={{ path }}>
            {children}
        </RouterContext.Provider>
    );
};

export const useRouter = () => useContext(RouterContext);
