import { NavLink, Outlet, useLocation } from "react-router-dom";

export const Layout = () => {
  const location = useLocation();

  const isActiveCategory = (category: string) => {
    return location.pathname.includes(`/movie/${category}/`);
  };

  return (
    <>
      <div className="flex gap-4 p-8 ">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-xl ${
              isActive ? "font-bold text-emerald-600" : "text-gray-500"
            }`
          }
        >
          홈
        </NavLink>
        <NavLink
          to="/movie/popular/1"
          className={`text-xl ${
            isActiveCategory("popular")
              ? "font-bold text-emerald-600"
              : "text-gray-500"
          }`}
        >
          인기 영화
        </NavLink>
        <NavLink
          to="/movie/now_playing/1"
          className={`text-xl ${
            isActiveCategory("now_playing")
              ? "font-bold text-emerald-600"
              : "text-gray-500"
          }`}
        >
          상영중
        </NavLink>
        <NavLink
          to="/movie/top_rated/1"
          className={`text-xl ${
            isActiveCategory("top_rated")
              ? "font-bold text-emerald-600"
              : "text-gray-500"
          }`}
        >
          평점 높은
        </NavLink>
        <NavLink
          to="/movie/upcoming/1"
          className={`text-xl ${
            isActiveCategory("upcoming")
              ? "font-bold text-emerald-600"
              : "text-gray-500"
          }`}
        >
          개봉 예정
        </NavLink>
      </div>
      <Outlet />
    </>
  );
};
