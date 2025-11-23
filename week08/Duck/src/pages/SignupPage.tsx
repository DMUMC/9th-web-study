import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { postSignup } from "../apis/auth";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    name: z.string().min(1, { message: "이름을 입력해 주세요" }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { passwordCheck, ...rest } = data;

    const response = await postSignup(rest);
    nav("/login");
    console.log(response);
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <button
            onClick={() => nav(-1)}
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
            회원가입
          </h1>
          <p className="text-gray-600">새 계정을 만들어 LP를 공유하세요</p>
        </div>

        <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-xl border border-gray-100">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                {...register("email")}
                className={`w-full rounded-lg border px-4 py-3 transition-all focus:outline-none focus:ring-2 ${
                  errors?.email
                    ? "border-red-500 bg-red-50 focus:ring-red-200"
                    : "border-gray-300 bg-white focus:border-pink-500 focus:ring-pink-200"
                }`}
                type={"email"}
                placeholder={"이메일을 입력하세요"}
              />
              {errors?.email && (
                <div className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                {...register("password")}
                className={`w-full rounded-lg border px-4 py-3 transition-all focus:outline-none focus:ring-2 ${
                  errors?.password
                    ? "border-red-500 bg-red-50 focus:ring-red-200"
                    : "border-gray-300 bg-white focus:border-pink-500 focus:ring-pink-200"
                }`}
                type={"password"}
                placeholder={"비밀번호를 입력하세요 (8자 이상)"}
              />
              {errors?.password && (
                <div className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <input
                {...register("passwordCheck")}
                className={`w-full rounded-lg border px-4 py-3 transition-all focus:outline-none focus:ring-2 ${
                  errors?.passwordCheck
                    ? "border-red-500 bg-red-50 focus:ring-red-200"
                    : "border-gray-300 bg-white focus:border-pink-500 focus:ring-pink-200"
                }`}
                type={"password"}
                placeholder={"비밀번호를 다시 입력하세요"}
              />
              {errors?.passwordCheck && (
                <div className="mt-1 text-sm text-red-500">
                  {errors.passwordCheck.message}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                이름
              </label>
              <input
                {...register("name")}
                className={`w-full rounded-lg border px-4 py-3 transition-all focus:outline-none focus:ring-2 ${
                  errors?.name
                    ? "border-red-500 bg-red-50 focus:ring-red-200"
                    : "border-gray-300 bg-white focus:border-pink-500 focus:ring-pink-200"
                }`}
                type={"text"}
                placeholder={"이름을 입력하세요"}
              />
              {errors?.name && (
                <div className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-3 text-lg font-medium text-white shadow-md transition-all hover:from-pink-600 hover:to-purple-700 hover:shadow-lg hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:scale-100"
            >
              {isSubmitting ? (
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
                  회원가입 중...
                </span>
              ) : (
                "회원가입"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
