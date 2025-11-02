import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";

type LoginFormValues = {
  email: string;
  password: string;
};

const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

type GoogleCredentialResponse = {
  credential: string;
  clientId?: string;
  select_by?: string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            container: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
          prompt: () => void;
          cancel: () => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginPage() {
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const handleSuccessfulLogin = useCallback(
    (values: LoginFormValues) => {
      console.info("로그인 요청", values);
      navigate("/popular", { replace: true });
    },
    [navigate],
  );

  const handleGoogleCredential = useCallback(
    (response: GoogleCredentialResponse) => {
      if (!response?.credential) {
        setGoogleError("구글 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      console.info("구글 로그인 성공", response);
      navigate("/popular", { replace: true });
    },
    [navigate],
  );

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setGoogleError("Google Client ID가 설정되지 않았습니다.");
      return;
    }

    let scriptElement: HTMLScriptElement | null = null;

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) {
        setGoogleError("Google Identity Services를 불러오지 못했습니다.");
        return;
      }

      setGoogleError(null);

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      });

      const container = googleButtonRef.current;
      if (container) {
        container.innerHTML = "";
        window.google.accounts.id.renderButton(container, {
          theme: "outline",
          size: "large",
          width: container.offsetWidth || 320,
          shape: "pill",
          text: "signin_with",
        });
      }

      window.google.accounts.id.prompt();
    };

    const existingScript = document.getElementById(
      "google-identity-services",
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.google?.accounts?.id) {
        initializeGoogle();
      } else {
        existingScript.addEventListener("load", initializeGoogle);
      }

      return () => {
        existingScript.removeEventListener("load", initializeGoogle);
      };
    }

    scriptElement = document.createElement("script");
    scriptElement.id = "google-identity-services";
    scriptElement.src = "https://accounts.google.com/gsi/client";
    scriptElement.async = true;
    scriptElement.defer = true;
    scriptElement.onload = initializeGoogle;
    scriptElement.onerror = () => {
      setGoogleError("Google Identity Services 스크립트를 불러오지 못했습니다.");
    };
    document.head.appendChild(scriptElement);

    return () => {
      if (scriptElement) {
        scriptElement.onload = null;
        scriptElement.onerror = null;
      }
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [handleGoogleCredential]);

  const { register, errors, touched, isValid, handleSubmit } =
    useForm<LoginFormValues>({
      initialValues: {
        email: "",
        password: "",
      },
      validators: {
        email: (value) => {
          const trimmed = String(value).trim();
          if (!trimmed) {
            return "이메일을 입력해주세요.";
          }
          if (!EMAIL_PATTERN.test(trimmed)) {
            return "유효하지 않은 이메일 형식입니다.";
          }
          return "";
        },
        password: (value) => {
          const password = String(value);
          if (!password) {
            return "비밀번호를 입력해주세요.";
          }
          if (password.length < 6) {
            return "비밀번호는 최소 6자 이상이어야 합니다.";
          }
          return "";
        },
      },
      onSubmit: handleSuccessfulLogin,
    });

  const emailField = register("email");
  const passwordField = register("password");

  const emailError = touched.email && errors.email;
  const passwordError = touched.password && errors.password;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/popular", { replace: true });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-6 py-12">
      <button
        type="button"
        onClick={handleBack}
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

        <form className="space-y-7" onSubmit={handleSubmit()}>
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
              {...emailField}
              className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                emailError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                  : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-300"
              }`}
            />
            {emailError ? (
              <p className="text-sm text-red-500">{errors.email}</p>
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
              {...passwordField}
              className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                passwordError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                  : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-300"
              }`}
            />
            {passwordError ? (
              <p className="text-sm text-red-500">{errors.password}</p>
            ) : (
              <p className="text-xs text-slate-400">
                안전한 계정을 위해 특수문자와 숫자를 함께 사용해보세요.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid}
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
          <div
            ref={googleButtonRef}
            className="w-full max-w-xs shrink-0 self-center"
          />
          {googleError ? (
            <p className="text-xs font-medium text-red-500">{googleError}</p>
          ) : null}
        </div>

        <footer className="text-center text-xs text-slate-400">
          계정이 없으신가요?{" "}
          <span className="font-medium text-indigo-500">지금 가입하기</span>
        </footer>
      </div>
    </div>
  );
}
