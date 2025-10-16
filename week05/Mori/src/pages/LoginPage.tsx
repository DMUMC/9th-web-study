import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { postSignin } from '../apis/auth';
import { AuthHeader } from '../components/AuthHeader';
import { SocialLogin } from '../components/SocialLogin';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthStore } from "../store/authStore";

const schema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
  password: z.string().min(1, { message: "비밀번호를 입력해주세요." }),
});

type FormFields = z.infer<typeof schema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { setLogin } = useAuthStore();

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting, isValid } 
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: 'onChange', 
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await postSignin(data)
      setLogin(response.data.accessToken)
      alert("로그인 성공!")
      navigate('/')
    } catch (error: unknown) {
      console.error("로그인 실패:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-full gap-4 bg-black'>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className='flex flex-col gap-3 w-70 my-12'
      >
        <AuthHeader title="로그인" />
        <SocialLogin />

        <input 
          {...register('email')}
          type={'email'} 
          className={`border border-white bg-[#202020] w-full p-3 focus:outline-none focus:border-[#ff00b3] rounded-lg text-white placeholder-gray-400
            ${errors?.email ? 'border-red-500': ''}`}
          placeholder={'이메일을 입력해주세요!'}
        />
        {errors.email && (
          <div className='text-red-500 text-sm'>{errors.email.message}</div>
        )}
        <div className="relative w-full mt-2">
          <input 
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            className={`border border-white bg-[#202020] w-full p-3 mt-2 focus:outline-none focus:border-[#ff00b3] rounded-lg text-white placeholder-gray-400
              ${errors?.password ? 'border-red-500': ''}`}
            placeholder={'비밀번호를 입력해주세요!'}
          />
          <div 
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? <FaEyeSlash color="gray" /> : <FaEye color="gray" />}
          </div>
        </div>
        {errors.password && (
            <div className='text-red-500 text-sm'>{errors.password.message}</div>
          )}
        <button 
          type='submit' 
          disabled={!isValid || isSubmitting}
          className='w-full bg-[#ff00b3] text-white py-3 rounded-md mt-2 font-medium 
          hover:bg-[#b3007d] transition-colors cursor-pointer disabled:bg-[#202020] disabled:text-gray-500'>
            {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  )
}
