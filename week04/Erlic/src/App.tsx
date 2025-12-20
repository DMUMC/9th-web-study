import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MoviePage from "./pages/MoviePage";
import MovieDetailPage from "./pages/MovieDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<Layout />}>
        <Route path="/popular" element={<MoviePage category="popular" />} />
        <Route path="/upcoming" element={<MoviePage category="upcoming" />} />
        <Route path="/top-rated" element={<MoviePage category="top_rated" />} />
        <Route
          path="/now-playing"
          element={<MoviePage category="now_playing" />}
        />
        <Route path="/movies/:movieId" element={<MovieDetailPage />} />
      </Route>
    </Routes>
  );
}
