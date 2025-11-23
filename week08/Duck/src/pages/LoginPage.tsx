import { useEffect } from "react";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninInformation } from "../utils/validate";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useSignin from "../hooks/mutations/useSignin";

const LoginPage = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirect");
  const { mutate: signin, isPending } = useSignin();

  useEffect(() => {
    if (accessToken) {
      navigate(redirectTo ?? "/");
    }
  }, [accessToken, navigate, redirectTo]);

  const { values, errors, touched, getInutProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = () => {
    signin(values);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_SERVER_API_URL
    }/v1/auth/google/login`;
  };
  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-pink-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            뒤로가기
          </button>
          <h1 className="mb-2 text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            로그인
          </h1>
          <p className="text-gray-600">계정에 로그인하여 LP를 공유하세요</p>
        </div>

        <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-xl border border-gray-100">
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                {...getInutProps("email")}
                className={`w-full rounded-lg border px-4 py-3 transition-all focus:outline-none focus:ring-2 ${
                  errors?.email && touched?.email
                    ? "border-red-500 bg-red-50 focus:ring-red-200"
                    : "border-gray-300 bg-white focus:border-pink-500 focus:ring-pink-200"
                }`}
                type={"email"}
                placeholder={"이메일을 입력하세요"}
              />
              {errors?.email && touched?.email && (
                <div className="mt-1 text-sm text-red-500">{errors.email}</div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                {...getInutProps("password")}
                className={`w-full rounded-lg border px-4 py-3 transition-all focus:outline-none focus:ring-2 ${
                  errors?.password && touched?.password
                    ? "border-red-500 bg-red-50 focus:ring-red-200"
                    : "border-gray-300 bg-white focus:border-pink-500 focus:ring-pink-200"
                }`}
                type={"password"}
                placeholder={"비밀번호를 입력하세요"}
              />
              {errors?.password && touched?.password && (
                <div className="mt-1 text-sm text-red-500">
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isDisabled || isPending}
              className="mt-2 w-full rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-3 text-lg font-medium text-white shadow-md transition-all hover:from-pink-600 hover:to-purple-700 hover:shadow-lg hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:scale-100"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  로그인 중...
                </span>
              ) : (
                "로그인"
              )}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">또는</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-lg font-medium text-gray-700 transition-all hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>구글 로그인</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
