import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { postSignup } from '../apis/auth';
import { setTokens } from '../utils/token';
import useForm from '../hooks/useForm';
import type { UserSignupInformation } from '../utils/validate';
import { validateSignup } from '../utils/validate';
import { useUserStore } from '../store/zustand/userStore';

type Step = 'email' | 'password' | 'nickname';

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const { setUser } = useUserStore();

  const { values, errors, touched, getInputProps } = useForm<UserSignupInformation>({
    initialValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
    },
    validate: validateSignup,
  });

  const signupMutation = useMutation({
    mutationFn: postSignup,
    onSuccess: (data) => {
      if (data && data.accessToken && data.refreshToken) {
        setTokens(data.accessToken, data.refreshToken);
        if (data.user) {
          setUser(data.user);
        }
        navigate('/');
      }
    },
    onError: (error: any) => {
      console.error('회원가입 실패:', error);
      // 에러 메시지를 사용자에게 표시하기 위해 상태 관리 필요
    },
  });

  const handleNext = () => {
    if (step === 'email') {
      if (!errors.email && values.email) {
        setStep('password');
      }
    } else if (step === 'password') {
      if (!errors.password && !errors.passwordConfirm && values.password && values.passwordConfirm) {
        setStep('nickname');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      signupMutation.mutate({
        email: values.email,
        password: values.password,
        nickname: values.nickname,
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <span className="mr-2">←</span>
          뒤로 가기
        </Link>

        <div className="bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">회원가입</h1>

          {step === 'email' && (
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 mb-4">이메일을 입력해주세요</p>
                <input
                  {...getInputProps('email')}
                  type="email"
                  placeholder="이메일"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>
              <button
                onClick={handleNext}
                disabled={!!errors.email || !values.email}
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          )}

          {step === 'password' && (
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 mb-2">이메일: {values.email}</p>
                <p className="text-gray-400 mb-4">비밀번호를 설정해주세요</p>
                <div className="relative mb-4">
                  <input
                    {...getInputProps('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}

                <div className="relative">
                  <input
                    {...getInputProps('passwordConfirm')}
                    type={showPasswordConfirm ? 'text' : 'password'}
                    placeholder="비밀번호 재확인"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswordConfirm ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {touched.passwordConfirm && errors.passwordConfirm && (
                  <p className="mt-1 text-sm text-red-400">{errors.passwordConfirm}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('email')}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold transition-colors"
                >
                  이전
                </button>
                <button
                  onClick={handleNext}
                  disabled={!!errors.password || !!errors.passwordConfirm || !values.password || !values.passwordConfirm}
                  className="flex-1 py-3 bg-pink-600 hover:bg-pink-700 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {step === 'nickname' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="text-gray-400 mb-2">이메일: {values.email}</p>
                <p className="text-gray-400 mb-4">닉네임을 입력해주세요</p>
                <input
                  {...getInputProps('nickname')}
                  type="text"
                  placeholder="닉네임"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                />
                {touched.nickname && errors.nickname && (
                  <p className="mt-1 text-sm text-red-400">{errors.nickname}</p>
                )}
              </div>

              {signupMutation.isError && (
                <p className="text-sm text-red-400">
                  회원가입에 실패했습니다. 다시 시도해주세요.
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('password')}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold transition-colors"
                >
                  이전
                </button>
                <button
                  type="submit"
                  disabled={!!errors.nickname || !values.nickname || signupMutation.isPending}
                  className="flex-1 py-3 bg-pink-600 hover:bg-pink-700 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {signupMutation.isPending ? '가입 중...' : '회원가입 완료'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-pink-600 hover:text-pink-700">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

