// src/pages/LoginPage.tsx
import googleLogo from '../assets/Google__G__logo.svg';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod'; 
import { loginSchema, type LoginFormData } from '../utils/validation'; 
import { useAuth } from '../context/AutoContext';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isLoading } = useAuth(); 

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema), 
        mode: 'onBlur',
    });

    const handleLogin = async (data: LoginFormData) => {
        await login(data); 
    };
    
    return (
        <div className='flex flex-col gap-4 w-80'>
            <div className='flex justify-between items-center mb-4'>
                <button className='text-white w-10 text-2xl' onClick={() => navigate(-1)}>{'<'}</button>
                <p className='text-2xl font-bold text-center'>로그인</p>
                <div className='w-10'></div>
            </div>

            <button type="button" className='flex px-4 py-3 border border-gray-500 rounded-md items-center justify-center relative font-semibold'>
                <img src={googleLogo} alt="googleLogo" className='absolute left-4 w-5 h-5' />
                <p>구글 로그인</p>
            </button>

            <div className='relative text-center my-4'>
                <div className='absolute inset-0 flex items-center'><div className='w-full border-t border-gray-600'></div></div>
                <div className='relative flex justify-center text-sm'><span className='bg-neutral-900 px-2 text-gray-400'>OR</span></div>
            </div>
            
            <form onSubmit={handleSubmit(handleLogin)} className='flex flex-col gap-4'>
                <div>
                    <input
                        type="text"
                        placeholder='이메일을 입력해주세요'
                        className='w-full bg-neutral-800 px-4 py-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        {...register('email')} 
                    />
                    {errors.email && <p className='text-red-500 text-sm mt-1 ml-1'>{errors.email.message}</p>}
                </div>

                <div>
                    <input
                        type="password"
                        placeholder='비밀번호를 입력해주세요'
                        className='w-full bg-neutral-800 px-4 py-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        {...register('password')} 
                    />
                    {errors.password && <p className='text-red-500 text-sm mt-1 ml-1'>{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    className='bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-neutral-700 disabled:cursor-not-allowed font-bold'
                    disabled={!isValid || isLoading} 
                >
                    {isLoading ? '로그인 중...' : '로그인'}
                </button>
            </form>
        </div>
    );
};