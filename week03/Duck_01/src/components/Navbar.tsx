import { NavLink } from "react-router-dom";

export default function Navbar() {
  const LINKS = [
    {
      label: "Home",
      to: "/",
    },
    {
      label: "Popular",
      to: "/movies/popular",
    },
    {
      label: "Now Playing",
      to: "/movies/now_playing",
    },
  ];
  return (
    <div className="flex gap-3 p-4">
      {LINKS.map(({ label, to }) => (
        <NavLink
          key={label}
          to={to}
          className={({ isActive }) =>
            isActive ? "text-blue-500" : "text-gray-500"
          }
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
}
