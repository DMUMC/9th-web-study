import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "이메일을 입력해주세요." })
    .email("유효하지 않은 이메일 형식입니다."),
  password: z
    .string()
    .min(1, { message: "비밀번호를 입력해주세요." })
    .min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, { message: "이메일을 입력해주세요." })
      .email("올바른 이메일 형식을 입력해주세요."),
    password: z
      .string()
      .min(1, { message: "비밀번호를 입력해주세요." })
      .min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
    confirmPassword: z
      .string()
      .min(1, { message: "비밀번호를 다시 입력해주세요." })
      .min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
    nickname: z
      .string()
      .trim()
      .min(1, { message: "사용하실 닉네임을 입력해주세요." })
      .max(20, { message: "닉네임은 20자 이하여야 합니다." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
