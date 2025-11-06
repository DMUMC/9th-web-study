import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export const HomeLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="border-b border-neutral-900">
        <Header />
      </header>
      <main className="flex-1 flex justify-center items-center px-4 py-12">
        <Outlet />
      </main>
    </div>
  );
};
