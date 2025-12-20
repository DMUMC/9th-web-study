// src/utils/validation.ts
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
  password: z.string().min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
  confirmPassword: z.string().min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
  name: z.string().min(2, { message: "닉네임은 2자 이상 입력해주세요." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;


export const loginSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
  password: z.string().min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
});

export type LoginFormData = z.infer<typeof loginSchema>;