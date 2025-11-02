import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ACCESS_TOKEN_KEY, AUTH_PROFILE_KEY } from "../constants/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { loginSchema, type LoginFormValues } from "../types/auth";

const GOOGLE_LOGIN_URL = import.meta.env.VITE_AUTH_GOOGLE_LOGIN_URL;
const GOOGLE_REDIRECT_URL = import.meta.env.VITE_AUTH_GOOGLE_REDIRECT_URL;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authToken, setAuthToken] = useLocalStorage<string>(ACCESS_TOKEN_KEY, null);
  const [, setAuthProfile] = useLocalStorage<{
    provider: "local" | "google";
    email?: string;
    nickname?: string;
  }>(AUTH_PROFILE_KEY, null);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const redirectPath = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from ?? "/popular";
  }, [location.state]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSuccessfulLogin = useCallback(
    (values: LoginFormValues) => {
      const encodedToken =
        typeof window !== "undefined"
          ? window.btoa(`${values.email}:${values.password}`)
          : `${values.email}-token`;

      setAuthToken(`basic-${encodedToken}`);
      setAuthProfile({ provider: "local", email: values.email });
      navigate(redirectPath, { replace: true });
    },
    [navigate, redirectPath, setAuthProfile, setAuthToken],
  );

  useEffect(() => {
    if (authToken) {
      navigate(redirectPath, { replace: true });
    }
  }, [authToken, navigate, redirectPath]);

  const onSubmit = handleSubmit(handleSuccessfulLogin);

  const handleGoogleLogin = () => {
    if (!GOOGLE_LOGIN_URL) {
      setGoogleError("Google 로그인 URL이 설정되지 않았습니다. .env 값을 확인해주세요.");
      return;
    }

    const redirectUri =
      GOOGLE_REDIRECT_URL ??
      (typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : "");

    if (!redirectUri) {
      setGoogleError("Redirect URL을 계산할 수 없습니다. 브라우저 환경에서 다시 시도해주세요.");
      return;
    }

    const loginUrl = new URL(GOOGLE_LOGIN_URL);
    const encodedRedirect = encodeURIComponent(redirectPath);
    loginUrl.searchParams.set("redirect_uri", redirectUri);
    loginUrl.searchParams.set("state", encodedRedirect);
    loginUrl.searchParams.set("redirect", encodedRedirect);

    setGoogleError(null);
    window.location.href = loginUrl.toString();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-6 py-12">
      <button
        type="button"
        onClick={() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate("/popular", { replace: true });
          }
        }}
        className="absolute left-6 top-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl font-light text-slate-700 shadow-sm transition hover:-translate-x-0.5 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        aria-label="이전 페이지로 돌아가기"
      >
        &lt;
      </button>

      <div className="w-full max-w-md space-y-10 rounded-3xl border border-white/70 bg-white/80 px-10 pb-12 pt-14 shadow-2xl backdrop-blur">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">
            welcome back
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            다시 만나서 반가워요 👋
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            계정에 로그인하고 맞춤형 영화 추천을 확인해보세요.
          </p>
        </header>

        <form className="space-y-7" onSubmit={onSubmit} noValidate>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              {...register("email")}
              className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                errors.email
                  ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                  : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-300"
              }`}
            />
            {errors.email ? (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            ) : (
              <p className="text-xs text-slate-400">
                가입 시 사용한 이메일 주소를 입력해주세요.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="6자 이상 입력하세요."
              {...register("password")}
              className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                errors.password
                  ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                  : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-300"
              }`}
            />
            {errors.password ? (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            ) : (
              <p className="text-xs text-slate-400">
                안전한 계정을 위해 특수문자와 숫자를 함께 사용해보세요.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full rounded-2xl px-4 py-3 text-base font-semibold text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isValid
                ? "bg-slate-900 hover:-translate-y-0.5 hover:bg-slate-800 focus:ring-slate-900"
                : "cursor-not-allowed bg-slate-300 text-slate-500 focus:ring-0"
            }`}
          >
            로그인
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-200" />
          <span className="relative mx-auto block w-fit bg-white/80 px-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            또는
          </span>
        </div>

        <div className="flex w-full flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4"
              >
                <path
                  fill="#4285F4"
                  d="M23.52 12.273c0-.815-.073-1.6-.209-2.353H12v4.444h6.46a5.52 5.52 0 0 1-2.396 3.616v2.998h3.868c2.27-2.088 3.588-5.166 3.588-8.705z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.956-1.073 7.941-2.922l-3.868-2.998c-1.079.724-2.46 1.153-4.073 1.153-3.132 0-5.784-2.115-6.73-4.968H1.222v3.118A11.994 11.994 0 0 0 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.265A7.214 7.214 0 0 1 4.9 12c0-.79.136-1.56.37-2.265V6.617H1.222A11.994 11.994 0 0 0 0 12c0 1.927.46 3.748 1.222 5.383l4.048-3.118z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.773c1.76 0 3.338.605 4.582 1.793l3.437-3.437C17.953 1.16 15.24 0 12 0 7.332 0 3.267 2.69 1.222 6.617l4.048 3.118C6.216 6.888 8.868 4.773 12 4.773z"
                />
              </svg>
            </span>
            구글로 로그인
          </button>
          {googleError ? (
            <p className="text-xs font-medium text-red-500">{googleError}</p>
          ) : (
            <p className="text-xs text-slate-400">
              구글 계정으로 빠르게 로그인할 수 있어요.
            </p>
          )}
        </div>

        <footer className="text-center text-xs text-slate-400">
          계정이 없으신가요?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-500 underline underline-offset-2"
          >
            지금 가입하기
          </Link>
        </footer>
      </div>
    </div>
  );
}
