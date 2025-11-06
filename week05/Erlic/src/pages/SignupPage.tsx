import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ACCESS_TOKEN_KEY, AUTH_PROFILE_KEY } from "../constants/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { signupSchema, type SignupFormValues } from "../types/auth";

type Step = 1 | 2 | 3;

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authToken, setAuthToken] = useLocalStorage<string>(ACCESS_TOKEN_KEY, null);
  const [, setAuthProfile] = useLocalStorage<{
    provider: "local" | "google";
    email?: string;
    nickname?: string;
  }>(AUTH_PROFILE_KEY, null);
  const redirectPath = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from ?? "/popular";
  }, [location.state]);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      nickname: "",
    },
  });

  const values = watch();

  const handleEmailNext = async () => {
    const valid = await trigger("email");
    if (valid) {
      setStep(2);
    }
  };

  const handlePasswordNext = async () => {
    const valid = await trigger(["password", "confirmPassword"]);
    if (valid) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep((prev) => {
      if (prev === 3) return 2;
      if (prev === 2) return 1;
      return 1;
    });
  };

  useEffect(() => {
    if (authToken) {
      navigate(redirectPath, { replace: true });
    }
  }, [authToken, navigate, redirectPath]);

  const onSubmit = handleSubmit((formValues: SignupFormValues) => {
    const encodedToken =
      typeof window !== "undefined"
        ? window.btoa(`${formValues.email}:${formValues.password}`)
        : `${formValues.email}-token`;
    setAuthToken(`basic-${encodedToken}`);
    setAuthProfile({
      provider: "local",
      email: formValues.email,
      nickname: formValues.nickname,
    });
    navigate(redirectPath, { replace: true });
  });

  const progress = useMemo(() => {
    if (step === 1) return 33;
    if (step === 2) return 66;
    return 100;
  }, [step]);

  const trimmedEmail = values.email.trim();
  const trimmedNickname = values.nickname.trim();
  const isEmailStepValid = trimmedEmail.length > 0 && !errors.email;
  const isPasswordStepValid =
    values.password.length >= 6 &&
    values.confirmPassword.length >= 6 &&
    values.password === values.confirmPassword &&
    !errors.password &&
    !errors.confirmPassword;
  const isNicknameStepValid = trimmedNickname.length > 0 && !errors.nickname;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-white to-indigo-100 px-6 py-12">
      {step > 1 ? (
        <button
          type="button"
          onClick={handleBack}
          className="absolute left-6 top-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl font-light text-slate-700 shadow-sm transition hover:-translate-x-0.5 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          aria-label="이전 단계로 돌아가기"
        >
          &lt;
        </button>
      ) : null}

      <div className="w-full max-w-xl space-y-10 rounded-3xl border border-white/70 bg-white/80 px-10 pb-12 pt-14 shadow-2xl backdrop-blur">
        <header className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">
            create account
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            회원가입을 시작해볼까요?
          </h1>
          <p className="text-sm text-slate-500">
            단계별 정보를 입력하면 나만의 맞춤형 영화 서비스를 이용할 수 있어요.
          </p>

          <div className="mx-auto mt-4 h-2 w-48 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-slate-400">
            Step {step} / 3
          </p>
        </header>

        <form className="space-y-8" onSubmit={onSubmit} noValidate>
          {step === 1 ? (
            <section className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="signup-email"
                  className="text-sm font-medium text-slate-700"
                >
                  이메일 주소
                </label>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className={`w-full rounded-2xl border px-5 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    errors.email
                      ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                      : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-300"
                  }`}
                />
                {errors.email ? (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                ) : (
                  <p className="text-xs text-slate-400">
                    가입 완료 후 이 계정으로 로그인하게 돼요.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleEmailNext}
                disabled={!isEmailStepValid}
                className={`w-full rounded-2xl px-4 py-3 text-base font-semibold text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isEmailStepValid
                    ? "bg-slate-900 hover:-translate-y-0.5 hover:bg-slate-800 focus:ring-slate-900"
                    : "cursor-not-allowed bg-slate-300 text-slate-500 focus:ring-0"
                }`}
              >
                다음
              </button>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="space-y-6">
              <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50 px-6 py-4 text-left">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">
                    이메일
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {values.email}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-indigo-500 underline"
                  onClick={() => setStep(1)}
                >
                  수정하기
                </button>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signup-password"
                  className="text-sm font-medium text-slate-700"
                >
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="6자 이상 입력해주세요."
                    {...register("password")}
                    className={`w-full rounded-2xl border px-5 py-3 pr-12 text-sm font-medium text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      errors.password
                        ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                        : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-lg"
                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">
                    영문, 숫자, 특수문자를 조합하면 더 안전해요.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signup-confirm-password"
                  className="text-sm font-medium text-slate-700"
                >
                  비밀번호 재확인
                </label>
                <div className="relative">
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="비밀번호를 한 번 더 입력해주세요."
                    {...register("confirmPassword")}
                    className={`w-full rounded-2xl border px-5 py-3 pr-12 text-sm font-medium text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      errors.confirmPassword
                        ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                        : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-lg"
                    aria-label={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showConfirmPassword ? "👁️" : "🙈"}
                  </button>
                </div>
                {errors.confirmPassword ? (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">
                    방금 입력한 비밀번호와 동일한지 확인해주세요.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-1/2 rounded-2xl border border-slate-200 px-4 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={handlePasswordNext}
                  disabled={!isPasswordStepValid}
                  className={`w-1/2 rounded-2xl px-4 py-3 text-base font-semibold text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isPasswordStepValid
                      ? "bg-slate-900 hover:-translate-y-0.5 hover:bg-slate-800 focus:ring-slate-900"
                      : "cursor-not-allowed bg-slate-300 text-slate-500 focus:ring-0"
                  }`}
                >
                  다음
                </button>
              </div>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="space-y-6">
              <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50 px-6 py-4 text-left">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">
                    이메일
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {values.email}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-indigo-500 underline"
                  onClick={() => setStep(1)}
                >
                  변경
                </button>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/80 px-6 py-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
                  🙂
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    프로필 이미지는 아직 준비 중이에요.
                  </p>
                  <p className="text-xs text-slate-500">
                    다음 업데이트에서 업로드 기능이 제공될 예정입니다.
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                  disabled
                >
                  준비중
                </button>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signup-nickname"
                  className="text-sm font-medium text-slate-700"
                >
                  닉네임
                </label>
                <input
                  id="signup-nickname"
                  type="text"
                  autoComplete="nickname"
                  placeholder="다른 사용자에게 보일 이름을 입력하세요."
                  {...register("nickname")}
                  className={`w-full rounded-2xl border px-5 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    errors.nickname
                      ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                      : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-300"
                  }`}
                />
                {errors.nickname ? (
                  <p className="text-sm text-red-500">
                    {errors.nickname.message}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">
                    10자 이내의 간단한 닉네임을 추천드려요.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-1/2 rounded-2xl border border-slate-200 px-4 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
                >
                  이전
                </button>
                <button
                  type="submit"
                  disabled={!isNicknameStepValid || isSubmitting}
                  className={`w-1/2 rounded-2xl px-4 py-3 text-base font-semibold text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isNicknameStepValid
                      ? "bg-indigo-600 hover:-translate-y-0.5 hover:bg-indigo-500 focus:ring-indigo-600"
                      : "cursor-not-allowed bg-slate-300 text-slate-500 focus:ring-0"
                  }`}
                >
                  회원가입 완료
                </button>
              </div>
            </section>
          ) : null}
        </form>
      </div>
    </div>
  );
}
