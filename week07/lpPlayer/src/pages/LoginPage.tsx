import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { authStore } from "../authStore";
import { postSignin } from "../apis/auth";
import { AuthHeader } from "../components/AuthHeader";
import { SocialLogin } from "../components/SocialLogin";
import { API_ORIGIN } from "../config/api";
import { useMutation } from "@tanstack/react-query";

const schema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
  password: z.string().min(1, { message: "비밀번호를 입력해주세요." }),
});

type FormFields = z.infer<typeof schema>;

type RedirectState = {
  from?: {
    pathname: string;
    search?: string;
    hash?: string;
  } | null;
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const fromState = location.state as RedirectState | null;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: 'onChange', 
  });

  const { mutateAsync: signin, isPending } = useMutation({
    mutationFn: postSignin,
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;
      if (!accessToken || !refreshToken) {
        throw new Error("토큰 정보가 없습니다.");
      }
      authStore.setTokens(accessToken, refreshToken);
      const fallback =
        fromState?.from?.pathname
          ? `${fromState.from.pathname}${fromState.from.search ?? ''}${fromState.from.hash ?? ''}`
          : '/';
      navigate(fallback, { replace: true });
    },
    onError: () => {
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const handleGoogleLogin = () => {
    window.location.href = `${API_ORIGIN}/v1/auth/google/login`; // ✅ 절대경로로 이동
  };
  
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await signin(data);
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="rounded-2xl border border-neutral-800 bg-[#050505] px-8 py-10 shadow-[0_25px_60px_rgba(0,0,0,0.65)]">
        <AuthHeader title="로그인" />

        <SocialLogin onGoogleClick={handleGoogleLogin} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-5"
        >
          <div>
            <input
              {...register("email")}
              type="email"
              className={`w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-sm text-white placeholder:text-neutral-500 transition-colors focus:border-[#ff2b9c] focus:outline-none ${
                errors?.email ? "border-red-500" : ""
              }`}
              placeholder="이메일을 입력해주세요!"
            />
            {errors.email && (
              <p className="mt-2 text-xs text-[#ff6b81]">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div
              className={`relative flex items-center rounded-xl border border-neutral-700 bg-black transition-colors focus-within:border-[#ff2b9c] ${
                errors?.password ? "border-red-500" : ""
              }`}
            >
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none"
                placeholder="비밀번호를 입력해주세요!"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500 transition-colors hover:text-white"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-xs text-[#ff6b81]">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isPending}
            className="mt-2 w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:bg-neutral-950 disabled:text-neutral-600"
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
};
