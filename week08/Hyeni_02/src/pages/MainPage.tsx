// src/pages/MainPage.tsx
import { Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AutoContext";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { FloatingAddButton } from "../components/FloatingAddButton";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useSidebar } from "../hooks/useSidebar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, 
      gcTime: 1000 * 60 * 30, 
      retry: 1,
    },
  },
});

export const MainPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider> 
        <MainPageContent />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

const MainPageContent = () => {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 text-white">
      <Navbar onToggleSidebar={toggle} />
      
      <div className="flex flex-1 overflow-hidden relative"> 
        <Sidebar isOpen={isOpen} onClose={close} />

        <main className="flex-1 flex justify-center items-start overflow-y-auto p-0 w-full">
          <Outlet />
        </main>
      </div>
      
      <ConditionalFloatingButton />
    </div>
  );
}

const ConditionalFloatingButton = () => {
  const { token } = useAuth(); 
  return token ? <FloatingAddButton /> : null;
};