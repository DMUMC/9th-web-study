import axios from "axios";

const token = import.meta.env.VITE_TMDB_KEY as string | undefined;

if (!token) {
  // 개발 중 콘솔 경고만. 런타임에서 401 나오면 네트워크 탭 확인
  console.warn("[TMDB] VITE_TMDB_KEY is missing. Set v4 bearer token in .env");
}

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: token ? {
    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
    Accept: "application/json",
  } : {
    Accept: "application/json",
  },
});
