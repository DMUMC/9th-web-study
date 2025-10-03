import { useState } from 'react'
import googleLogo from '../assets/Google__G__logo.svg'
import { useNavigate } from 'react-router'
import axios from 'axios'

const LoginPage = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [emailError, setEmailError] = useState<boolean>(false)
    const [passwordError, setPasswordError] = useState<boolean>(false)
    const [emailTouched, setEmailTouched] = useState<boolean>(false)
    const [passwordTouched, setPasswordTouched] = useState<boolean>(false)

    const handleEmailBlur = () => {
        setEmailTouched(true)
        if (!/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(values.email)) {
            setEmailError(true)
        } else {
            setEmailError(false)
        }
    }

    const handlePasswordBlur = () => {
        setPasswordTouched(true)
        if (password && password.length < 6) {
            setPasswordError(true)
        } else {
            setPasswordError(false)
        }
    }

    const handleLogin = () => {
        const login = async () => {
            await axios.post('http://localhost:8000/v1/auth/signin', {
                email,
                password
            }).catch((e) => {
                console.log(e)
                alert('로그인에 실패했습니다.')
            })
        }
        login()
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <div className='flex flex-col gap-4 w-80'>
            <div className='flex justify-between items-center'>
                <button className='text-white w-10' onClick={handleGoBack}>{'<'}</button>
                <p className='text-2xl font-bold text-center'>로그인</p>
                <div className='w-10'></div>
            </div>

            <div className='flex px-4 py-3 border-1 border-gray-300 rounded-md items-center relative'>
                <img src={googleLogo} alt="googleLogo" />
                <p className='absolute left-1/2 transform -translate-x-1/2'>구글 로그인</p>
            </div>

            <div className='relative text-center my-4'>
                <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-300'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                    <span className='bg-neutral-900 px-2 w-24'>OR</span>
                </div>
            </div>

            <input
                name='email'
                type="text"
                placeholder='이메일을 입력해주세요'
                className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
            />
            {emailTouched && emailError && <p className='text-red-500'>이메일 형식이 올바르지 않습니다.</p>}
            <input
                name='password'
                type="password"
                placeholder='비밀번호를 입력해주세요'
                className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePasswordBlur}
            />
            {passwordTouched && passwordError && <p className='text-red-500'>비밀번호는 6자 이상이어야 합니다.</p>}
            <button className='bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors disabled:bg-neutral-700 disabled:cursor-not-allowed' disabled={!email || !password || emailError || passwordError} onClick={handleLogin}>로그인</button>
        </div>
    )
}

export default LoginPage