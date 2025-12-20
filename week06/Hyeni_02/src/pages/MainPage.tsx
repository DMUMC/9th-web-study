// src/pages/MainPage.tsx
import { Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AutoContext";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { FloatingAddButton } from "../components/FloatingAddButton";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; 

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
  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 text-white">
      <Navbar onToggleSidebar={function (): void {
        throw new Error("Function not implemented.");
      } } />
      
      <div className="flex flex-1 overflow-hidden"> 
        <Sidebar />

        <main className="flex-1 flex justify-center items-start overflow-y-auto p-0">
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