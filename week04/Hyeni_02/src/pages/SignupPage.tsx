import googleLogo from '../assets/Google__G__logo.svg';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { signupSchema, type SignupFormData } from '../utils/validation';

import eyeIcon from '../assets/eye.svg';
import eyeOffIcon from '../assets/eye-off.svg';

export const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, dirtyFields },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');

  const handleGoBack = () => {
    if (step === 1) navigate(-1);
    else setStep(prev => prev - 1);
  };

  const onSubmit = (data: SignupFormData) => {
    console.log('회원가입 데이터:', data);
    alert(`${data.nickname}님, 회원가입이 완료되었습니다!`);
    navigate('/');
  };

  return (
    <div className='flex flex-col gap-8 w-full max-w-sm'>
      <div className='flex justify-between items-center'>
        <button className='text-white w-10 text-2xl' onClick={handleGoBack}>{'<'}</button>
        <p className='text-2xl font-bold text-center'>회원가입</p>
        <div className='w-10'></div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* === 1단계: 이메일 === */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <button type="button" className='flex px-4 py-3 border border-gray-500 rounded-md items-center justify-center relative font-semibold'>
              <img src={googleLogo} alt="googleLogo" className='absolute left-4 w-5 h-5' />
              <p>구글 로그인</p>
            </button>
            <div className='relative text-center'><span className='bg-neutral-900 px-2 text-gray-400'>OR</span></div>
            <div>
              <input
                type="email"
                placeholder="이메일을 입력해주세요"
                className={`w-full bg-neutral-800 px-4 py-3 rounded-md border
                    ${errors.email ?
                        'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register('email')}
              />
              {errors.email && <p className="text-red-500 text-sm mt-2 ml-1">{errors.email.message}</p>}
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!!errors.email || !dirtyFields.email}
              className="bg-blue-600 text-white px-4 py-3 rounded-md font-bold disabled:bg-neutral-700 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}

        {/* === 2단계: 비밀번호 === */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div className='p-3 bg-neutral-800 rounded-md text-center text-gray-300 font-semibold'>{watch('email')}</div>
            <div>
              <div className={`relative flex items-center w-full bg-neutral-800 rounded-md border
                ${errors.password ?
                'border-red-500' : 'border-gray-600'} focus-within:ring-2 focus-within:ring-blue-500`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력해주세요"
                  className="w-full bg-transparent px-4 py-3 focus:outline-none"
                  {...register('password')}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="pr-4">
                  <img src={showPassword ? eyeIcon : eyeOffIcon} alt="toggle password visibility" className="w-6 h-6" />
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-2 ml-1">{errors.password.message}</p>}
            </div>
            <div>
              <div className={`relative flex items-center w-full bg-neutral-800 rounded-md border
                ${errors.confirmPassword || (passwordValue !== confirmPasswordValue && dirtyFields.confirmPassword)
                ? 'border-red-500' : 'border-gray-600'} focus-within:ring-2 focus-within:ring-blue-500`}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 다시 한번 입력해주세요"
                  className="w-full bg-transparent px-4 py-3 focus:outline-none"
                  {...register('confirmPassword')}
                />
                <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="pr-4">
                  <img src={showConfirmPassword ? eyeIcon : eyeOffIcon} alt="toggle password visibility" className="w-6 h-6" />
                </button>
              </div>
              {errors.confirmPassword ? (
                <p className="text-red-500 text-sm mt-2 ml-1">{errors.confirmPassword.message}</p>
              ) : (
                passwordValue !== confirmPasswordValue && dirtyFields.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2 ml-1">비밀번호가 일치하지 않습니다.</p>
                )
              )}
            </div>
             <button
              type="button"
              onClick={() => setStep(3)}
              disabled={
                // Zod의 길이 검사 등 기본 유효성 에러가 있거나
                !!errors.password || !!errors.confirmPassword ||
                // 두 필드에 아직 입력하지 않았거나
                !dirtyFields.password || !dirtyFields.confirmPassword ||
                // 두 필드의 값이 실시간으로 다르면 비활성화
                passwordValue !== confirmPasswordValue
              }
              className="bg-blue-600 text-white px-4 py-3 rounded-md font-bold disabled:bg-neutral-700 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}

        {/* === 3단계: 닉네임 === */}
        {step === 3 && (
           <div className="flex flex-col gap-6 items-center">
            <div className="w-24 h-24 bg-neutral-700 rounded-full flex items-center justify-center text-5xl">👤</div>
            <div>
              <input
                type="text"
                placeholder="닉네임을 입력해주세요"
                className={`w-full bg-neutral-800 px-4 py-3 rounded-md border text-center
                    ${errors.nickname ?
                        'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register('nickname')}
              />
              {errors.nickname && <p className="text-red-500 text-sm mt-2">{errors.nickname.message}</p>}
            </div>
             <button
              type="submit"
              disabled={!isValid}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-md font-bold disabled:bg-neutral-700 disabled:cursor-not-allowed"
            >
              회원가입 완료
            </button>
          </div>
        )}
      </form>
    </div>
  );
};