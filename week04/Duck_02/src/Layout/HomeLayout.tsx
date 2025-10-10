import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="h-dvh flex flex-col">
      <nav>aa</nav>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer>cc</footer>
    </div>
  );
}
