import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN_KEY, AUTH_PROFILE_KEY, REFRESH_TOKEN_KEY } from "../constants/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function AuthCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useLocalStorage<string>(ACCESS_TOKEN_KEY, null);
  const [, setRefreshToken] = useLocalStorage<string>(REFRESH_TOKEN_KEY, null);
  const [, setAuthProfile] = useLocalStorage<{
    provider: "local" | "google";
    email?: string;
    nickname?: string;
  }>(AUTH_PROFILE_KEY, null);

  const [error, setError] = useState<string | null>(null);
  const [processed, setProcessed] = useState(false);

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  useEffect(() => {
    if (processed) {
      return;
    }

    const nextAccessToken =
      params.get("accessToken") ?? params.get("access_token") ?? undefined;
    const nextRefreshToken =
      params.get("refreshToken") ?? params.get("refresh_token") ?? undefined;
    const email = params.get("email") ?? undefined;
    const redirectParam = params.get("redirect");
    const stateParam = params.get("state");
    const redirectTarget =
      redirectParam
        ? decodeURIComponent(redirectParam)
        : stateParam
          ? decodeURIComponent(stateParam)
          : "/popular";
    const errorMessage = params.get("error") ?? undefined;

    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
      return;
    }

    if (!nextAccessToken) {
      setError("인증 토큰이 전달되지 않았습니다. 다시 시도해주세요.");
      return;
    }

    setAccessToken(nextAccessToken);
    setRefreshToken(nextRefreshToken ?? null);
    setAuthProfile({ provider: "google", email });

    setProcessed(true);
    navigate(redirectTarget, { replace: true });
  }, [
    navigate,
    processed,
    params,
    setAccessToken,
    setAuthProfile,
    setRefreshToken,
  ]);

  if (accessToken && !error) {
    return <Navigate to="/popular" replace />;
  }

  if (error) {
    return (
      <section className="mx-auto flex min-h-screen max-w-lg flex-col justify-center space-y-6 px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">로그인에 실패했어요</h1>
        <p className="text-sm text-slate-600">
          {error}
        </p>
        <button
          type="button"
          onClick={() => navigate("/login", { replace: true })}
          className="mx-auto inline-flex items-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          로그인 페이지로 돌아가기
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center space-y-4 px-6 py-12 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
      <p className="text-sm text-slate-500">구글 로그인 정보를 확인하고 있습니다…</p>
    </section>
  );
}
