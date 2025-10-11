import googleLogo from '../assets/Google__G__logo.svg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from '../hooks/useForm';
import { validateSignin, type UserSigninInformation } from '../utils/validate';

export const LoginPage = () => {
    const navigate = useNavigate();

    const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
        initialValues: {
            email: '',
            password: ''
        },
        validate: validateSignin
    });

    const handleLogin = async () => {
        try {
            await axios.post('http://localhost:8000/v1/auth/signin', values);
            alert('로그인 성공');
            navigate('/');
        } catch (e) {
            console.error(e);
            alert('로그인에 실패했습니다.');
        }
    };
    
    const isDisabled = Object.keys(errors).length > 0 || Object.values(values).some((v) => v === "");

    return (
        <div className='flex justify-center items-center min-h-screen bg-neutral-900 text-white'>
            <div className='flex flex-col gap-4 w-80'>
                <div className='flex justify-between items-center mb-4'>
                    <button className='text-white w-10 text-2xl' onClick={() => navigate(-1)}>{'<'}</button>
                    <p className='text-2xl font-bold text-center'>로그인</p>
                    <div className='w-10'></div>
                </div>

                <button className='flex px-4 py-3 border border-gray-500 rounded-md items-center justify-center relative font-semibold'>
                    <img src={googleLogo} alt="googleLogo" className='absolute left-4 w-5 h-5' />
                    <p>구글 로그인</p>
                </button>

                <div className='relative text-center my-4'>
                    <div className='absolute inset-0 flex items-center'><div className='w-full border-t border-gray-600'></div></div>
                    <div className='relative flex justify-center text-sm'><span className='bg-neutral-900 px-2 text-gray-400'>OR</span></div>
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className='flex flex-col gap-4'>
                    <div>
                        <input
                            type="text"
                            placeholder='이메일을 입력해주세요'
                            className='w-full bg-neutral-800 px-4 py-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            {...getInputProps('email')}
                        />
                        {touched.email && errors.email && <p className='text-red-500 text-sm mt-1 ml-1'>{errors.email}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder='비밀번호를 입력해주세요'
                            className='w-full bg-neutral-800 px-4 py-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            {...getInputProps('password')}
                        />
                        {touched.password && errors.password && <p className='text-red-500 text-sm mt-1 ml-1'>{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        className='bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-neutral-700 disabled:cursor-not-allowed font-bold'
                        disabled={isDisabled}
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
};