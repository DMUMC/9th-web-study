import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import { validateSignin, type UserSigninInformation } from '../utils/validate';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const { login, accessToken } = useAuth();
    const navigate = useNavigate();
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    useEffect(() => {
        if (accessToken) {
            navigate('/');
        }
    }, [navigate, accessToken]);

    const { values, errors, touched, getInputProps } =
        useForm<UserSigninInformation>({
            initialValue: { email: '', password: '' },
            validate: validateSignin,
        });

    const handleSubmit = async () => {
        if (isFormLoading) return;
        setIsFormLoading(true);
        await login(values);
    };

    const handleGoogleLogin = () => {
        if (isGoogleLoading) return;
        setIsGoogleLoading(true);
        window.location.href =
            import.meta.env.VITE_SERVER_API_URL + '/v1/auth/google/login';
    };

    const isDisabled =
        Object.values(errors || {}).some((error) => error.length > 0) ||
        Object.values(values).some((value) => value === '');

    return (
        <div className='flex flex-col items-center justify-center h-full gap-4'>
            <div className='flex flex-col gap-3'>
                <button
                    onClick={() => navigate(-1)}
                    className='w-10 h-10 flex items-center justify-center cursor-pointer'
                >
                    &lt;
                </button>
                <input
                    {...getInputProps('email')}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                    ${
                        errors?.email && touched?.email
                            ? 'border-red-500 bg-red-200'
                            : 'border-gray-300'
                    }`}
                    type='email'
                    placeholder='이메일'
                />
                {errors?.email && touched?.email && (
                    <div className='text-red-500 text-sm'>{errors.email}</div>
                )}
                <input
                    {...getInputProps('password')}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                    ${
                        errors?.password && touched?.password
                            ? 'border-red-500 bg-red-200'
                            : 'border-gray-300'
                    }`}
                    type='password'
                    placeholder='비밀번호'
                />
                {errors?.password && touched?.password && (
                    <div className='text-red-500 text-sm'>
                        {errors.password}
                    </div>
                )}
                <button
                    type='button'
                    onClick={handleSubmit}
                    disabled={isDisabled || isFormLoading}
                    className='w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300'
                >
                    {isFormLoading ? '로그인 중...' : '로그인'}
                </button>
                <button
                    type='button'
                    onClick={handleGoogleLogin}
                    className='w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300'
                >
                    <div className='flex items-center justify-center gap-4'>
                        <img
                            src={'/images/google.svg'}
                            alt='google logo image'
                            className='w-6'
                        />

                        <span>
                            {isGoogleLoading
                                ? '구글 로그인 중...'
                                : '구글 로그인'}
                        </span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
