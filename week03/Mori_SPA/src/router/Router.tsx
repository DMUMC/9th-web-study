import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface RouterContextType {
    path: string;
    changePath: (newPath: string) => void;
}

export const RouterContext = createContext<RouterContextType>(undefined!);

interface RouterProps {
  children: ReactNode;
}

export const Router = ({ children }: RouterProps) => {
  const [path, setPath] = useState(window.location.pathname);

  // popstate 이벤트
  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const changePath = useCallback((newPath: string) => {
    history.pushState({ path: newPath }, '', newPath);
    setPath(newPath);
  }, []);

  const value = { path, changePath };

  return (
    <RouterContext.Provider value={value}>
      {children}
    </RouterContext.Provider>
  );
};