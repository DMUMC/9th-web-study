import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const MainPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-neutral-900 text-white">
        <Outlet />
      </div>
    </>
  );
};