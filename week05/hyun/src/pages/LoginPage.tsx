import React, { useEffect } from 'react';
import useForm from '../hooks/useForm';
import { validateSignin, type UserSigninInformation } from '../utils/validate';
import { useNavigate } from 'react-router-dom';
import { postSignin } from '../apis/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constant/key';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const { login, accessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('AccessToken in LoginPage:', accessToken); // 🚨 토큰 값 확인
        if (accessToken) {
            console.log("Token exists, navigating to '/'");
            // 출입증이 있다면
            navigate('/'); // 메인으로 가라
        }
    }, [accessToken, navigate]);

    const { values, errors, touched, getInutProps } =
        useForm<UserSigninInformation>({
            initialValue: {
                email: '',
                password: '',
            },
            validate: validateSignin,
        });

    const handleSubmit = async () => {
        await login(values);
    };

    const handleGoogleLogin = () => {
        window.location.href = `${
            import.meta.env.VITE_SERVER_API_URL
        }/v1/auth/google/login`;
    };
    const isDisabled =
        Object.values(errors || {}).some((error) => error.length > 0) ||
        Object.values(values).some((value) => value === '');

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex justify-between">
                <button onClick={() => navigate(-1)}>{'<'}</button>
                <h1 className="text-center">로그인</h1>
            </div>
            <div className="flex flex-col gap-3">
                <input
                    {...getInutProps('email')}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${
                        errors?.email && touched?.email
                            ? 'border-red-500 bg-red-200'
                            : 'border-gray-300'
                    }`}
                    type={'email'}
                    placeholder={'이메일'}
                />
                {errors?.email && touched?.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                )}
                <input
                    {...getInutProps('password')}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${
                        errors?.password && touched?.password
                            ? 'border-red-500 bg-red-200'
                            : 'border-gray-300'
                    }`}
                    type={'password'}
                    placeholder={'비밀번호'}
                />
                {errors?.password && touched?.password && (
                    <div className="text-red-500 text-sm">
                        {errors.password}
                    </div>
                )}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
                >
                    로그인
                </button>
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    // disabled={isDisabled}
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
                >
                    <img src="" alt="" />
                    <span>구글 로그인</span>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
