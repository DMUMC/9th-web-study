// src/pages/MainPage.tsx
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { AuthProvider } from "../context/AutoContext";

export const MainPage = () => {
  return (
    <AuthProvider> 
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-neutral-900 text-white">
        <Outlet />
      </div>
    </AuthProvider>
  );
};