import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateSignin, type UserSigninInformation } from '../utils/validate';
import { useNavigate } from 'react-router-dom';

// assets
import googleLogo from '../assets/Google__G__logo.svg';

const LoginPage = () => {
  const { login /*, accessToken*/ } = useAuth();
  const navigate = useNavigate();

  // ✅ 자동 리다이렉트(useEffect) 제거: 로그인 버튼을 눌렀을 때만 이동하도록 유지

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValues: {
        email: '',
        password: '',
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    // AuthContext.login 내부에서 성공 시 /my로 이동 (window.location.href = "/my")
    await login(values);
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_SERVER_API_URL + '/v1/auth/google/login';
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values || {}).some((value) => value === '');

  return (
    <div className='flex flex-col items-center justify-center h-full gap-4'>
      <div className='flex flex-col gap-3 items-center'>
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className='w-10 h-10 flex items-center justify-center cursor-pointer self-start'
          aria-label='뒤로가기'
        >
          &lt;
        </button>

        {/* 구글 로고 */}
        <img
          src={googleLogo}
          alt='google logo'
          className='w-10 h-10 mb-2'
        />

        {/* 이메일 입력 */}
        <input
          {...getInputProps('email')}
          className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff]
            ${errors?.email && touched?.email ? 'border-red-500 bg-red-200' : 'border-gray-300'}
          `}
          type='email'
          placeholder='이메일'
        />
        {errors?.email && touched?.email && (
          <div className='text-red-500 text-sm'>{errors.email}</div>
        )}

        {/* 비밀번호 입력 */}
        <input
          {...getInputProps('password')}
          className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff]
            ${errors?.password && touched?.password ? 'border-red-500 bg-red-200' : 'border-gray-300'}
          `}
          type='password'
          placeholder='비밀번호'
        />
        {errors?.password && touched?.password && (
          <div className='text-red-500 text-sm'>{errors.password}</div>
        )}

        {/* 로그인 버튼 */}
        <button
          type='button'
          onClick={handleSubmit}
          disabled={isDisabled}
          className='w-[300px] bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300'
        >
          로그인
        </button>

        {/* 구글 로그인 버튼 */}
        <button
          type='button'
          onClick={handleGoogleLogin}
          className='w-[300px] bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300'
        >
          <div className='flex items-center justify-center gap-4'>
            <img
              src={googleLogo}
              alt='google logo image'
              className='w-6 h-6'
            />
            <span>구글 로그인</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;


