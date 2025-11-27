import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { postLogin } from '../apis/auth';
import { setTokens } from '../utils/token';
import useForm from '../hooks/useForm';
import type { UserSigninInformation } from '../utils/validate';
import { validateSignin } from '../utils/validate';
import { useUserStore } from '../store/zustand/userStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useUserStore();

  const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: validateSignin,
  });

  const loginMutation = useMutation({
    mutationFn: postLogin,
    onSuccess: (data) => {
      if (data && data.accessToken && data.refreshToken) {
        setTokens(data.accessToken, data.refreshToken);
        if (data.user) {
          setUser(data.user);
        }
        const from = (location.state as { from?: Location })?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    },
    onError: (error: any) => {
      console.error('로그인 실패:', error);
      // 에러 메시지를 사용자에게 표시하기 위해 상태 관리 필요
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (values.email && values.password && Object.keys(errors).length === 0) {
      loginMutation.mutate(values);
    }
  };

  const isFormValid = values.email && values.password && Object.keys(errors).length === 0;

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
          <h1 className="text-3xl font-bold mb-8 text-center">로그인</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
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

            <div>
              <div className="relative">
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
            </div>

            {loginMutation.isError && (
              <p className="text-sm text-red-400">
                로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.
              </p>
            )}

            <button
              type="submit"
              disabled={!isFormValid || loginMutation.isPending}
              className="w-full py-3 bg-pink-600 hover:bg-pink-700 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              계정이 없으신가요?{' '}
              <Link to="/signup" className="text-pink-600 hover:text-pink-700">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

