import { AuthHeader } from '../components/AuthHeader';
import { SocialLogin } from '../components/SocialLogin';
import useForm from '../hooks/useForm';
import { type UserSigninInformation, validateSignin } from '../utils/validate';

export const LoginPage = () => {

  const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
    initialValue: {
      email: "",
      password: "",
    },
    validate: validateSignin,
  });

  const handleSubmit = () => {
    console.log(values);
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) || //오류가 있으면 true
    Object.values(values).some((value) => value === "") || // 입력값이 비어있으면 true
    !values.email ||
    !values.password;

  return (
    <div className='flex flex-col items-center justify-center h-full gap-4'>
      <div className='flex flex-col gap-3 w-70'>
        <AuthHeader title="로그인" />
        <SocialLogin />

        <input 
          {...getInputProps('email')}
          type={'email'} 
          className={`border border-white bg-[#202020] w-full p-3 mb-2 focus:outline-none focus:border-[#ff00b3] rounded-lg text-white placeholder-gray-400
            ${errors?.email && touched?.email ? 'border-red-500': ''}`}
          placeholder={'이메일을 입력해주세요!'}
        />
        {errors?.email && touched?.email && (
          <div className='text-red-500 text-sm'>{errors.email}</div>
        )}
        <input 
          {...getInputProps('password')}
          type={'password'} 
          className={`border border-white bg-[#202020] w-full p-3 mb-2 focus:outline-none focus:border-[#ff00b3] rounded-lg text-white placeholder-gray-400
            ${errors?.password && touched?.password ? 'border-red-500': ''}`}
          placeholder={'비밀번호를 입력해주세요!'}
        />
        {errors?.password && touched?.password && (
          <div className='text-red-500 text-sm'>{errors.password}</div>
        )}
        <button 
          type='button' 
          onClick={handleSubmit} 
          disabled={isDisabled} 
          className='w-full bg-[#ff00b3] text-white py-3 rounded-md font-medium 
          hover:bg-[#b3007d] transition-colors cursor-pointer disabled:bg-[#202020] disabled:text-gray-500'>
            로그인
          </button>
        </div>
    </div>
  )
}
