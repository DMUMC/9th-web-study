import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod"
import { AuthHeader } from "../components/AuthHeader";
import { SocialLogin } from "../components/SocialLogin";
import { postSignup } from "../apis/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
  })

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {passwordCheck, ...rest} = data;
    const response = await postSignup(rest)
    console.log(response)
    navigate('/'); 
  }

  const handleNextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger("email");
    } else if (step === 2) {
      isValid = await trigger(["password", "passwordCheck"]);
    }
    
    if (isValid) {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-full gap-4 bg-white'>
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-3 w-70 my-12'>
        <AuthHeader title="회원가입" />
        
        {step === 1 && (
          <SocialLogin />
        )}

        {step === 1 && (
          <>
            <input 
              {...register('email')}
              type={'email'} 
              className={`border border-black bg-white w-full p-3 focus:outline-none focus:border-[#4562D6] rounded-lg text-sm text-black placeholder-gray-400
                ${errors?.email ? 'border-red-500': ''}`}
              placeholder={'이메일을 입력해주세요'}
            />
            {errors.email && <div className={`text-red-500 text-sm`}>{errors.email.message}</div>}
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-4">
              <label className="text-sm text-gray-400">이메일</label>
              <p className="text-lg font-medium text-gray-200">{getValues('email')}</p>
            </div>
            <div className="relative w-full">
              <input 
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className={`border border-black bg-white w-full p-3 focus:outline-none focus:border-[#4562D6] rounded-lg text-sm text-black placeholder-gray-400
                  ${errors?.password ? 'border-red-500': ''}`}
                placeholder={'비밀번호를 입력해주세요'}
              />
              <div 
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <FaEyeSlash color="gray" /> : <FaEye color="gray" />}
              </div>
            </div>
            {errors.password && <div className={`text-red-500 text-sm`}>{errors.password.message}</div>}
            <div className="relative w-full">
              <input 
                {...register('passwordCheck')}
                type={showPasswordCheck ? 'text' : 'password'}
                className={`border border-black bg-white w-full p-3 mt-2 focus:outline-none focus:border-[#4562D6] rounded-lg text-sm text-black placeholder-gray-400
                  ${errors?.passwordCheck ? 'border-red-500': ''}`}
                placeholder={'비밀번호를 다시 한 번 입력해주세요'}
              />
              <div 
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPasswordCheck(prev => !prev)}
              >
                {showPasswordCheck ? <FaEyeSlash color="gray" /> : <FaEye color="gray" />}
              </div>
            </div>
            {errors.passwordCheck && <div className={`text-red-500 text-sm`}>{errors.passwordCheck.message}</div>}
          </>
        )}

        {step === 3 && (
          <>
            <input 
              {...register('name')}
              type={'text'}
              className={`border border-black bg-white w-full p-3 focus:outline-none focus:border-[#4562D6] rounded-lg text-sm text-black placeholder-gray-400
                ${errors?.name ? 'border-red-500': ''}`}
              placeholder={'닉네임을 입력해주세요'}
            />
            {errors.name && <div className={`text-red-500 text-sm`}>{errors.name.message}</div>}
          </>
        )}

        {step < 3 ? (
          <button 
            type='button' 
            onClick={handleNextStep} 
            disabled={
              (step === 1 && (!!errors.email || getValues('email') === '')) ||
              (step === 2 && (!!errors.password || !!errors.passwordCheck || getValues('password') === '' || getValues('passwordCheck') === ''))
            }
            className='w-full bg-[#4562D6] text-white py-3 mt-2 rounded-md font-medium 
            hover:bg-[#4562D6] transition-colors cursor-pointer disabled:bg-[#202020] disabled:text-gray-500'>
              다음
          </button>
        ) : (
          <button 
            type='submit' 
            disabled={isSubmitting || !!errors.name || getValues('name') === ''} 
            className='w-full bg-[#4562D6] text-white py-3 mt-2 rounded-md font-medium 
            hover:bg-[#4562D6] transition-colors cursor-pointer disabled:bg-[#202020] disabled:text-gray-500'>
              회원가입 완료
          </button>
        )}
      </form>
    </div>
  )
}