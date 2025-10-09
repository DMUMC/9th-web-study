import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import MoviePage from "./pages/MoviePage";
import MovieDetailPage from "./pages/MovieDetailPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MoviePage category="popular" />} />
        <Route path="/popular" element={<MoviePage category="popular" />} />
        <Route path="/upcoming" element={<MoviePage category="upcoming" />} />
        <Route path="/top-rated" element={<MoviePage category="top_rated" />} />
        <Route path="/now-playing" element={<MoviePage category="now_playing" />} />
              <Route path="/movies/:movieId" element={<MovieDetailPage />} />
      </Route>
    </Routes>
  );
}
