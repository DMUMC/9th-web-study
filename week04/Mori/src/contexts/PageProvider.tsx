import React, { createContext, useContext, useState, useMemo } from 'react';

interface PageContextType {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export function PageProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState(1);

  const value = useMemo(() => ({ page, setPage }), [page]);

  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  );
}

export function usePage() {
  const context = useContext(PageContext);
  
  if (context === undefined) {
    throw new Error('usePage 훅은 PageProvider 내에서 사용되어야 합니다.');
  }
  
  return context;
}