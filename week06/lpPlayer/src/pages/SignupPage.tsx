import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { postSignup } from "../apis/auth";
import { AuthHeader } from "../components/AuthHeader";
import { SocialLogin } from "../components/SocialLogin";
import { API_ORIGIN } from "../config/api";

const schema = z.object({
  email: z.string().email({message: "올바른 이메일 형식이 아닙니다."}),
  password: z
    .string()
    .min(8, {
      message: "비밀번호는 8자 이상이어야 합니다."
    })
    .max(20, {
      message: "비밀번호는 20자 이하여야 합니다."
    }),
  passwordCheck: z
    .string()
    .min(8, {
      message: "비밀번호는 8자 이상이어야 합니다."
    })
    .max(20, {
      message: "비밀번호는 20자 이하여야 합니다."
    }),
  name: z
    .string()
    .min(1, { message: "닉네임을 입력해주세요." })
})
.refine((data) => data.password === data.passwordCheck, {
  message: "비밀번호가 일치하지 않습니다. ",
  path: ["passwordCheck"],
})

type FormFields = z.infer<typeof schema>;

export const SignupPage = () => {

  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordCheck, setShowPasswordCheck] = useState(false)

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      password: "",
      passwordCheck: "",
      name: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
    shouldUnregister: false,
  })

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const passwordCheckValue = watch("passwordCheck");
  const nameValue = watch("name");

  const handleGoogleLogin = () => {
    window.location.href = `${API_ORIGIN}/v1/auth/google/login`;
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordCheck, ...rest } = data;
    try {
      await postSignup(rest);
      alert("회원가입이 완료되었습니다.");
      navigate('/');
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }

  const handleNextStep = async () => {
    if (step === 1) {
      const isEmailValid = await trigger("email");
      if (isEmailValid) {
        setStep(prev => prev + 1);
      }
      return;
    }

    if (step === 2) {
      const arePasswordsValid = await trigger(["password", "passwordCheck"]);
      if (arePasswordsValid) {
        setStep(prev => prev + 1);
      }
      return;
    }

  };

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-neutral-800 bg-[#050505] px-8 py-10 text-white shadow-[0_25px_60px_rgba(0,0,0,0.65)]">
        <AuthHeader title="회원가입" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex flex-col gap-5"
        >
          {step === 1 && (
            <>
              <SocialLogin onGoogleClick={handleGoogleLogin} />

              <div>
                <input
                  {...register("email")}
                  type="email"
                  className={`w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-sm text-white placeholder:text-neutral-500 transition-colors focus:border-[#ff2b9c] focus:outline-none ${
                    errors?.email ? "border-red-500" : ""
                  }`}
                  placeholder="이메일을 입력해주세요"
                />
                {errors.email && (
                  <p className="mt-2 text-xs text-[#ff6b81]">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="rounded-xl border border-neutral-800 bg-black px-4 py-3 text-sm text-neutral-400">
                <span className="block text-xs text-neutral-500">이메일</span>
                <span className="text-base text-white">{getValues("email")}</span>
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
                    placeholder="비밀번호를 입력해주세요"
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

              <div>
                <div
                  className={`relative flex items-center rounded-xl border border-neutral-700 bg-black transition-colors focus-within:border-[#ff2b9c] ${
                    errors?.passwordCheck ? "border-red-500" : ""
                  }`}
                >
                  <input
                    {...register("passwordCheck")}
                    type={showPasswordCheck ? "text" : "password"}
                    className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none"
                    placeholder="비밀번호를 다시 한 번 입력해주세요"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500 transition-colors hover:text-white"
                    onClick={() => setShowPasswordCheck((prev) => !prev)}
                  >
                    {showPasswordCheck ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.passwordCheck && (
                  <p className="mt-2 text-xs text-[#ff6b81]">
                    {errors.passwordCheck.message}
                  </p>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <div>
              <input
                {...register("name")}
                type="text"
                className={`w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-sm text-white placeholder:text-neutral-500 transition-colors focus:border-[#ff2b9c] focus:outline-none ${
                  errors?.name ? "border-red-500" : ""
                }`}
                placeholder="닉네임을 입력해주세요"
              />
              {errors.name && (
                <p className="mt-2 text-xs text-[#ff6b81]">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={
              (step === 1 &&
                (!!errors.email || emailValue.trim() === "")) ||
              (step === 2 &&
                (!!errors.password ||
                  !!errors.passwordCheck ||
                  passwordValue.trim() === "" ||
                  passwordCheckValue.trim() === ""))
            }
            className="w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:bg-neutral-950 disabled:text-neutral-600"
          >
            다음
          </button>
        ) : (
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !!errors.name ||
              nameValue.trim() === ""
            }
            className="w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:bg-neutral-950 disabled:text-neutral-600"
          >
            회원가입 완료
          </button>
        )}
        </form>
      </div>
    </div>
  );
};
