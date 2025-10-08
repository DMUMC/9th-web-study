import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";
import InPutCompoent from "../components/InPutCompoent";
import { useNavigate } from "react-router-dom";
type FormFields = z.infer<typeof schema>;

const schema = z
  .object({
    email: z.string().email({ message: "이메일 형식이 올바르지 않습니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하이어야 합니다." }),
    passwordCheck: z.string({ message: "비밀번호가 일치하지 않습니다." }),

    name: z.string().min(2, { message: "이름은 2자 이상이어야 합니다." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

export default function SignupPage() {
  const navigate = useNavigate();
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordCheck, ...rest } = data;
    const response = await postSignup(rest);
    console.log(response);
    navigate("/login");
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-full">
      <div className="flex flex-col gap-3">
        <InPutCompoent
          type="email"
          placeholder="Email"
          {...register("email")}
        />
        {/* <input
          {...register("email")}
          // name="email"
          className="border border-[#ccc] w-[300px] p-2 focus:border-[#333] rounded-md"
          type="email"
          placeholder="Email"
        /> */}
        {errors.email && (
          <div className="text-red-500 text-sm">{errors.email.message}</div>
        )}

        <InPutCompoent
          type="password"
          placeholder="password"
          {...register("password")}
        />
        {errors.password && (
          <div className="text-red-500 text-sm">{errors.password.message}</div>
        )}

        <InPutCompoent
          type="password"
          placeholder="passwordCheck"
          {...register("passwordCheck")}
        />

        {errors.passwordCheck && (
          <div className="text-red-500 text-sm">
            {errors.passwordCheck.message}
          </div>
        )}
        <InPutCompoent type="name" placeholder="name" {...register("name")} />

        {errors.name && (
          <div className="text-red-500 text-sm">{errors.name.message}</div>
        )}
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
