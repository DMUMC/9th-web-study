import googleLogo from '../assets/Google__G__logo.svg'
import { useNavigate } from 'react-router'
import { validateSignin, type UserSigninInformation } from '../utils/validate'
import { useForm } from '../hooks/useForm'
import { postLogin } from '../apis/auth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { LOCAL_STORAGE_KEY } from '../constant/key'

const LoginPage = () => {
    const navigate = useNavigate()
    const {setItem} = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)

    const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
        initialValues: {
            email: '',
            password: ''
        },
        validate: validateSignin
    })

    const handleLogin = async () => {
        try{
            await postLogin(values).then((res) =>{
               setItem(res.data.accessToken)
                console.log(res)
            })
        } catch(e) {
            console.log(e)
            alert('로그인에 실패했습니다.')
        }
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    const isDisabled = Object.values(errors || {}).some((e) => e.length > 0) || Object.values(values).some((value) => value === "")

    return (
        <div className='flex flex-col gap-4 w-80'>
            <div className='flex justify-between items-center'>
                <button className='text-white w-10' onClick={handleGoBack}>{'<'}</button>
                <p className='text-2xl font-bold text-center'>로그인</p>
                <div className='w-10'></div>
            </div>

            <div className='flex px-4 py-3 border-1 border-gray-300 rounded-md items-center relative hover:cursor-pointer'>
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
                {...getInputProps('email')}
            />
            {touched?.email && errors?.email && <p className='text-red-500'>{errors.email}</p>}
            <input
                name='password'
                type="password"
                placeholder='비밀번호를 입력해주세요'
                className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500'
                {...getInputProps('password')}
            />
            {touched?.password && errors?.password  && <p className='text-red-500'>{errors.password}</p>}
            <button
                className='bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors disabled:bg-neutral-700 disabled:cursor-not-allowed'
                disabled={isDisabled}
                onClick={handleLogin}
            >
                로그인
            </button>
        </div>
    )
}

export default LoginPage